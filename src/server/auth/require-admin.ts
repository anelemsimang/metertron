import { allows, actorFromSession, type Capability } from "@/server/auth/access";
import { getSessionUser, type SessionUser } from "@/server/auth/session";
import { isOfficeMembership } from "@/lib/roles";

export async function requireAdmin(): Promise<{ user: SessionUser } | { error: Response }> {
  const user = await getSessionUser();
  if (!user) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  if (!isOfficeMembership(user.membershipRole) || user.membershipRole === "viewer") {
    return { error: Response.json({ error: "Only a manager can do that." }, { status: 403 }) };
  }
  return { user };
}

export async function requireCapability(capability: Capability): Promise<{ user: SessionUser } | { error: Response }> {
  const user = await getSessionUser();
  if (!user) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  const actor = actorFromSession(user);
  if (!allows(actor, capability)) {
    return { error: Response.json({ error: "Not allowed." }, { status: 403 }) };
  }
  return { user };
}

export async function requireSession(): Promise<{ user: SessionUser } | { error: Response }> {
  const user = await getSessionUser();
  if (!user) return { error: Response.json({ error: "Sign in required." }, { status: 401 }) };
  return { user };
}
