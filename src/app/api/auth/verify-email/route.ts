import { eq } from "drizzle-orm";
import { requireSession } from "@/server/auth/require-admin";
import { consumeAuthToken, issueAuthToken } from "@/server/auth/tokens";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { users } from "@/server/db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: unknown; action?: unknown };
  const action = body.action === "request" ? "request" : "confirm";

  try {
    if (action === "request") {
      const gate = await requireSession();
      if ("error" in gate) return gate.error;
      if (gate.user.emailVerified) return Response.json({ ok: true, alreadyVerified: true });
      const issued = await issueAuthToken({
        kind: "email_verify",
        email: gate.user.email,
        userId: gate.user.id,
        ttlHours: 48,
      });
      return Response.json({ ok: true, emailVerifyToken: issued.token });
    }

    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token) return Response.json({ error: "Missing verification token." }, { status: 400 });
    const row = await consumeAuthToken("email_verify", token);
    if (!row?.userId) return Response.json({ error: "Invalid or expired verification link." }, { status: 400 });
    await withBypassRls(async () => {
      await getDb()
        .update(users)
        .set({ emailVerified: true, updatedAt: new Date() })
        .where(eq(users.id, row.userId!));
    });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
