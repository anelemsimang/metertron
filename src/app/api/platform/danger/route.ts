import { eq } from "drizzle-orm";
import { writePlatformAudit } from "@/server/platform/audit";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { organisations } from "@/server/db/schema";

export async function POST(request: Request) {
  const gate = await requirePlatformStaff("danger");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as {
    action?: unknown;
    organisationId?: unknown;
    confirmSlug?: unknown;
  };
  const organisationId = typeof body.organisationId === "string" ? body.organisationId : "";
  const confirmSlug = typeof body.confirmSlug === "string" ? body.confirmSlug.trim() : "";
  const action = body.action === "mark_deleted" ? "mark_deleted" : body.action === "suspend" ? "suspend" : "";
  if (!organisationId || !action) return Response.json({ error: "organisationId and action required." }, { status: 400 });

  try {
    const result = await withBypassRls(async () => {
      const db = getDb();
      const [org] = await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1);
      if (!org) throw new Error("Organisation not found.");
      if (confirmSlug !== org.slug) throw new Error("Confirm by typing the organisation slug exactly.");
      const status = action === "suspend" ? "suspended" : "deleted";
      await db.update(organisations).set({ status, updatedAt: new Date() }).where(eq(organisations.id, organisationId));
      return org;
    });

    await writePlatformAudit({
      staffId: gate.staff.id,
      organisationId,
      action: `danger.${action}`,
      targetType: "organisation",
      targetId: organisationId,
      summary: `${action} on ${result.name}`,
      ipAddress: await clientIp(),
    });
    return Response.json({ ok: true, status: action === "suspend" ? "suspended" : "deleted" });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
