import { desc, eq } from "drizzle-orm";
import { requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { platformAuditEvents, platformStaff } from "@/server/db/schema";

export async function GET(request: Request) {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  const orgId = new URL(request.url).searchParams.get("organisationId");
  try {
    const events = await withBypassRls(async () => {
      const db = getDb();
      const base = db
        .select({
          id: platformAuditEvents.id,
          action: platformAuditEvents.action,
          summary: platformAuditEvents.summary,
          organisationId: platformAuditEvents.organisationId,
          targetType: platformAuditEvents.targetType,
          targetId: platformAuditEvents.targetId,
          createdAt: platformAuditEvents.createdAt,
          staffEmail: platformStaff.email,
        })
        .from(platformAuditEvents)
        .leftJoin(platformStaff, eq(platformAuditEvents.staffId, platformStaff.id))
        .orderBy(desc(platformAuditEvents.createdAt))
        .limit(150);
      if (orgId) {
        return db
          .select({
            id: platformAuditEvents.id,
            action: platformAuditEvents.action,
            summary: platformAuditEvents.summary,
            organisationId: platformAuditEvents.organisationId,
            targetType: platformAuditEvents.targetType,
            targetId: platformAuditEvents.targetId,
            createdAt: platformAuditEvents.createdAt,
            staffEmail: platformStaff.email,
          })
          .from(platformAuditEvents)
          .leftJoin(platformStaff, eq(platformAuditEvents.staffId, platformStaff.id))
          .where(eq(platformAuditEvents.organisationId, orgId))
          .orderBy(desc(platformAuditEvents.createdAt))
          .limit(150);
      }
      return base;
    });
    return Response.json({ events });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
