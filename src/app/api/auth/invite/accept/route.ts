import { hashPassword } from "@/server/auth/password";
import { createSession } from "@/server/auth/session";
import { getSessionUser } from "@/server/auth/session";
import { safeDbMessage } from "@/server/db/client";
import { acceptInvite, findInviteByToken } from "@/server/orgs/invites";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  if (!token) return Response.json({ error: "Missing invite token." }, { status: 400 });
  try {
    const invite = await findInviteByToken(token);
    if (!invite || invite.revokedAt || invite.acceptedAt) {
      return Response.json({ error: "This invite is no longer valid." }, { status: 404 });
    }
    if (invite.expiresAt.getTime() <= Date.now()) {
      return Response.json({ error: "This invite has expired." }, { status: 410 });
    }
    return Response.json({
      email: invite.email,
      role: invite.role,
      organisationId: invite.organisationId,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    token?: unknown;
    name?: unknown;
    username?: unknown;
    password?: unknown;
  };
  const token = clean(body.token);
  if (!token) return Response.json({ error: "Missing invite token." }, { status: 400 });

  try {
    const session = await getSessionUser();
    if (session) {
      const result = await acceptInvite({ token, userId: session.id });
      if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
      await createSession(result.userId, result.organisationId);
      return Response.json({ ok: true, role: result.role });
    }

    const name = clean(body.name);
    const username = clean(body.username);
    const password = typeof body.password === "string" ? body.password : "";
    if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    const result = await acceptInvite({
      token,
      name,
      username,
      passwordHash: await hashPassword(password),
    });
    if ("error" in result) return Response.json({ error: result.error }, { status: 400 });
    await createSession(result.userId, result.organisationId);
    return Response.json({ ok: true, role: result.role });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
