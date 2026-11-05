import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers – Metertron",
  description: "Join Metertron — building water meter installation software for South African contractors.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Careers", path: "/careers" },
            ]}
          />
          <MkH1>Build tools that keep every meter accounted for</MkH1>
          <MkLead>
            Metertron is a South African product company focused on the unglamorous work of field capture, review and
            municipal-ready exports. We hire people who care about operational detail.
          </MkLead>
          <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">How we work</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li>Product decisions start from contractor and supervisor workflows, not feature checklists</li>
            <li>We ship carefully — meter data is evidence, not a sandbox</li>
            <li>Remote-friendly within South Africa; async writing over status theatre</li>
          </ul>
          <h2 className="mt-12 font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">Open roles</h2>
          <p className="mt-4 rounded-xl border border-line bg-white p-5 text-muted">
            No open roles right now.{" "}
            <Link href="/contact" className="text-[var(--mt-leaf-deep)] hover:underline">
              Call or WhatsApp us
            </Link>{" "}
            if you want to be considered for engineering, customer success or field operations roles.
          </p>
          <p className="mt-8 text-sm">
            <Link href="/about" className="text-[var(--mt-leaf-deep)] hover:underline">
              About Metertron
            </Link>
            {" · "}
            <Link href="/partners" className="text-[var(--mt-leaf-deep)] hover:underline">
              Partners
            </Link>
            {" · "}
            <Link href="/contact" className="text-[var(--mt-leaf-deep)] hover:underline">
              Contact
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand title="Prefer to try the product first?" body="Start a 7-day trial — full access for your organisation." />
    </>
  );
}
