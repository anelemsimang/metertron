import { randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import type { MembershipRole } from "@/lib/membership";
import { orgRoleFromMembership } from "@/lib/membership";
import { getDb, withBypassRls, withOrg } from "@/server/db/client";
import { organisationInvites, organisationMemberships, users } from "@/server/db/schema";

const INVITE_DAYS = 7;

export async function createInvite(input: {
  organisationId: string;
  email: string;
  role: MembershipRole;
  invitedBy: string;
}) {
  if (input.role === "owner") throw new Error("Cannot invite another owner. Transfer ownership separately.");
  const email = input.email.trim().toLowerCase();
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_DAYS);

  return withOrg(input.organisationId, async () => {
    const [invite] = await getDb()
      .insert(organisationInvites)
      .values({
        organisationId: input.organisationId,
        email,
        role: input.role,
        token,
        invitedBy: input.invitedBy,
        expiresAt,
      })
      .returning();
    return invite;
  });
}

export async function listInvites(organisationId: string) {
  return withOrg(organisationId, async () => {
    return getDb()
      .select({
        id: organisationInvites.id,
        email: organisationInvites.email,
        role: organisationInvites.role,
        expiresAt: organisationInvites.expiresAt,
        acceptedAt: organisationInvites.acceptedAt,
        revokedAt: organisationInvites.revokedAt,
        createdAt: organisationInvites.createdAt,
        token: organisationInvites.token,
      })
      .from(organisationInvites)
      .where(and(eq(organisationInvites.organisationId, organisationId), isNull(organisationInvites.revokedAt)));
  });
}

export async function revokeInvite(organisationId: string, inviteId: string) {
  return withOrg(organisationId, async () => {
    await getDb()
      .update(organisationInvites)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(organisationInvites.id, inviteId), eq(organisationInvites.organisationId, organisationId)));
  });
}

export async function findInviteByToken(token: string) {
  return withBypassRls(async () => {
    const [invite] = await getDb().select().from(organisationInvites).where(eq(organisationInvites.token, token)).limit(1);
    return invite ?? null;
  });
}

export async function acceptInvite(input: {
  token: string;
  userId?: string;
  name?: string;
  username?: string;
  passwordHash?: string;
}) {
  return withBypassRls(async () => {
    const db = getDb();
    const [invite] = await db.select().from(organisationInvites).where(eq(organisationInvites.token, input.token)).limit(1);
    if (!invite || invite.revokedAt || invite.acceptedAt) return { error: "This invite is no longer valid." as const };
    if (invite.expiresAt.getTime() <= Date.now()) return { error: "This invite has expired." as const };

    let userId = input.userId;
    if (userId) {
      const [existing] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!existing) return { error: "Sign in required." as const };
      if (existing.email.toLowerCase() !== invite.email.toLowerCase()) {
        return { error: "Sign in with the invited email address." as const };
      }
    } else {
      const name = input.name?.trim() ?? "";
      const username = input.username?.trim() ?? "";
      if (name.length < 2 || !/^[A-Za-z0-9._-]{2,40}$/.test(username) || !input.passwordHash) {
        return { error: "Complete your account details to accept the invite." as const };
      }
      const [emailHit] = await db.select({ id: users.id }).from(users).where(eq(users.email, invite.email)).limit(1);
      if (emailHit) return { error: "An account with that email already exists. Log in, then open the invite link again." as const };
      const [created] = await db
        .insert(users)
        .values({
          organisationId: invite.organisationId,
          orgRole: orgRoleFromMembership(invite.role),
          name,
          username,
          email: invite.email,
          passwordHash: input.passwordHash,
          emailVerified: true,
        })
        .returning({ id: users.id });
      userId = created.id;
    }

    await db
      .insert(organisationMemberships)
      .values({
        userId,
        organisationId: invite.organisationId,
        role: invite.role,
      })
      .onConflictDoNothing();

    await db
      .update(users)
      .set({
        organisationId: invite.organisationId,
        orgRole: orgRoleFromMembership(invite.role),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    await db
      .update(organisationInvites)
      .set({ acceptedAt: new Date(), updatedAt: new Date() })
      .where(eq(organisationInvites.id, invite.id));

    return { ok: true as const, userId, organisationId: invite.organisationId, role: invite.role };
  });
}
