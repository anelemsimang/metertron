import { createElement } from "react";
import { isMembershipRole } from "@/lib/membership";
import { requireCapability } from "@/server/auth/require-admin";
import { OrgAccessError, assertOrgWritable } from "@/server/billing/org-access";
import { assertWithinSeatLimit } from "@/server/billing/usage";
import { safeDbMessage, withOrg } from "@/server/db/client";
import { sendEmail } from "@/server/email/send";
import { InviteEmailTemplate } from "@/server/email/templates";
import { createInvite, listInvites, revokeInvite } from "@/server/orgs/invites";
import { log } from "@/server/observability/log";

export async function GET() {
  const gate = await requireCapability("invite_members");
  if ("error" in gate) return gate.error;
  try {
    const invites = await listInvites(gate.user.organisationId);
    return Response.json({
      invites: invites.map((invite) => ({
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
        acceptedAt: invite.acceptedAt,
        createdAt: invite.createdAt,
        // Until Phase 8 email: expose accept path for the inviter to share.
        acceptPath: invite.acceptedAt ? null : `/invite/${invite.token}`,
      })),
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireCapability("invite_members");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { email?: unknown; role?: unknown; action?: unknown; inviteId?: unknown };

  try {
    return await withOrg(gate.user.organisationId, async () => {
      if (body.action === "revoke") {
        const inviteId = typeof body.inviteId === "string" ? body.inviteId : "";
        if (!inviteId) return Response.json({ error: "Choose an invite." }, { status: 400 });
        await revokeInvite(gate.user.organisationId, inviteId);
        return Response.json({ ok: true });
      }

      await assertOrgWritable(gate.user.organisationId);
      await assertWithinSeatLimit(gate.user.organisationId);

      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const role = body.role;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email." }, { status: 400 });
      if (!isMembershipRole(role) || role === "owner") {
        return Response.json({ error: "Choose a role (admin, supervisor, technician, or viewer)." }, { status: 400 });
      }
      const invite = await createInvite({
        organisationId: gate.user.organisationId,
        email,
        role,
        invitedBy: gate.user.id,
      });
      const origin = new URL(request.url).origin;
      const acceptPath = `/invite/${invite.token}`;
      try {
        await sendEmail({
          to: email,
          subject: `${gate.user.organisationName} invited you to Metertron`,
          organisationId: gate.user.organisationId,
          react: createElement(InviteEmailTemplate, {
            organisationName: gate.user.organisationName,
            role,
            inviteUrl: `${origin}${acceptPath}`,
            inviterName: gate.user.name,
          }),
        });
      } catch (error) {
        log.warn("invite.email_failed", {
          organisationId: gate.user.organisationId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      return Response.json({
        invite: {
          id: invite.id,
          email: invite.email,
          role: invite.role,
          expiresAt: invite.expiresAt,
          acceptPath,
        },
      });
    });
  } catch (error) {
    if (error instanceof OrgAccessError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && /limit reached/i.test(error.message)) {
      return Response.json({ error: error.message }, { status: 402 });
    }
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
