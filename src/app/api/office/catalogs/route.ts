import { requireCapability } from "@/server/auth/require-admin";
import { safeDbMessage, withOrg } from "@/server/db/client";
import {
  ensureDefaultCatalogs,
  listCatalogItems,
  listZones,
  upsertCatalogItem,
  upsertZone,
  type CatalogKind,
} from "@/server/templates/catalogs";
import { ensureDefaultContract } from "@/server/templates/contracts";
import { listOrgContracts } from "@/server/templates/forms";

const KINDS = new Set<CatalogKind>(["size", "class", "type"]);

export async function GET(request: Request) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const contractId = new URL(request.url).searchParams.get("contractId") ?? undefined;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      await ensureDefaultContract(gate.user.organisationId);
      const contracts = await listOrgContracts(gate.user.organisationId);
      const activeContractId = contractId ?? contracts[0]?.id;
      if (activeContractId) {
        await ensureDefaultCatalogs(gate.user.organisationId, activeContractId);
      }
      const [items, zones] = await Promise.all([
        listCatalogItems(gate.user.organisationId, activeContractId),
        listZones(gate.user.organisationId, activeContractId),
      ]);
      return Response.json({ contracts, contractId: activeContractId ?? null, items, zones });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requireCapability("manage_setup");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as Record<string, unknown>;
  const contractId = typeof body.contractId === "string" ? body.contractId : "";
  if (!contractId) return Response.json({ error: "Choose a contract." }, { status: 400 });

  try {
    return await withOrg(gate.user.organisationId, async () => {
      if (body.kind === "zone") {
        const zone = await upsertZone(gate.user.organisationId, {
          contractId,
          name: typeof body.name === "string" ? body.name : "",
        });
        return Response.json({ zone });
      }
      const kind = body.kind as CatalogKind;
      if (!KINDS.has(kind)) return Response.json({ error: "Choose size, class, or type." }, { status: 400 });
      const item = await upsertCatalogItem(gate.user.organisationId, {
        contractId,
        kind,
        code: typeof body.code === "string" ? body.code : "",
        exportString: typeof body.exportString === "string" ? body.exportString : "",
        isDefault: body.isDefault === true,
      });
      return Response.json({ item });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
