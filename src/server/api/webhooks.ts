import { createHmac, randomBytes } from "node:crypto";
import { and, desc, eq, isNull } from "drizzle-orm";
import { log } from "@/server/observability/log";
import { getDb, withOrg } from "@/server/db/client";
import { webhookDeliveries, webhookEndpoints } from "@/server/db/schema";

export async function createWebhookEndpoint(input: {
  organisationId: string;
  url: string;
  events?: string[];
}) {
  const secret = `whsec_${randomBytes(24).toString("hex")}`;
  const [row] = await withOrg(input.organisationId, async () =>
    getDb()
      .insert(webhookEndpoints)
      .values({
        organisationId: input.organisationId,
        url: input.url,
        secret,
        events: input.events ?? ["job.approved", "job.rejected", "job.submitted"],
      })
      .returning(),
  );
  return row;
}

export async function listWebhookEndpoints(organisationId: string) {
  return withOrg(organisationId, async () =>
    getDb()
      .select()
      .from(webhookEndpoints)
      .where(and(eq(webhookEndpoints.organisationId, organisationId), isNull(webhookEndpoints.disabledAt)))
      .orderBy(desc(webhookEndpoints.createdAt)),
  );
}

export async function dispatchWebhookEvent(organisationId: string, event: string, payload: Record<string, unknown>) {
  const endpoints = await withOrg(organisationId, async () =>
    getDb()
      .select()
      .from(webhookEndpoints)
      .where(and(eq(webhookEndpoints.organisationId, organisationId), isNull(webhookEndpoints.disabledAt))),
  );

  for (const endpoint of endpoints) {
    if (!endpoint.events.includes(event) && !endpoint.events.includes("*")) continue;
    const body = JSON.stringify({
      id: randomBytes(8).toString("hex"),
      event,
      created_at: new Date().toISOString(),
      data: payload,
    });
    const signature = createHmac("sha256", endpoint.secret).update(body).digest("hex");
    try {
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-metertron-event": event,
          "x-metertron-signature": signature,
          "user-agent": "Metertron-Webhooks/1.0",
        },
        body,
        signal: AbortSignal.timeout(8_000),
      });
      await withOrg(organisationId, async () => {
        await getDb().insert(webhookDeliveries).values({
          organisationId,
          endpointId: endpoint.id,
          event,
          payload: JSON.parse(body) as Record<string, unknown>,
          statusCode: response.status,
          success: response.ok,
          error: response.ok ? null : await response.text().catch(() => "non-2xx"),
        });
      });
      log.info("webhook.delivered", { organisationId, event, status: response.status, endpointId: endpoint.id });
    } catch (error) {
      await withOrg(organisationId, async () => {
        await getDb().insert(webhookDeliveries).values({
          organisationId,
          endpointId: endpoint.id,
          event,
          payload: { event, data: payload },
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      });
      log.warn("webhook.failed", { organisationId, event, endpointId: endpoint.id });
    }
  }
}
