import { requireSession } from "@/server/auth/require-admin";
import { listUserOrganisations, switchOrganisation } from "@/server/auth/session";
import { safeDbMessage } from "@/server/db/client";

export async function GET() {
  const gate = await requireSession();
  if ("error" in gate) return gate.error;
  try {
    const organisations = await listUserOrganisations(gate.user.id);
    return Response.json({
      activeOrganisationId: gate.user.organisationId,
      organisations,
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireSession();
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { organisationId?: unknown };
  const organisationId = typeof body.organisationId === "string" ? body.organisationId : "";
  if (!organisationId) return Response.json({ error: "Choose an organisation." }, { status: 400 });
  try {
    const ok = await switchOrganisation(gate.user.id, organisationId);
    if (!ok) return Response.json({ error: "You are not a member of that organisation." }, { status: 403 });
    return Response.json({ ok: true, organisationId });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
