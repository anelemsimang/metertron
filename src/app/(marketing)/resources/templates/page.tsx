import type { Metadata } from "next";
import Link from "next/link";
import { TemplatesLeadForm } from "@/components/marketing/templates-lead-form";
import { Breadcrumbs, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Templates & checklists – Metertron",
  description:
    "Download a meter installation field checklist and a blank municipal-style export header sheet for your programme.",
  path: "/resources/templates",
});

export default function TemplatesResourcePage() {
  return (
    <MkSection className="pt-10 md:pt-14">
      <MkContainer className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Resources", path: "/blog" },
              { name: "Templates", path: "/resources/templates" },
            ]}
          />
          <MkH1>Field checklist and export headers</MkH1>
          <MkLead>
            A capture checklist for supervisors, plus a blank CSV of common municipal-style columns you can map in Metertron —
            always validate column names against your client’s current pack.
          </MkLead>
          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li>Checklist covers serials, seals, photos, GPS and commissioning notes</li>
            <li>Export file is headers only — no fabricated install rows</li>
            <li>Files download after you confirm POPIA consent</li>
          </ul>
          <p className="mt-8 text-sm">
            <Link href="/guides/meter-installation-programme-guide" className="text-[var(--mt-leaf-deep)] hover:underline">
              Programme guide
            </Link>
            {" · "}
            <Link href="/features/municipal-export-templates" className="text-[var(--mt-leaf-deep)] hover:underline">
              Export templates feature
            </Link>
            {" · "}
            <Link href="/blog" className="text-[var(--mt-leaf-deep)] hover:underline">
              Blog
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white p-6 md:p-8">
          <TemplatesLeadForm />
        </div>
      </MkContainer>
    </MkSection>
  );
}
