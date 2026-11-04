import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { getDb, withBypassRls } from "@/server/db/client";
import { authTokens } from "@/server/db/schema";

export type AuthTokenKind = "email_verify" | "magic_link" | "password_reset";

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export async function issueAuthToken(input: {
  kind: AuthTokenKind;
  email: string;
  userId?: string;
  ttlHours?: number;
}) {
  const raw = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + (input.ttlHours ?? 24) * 60 * 60 * 1000);
  await withBypassRls(async () => {
    await getDb().insert(authTokens).values({
      kind: input.kind,
      email: input.email.trim().toLowerCase(),
      userId: input.userId,
      token: hashToken(raw),
      expiresAt,
    });
  });
  return { token: raw, expiresAt };
}

export async function consumeAuthToken(kind: AuthTokenKind, raw: string) {
  const hashed = hashToken(raw);
  return withBypassRls(async () => {
    const db = getDb();
    const [row] = await db
      .select()
      .from(authTokens)
      .where(and(eq(authTokens.kind, kind), eq(authTokens.token, hashed), isNull(authTokens.consumedAt)))
      .limit(1);
    if (!row) return null;
    if (row.expiresAt.getTime() <= Date.now()) return null;
    await db.update(authTokens).set({ consumedAt: new Date(), updatedAt: new Date() }).where(eq(authTokens.id, row.id));
    return row;
  });
}
