import { isMembershipRole } from "@/lib/membership";
import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage } from "@/server/db/client";
import { createInvite, listInvites, revokeInvite } from "@/server/orgs/invites";

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
    if (body.action === "revoke") {
      const inviteId = typeof body.inviteId === "string" ? body.inviteId : "";
      if (!inviteId) return Response.json({ error: "Choose an invite." }, { status: 400 });
      await revokeInvite(gate.user.organisationId, inviteId);
      return Response.json({ ok: true });
    }

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
    return Response.json({
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
        acceptPath: `/invite/${invite.token}`,
      },
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
