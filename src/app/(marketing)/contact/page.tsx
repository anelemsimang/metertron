import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/contact-form";
import {
  Breadcrumbs,
  CtaBand,
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
  description: "Talk to the Metertron team about your meter installation programme, pricing or support.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Contact", path: "/contact" },
              ]}
            />
            <MkEyebrow>Contact</MkEyebrow>
            <MkH1>Talk to the Metertron team</MkH1>
            <MkLead>
              Ask about pricing, demos, municipal export templates or support for your meter installation programme.
            </MkLead>
            <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-[var(--mt-grove)]">General &amp; sales</dt>
                <dd>
                  <a className="text-[var(--mt-leaf-deep)] hover:underline" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--mt-grove)]">Customer support</dt>
                <dd>
                  <a className="text-[var(--mt-leaf-deep)] hover:underline" href={`mailto:${SITE.supportEmail}`}>
                    {SITE.supportEmail}
                  </a>
                </dd>
              </div>
            </dl>
            {whatsapp ? (
              <p className="mt-6">
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  className="inline-flex min-h-12 items-center rounded-md border border-line px-5 text-sm font-semibold text-[var(--mt-grove)] hover:bg-[var(--mt-mist)]"
                  rel="noreferrer"
                  target="_blank"
                >
                  WhatsApp click-to-chat
                </a>
              </p>
            ) : null}
            <p className="mt-8 text-sm">
              <Link href="/demo" className="text-[var(--mt-leaf-deep)] hover:underline">
                Book a demo
              </Link>
              {" · "}
              <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
                Pricing
              </Link>
              {" · "}
              <Link href="/security" className="text-[var(--mt-leaf-deep)] hover:underline">
                Security
              </Link>
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 md:p-8">
            <ContactForm />
          </div>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
