import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, CtaPrimary, CtaSecondary, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Partners – Metertron",
  description: "Partner with Metertron to deliver meter installation capture and municipal export workflows to your clients.",
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Partners", path: "/partners" },
            ]}
          />
          <MkH1>Partner with Metertron</MkH1>
          <MkLead>
            Implementation partners, meter suppliers and programme managers help contractors adopt structured capture. We
            support partners who introduce Metertron into live installation programmes.
          </MkLead>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Implementers",
                body: "Configure forms, export templates and training for contractor tenants you support.",
              },
              {
                title: "Suppliers & OEMs",
                body: "Pair meter supply with a capture workflow that proves installs and tracks serials.",
              },
              {
                title: "Programme offices",
                body: "Give multiple contractors a consistent evidence and export standard without owning their ops tools.",
              },
              {
                title: "Resellers",
                body: "Introduce Metertron to regional contractor networks with shared demos and onboarding playbooks.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-xl border border-line bg-white p-5">
                <h2 className="font-semibold text-[var(--mt-grove)]">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <CtaPrimary href="/demo">Book a partner demo</CtaPrimary>
            <CtaSecondary href="/contact">Talk to us</CtaSecondary>
          </div>
          <p className="mt-8 text-sm">
            <Link href="/security" className="text-[var(--mt-leaf-deep)] hover:underline">
              Security
            </Link>
            {" · "}
            <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
              Pricing
            </Link>
            {" · "}
            <Link href="/solutions/meter-installation-contractors" className="text-[var(--mt-leaf-deep)] hover:underline">
              Contractor solution
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
