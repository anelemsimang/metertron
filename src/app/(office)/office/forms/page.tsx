import { DatabaseNotice } from "@/components/office/database-notice";
import { CatalogPanel } from "@/components/office/catalog-panel";
import { FormBuilderPanel } from "@/components/office/form-builder";
import { SectionTitle } from "@/components/section-title";
import { getSessionUser } from "@/server/auth/session";
import { withOrg } from "@/server/db/client";
import { ensureDefaultContract } from "@/server/templates/contracts";
import { listCatalogItems, listZones } from "@/server/templates/catalogs";
import { listFormVersions, listOrgContracts } from "@/server/templates/forms";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("Sign in required.");
    const data = await withOrg(user.organisationId, async () => {
      await ensureDefaultContract(user.organisationId);
      const contracts = await listOrgContracts(user.organisationId);
      const forms = await listFormVersions(user.organisationId);
      const contractId = contracts[0]?.id;
      const items = contractId ? await listCatalogItems(user.organisationId, contractId) : [];
      const zones = contractId ? await listZones(user.organisationId, contractId) : [];
      return { contracts, forms, items, zones, contractId: contractId ?? null };
    });

    return (
      <div className="space-y-8">
        <div>
          <SectionTitle>Forms & catalogs</SectionTitle>
          <p className="mt-3 max-w-3xl text-sm text-muted">
            Build meter-change form versions for each contract, publish them for field capture, and manage size/class/type catalogs and towns.
          </p>
        </div>
        <FormBuilderPanel contracts={data.contracts} forms={data.forms} />
        <CatalogPanel contracts={data.contracts} initialContractId={data.contractId} initialItems={data.items} initialZones={data.zones} />
      </div>
    );
  } catch (error) {
    return <DatabaseNotice title="Forms" error={error} />;
  }
}
