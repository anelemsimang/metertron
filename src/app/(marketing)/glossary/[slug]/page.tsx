import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/marketing/json-ld";
import {
  Breadcrumbs,
  CtaBand,
  MkContainer,
  MkH1,
  MkLead,
  MkSection,
} from "@/components/marketing/ui";
import { allTerms, getTerm } from "@/lib/marketing/glossary";
import { pageMetadata } from "@/lib/marketing/seo";
import { SITE } from "@/lib/marketing/site";

export function generateStaticParams() {
  return allTerms().map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) return {};
  return pageMetadata({
    title: `${term.term} – Metertron glossary`,
    description: term.short,
    path: `/glossary/${term.slug}`,
  });
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getTerm(slug);
  if (!term) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: term.term,
          description: term.short,
          inDefinedTermSet: `${SITE.url}/glossary`,
          url: `${SITE.url}/glossary/${term.slug}`,
        }}
      />
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Glossary", path: "/glossary" },
              { name: term.term, path: `/glossary/${term.slug}` },
            ]}
          />
          <MkH1>{term.term}</MkH1>
          <MkLead>{term.short}</MkLead>
          <div className="mt-8 space-y-4 text-muted">
            {term.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-10 text-sm">
            <Link href="/blog" className="text-[var(--mt-leaf-deep)] hover:underline">
              Blog
            </Link>
            {" · "}
            <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
              Product
            </Link>
            {" · "}
            <Link href="/guides/meter-installation-programme-guide" className="text-[var(--mt-leaf-deep)] hover:underline">
              Programme guide
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
