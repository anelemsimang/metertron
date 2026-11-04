import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage, withOrg } from "@/server/db/client";
import { cloneExportTemplate, listExportTemplates } from "@/server/templates/export";

export async function GET() {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      const templates = await listExportTemplates(gate.user.organisationId);
      return Response.json({ templates });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { sourceId?: unknown; key?: unknown; name?: unknown };
  const sourceId = typeof body.sourceId === "string" ? body.sourceId : "";
  const key = typeof body.key === "string" ? body.key : "";
  const name = typeof body.name === "string" ? body.name : "";
  if (!sourceId) return Response.json({ error: "Choose a template to clone." }, { status: 400 });
  try {
    return await withOrg(gate.user.organisationId, async () => {
      const template = await cloneExportTemplate(gate.user.organisationId, sourceId, { key, name });
      if (!template) return Response.json({ error: "That template was not found." }, { status: 404 });
      return Response.json({ template });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
