import { requireCapability } from "@/server/auth/require-admin";
import type { FormDefinition } from "@/domain/forms/types";
import { safeDbMessage, withOrg } from "@/server/db/client";
import { getFormVersion, parseFormSchema, publishFormVersion, saveFormDraft } from "@/server/templates/forms";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const { id } = await context.params;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      const form = await getFormVersion(gate.user.organisationId, id);
      if (!form) return Response.json({ error: "That form was not found." }, { status: 404 });
      return Response.json({ form });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const { id } = await context.params;
  const body = (await request.json()) as { schema?: unknown; action?: unknown };
  try {
    return await withOrg(gate.user.organisationId, async () => {
      if (body.action === "publish") {
        const form = await publishFormVersion(gate.user.organisationId, id);
        if (!form) return Response.json({ error: "That form was not found." }, { status: 404 });
        return Response.json({ form });
      }
      if (!body.schema) return Response.json({ error: "Send a form schema." }, { status: 400 });
      const schema = parseFormSchema(body.schema) as FormDefinition;
      const form = await saveFormDraft(gate.user.organisationId, id, schema);
      if (!form) return Response.json({ error: "That form was not found." }, { status: 404 });
      return Response.json({ form });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
