import type { Metadata } from "next";
import Link from "next/link";
import { WhatsappCta } from "@/components/marketing/whatsapp-widget";
import {
  Breadcrumbs,
  CtaPrimary,
  MkContainer,
  MkH1,
  MkLead,
  MkSection,
} from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";
import { SITE } from "@/lib/marketing/site";

export const metadata: Metadata = pageMetadata({
  title: "Book a Demo – Metertron",
  description: "WhatsApp or call Metertron to arrange a live walkthrough of field capture, review, and municipal exports.",
  path: "/demo",
});

export default function DemoPage() {
  return (
    <MkSection className="pt-10 md:pt-14">
      <MkContainer className="max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Demo", path: "/demo" },
          ]}
        />
        <MkH1>See Metertron on your programme</MkH1>
        <MkLead>
          WhatsApp or call us to arrange a live walkthrough — field capture, review, and how exports map to the municipal
          workbook you already use. Paid access is arranged with us directly after that conversation.
        </MkLead>
        <ul className="mt-8 space-y-3 text-sm text-muted">
          <li>Live product — not a slide deck of aspirational screenshots</li>
          <li>Mapped to contractor or municipal stakeholder roles</li>
          <li>Clear next step: free trial now, or monthly / annual access with us</li>
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <WhatsappCta className="border-transparent bg-[#25D366] text-white hover:brightness-105">
            WhatsApp to book a demo
          </WhatsappCta>
          <CtaPrimary />
        </div>
        <ul className="mt-8 space-y-2 text-sm">
          {SITE.phones.map((person) => (
            <li key={person.tel}>
              <span className="text-muted">{person.name}: </span>
              <a className="font-semibold text-[var(--mt-leaf-deep)] hover:underline" href={`tel:${person.tel}`}>
                {person.display}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
            Pricing
          </Link>
          {" · "}
          <Link href="/contact" className="text-[var(--mt-leaf-deep)] hover:underline">
            Contact
          </Link>
        </p>
      </MkContainer>
    </MkSection>
  );
}
