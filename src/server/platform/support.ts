import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { SUPPORT_SESSION_COOKIE } from "@/lib/brand";
import { writePlatformAudit } from "@/server/platform/audit";
import { getDb, withBypassRls, withOrg } from "@/server/db/client";
import {
  organisations,
  platformSupportSessions,
  supportAccessEvents,
} from "@/server/db/schema";
import type { PlatformStaffSession } from "@/server/platform/session";

const FOUR_HOURS = 60 * 60 * 4;

export type SupportContext = {
  sessionId: string;
  organisationId: string;
  organisationName: string;
  organisationSlug: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  reason: string;
  accessEventId: string | null;
};

function cookieOptions(maxAge = FOUR_HOURS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function startSupportSession(
  staff: PlatformStaffSession,
  organisationId: string,
  reason: string,
  ipAddress?: string | null,
) {
  return withBypassRls(async () => {
    const db = getDb();
    const [org] = await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1);
    if (!org) throw new Error("Organisation not found.");
    if (!org.supportAccessAllowed) throw new Error("This organisation has disabled Metertron support access.");

    const [accessEvent] = await db
      .insert(supportAccessEvents)
      .values({
        organisationId,
        staffId: staff.id,
        staffEmail: staff.email,
        staffName: staff.name,
        reason,
        startedAt: new Date(),
      })
      .returning();

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + FOUR_HOURS * 1000);
    const [session] = await db
      .insert(platformSupportSessions)
      .values({
        staffId: staff.id,
        organisationId,
        accessEventId: accessEvent.id,
        token,
        reason,
        expiresAt,
      })
      .returning();

    await writePlatformAudit({
      staffId: staff.id,
      organisationId,
      action: "support.view_as.start",
      targetType: "organisation",
      targetId: organisationId,
      summary: `Started support access on ${org.name}`,
      payload: { reason, accessEventId: accessEvent.id },
      ipAddress,
    });

    const store = await cookies();
    store.set(SUPPORT_SESSION_COOKIE, token, cookieOptions());
    return { session, accessEvent, organisation: org };
  });
}

export async function endSupportSession() {
  const store = await cookies();
  const token = store.get(SUPPORT_SESSION_COOKIE)?.value;
  if (!token) return;
  await withBypassRls(async () => {
    const db = getDb();
    const [session] = await db
      .select()
      .from(platformSupportSessions)
      .where(eq(platformSupportSessions.token, token))
      .limit(1);
    if (!session) return;
    await db
      .update(platformSupportSessions)
      .set({ endedAt: new Date(), updatedAt: new Date() })
      .where(eq(platformSupportSessions.id, session.id));
    if (session.accessEventId) {
      await db
        .update(supportAccessEvents)
        .set({ endedAt: new Date(), updatedAt: new Date() })
        .where(eq(supportAccessEvents.id, session.accessEventId));
    }
    await writePlatformAudit({
      staffId: session.staffId,
      organisationId: session.organisationId,
      action: "support.view_as.end",
      targetType: "organisation",
      targetId: session.organisationId,
      summary: "Ended support access",
    });
  });
  store.delete(SUPPORT_SESSION_COOKIE);
}

export async function getSupportContext(): Promise<SupportContext | null> {
  const store = await cookies();
  const token = store.get(SUPPORT_SESSION_COOKIE)?.value;
  if (!token) return null;

  return withBypassRls(async () => {
    const [row] = await getDb()
      .select({
        sessionId: platformSupportSessions.id,
        organisationId: platformSupportSessions.organisationId,
        staffId: platformSupportSessions.staffId,
        reason: platformSupportSessions.reason,
        accessEventId: platformSupportSessions.accessEventId,
        expiresAt: platformSupportSessions.expiresAt,
        endedAt: platformSupportSessions.endedAt,
        organisationName: organisations.name,
        organisationSlug: organisations.slug,
        staffEmail: supportAccessEvents.staffEmail,
        staffName: supportAccessEvents.staffName,
      })
      .from(platformSupportSessions)
      .innerJoin(organisations, eq(platformSupportSessions.organisationId, organisations.id))
      .leftJoin(supportAccessEvents, eq(platformSupportSessions.accessEventId, supportAccessEvents.id))
      .where(
        and(
          eq(platformSupportSessions.token, token),
          gt(platformSupportSessions.expiresAt, new Date()),
          isNull(platformSupportSessions.endedAt),
        ),
      )
      .limit(1);

    if (!row) return null;
    return {
      sessionId: row.sessionId,
      organisationId: row.organisationId,
      organisationName: row.organisationName,
      organisationSlug: row.organisationSlug,
      staffId: row.staffId,
      staffName: row.staffName ?? "Metertron Support",
      staffEmail: row.staffEmail ?? "",
      reason: row.reason,
      accessEventId: row.accessEventId,
    };
  });
}

export async function listSupportAccessForOrg(organisationId: string, limit = 20) {
  return withOrg(organisationId, async () => {
    return getDb()
      .select({
        id: supportAccessEvents.id,
        staffEmail: supportAccessEvents.staffEmail,
        staffName: supportAccessEvents.staffName,
        reason: supportAccessEvents.reason,
        startedAt: supportAccessEvents.startedAt,
        endedAt: supportAccessEvents.endedAt,
      })
      .from(supportAccessEvents)
      .where(eq(supportAccessEvents.organisationId, organisationId))
      .orderBy(desc(supportAccessEvents.startedAt))
      .limit(limit);
  });
}
