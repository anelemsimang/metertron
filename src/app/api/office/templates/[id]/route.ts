import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage, withOrg } from "@/server/db/client";
import { getExportTemplate, updateExportTemplate } from "@/server/templates/export";

function stringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const { id } = await context.params;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      const template = await getExportTemplate(gate.user.organisationId, id);
      if (!template) return Response.json({ error: "That template was not found." }, { status: 404 });
      return Response.json({ template });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const listPhrases =
    body.listPhrases &&
    typeof body.listPhrases === "object" &&
    typeof (body.listPhrases as { oldMeterSuffix?: unknown }).oldMeterSuffix === "string" &&
    typeof (body.listPhrases as { connectionValue?: unknown }).connectionValue === "string"
      ? {
          oldMeterSuffix: (body.listPhrases as { oldMeterSuffix: string }).oldMeterSuffix,
          connectionValue: (body.listPhrases as { connectionValue: string }).connectionValue,
        }
      : undefined;

  try {
    return await withOrg(gate.user.organisationId, async () => {
      const template = await updateExportTemplate(gate.user.organisationId, id, {
        ...(typeof body.name === "string" ? { name: body.name } : {}),
        ...(typeof body.sheetName === "string" ? { sheetName: body.sheetName } : {}),
        ...(typeof body.statusExportValue === "string" ? { statusExportValue: body.statusExportValue } : {}),
        ...(stringArray(body.headers) ? { headers: stringArray(body.headers)! } : {}),
        ...(stringArray(body.mapHeaders) ? { mapHeaders: stringArray(body.mapHeaders)! } : {}),
        ...(listPhrases ? { listPhrases } : {}),
        ...(typeof body.isDefault === "boolean" ? { isDefault: body.isDefault } : {}),
      });
      if (!template) return Response.json({ error: "That template was not found." }, { status: 404 });
      return Response.json({ template });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
