import { createApiKey, listApiKeys, revokeApiKey } from "@/server/api/keys";
import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage } from "@/server/db/client";

export async function GET() {
  const gate = await requireCapability("manage_billing");
  if ("error" in gate) return gate.error;
  try {
    const keys = await listApiKeys(gate.user.organisationId);
    return Response.json({ keys });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireCapability("manage_billing");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { name?: unknown; scopes?: unknown };
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "Name required." }, { status: 400 });
  const scopes = Array.isArray(body.scopes) ? body.scopes.filter((s): s is string => typeof s === "string") : undefined;
  try {
    const key = await createApiKey({
      organisationId: gate.user.organisationId,
      name,
      scopes,
      createdByUserId: gate.user.id,
    });
    return Response.json({ key });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const gate = await requireCapability("manage_billing");
  if ("error" in gate) return gate.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required." }, { status: 400 });
  try {
    await revokeApiKey(gate.user.organisationId, id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
