import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  CtaBand,
  CtaPrimary,
  CtaSecondary,
  FaqAccordion,
  MkContainer,
  MkH1,
  MkLead,
  MkSection,
  RelatedLinks,
} from "@/components/marketing/ui";
import { allMunicipalities, getMunicipality } from "@/lib/marketing/content/municipalities";
import { pageMetadata } from "@/lib/marketing/seo";

export function generateStaticParams() {
  return allMunicipalities().map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = getMunicipality(slug);
  if (!row) return {};
  return pageMetadata({
    title: row.metaTitle,
    description: row.metaDescription,
    path: `/municipalities/${row.slug}`,
    noIndex: !row.indexable,
  });
}

export default async function MunicipalityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = getMunicipality(slug);
  if (!row) notFound();

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Municipalities", path: "/municipalities" },
              { name: row.name, path: `/municipalities/${row.slug}` },
            ]}
          />
          <p className="text-sm text-muted">{row.province}</p>
          <MkH1>{row.name} meter installation capture</MkH1>
          <MkLead>{row.summary}</MkLead>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaPrimary />
            <CtaSecondary />
          </div>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer className="prose-marketing max-w-3xl space-y-5 text-muted">
          {row.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">Local FAQ</h2>
          <div className="mt-6">
            <FaqAccordion faqs={row.faqs} />
          </div>
          <div className="mt-12">
            <RelatedLinks
              title="Nearby metros"
              links={row.nearby.map((nearbySlug) => {
                const nearby = getMunicipality(nearbySlug);
                return {
                  href: `/municipalities/${nearbySlug}`,
                  label: nearby?.name ?? nearbySlug,
                };
              })}
            />
          </div>
          <p className="mt-8 text-sm">
            <Link href="/features/municipal-export-templates" className="text-[var(--mt-leaf-deep)] hover:underline">
              Export templates
            </Link>
            {" · "}
            <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
              Pricing
            </Link>
            {" · "}
            <Link href="/demo" className="text-[var(--mt-leaf-deep)] hover:underline">
              Book a demo
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
