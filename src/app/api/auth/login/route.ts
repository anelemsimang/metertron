import { and, eq } from "drizzle-orm";
import { membershipFromOrgRole } from "@/lib/membership";
import { verifyPassword } from "@/server/auth/password";
import { createSession } from "@/server/auth/session";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { organisationMemberships, users } from "@/server/db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return Response.json({ error: "Enter your email and password." }, { status: 400 });

  try {
    const user = await withBypassRls(async () => {
      const [row] = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
      return row ?? null;
    });
    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return Response.json({ error: "Email or password is wrong." }, { status: 401 });
    }
    if (user.removedAt) return Response.json({ error: "This account has been removed." }, { status: 403 });
    const membershipRole = await withBypassRls(async () => {
      const [membership] = await getDb()
        .select({ role: organisationMemberships.role })
        .from(organisationMemberships)
        .where(and(eq(organisationMemberships.userId, user.id), eq(organisationMemberships.organisationId, user.organisationId)))
        .limit(1);
      return membership?.role ?? membershipFromOrgRole(user.orgRole);
    });
    await createSession(user.id, user.organisationId);
    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        orgRole: user.orgRole,
        membershipRole,
      },
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
