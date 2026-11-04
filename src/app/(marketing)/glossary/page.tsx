import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { allTerms } from "@/lib/marketing/glossary";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Glossary – Metertron",
  description: "Plain-language definitions for meter installation, municipal submission, and Metertron product terms.",
  path: "/glossary",
});

export default function GlossaryIndexPage() {
  const terms = allTerms();
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Glossary", path: "/glossary" },
            ]}
          />
          <MkH1>Water meter glossary</MkH1>
          <MkLead>{terms.length} definitions for crews, office leads and municipal counterparts.</MkLead>
          <ul className="mt-12 columns-1 gap-8 sm:columns-2">
            {terms.map((term) => (
              <li key={term.slug} className="mb-3 break-inside-avoid">
                <Link href={`/glossary/${term.slug}`} className="text-[var(--mt-grove)] hover:text-[var(--mt-leaf-deep)] hover:underline">
                  {term.term}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm">
            <Link href="/blog" className="text-[var(--mt-leaf-deep)] hover:underline">
              Blog
            </Link>
            {" · "}
            <Link href="/guides/meter-installation-programme-guide" className="text-[var(--mt-leaf-deep)] hover:underline">
              Programme guide
            </Link>
            {" · "}
            <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
              Product
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
