import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/marketing/json-ld";
import {
  Breadcrumbs,
  CtaBand,
  CtaPrimary,
  CtaSecondary,
  MkContainer,
  MkH1,
  MkLead,
  MkSection,
} from "@/components/marketing/ui";
import { allFeatures } from "@/lib/marketing/content/features";
import { PRICING } from "@/lib/marketing/pricing";
import { pageMetadata } from "@/lib/marketing/seo";
import { SITE } from "@/lib/marketing/site";

export const metadata: Metadata = pageMetadata({
  title: "Product Overview – Metertron",
  description:
    "One platform for meter installation crews: field capture, supervisor review, dashboards and municipal-ready exports.",
  path: "/product",
});

const pillars = [
  {
    title: "Field capture & offline",
    body: "Guided meter-change forms, serials, photos and GPS — with sync that survives dead zones and load-shedding.",
    href: "/features/field-capture-app",
  },
  {
    title: "Photo + GPS evidence",
    body: "Evidence attaches to the job so reviewers approve proof, not WhatsApp archaeology.",
    href: "/features/photo-evidence-gps",
  },
  {
    title: "Review workflow",
    body: "Approve or reject with reasons that feed back to installers before you export a batch.",
    href: "/features/review-approval-workflow",
  },
  {
    title: "Municipal exports",
    body: "Map approved jobs to client Excel templates — including metro-oriented starting layouts you validate against contract packs.",
    href: "/features/municipal-export-templates",
  },
];

export default function ProductPage() {
  const features = allFeatures();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: SITE.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: SITE.description,
          offers: {
            "@type": "Offer",
            priceCurrency: "ZAR",
            price: (PRICING.monthlyZarCents / 100).toFixed(2),
          },
        }}
      />
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Product", path: "/product" },
            ]}
          />
          <MkH1>From the trench to the municipal file</MkH1>
          <MkLead>
            Metertron is water meter installation software for South African contractors: capture in the field, verify in
            the office, export what the municipality expects — in one organisation tenant.
          </MkLead>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaPrimary />
            <CtaSecondary />
          </div>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="rounded-xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-[var(--mt-leaf)]"
            >
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">{pillar.title}</h2>
              <p className="mt-2 text-muted">{pillar.body}</p>
            </Link>
          ))}
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">All features</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.slug}>
                <Link href={`/features/${feature.slug}`} className="text-[var(--mt-leaf-deep)] hover:underline">
                  {feature.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm">
            <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
              Pricing
            </Link>
            {" · "}
            <Link href="/solutions/meter-installation-contractors" className="text-[var(--mt-leaf-deep)] hover:underline">
              Contractor solution
            </Link>
            {" · "}
            <Link href="/security" className="text-[var(--mt-leaf-deep)] hover:underline">
              Security
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
