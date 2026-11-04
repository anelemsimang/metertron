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
  MkEyebrow,
  MkH1,
  MkLead,
  MkSection,
  RelatedLinks,
} from "@/components/marketing/ui";
import { allFeatures, getFeature } from "@/lib/marketing/content/features";
import { pageMetadata } from "@/lib/marketing/seo";

const FEATURE_ART: Record<string, string> = {
  "field-capture-app": "camera-evidence",
  "offline-mode": "offline-sync",
  "photo-evidence-gps": "gps-pin",
  "review-approval-workflow": "approval-check",
  "municipal-export-templates": "excel-export",
  "dashboards-reporting": "map",
  "team-roles-permissions": "team-roles",
  "job-scheduling": "scheduling",
  "api-integrations": "api-webhooks",
  "audit-trail": "shield-popia",
};

export function generateStaticParams() {
  return allFeatures().map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};
  return pageMetadata({
    title: feature.metaTitle,
    description: feature.metaDescription,
    path: `/features/${feature.slug}`,
  });
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Features", path: "/product" },
              { name: feature.title, path: `/features/${feature.slug}` },
            ]}
          />
          <MkEyebrow>{feature.heroEyebrow}</MkEyebrow>
          <MkH1>{feature.heroHeadline}</MkH1>
          <MkLead>{feature.heroSubhead}</MkLead>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaPrimary />
            <CtaSecondary />
          </div>
          <div className="mt-10 flex min-h-48 max-w-md items-center justify-center rounded-xl border border-line bg-white p-10 mk-glow">
            <img
              src={`/images/marketing/illustrations/${FEATURE_ART[feature.slug] ?? "alerts"}.svg`}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24"
            />
          </div>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer className="grid gap-8 md:grid-cols-2">
          {feature.benefits.map((benefit) => (
            <article key={benefit.title}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">{benefit.title}</h2>
              <p className="mt-2 text-muted">{benefit.body}</p>
            </article>
          ))}
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {feature.steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-line bg-white p-5">
                <p className="font-mono text-sm text-[var(--mt-leaf)]">0{index + 1}</p>
                <h3 className="mt-2 font-semibold text-[var(--mt-grove)]">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">{feature.useCase.title}</h2>
          <p className="mt-3 max-w-3xl text-muted">{feature.useCase.body}</p>
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">FAQ</h2>
          <div className="mt-6">
            <FaqAccordion faqs={feature.faqs} />
          </div>
          <div className="mt-12">
            <RelatedLinks
              title="Related features"
              links={feature.related.map((relatedSlug) => {
                const related = getFeature(relatedSlug);
                return {
                  href: `/features/${relatedSlug}`,
                  label: related?.title ?? relatedSlug,
                };
              })}
            />
          </div>
          <p className="mt-8 text-sm">
            <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
              Product overview
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
