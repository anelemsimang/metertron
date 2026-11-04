import { eq } from "drizzle-orm";
import { METERTRON_PLAN_KEY, TRIAL_DAYS } from "@/server/billing/plans";
import { writePlatformAudit } from "@/server/platform/audit";
import { ensureMetertronPlan, getMetertronPlan } from "@/server/billing/subscriptions";
import { annualFromMonthly } from "@/server/billing/vat";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { plans } from "@/server/db/schema";

export async function GET() {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  try {
    const plan = await getMetertronPlan();
    const monthly = plan?.amountMonthlyZarCents ?? null;
    return Response.json({
      plan,
      trialDays: TRIAL_DAYS,
      annualZarCents: monthly != null ? annualFromMonthly(monthly) : null,
      model: {
        key: METERTRON_PLAN_KEY,
        summary: "One Metertron subscription per organisation. Full product access. No seat or install caps. Trial is status, not a separate plan.",
      },
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const gate = await requirePlatformStaff("manage_plans");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as {
    name?: unknown;
    description?: unknown;
    amountMonthlyZarCents?: unknown;
  };

  const patch: Partial<typeof plans.$inferInsert> = {
    updatedAt: new Date(),
    seatLimit: null,
    installsPerMonth: null,
    storageBytes: null,
    isPublic: true,
    sortOrder: 0,
  };
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.amountMonthlyZarCents === "number" && Number.isFinite(body.amountMonthlyZarCents) && body.amountMonthlyZarCents >= 0) {
    patch.amountMonthlyZarCents = Math.round(body.amountMonthlyZarCents);
  }

  try {
    await ensureMetertronPlan();
    await withBypassRls(async () => {
      await getDb().update(plans).set(patch).where(eq(plans.key, METERTRON_PLAN_KEY));
    });
    await writePlatformAudit({
      staffId: gate.staff.id,
      action: "plan.update",
      targetType: "plan",
      targetId: METERTRON_PLAN_KEY,
      summary: "Updated Metertron plan",
      payload: patch as Record<string, unknown>,
      ipAddress: await clientIp(),
    });
    const plan = await getMetertronPlan();
    return Response.json({ ok: true, plan });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
