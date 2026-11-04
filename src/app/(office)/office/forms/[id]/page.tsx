import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseNotice } from "@/components/office/database-notice";
import { FormDraftEditor } from "@/components/office/form-builder";
import { SectionTitle } from "@/components/section-title";
import { getSessionUser } from "@/server/auth/session";
import { withOrg } from "@/server/db/client";
import { getFormVersion } from "@/server/templates/forms";

export const dynamic = "force-dynamic";

export default async function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) throw new Error("Sign in required.");
    const form = await withOrg(user.organisationId, () => getFormVersion(user.organisationId, id));
    if (!form) notFound();
    return (
      <div className="space-y-4">
        <div>
          <Link href="/office/forms" className="text-sm font-semibold text-brand">
            ← Forms
          </Link>
          <SectionTitle className="mt-2">Form builder</SectionTitle>
        </div>
        <FormDraftEditor
          form={{
            id: form.id,
            contractId: form.contractId,
            key: form.key,
            version: form.version,
            status: form.status,
            schema: form.schema,
          }}
        />
      </div>
    );
  } catch (error) {
    return <DatabaseNotice title="Form" error={error} />;
  }
}
