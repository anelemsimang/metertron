import { getDb, withBypassRls } from "@/server/db/client";
import { platformAuditEvents } from "@/server/db/schema";

export async function writePlatformAudit(input: {
  staffId?: string | null;
  organisationId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  summary?: string;
  payload?: Record<string, unknown>;
  ipAddress?: string | null;
}) {
  await withBypassRls(async () => {
    await getDb().insert(platformAuditEvents).values({
      staffId: input.staffId ?? null,
      organisationId: input.organisationId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      summary: input.summary ?? "",
      payload: input.payload ?? {},
      ipAddress: input.ipAddress ?? null,
    });
  });
}
