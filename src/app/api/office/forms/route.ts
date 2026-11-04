import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage, withOrg } from "@/server/db/client";
import { ensureDefaultContract } from "@/server/templates/contracts";
import { listFormVersions, listOrgContracts, seedMeterChangeDraft } from "@/server/templates/forms";

export async function GET(request: Request) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const contractId = new URL(request.url).searchParams.get("contractId") ?? undefined;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      await ensureDefaultContract(gate.user.organisationId);
      const [forms, contracts] = await Promise.all([
        listFormVersions(gate.user.organisationId, contractId),
        listOrgContracts(gate.user.organisationId),
      ]);
      return Response.json({ forms, contracts });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { contractId?: unknown; action?: unknown };
  const contractId = typeof body.contractId === "string" ? body.contractId : "";
  if (!contractId) return Response.json({ error: "Choose a contract." }, { status: 400 });
  try {
    return await withOrg(gate.user.organisationId, async () => {
      const form = await seedMeterChangeDraft(gate.user.organisationId, contractId);
      return Response.json({ form });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
