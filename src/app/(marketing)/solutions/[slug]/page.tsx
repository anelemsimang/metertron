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
import { getFeature } from "@/lib/marketing/content/features";
import { allSolutions, getSolution } from "@/lib/marketing/content/solutions";
import { pageMetadata } from "@/lib/marketing/seo";

export function generateStaticParams() {
  return allSolutions().map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return pageMetadata({
    title: solution.metaTitle,
    description: solution.metaDescription,
    path: `/solutions/${solution.slug}`,
  });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Solutions", path: "/solutions/meter-installation-contractors" },
              { name: solution.title, path: `/solutions/${solution.slug}` },
            ]}
          />
          <MkH1>{solution.heroHeadline}</MkH1>
          <MkLead>{solution.heroSubhead}</MkLead>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaPrimary />
            <CtaSecondary />
          </div>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">Pain points</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {solution.painPoints.map((point) => (
              <li key={point.title} className="rounded-xl border border-line bg-white p-4">
                <h3 className="font-semibold text-[var(--mt-grove)]">{point.title}</h3>
                <p className="mt-2 text-sm text-muted">{point.body}</p>
              </li>
            ))}
          </ul>
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">Workflow</h2>
          <ol className="mt-8 space-y-4">
            {solution.steps.map((step, index) => (
              <li key={step.title} className="grid gap-2 border-l-2 border-[var(--mt-leaf)] pl-4 md:grid-cols-[2rem_1fr]">
                <span className="font-mono text-[var(--mt-leaf)]">0{index + 1}</span>
                <div>
                  <h3 className="font-semibold text-[var(--mt-grove)]">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">ROI focus</h2>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-muted">
            {solution.roi.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-10">
            <RelatedLinks
              title="Features that matter here"
              links={solution.featuresUsed.map((featureSlug) => ({
                href: `/features/${featureSlug}`,
                label: getFeature(featureSlug)?.title ?? featureSlug,
              }))}
            />
          </div>
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">FAQ</h2>
          <div className="mt-6">
            <FaqAccordion faqs={solution.faqs} />
          </div>
          <p className="mt-8 text-sm">
            <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
              Pricing
            </Link>
            {" · "}
            <Link href="/municipalities" className="text-[var(--mt-leaf-deep)] hover:underline">
              Municipalities
            </Link>
            {" · "}
            <Link href="/contact" className="text-[var(--mt-leaf-deep)] hover:underline">
              Contact
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
