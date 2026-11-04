import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/marketing/json-ld";
import { PricingTable } from "@/components/marketing/pricing-table";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { PRICING } from "@/lib/marketing/pricing";
import { pageMetadata } from "@/lib/marketing/seo";
import { SITE } from "@/lib/marketing/site";

export const metadata: Metadata = pageMetadata({
  title: "Pricing – Metertron Meter Installation Software",
  description:
    "Simple plans in ZAR for contractors of every size. Start a 7-day free trial, no card required.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: SITE.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "ZAR",
            lowPrice: (PRICING.monthlyZarCents / 100).toFixed(2),
            highPrice: (PRICING.annualZarCents / 100).toFixed(2),
            offerCount: 2,
          },
        }}
      />
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing" },
            ]}
          />
          <MkH1>Simple pricing in ZAR</MkH1>
          <MkLead>
            One plan for contractors of every size. Start a {PRICING.trialDays}-day free trial — no card required.
          </MkLead>
          <PricingTable />
          <p className="mt-8 text-sm">
            <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
              Product
            </Link>
            {" · "}
            <Link href="/demo" className="text-[var(--mt-leaf-deep)] hover:underline">
              Book a demo
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
