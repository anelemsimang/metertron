import type { Metadata } from "next";
import Link from "next/link";
import { DemoForm } from "@/components/marketing/demo-form";
import {
  Breadcrumbs,
  MkContainer,
  MkH1,
  MkLead,
  MkSection,
} from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book a Demo – Metertron",
  description:
    "See Metertron in action with a 30-minute walkthrough tailored to your meter installation programme.",
  path: "/demo",
});

export default function DemoPage() {
  return (
    <MkSection className="pt-10 md:pt-14">
      <MkContainer className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Demo", path: "/demo" },
            ]}
          />
          <MkH1>See Metertron on your programme</MkH1>
          <MkLead>
            Book a 30-minute walkthrough. We will cover field capture, review, and how export templates map to the municipal
            workbook you already use.
          </MkLead>
          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li>Live product — not a slide deck of aspirational screenshots</li>
            <li>Mapped to contractor or municipal stakeholder roles</li>
            <li>Clear next step: 7-day trial or pilot suburb</li>
          </ul>
          <p className="mt-6 text-sm">
            Prefer email?{" "}
            <Link href="/contact" className="text-[var(--mt-leaf-deep)] hover:underline">
              Contact us
            </Link>
            {" · "}
            <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
              Pricing
            </Link>
            {" · "}
            <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
              Product
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white p-6 md:p-8">
          <DemoForm />
        </div>
      </MkContainer>
    </MkSection>
  );
}
