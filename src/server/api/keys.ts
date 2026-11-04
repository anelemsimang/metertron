import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { getDb, withBypassRls, withOrg } from "@/server/db/client";
import { apiKeys } from "@/server/db/schema";

export function hashApiKey(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export async function createApiKey(input: {
  organisationId: string;
  name: string;
  scopes?: string[];
  createdByUserId?: string;
}) {
  const raw = `mt_live_${randomBytes(24).toString("hex")}`;
  const keyPrefix = raw.slice(0, 12);
  const keyHash = hashApiKey(raw);
  const [row] = await withOrg(input.organisationId, async () =>
    getDb()
      .insert(apiKeys)
      .values({
        organisationId: input.organisationId,
        name: input.name,
        keyPrefix,
        keyHash,
        scopes: input.scopes ?? ["read:jobs", "read:org"],
        createdByUserId: input.createdByUserId,
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        scopes: apiKeys.scopes,
        createdAt: apiKeys.createdAt,
      }),
  );
  return { ...row, secret: raw };
}

export async function listApiKeys(organisationId: string) {
  return withOrg(organisationId, async () =>
    getDb()
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        scopes: apiKeys.scopes,
        lastUsedAt: apiKeys.lastUsedAt,
        revokedAt: apiKeys.revokedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(and(eq(apiKeys.organisationId, organisationId), isNull(apiKeys.revokedAt))),
  );
}

export async function revokeApiKey(organisationId: string, id: string) {
  return withOrg(organisationId, async () => {
    await getDb()
      .update(apiKeys)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.organisationId, organisationId)));
  });
}

export async function authenticateApiKey(rawKey: string) {
  if (!rawKey.startsWith("mt_live_")) return null;
  const keyPrefix = rawKey.slice(0, 12);
  const keyHash = hashApiKey(rawKey);
  return withBypassRls(async () => {
    const [row] = await getDb()
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.keyPrefix, keyPrefix), eq(apiKeys.keyHash, keyHash), isNull(apiKeys.revokedAt)))
      .limit(1);
    if (!row) return null;
    await getDb().update(apiKeys).set({ lastUsedAt: new Date(), updatedAt: new Date() }).where(eq(apiKeys.id, row.id));
    return row;
  });
}
