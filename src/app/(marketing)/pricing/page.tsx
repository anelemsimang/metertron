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
  description: "Start a free Metertron trial. WhatsApp or call us for pricing.",
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
            "@type": "Offer",
            priceCurrency: "ZAR",
            availability: "https://schema.org/InStock",
            description: "WhatsApp or call Metertron for pricing.",
            url: `${SITE.url}/contact`,
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
          <MkH1>Pricing</MkH1>
          <MkLead>
            Start a {PRICING.trialDays}-day free trial with full product access. WhatsApp or call us for pricing.
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
