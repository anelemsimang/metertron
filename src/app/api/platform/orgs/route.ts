import { eq } from "drizzle-orm";
import { METERTRON_PLAN_KEY } from "@/server/billing/plans";
import { activateOrganisationAccess } from "@/server/billing/subscriptions";
import { writePlatformAudit } from "@/server/platform/audit";
import { getOrganisationDetail, listOrganisations } from "@/server/platform/overview";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { organisations } from "@/server/db/schema";

export async function GET(request: Request) {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  const id = url.searchParams.get("id");
  try {
    if (id) {
      const detail = await getOrganisationDetail(id);
      if (!detail) return Response.json({ error: "Not found." }, { status: 404 });
      return Response.json(detail);
    }
    const orgs = await listOrganisations(q);
    return Response.json({ orgs });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const gate = await requirePlatformStaff("manage_orgs");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as {
    organisationId?: unknown;
    action?: unknown;
    interval?: unknown;
    status?: unknown;
    planKey?: unknown;
    supportAccessAllowed?: unknown;
    supportAccessRequiresApproval?: unknown;
  };
  const organisationId = typeof body.organisationId === "string" ? body.organisationId : "";
  if (!organisationId) return Response.json({ error: "organisationId required." }, { status: 400 });

  if (body.action === "activate") {
    const interval = body.interval === "annual" ? "annual" : "monthly";
    try {
      const period = await withBypassRls(async () => activateOrganisationAccess(organisationId, interval));
      await writePlatformAudit({
        staffId: gate.staff.id,
        organisationId,
        action: "org.activate",
        targetType: "organisation",
        targetId: organisationId,
        summary: `Activated ${interval} access`,
        payload: { interval, ...period },
        ipAddress: await clientIp(),
      });
      return Response.json({ ok: true, subscription: period });
    } catch (error) {
      return Response.json({ error: safeDbMessage(error) }, { status: 500 });
    }
  }

  const patch: Partial<typeof organisations.$inferInsert> = { updatedAt: new Date() };
  if (
    body.status === "trialing" ||
    body.status === "active" ||
    body.status === "past_due" ||
    body.status === "readonly" ||
    body.status === "suspended"
  ) {
    patch.status = body.status;
  }
  if (typeof body.planKey === "string" && body.planKey.trim()) {
    // Single commercial plan — ignore legacy keys from older clients.
    patch.planKey = METERTRON_PLAN_KEY;
  }
  if (typeof body.supportAccessAllowed === "boolean") patch.supportAccessAllowed = body.supportAccessAllowed;
  if (typeof body.supportAccessRequiresApproval === "boolean") {
    patch.supportAccessRequiresApproval = body.supportAccessRequiresApproval;
  }

  try {
    await withBypassRls(async () => {
      await getDb().update(organisations).set(patch).where(eq(organisations.id, organisationId));
    });
    await writePlatformAudit({
      staffId: gate.staff.id,
      organisationId,
      action: "org.update",
      targetType: "organisation",
      targetId: organisationId,
      summary: "Updated organisation from platform",
      payload: patch as Record<string, unknown>,
      ipAddress: await clientIp(),
    });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
