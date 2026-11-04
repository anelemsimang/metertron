import { requireSession } from "@/server/auth/require-admin";
import { disableTotpScaffold, enableTotpScaffold } from "@/server/auth/totp";
import { safeDbMessage } from "@/server/db/client";

/** Scaffold endpoints for TOTP enable/disable (full verify with Better Auth later). */
export async function POST(request: Request) {
  const gate = await requireSession();
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { action?: unknown };
  try {
    if (body.action === "disable") {
      await disableTotpScaffold(gate.user.id);
      return Response.json({ ok: true, enabled: false });
    }
    const result = await enableTotpScaffold(gate.user.id);
    return Response.json({ ok: true, enabled: true, secret: result.secret, otpauthUrl: result.otpauthUrl });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
