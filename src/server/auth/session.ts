import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { LEGACY_SESSION_COOKIE, SESSION_COOKIE } from "@/lib/brand";
import { membershipFromOrgRole, type MembershipRole } from "@/lib/membership";
import { type OrgRole } from "@/lib/roles";
import { getDb, isTransientDbError, resetDb, withBypassRls } from "@/server/db/client";
import { organisationMemberships, organisations, sessions, users } from "@/server/db/schema";

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
  organisationName: string;
  organisationSlug: string;
  onboardingCompleted: boolean;
  orgRole: OrgRole;
  membershipRole: MembershipRole;
  emailVerified: boolean;
  totpEnabled: boolean;
};

export type OrgMembershipSummary = {
  organisationId: string;
  name: string;
  slug: string;
  role: MembershipRole;
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

function clearRemembered(token?: string) {
  if (token) remembered.delete(token);
  else remembered.clear();
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
  clearRemembered();
}

export async function clearSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? store.get(LEGACY_SESSION_COOKIE)?.value;
  if (token) {
    clearRemembered(token);
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
        primaryOrganisationId: users.organisationId,
        orgRole: users.orgRole,
        emailVerified: users.emailVerified,
        totpEnabledAt: users.totpEnabledAt,
        removedAt: users.removedAt,
        sessionId: sessions.id,
        sessionOrganisationId: sessions.organisationId,
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

    const organisationId = row.sessionOrganisationId ?? row.primaryOrganisationId;
    const [membership] = await db
      .select({ role: organisationMemberships.role })
      .from(organisationMemberships)
      .where(and(eq(organisationMemberships.userId, row.id), eq(organisationMemberships.organisationId, organisationId)))
      .limit(1);
    const [organisation] = await db
      .select({
        name: organisations.name,
        slug: organisations.slug,
        onboardingCompletedAt: organisations.onboardingCompletedAt,
      })
      .from(organisations)
      .where(eq(organisations.id, organisationId))
      .limit(1);
    if (!organisation) return null;

    const membershipRole = membership?.role ?? membershipFromOrgRole(row.orgRole);
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      organisationId,
      organisationName: organisation.name,
      organisationSlug: organisation.slug,
      onboardingCompleted: Boolean(organisation.onboardingCompletedAt),
      orgRole: row.orgRole,
      membershipRole,
      emailVerified: row.emailVerified,
      totpEnabled: Boolean(row.totpEnabledAt),
    };
  });
}

export async function listUserOrganisations(userId: string): Promise<OrgMembershipSummary[]> {
  return withBypassRls(async () => {
    const rows = await getDb()
      .select({
        organisationId: organisationMemberships.organisationId,
        role: organisationMemberships.role,
        name: organisations.name,
        slug: organisations.slug,
      })
      .from(organisationMemberships)
      .innerJoin(organisations, eq(organisations.id, organisationMemberships.organisationId))
      .where(eq(organisationMemberships.userId, userId));
    return rows.map((row) => ({
      organisationId: row.organisationId,
      name: row.name,
      slug: row.slug,
      role: row.role,
    }));
  });
}

export async function switchOrganisation(userId: string, organisationId: string) {
  return withBypassRls(async () => {
    const db = getDb();
    const [membership] = await db
      .select({ role: organisationMemberships.role })
      .from(organisationMemberships)
      .where(and(eq(organisationMemberships.userId, userId), eq(organisationMemberships.organisationId, organisationId)))
      .limit(1);
    if (!membership) return false;

    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value ?? store.get(LEGACY_SESSION_COOKIE)?.value;
    if (token) {
      await db
        .update(sessions)
        .set({ organisationId, updatedAt: new Date() })
        .where(eq(sessions.token, token));
      clearRemembered(token);
    }
    await db
      .update(users)
      .set({
        organisationId,
        orgRole: membership.role === "owner" ? "head" : membership.role === "admin" || membership.role === "supervisor" ? "admin" : "member",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    return true;
  });
}

export async function forgetUser(userId: string) {
  await withBypassRls(async () => {
    const rows = await getDb().select({ token: sessions.token }).from(sessions).where(eq(sessions.userId, userId));
    for (const row of rows) clearRemembered(row.token);
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

async function sessionUserFromSupport(): Promise<SessionUser | null> {
  const { getSupportContext } = await import("@/server/platform/support");
  const support = await getSupportContext();
  if (!support) return null;
  return {
    id: support.staffId,
    name: `${support.staffName} (support)`,
    username: "metertron-support",
    email: support.staffEmail,
    organisationId: support.organisationId,
    organisationName: support.organisationName,
    organisationSlug: support.organisationSlug,
    onboardingCompleted: true,
    orgRole: "member",
    membershipRole: "viewer",
    emailVerified: true,
    totpEnabled: true,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? store.get(LEGACY_SESSION_COOKIE)?.value;
  if (!token) return sessionUserFromSupport();

  if (!store.get(SESSION_COOKIE)?.value && store.get(LEGACY_SESSION_COOKIE)?.value) {
    store.set(SESSION_COOKIE, token, cookieOptions());
    store.delete(LEGACY_SESSION_COOKIE);
  }

  const cached = rememberedUser(token);
  if (cached) return cached;
  try {
    const user = await readSession(token);
    if (user) remembered.set(token, { user, freshUntil: Date.now() + SESSION_MEMORY_MS });
    return user ?? sessionUserFromSupport();
  } catch (error) {
    if (!isTransientDbError(error)) throw error;
    resetDb();
    const user = await readSession(token);
    if (user) remembered.set(token, { user, freshUntil: Date.now() + SESSION_MEMORY_MS });
    return user ?? sessionUserFromSupport();
  }
}
