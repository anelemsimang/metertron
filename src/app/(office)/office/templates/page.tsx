import { DatabaseNotice } from "@/components/office/database-notice";
import { ExportTemplateList } from "@/components/office/export-template-list";
import { SectionTitle } from "@/components/section-title";
import { getSessionUser } from "@/server/auth/session";
import { withOrg } from "@/server/db/client";
import { listExportTemplates } from "@/server/templates/export";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("Sign in required.");
    const templates = await withOrg(user.organisationId, () => listExportTemplates(user.organisationId));
    return (
      <div className="space-y-4">
        <div>
          <SectionTitle>Export templates</SectionTitle>
          <p className="mt-3 max-w-3xl text-sm text-muted">
            Municipal spreadsheet layouts for this organisation. The built-in eThekwini (WS7761) template is cloned on first use — edit columns, sheet name, and status wording, or clone your own.
          </p>
        </div>
        <ExportTemplateList
          templates={templates.map((template) => ({
            id: template.id,
            key: template.key,
            name: template.name,
            sheetName: template.sheetName,
            statusExportValue: template.statusExportValue,
            headers: template.headers,
            isDefault: template.isDefault,
            sourceBuiltin: template.sourceBuiltin,
          }))}
        />
      </div>
    );
  } catch (error) {
    return <DatabaseNotice title="Export templates" error={error} />;
  }
}
