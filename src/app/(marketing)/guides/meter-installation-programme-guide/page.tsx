import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumbs,
  CtaBand,
  MkContainer,
  MkH1,
  MkLead,
  MkSection,
} from "@/components/marketing/ui";
import { PROGRAMME_GUIDE } from "@/lib/marketing/content/guide";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: PROGRAMME_GUIDE.metaTitle,
  description: PROGRAMME_GUIDE.metaDescription,
  path: PROGRAMME_GUIDE.path,
});

export default function ProgrammeGuidePage() {
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Guides", path: "/guides/meter-installation-programme-guide" },
              { name: "Programme guide", path: PROGRAMME_GUIDE.path },
            ]}
          />
          <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
            <nav aria-label="Table of contents" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-semibold text-[var(--mt-grove)]">On this page</p>
              <ol className="mt-3 space-y-2 text-sm">
                {PROGRAMME_GUIDE.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-[var(--mt-leaf-deep)] hover:underline">
                      {section.heading.replace(/^\d+\.\s*/, "")}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <article>
              <MkH1>{PROGRAMME_GUIDE.title}</MkH1>
              <MkLead>
                A practical pillar for South African contractors and programme managers — from scope pack to municipal-ready
                export.
              </MkLead>
              <div className="mt-12 space-y-14">
                {PROGRAMME_GUIDE.sections.map((section) => (
                  <section key={section.id} id={section.id}>
                    <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">{section.heading}</h2>
                    <div className="mt-4 space-y-4 text-muted">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
              <p className="mt-12 text-sm">
                <Link href="/features/field-capture-app" className="text-[var(--mt-leaf-deep)] hover:underline">
                  Field capture
                </Link>
                {" · "}
                <Link href="/blog" className="text-[var(--mt-leaf-deep)] hover:underline">
                  Blog
                </Link>
                {" · "}
                <Link href="/resources/templates" className="text-[var(--mt-leaf-deep)] hover:underline">
                  Templates
                </Link>
                {" · "}
                <Link href="/demo" className="text-[var(--mt-leaf-deep)] hover:underline">
                  Book a demo
                </Link>
              </p>
            </article>
          </div>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
