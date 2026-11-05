import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { getDb, withBypassRls } from "@/server/db/client";
import {
  invoices,
  organisationMemberships,
  organisationSubscriptions,
  organisations,
  platformAuditEvents,
  platformStaff,
  users,
} from "@/server/db/schema";

export async function getPlatformOverview() {
  return withBypassRls(async () => {
    const db = getDb();
    const [orgCounts] = await db
      .select({
        total: count(),
        trialing: sql<number>`count(*) filter (where ${organisations.status} = 'trialing')`.mapWith(Number),
        active: sql<number>`count(*) filter (where ${organisations.status} = 'active')`.mapWith(Number),
        pastDue: sql<number>`count(*) filter (where ${organisations.status} in ('past_due','readonly'))`.mapWith(Number),
        suspended: sql<number>`count(*) filter (where ${organisations.status} = 'suspended')`.mapWith(Number),
      })
      .from(organisations);

    const [userCount] = await db.select({ total: count() }).from(users);
    const [staffCount] = await db.select({ total: count() }).from(platformStaff);
    const [membershipCount] = await db.select({ total: count() }).from(organisationMemberships);

    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const [paid] = await db
      .select({
        revenueZarCents: sql<number>`coalesce(sum(${invoices.totalZarCents}), 0)`.mapWith(Number),
        invoiceCount: count(),
      })
      .from(invoices)
      .where(and(eq(invoices.status, "paid"), gte(invoices.paidAt, monthStart)));

    const recentOrgs = await db
      .select({
        id: organisations.id,
        name: organisations.name,
        slug: organisations.slug,
        status: organisations.status,
        planKey: organisations.planKey,
        createdAt: organisations.createdAt,
      })
      .from(organisations)
      .orderBy(desc(organisations.createdAt))
      .limit(8);

    const recentAudit = await db
      .select({
        id: platformAuditEvents.id,
        action: platformAuditEvents.action,
        summary: platformAuditEvents.summary,
        createdAt: platformAuditEvents.createdAt,
        staffEmail: platformStaff.email,
      })
      .from(platformAuditEvents)
      .leftJoin(platformStaff, eq(platformAuditEvents.staffId, platformStaff.id))
      .orderBy(desc(platformAuditEvents.createdAt))
      .limit(12);

    return {
      orgs: orgCounts,
      users: userCount.total,
      memberships: membershipCount.total,
      staff: staffCount.total,
      revenueThisMonthZarCents: paid?.revenueZarCents ?? 0,
      paidInvoicesThisMonth: paid?.invoiceCount ?? 0,
      recentOrgs,
      recentAudit,
    };
  });
}

export async function listOrganisations(query?: string) {
  return withBypassRls(async () => {
    const db = getDb();
    const rows = await db
      .select({
        id: organisations.id,
        name: organisations.name,
        legalName: organisations.legalName,
        slug: organisations.slug,
        status: organisations.status,
        planKey: organisations.planKey,
        trialEndsAt: organisations.trialEndsAt,
        supportAccessAllowed: organisations.supportAccessAllowed,
        supportAccessRequiresApproval: organisations.supportAccessRequiresApproval,
        createdAt: organisations.createdAt,
      })
      .from(organisations)
      .orderBy(desc(organisations.createdAt))
      .limit(200);

    const q = query?.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.legalName.toLowerCase().includes(q) ||
        row.id.includes(q),
    );
  });
}

export async function getOrganisationDetail(organisationId: string) {
  return withBypassRls(async () => {
    const db = getDb();
    const [org] = await db.select().from(organisations).where(eq(organisations.id, organisationId)).limit(1);
    if (!org) return null;
    const members = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        role: organisationMemberships.role,
        removedAt: users.removedAt,
      })
      .from(organisationMemberships)
      .innerJoin(users, eq(organisationMemberships.userId, users.id))
      .where(eq(organisationMemberships.organisationId, organisationId))
      .limit(100);
    const [subscription] = await db
      .select({
        status: organisationSubscriptions.status,
        interval: organisationSubscriptions.interval,
        currentPeriodStart: organisationSubscriptions.currentPeriodStart,
        currentPeriodEnd: organisationSubscriptions.currentPeriodEnd,
      })
      .from(organisationSubscriptions)
      .where(eq(organisationSubscriptions.organisationId, organisationId))
      .limit(1);
    return { organisation: org, members, subscription: subscription ?? null };
  });
}
