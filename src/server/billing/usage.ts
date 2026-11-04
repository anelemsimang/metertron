import { and, count, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import {
  jobPhotos,
  jobs,
  organisationMemberships,
  organisations,
  plans,
  usagePeriods,
  users,
} from "@/server/db/schema";

export type UsageSnapshot = {
  periodStart: Date;
  periodEnd: Date;
  seatsUsed: number;
  installsCount: number;
  storageBytes: number;
  limits: {
    seatLimit: number | null;
    installsPerMonth: number | null;
    storageBytes: number | null;
  };
  ratios: {
    seats: number | null;
    installs: number | null;
    storage: number | null;
  };
  warnings: string[];
  blocked: string[];
};

function monthBounds(now = new Date()) {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
  const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  return { periodStart, periodEnd };
}

function ratio(used: number, limit: number | null) {
  if (limit == null || limit <= 0) return null;
  return used / limit;
}

export async function refreshUsage(organisationId: string): Promise<UsageSnapshot> {
  const db = getDb();
  const { periodStart, periodEnd } = monthBounds();

  const [org] = await db
    .select({ planKey: organisations.planKey })
    .from(organisations)
    .where(eq(organisations.id, organisationId))
    .limit(1);
  const [plan] = org
    ? await db.select().from(plans).where(eq(plans.key, org.planKey)).limit(1)
    : [];

  const [seatRow] = await db
    .select({ value: count() })
    .from(organisationMemberships)
    .innerJoin(users, eq(users.id, organisationMemberships.userId))
    .where(and(eq(organisationMemberships.organisationId, organisationId), isNull(users.removedAt)));

  const [installRow] = await db
    .select({ value: count() })
    .from(jobs)
    .where(
      and(
        eq(jobs.organisationId, organisationId),
        isNull(jobs.deletedAt),
        gte(jobs.submittedOn, periodStart),
        lt(jobs.submittedOn, periodEnd),
      ),
    );

  const [storageRow] = await db
    .select({
      value: sql<number>`coalesce(sum(octet_length(${jobPhotos.content})), 0)`.mapWith(Number),
    })
    .from(jobPhotos)
    .where(eq(jobPhotos.organisationId, organisationId));

  const seatsUsed = Number(seatRow?.value ?? 0);
  const installsCount = Number(installRow?.value ?? 0);
  const storageBytes = Number(storageRow?.value ?? 0);

  await db
    .insert(usagePeriods)
    .values({
      organisationId,
      periodStart,
      periodEnd,
      seatsUsed,
      installsCount,
      storageBytes,
    })
    .onConflictDoUpdate({
      target: [usagePeriods.organisationId, usagePeriods.periodStart],
      set: {
        seatsUsed,
        installsCount,
        storageBytes,
        periodEnd,
        updatedAt: new Date(),
      },
    });

  const limits = {
    seatLimit: plan?.seatLimit ?? null,
    installsPerMonth: plan?.installsPerMonth ?? null,
    storageBytes: plan?.storageBytes ?? null,
  };
  const ratios = {
    seats: ratio(seatsUsed, limits.seatLimit),
    installs: ratio(installsCount, limits.installsPerMonth),
    storage: ratio(storageBytes, limits.storageBytes),
  };

  const warnings: string[] = [];
  const blocked: string[] = [];
  const check = (label: string, used: number, limit: number | null, r: number | null) => {
    if (limit == null || r == null) return;
    if (r >= 1) blocked.push(`${label} limit reached (${used}/${limit}).`);
    else if (r >= 0.8) warnings.push(`${label} at ${Math.round(r * 100)}% of plan (${used}/${limit}).`);
  };
  check("Seats", seatsUsed, limits.seatLimit, ratios.seats);
  check("Installs this month", installsCount, limits.installsPerMonth, ratios.installs);
  check("Storage", storageBytes, limits.storageBytes, ratios.storage);

  return { periodStart, periodEnd, seatsUsed, installsCount, storageBytes, limits, ratios, warnings, blocked };
}

export async function assertWithinInstallLimit(organisationId: string) {
  const usage = await refreshUsage(organisationId);
  if (usage.blocked.some((msg) => msg.startsWith("Installs"))) {
    throw new Error(usage.blocked.find((msg) => msg.startsWith("Installs")) ?? "Install limit reached.");
  }
  return usage;
}

export async function assertWithinSeatLimit(organisationId: string) {
  const usage = await refreshUsage(organisationId);
  if (usage.blocked.some((msg) => msg.startsWith("Seats"))) {
    throw new Error(usage.blocked.find((msg) => msg.startsWith("Seats")) ?? "Seat limit reached.");
  }
  return usage;
}
