import { eq } from "drizzle-orm";
import { createSession } from "@/server/auth/session";
import { consumeAuthToken, issueAuthToken } from "@/server/auth/tokens";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { users } from "@/server/db/schema";

/** Scaffold: issues/consumes magic-link tokens. Email delivery arrives in Phase 8. */
export async function POST(request: Request) {
  const body = (await request.json()) as { email?: unknown; token?: unknown; action?: unknown };
  const action = body.action === "consume" ? "consume" : "request";

  try {
    if (action === "request") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ error: "Enter a valid email." }, { status: 400 });
      }
      const user = await withBypassRls(async () => {
        const [row] = await getDb().select({ id: users.id, removedAt: users.removedAt }).from(users).where(eq(users.email, email)).limit(1);
        return row ?? null;
      });
      if (!user || user.removedAt) {
        // Do not reveal whether the email exists.
        return Response.json({ ok: true });
      }
      const issued = await issueAuthToken({ kind: "magic_link", email, userId: user.id, ttlHours: 1 });
      return Response.json({ ok: true, magicLinkToken: issued.token });
    }

    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token) return Response.json({ error: "Missing magic link token." }, { status: 400 });
    const row = await consumeAuthToken("magic_link", token);
    if (!row?.userId) return Response.json({ error: "Invalid or expired magic link." }, { status: 400 });
    const user = await withBypassRls(async () => {
      const [found] = await getDb().select().from(users).where(eq(users.id, row.userId!)).limit(1);
      return found ?? null;
    });
    if (!user || user.removedAt) return Response.json({ error: "Account not found." }, { status: 404 });
    await createSession(user.id, user.organisationId);
    return Response.json({
      user: { id: user.id, name: user.name, username: user.username, email: user.email, orgRole: user.orgRole },
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
