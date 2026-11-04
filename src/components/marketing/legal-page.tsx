import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  MkContainer,
  MkH1,
  MkSection,
  RelatedLinks,
} from "@/components/marketing/ui";
import { getLegalPage } from "@/lib/marketing/content/legal";
import { LEGAL_DRAFT_BANNER } from "@/lib/marketing/legal-constants";

export function LegalPageView({ slug, path }: { slug: string; path: string }) {
  const page = getLegalPage(slug);
  if (!page) notFound();

  const shortTitle = page.title.replace(/\s*\(Draft\)\s*/i, "").trim();

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Legal", path: "/privacy" },
              { name: shortTitle, path },
            ]}
          />
          <div
            role="status"
            className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            {LEGAL_DRAFT_BANNER}
          </div>
          <MkH1>{page.title}</MkH1>
          <div className="mt-10 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--mt-grove)]">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-muted">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-12 border-t border-line pt-8 text-sm text-muted">
            <p>
              Questions?{" "}
              <Link href="/contact" className="text-[var(--mt-leaf-deep)] hover:underline">
                Contact us
              </Link>
              , read our{" "}
              <Link href="/security" className="text-[var(--mt-leaf-deep)] hover:underline">
                security overview
              </Link>
              , or see the{" "}
              <Link href="/privacy" className="text-[var(--mt-leaf-deep)] hover:underline">
                privacy policy
              </Link>
              .
            </p>
          </div>
          <div className="mt-10">
            <RelatedLinks
              title="Other legal documents"
              links={[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/popia", label: "POPIA summary" },
                { href: "/dpa", label: "Data Processing Addendum" },
                { href: "/acceptable-use", label: "Acceptable Use" },
                { href: "/sla", label: "SLA" },
              ]}
            />
          </div>
        </MkContainer>
      </MkSection>
    </>
  );
}
