import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { LEGACY_SESSION_COOKIE, SESSION_COOKIE } from "@/lib/brand";
import { type OrgRole } from "@/lib/roles";
import { getDb, isTransientDbError, resetDb, withBypassRls } from "@/server/db/client";
import { sessions, users } from "@/server/db/schema";

export { SESSION_COOKIE, LEGACY_SESSION_COOKIE };

const THIRTY_DAYS = 60 * 60 * 24 * 30;
const SESSION_MEMORY_MS = 60_000;

const remembered = new Map<string, { user: SessionUser; freshUntil: number }>();

export type SessionUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  organisationId: string;
  orgRole: OrgRole;
};

function cookieOptions(maxAge = THIRTY_DAYS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function createSession(userId: string, organisationId?: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + THIRTY_DAYS * 1000);
  await withBypassRls(async () => {
    const db = getDb();
    let orgId = organisationId;
    if (!orgId) {
      const [user] = await db.select({ organisationId: users.organisationId }).from(users).where(eq(users.id, userId)).limit(1);
      orgId = user?.organisationId;
    }
    await db.insert(sessions).values({ userId, organisationId: orgId, token, expiresAt });
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOptions());
  store.delete(LEGACY_SESSION_COOKIE);
}

export async function clearSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? store.get(LEGACY_SESSION_COOKIE)?.value;
  if (token) {
    remembered.delete(token);
    await withBypassRls(async () => {
      await getDb().delete(sessions).where(eq(sessions.token, token));
    });
  }
  store.delete(SESSION_COOKIE);
  store.delete(LEGACY_SESSION_COOKIE);
}

async function readSession(token: string): Promise<SessionUser | null> {
  return withBypassRls(async () => {
    const db = getDb();
    const [row] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        organisationId: users.organisationId,
        orgRole: users.orgRole,
        removedAt: users.removedAt,
        sessionId: sessions.id,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);
    if (!row || row.removedAt) {
      if (row) await db.delete(sessions).where(eq(sessions.id, row.sessionId));
      return null;
    }
    if (row.expiresAt.getTime() <= Date.now()) {
      await db.delete(sessions).where(eq(sessions.id, row.sessionId));
      return null;
    }
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      organisationId: row.organisationId,
      orgRole: row.orgRole,
    };
  });
}

export async function forgetUser(userId: string) {
  await withBypassRls(async () => {
    const rows = await getDb().select({ token: sessions.token }).from(sessions).where(eq(sessions.userId, userId));
    for (const row of rows) remembered.delete(row.token);
  });
}

function rememberedUser(token: string) {
  const hit = remembered.get(token);
  if (!hit) return null;
  if (hit.freshUntil <= Date.now()) {
    remembered.delete(token);
    return null;
  }
  return hit.user;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? store.get(LEGACY_SESSION_COOKIE)?.value;
  if (!token) return null;

  if (!store.get(SESSION_COOKIE)?.value && store.get(LEGACY_SESSION_COOKIE)?.value) {
    store.set(SESSION_COOKIE, token, cookieOptions());
    store.delete(LEGACY_SESSION_COOKIE);
  }

  const cached = rememberedUser(token);
  if (cached) return cached;
  try {
    const user = await readSession(token);
    if (user) remembered.set(token, { user, freshUntil: Date.now() + SESSION_MEMORY_MS });
    return user;
  } catch (error) {
    if (!isTransientDbError(error)) throw error;
    resetDb();
    const user = await readSession(token);
    if (user) remembered.set(token, { user, freshUntil: Date.now() + SESSION_MEMORY_MS });
    return user;
  }
}
