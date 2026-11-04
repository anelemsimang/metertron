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
} from "@/components/marketing/ui";
import { allComparePages, getComparePage } from "@/lib/marketing/content/compare";
import { pageMetadata } from "@/lib/marketing/seo";

export function generateStaticParams() {
  return allComparePages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/compare/${page.slug}`,
  });
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Compare", path: "/compare/metertron-vs-paper-job-cards" },
              { name: page.title, path: `/compare/${page.slug}` },
            ]}
          />
          <MkH1>{page.heroHeadline}</MkH1>
          <MkLead>{page.heroSubhead}</MkLead>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaPrimary />
            <CtaSecondary />
          </div>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer>
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-[var(--mt-mist)]/40">
                <tr>
                  <th className="px-4 py-3 font-semibold text-[var(--mt-grove)]">Criterion</th>
                  <th className="px-4 py-3 font-semibold text-[var(--mt-grove)]">Metertron</th>
                  <th className="px-4 py-3 font-semibold text-[var(--mt-grove)]">{page.otherLabel}</th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((row) => (
                  <tr key={row.criterion} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--mt-grove)]">{row.criterion}</td>
                    <td className="px-4 py-3 text-muted">{row.metertron}</td>
                    <td className="px-4 py-3 text-muted">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-8 list-disc space-y-2 pl-5 text-muted">
            {page.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">FAQ</h2>
          <div className="mt-6">
            <FaqAccordion faqs={page.faqs} />
          </div>
          <p className="mt-8 text-sm">
            <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
              Product
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
