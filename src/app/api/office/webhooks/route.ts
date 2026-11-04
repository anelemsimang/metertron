import { createWebhookEndpoint, listWebhookEndpoints } from "@/server/api/webhooks";
import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage } from "@/server/db/client";

export async function GET() {
  const gate = await requireCapability("manage_billing");
  if ("error" in gate) return gate.error;
  try {
    const endpoints = await listWebhookEndpoints(gate.user.organisationId);
    return Response.json({ endpoints });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireCapability("manage_billing");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { url?: unknown; events?: unknown };
  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!url.startsWith("https://") && !url.startsWith("http://localhost")) {
    return Response.json({ error: "HTTPS webhook URL required (localhost allowed for dev)." }, { status: 400 });
  }
  const events = Array.isArray(body.events) ? body.events.filter((s): s is string => typeof s === "string") : undefined;
  try {
    const endpoint = await createWebhookEndpoint({
      organisationId: gate.user.organisationId,
      url,
      events,
    });
    return Response.json({ endpoint });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
