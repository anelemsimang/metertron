import type { Metadata } from "next";
import Link from "next/link";
import { WhatsappCta } from "@/components/marketing/whatsapp-widget";
import {
  Breadcrumbs,
  CtaBand,
  CtaPrimary,
  MkContainer,
  MkEyebrow,
  MkH1,
  MkLead,
  MkSection,
} from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";
import { SITE } from "@/lib/marketing/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Metertron",
  description: "Call or WhatsApp the Metertron team about pricing, trials, or your meter installation programme.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]}
          />
          <MkEyebrow>Contact</MkEyebrow>
          <MkH1>Call or WhatsApp us</MkH1>
          <MkLead>
            We arrange Metertron access privately — monthly or annual — after a conversation. Prefer WhatsApp for a
            quick reply, or call either of us. You can still start a free trial online without contacting us first.
          </MkLead>

          <div className="mt-10 flex flex-wrap gap-3">
            <WhatsappCta className="border-transparent bg-[#25D366] text-white hover:brightness-105">
              WhatsApp {SITE.whatsappName}
            </WhatsappCta>
            <CtaPrimary />
          </div>

          <div className="mt-12 space-y-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--mt-grove)]">Call</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {SITE.phones.map((person) => (
                  <li key={person.tel}>
                    <p className="font-semibold text-[var(--mt-grove)]">{person.name}</p>
                    <a className="text-[var(--mt-leaf-deep)] hover:underline" href={`tel:${person.tel}`}>
                      {person.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--mt-grove)]">WhatsApp</h2>
              <p className="mt-2 text-sm text-muted">
                {SITE.whatsappName} —{" "}
                <a className="font-semibold text-[var(--mt-leaf-deep)] hover:underline" href={SITE.whatsappUrl} target="_blank" rel="noreferrer">
                  {SITE.phones.find((p) => p.digits === SITE.whatsappNumber)?.display ?? `+${SITE.whatsappNumber}`}
                </a>
              </p>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted">
            Prefer to explore first?{" "}
            <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
              See pricing
            </Link>
            {" · "}
            <Link href="/login" className="text-[var(--mt-leaf-deep)] hover:underline">
              Start free trial
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
