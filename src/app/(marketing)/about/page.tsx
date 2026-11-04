import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Metertron",
  description: "Built in South Africa for the crews who install and replace the country's water meters.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]}
          />
          <MkH1>Built for the crews who keep meters moving</MkH1>
          <MkLead>
            Metertron is South African software for water meter installation and replacement programmes — field capture,
            office review and municipal-ready exports in one tenant your organisation controls.
          </MkLead>
          <div className="mt-10 space-y-5 text-muted">
            <p>
              Contractors are judged on throughput, but they get paid when submissions are accepted. We built Metertron
              around that reality: structured capture that survives offline routes, evidence tied to jobs, a review gate
              before export, and templates that map to the Excel layouts clients still require.
            </p>
            <p>
              We are not a generic field-service toolkit with a water sticker. Serials, seals, photo slots, stock and
              export columns are first-class. Multi-tenant isolation means your jobs and photos stay in your organisation.
            </p>
            <p>
              Our tagline is simple: <strong className="text-[var(--mt-grove)]">Every meter, accounted for.</strong>
            </p>
          </div>
          <p className="mt-10 text-sm">
            <Link href="/careers" className="text-[var(--mt-leaf-deep)] hover:underline">
              Careers
            </Link>
            {" · "}
            <Link href="/security" className="text-[var(--mt-leaf-deep)] hover:underline">
              Security
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
