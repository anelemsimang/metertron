import { endSupportSession, startSupportSession } from "@/server/platform/support";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { safeDbMessage } from "@/server/db/client";

export async function POST(request: Request) {
  const gate = await requirePlatformStaff("view_as");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { action?: unknown; organisationId?: unknown; reason?: unknown };
  const action = body.action === "end" ? "end" : "start";

  try {
    if (action === "end") {
      await endSupportSession();
      return Response.json({ ok: true });
    }
    const organisationId = typeof body.organisationId === "string" ? body.organisationId : "";
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    if (!organisationId) return Response.json({ error: "organisationId required." }, { status: 400 });
    if (reason.length < 3) return Response.json({ error: "Provide a short reason for support access." }, { status: 400 });
    const result = await startSupportSession(gate.staff, organisationId, reason, await clientIp());
    return Response.json({
      ok: true,
      organisation: { id: result.organisation.id, name: result.organisation.name, slug: result.organisation.slug },
      officeUrl: "/office",
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
