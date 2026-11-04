import { eq } from "drizzle-orm";
import { requireSession } from "@/server/auth/require-admin";
import { getDb, safeDbMessage, withOrg } from "@/server/db/client";
import { organisations } from "@/server/db/schema";
import { ensureDefaultContract } from "@/server/templates/contracts";
import { ensureBuiltinExportTemplates } from "@/server/templates/export";

export async function GET() {
  const gate = await requireSession();
  if ("error" in gate) return gate.error;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      const [org] = await getDb()
        .select({
          id: organisations.id,
          name: organisations.name,
          legalName: organisations.legalName,
          slug: organisations.slug,
          vatNumber: organisations.vatNumber,
          timezone: organisations.timezone,
          trialEndsAt: organisations.trialEndsAt,
          onboardingCompletedAt: organisations.onboardingCompletedAt,
        })
        .from(organisations)
        .where(eq(organisations.id, gate.user.organisationId))
        .limit(1);
      return Response.json({ organisation: org, membershipRole: gate.user.membershipRole });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireSession();
  if ("error" in gate) return gate.error;
  if (gate.user.membershipRole !== "owner" && gate.user.membershipRole !== "admin") {
    return Response.json({ error: "Only an owner or admin can finish onboarding." }, { status: 403 });
  }

  const body = (await request.json()) as {
    companyName?: unknown;
    legalName?: unknown;
    vatNumber?: unknown;
    timezone?: unknown;
    complete?: unknown;
  };

  const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
  const legalName = typeof body.legalName === "string" ? body.legalName.trim() : "";
  const vatNumber = typeof body.vatNumber === "string" ? body.vatNumber.trim() : "";
  const timezone = typeof body.timezone === "string" ? body.timezone.trim() : "Africa/Johannesburg";
  const complete = body.complete === true;

  if (companyName && companyName.length < 2) {
    return Response.json({ error: "Company name is too short." }, { status: 400 });
  }

  try {
    return await withOrg(gate.user.organisationId, async () => {
      const [organisation] = await getDb()
        .update(organisations)
        .set({
          ...(companyName ? { name: companyName } : {}),
          ...(legalName ? { legalName } : companyName ? { legalName: companyName } : {}),
          vatNumber: vatNumber || null,
          timezone: timezone || "Africa/Johannesburg",
          ...(complete ? { onboardingCompletedAt: new Date() } : {}),
          updatedAt: new Date(),
        })
        .where(eq(organisations.id, gate.user.organisationId))
        .returning({
          id: organisations.id,
          name: organisations.name,
          onboardingCompletedAt: organisations.onboardingCompletedAt,
        });
      if (complete) {
        await ensureBuiltinExportTemplates(gate.user.organisationId);
        await ensureDefaultContract(gate.user.organisationId);
      }
      return Response.json({ organisation });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
