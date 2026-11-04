import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseNotice } from "@/components/office/database-notice";
import { ExportTemplateEditor } from "@/components/office/export-template-editor";
import { SectionTitle } from "@/components/section-title";
import { getSessionUser } from "@/server/auth/session";
import { withOrg } from "@/server/db/client";
import { getExportTemplate } from "@/server/templates/export";

export const dynamic = "force-dynamic";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) throw new Error("Sign in required.");
    const template = await withOrg(user.organisationId, () => getExportTemplate(user.organisationId, id));
    if (!template) notFound();
    return (
      <div className="space-y-4">
        <div>
          <Link href="/office/templates" className="text-sm font-semibold text-brand">
            ← Templates
          </Link>
          <SectionTitle className="mt-2">Edit export template</SectionTitle>
          <p className="mt-3 text-sm text-muted">
            Change column order and wording carefully — municipal systems often expect exact header text, including historical typos.
          </p>
        </div>
        <ExportTemplateEditor
          template={{
            id: template.id,
            key: template.key,
            name: template.name,
            sheetName: template.sheetName,
            statusExportValue: template.statusExportValue,
            headers: template.headers,
            mapHeaders: template.mapHeaders,
            listPhrases: template.listPhrases,
            isDefault: template.isDefault,
          }}
        />
      </div>
    );
  } catch (error) {
    return <DatabaseNotice title="Export template" error={error} />;
  }
}
