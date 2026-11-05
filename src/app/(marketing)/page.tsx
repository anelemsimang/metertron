import type { Metadata } from "next";
import Link from "next/link";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { JsonLd } from "@/components/marketing/json-ld";
import { ProductShot } from "@/components/marketing/product-shot";
import {
  CtaBand,
  CtaPrimary,
  CtaSecondary,
  FaqAccordion,
  MkContainer,
  MkEyebrow,
  MkH1,
  MkH2,
  MkLead,
  MkSection,
} from "@/components/marketing/ui";
import { PRICING } from "@/lib/marketing/pricing";
import { pageMetadata } from "@/lib/marketing/seo";
import { SITE } from "@/lib/marketing/site";

export const metadata: Metadata = pageMetadata({
  title: "Metertron – Water Meter Installation Software",
  description:
    "Capture, verify and submit water meter installations from the field to the municipality. Offline app, photo evidence, GPS and instant exports.",
  path: "/",
});

const faqs = [
  {
    q: "Does Metertron work offline?",
    a: "Yes. Field technicians can complete forms and attach photos without signal. Sync runs when connectivity returns.",
  },
  {
    q: "Can exports match municipal Excel templates?",
    a: "Yes. Each organisation can publish export templates — including eThekwini-style layouts — so office teams stop retyping columns.",
  },
  {
    q: "Is there a free trial?",
    a: `Yes. Every new organisation gets a ${PRICING.trialDays}-day trial with full product access. No card is required to start.`,
  },
  {
    q: "How does pricing work?",
    a: "WhatsApp or call us for pricing. Every organisation gets full product access with no seat caps.",
  },
  {
    q: "Who is Metertron for?",
    a: "Meter installation contractors, plumbing crews running meter programmes, and the municipalities or utilities that receive their submissions.",
  },
  {
    q: "How do photos and GPS help?",
    a: "Reviewers see evidence tied to the job — location and timestamps when available — so approvals are based on proof, not chat threads.",
  },
  {
    q: "Can we invite technicians and supervisors?",
    a: "Yes. Owners invite people with roles such as technician, supervisor, admin or viewer, with capability-based access.",
  },
  {
    q: "Is our data isolated from other companies?",
    a: "Yes. Metertron is multi-tenant. Each organisation’s jobs, photos and exports are scoped to that organisation.",
  },
];

export default function HomePage() {
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
            availability: "https://schema.org/InStock",
            description: "WhatsApp or call Metertron for pricing.",
            url: `${SITE.url}/contact`,
          },
        }}
      />

      <section className="relative overflow-hidden mk-reservoir mk-dial-grid pt-10 md:pt-16">
        <div className="pointer-events-none absolute inset-0 mk-flow-lines opacity-60" />
        <MkContainer className="relative grid items-center gap-10 pb-14 md:grid-cols-[1.05fr_0.95fr] md:pb-24">
          <div>
            <MkEyebrow>Field to municipality</MkEyebrow>
            <MkH1 light>Water meter installations, captured right the first time</MkH1>
            <MkLead light>
              Offline field capture, GPS-backed photo evidence, supervisor review and municipal-ready exports — so every meter is accounted for.
            </MkLead>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaPrimary />
              <CtaSecondary light />
            </div>
          </div>
          <div className="mx-auto w-full max-w-lg md:max-w-none">
            <HeroVisual />
          </div>
        </MkContainer>
      </section>

      <MkSection tone="mist">
        <MkContainer>
          <MkH2>The mess Metertron replaces</MkH2>
          <MkLead>Lost job cards, rejected municipal files, unverifiable WhatsApp photos and Excel chaos slow programmes and erode trust.</MkLead>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              ["Lost paper cards", "Install details vanish between the trench and the office."],
              ["Rejected submissions", "Wrong headers, dates or meter numbers bounce entire batches."],
              ["Unverifiable photos", "Chat threads cannot prove which erf a picture belongs to."],
              ["Spreadsheet gymnastics", "Office staff retype the same job into three templates."],
            ].map(([title, body]) => (
              <li key={title} className="border-l-2 border-[var(--mt-citrus)] pl-4">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--mt-grove)]">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <MkH2>How it works</MkH2>
          <img
            src="/images/marketing/how-it-works.svg"
            alt="Capture, verify and submit meter installs"
            className="mt-8 w-full max-w-3xl rounded-xl border border-line bg-white"
            width={720}
            height={180}
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["Capture", "Technicians finish forms and photos on site — offline if needed."],
              ["Verify", "Supervisors approve or reject with reasons and evidence in view."],
              ["Submit", "Export the municipal layout your contract requires, without retyping."],
            ].map(([title, body], index) => (
              <div key={title} className="rounded-xl border border-line bg-white p-5 mk-card-lift">
                <p className="font-mono text-sm text-[var(--mt-leaf)]">0{index + 1}</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer className="space-y-16">
          {[
            {
              title: "Field capture & offline",
              body: "Complete meter-change forms, barcode serials and photo slots without waiting for signal. Sync when the network returns.",
              href: "/features/field-capture-app",
              shot: "/images/marketing/screenshots/field-capture.png?v=2",
              alt: "Field capture wizard on a phone — job details step",
              device: "phone" as const,
            },
            {
              title: "Photo + GPS evidence",
              body: "Evidence is attached to the job — not lost in a group chat — so review decisions are based on proof.",
              href: "/features/photo-evidence-gps",
              shot: "/images/marketing/screenshots/field-photos.png?v=2",
              alt: "Field app photo evidence slots for meter and water-point shots",
              device: "phone" as const,
            },
            {
              title: "Review workflow",
              body: "Queues, approvals and rejections with reasons keep first-time-right visible across the organisation.",
              href: "/features/review-approval-workflow",
              shot: "/images/marketing/screenshots/office-review.png?v=2",
              alt: "Office review queue with approve and reject actions",
              device: "desktop" as const,
            },
            {
              title: "Municipal exports",
              body: "Publish export templates that match the spreadsheet your municipality expects.",
              href: "/features/municipal-export-templates",
              shot: "/images/marketing/screenshots/office-exports.png?v=2",
              alt: "Office exports screen for daily and monthly municipal spreadsheets",
              device: "desktop" as const,
            },
          ].map((item, index) => (
            <div key={item.title} className={`grid items-center gap-8 md:grid-cols-2 ${index % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mt-grove)]">{item.title}</h3>
                <p className="mt-3 text-muted">{item.body}</p>
                <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-[var(--mt-leaf-deep)] hover:underline">
                  Explore feature →
                </Link>
              </div>
              <ProductShot src={item.shot} alt={item.alt} device={item.device} />
            </div>
          ))}
        </MkContainer>
      </MkSection>

      <MkSection tone="dark">
        <MkContainer>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              ["1 org", "Full access per organisation"],
              [`${PRICING.trialDays} days`, "Trial · no card to start"],
              ["0 seat caps", "Invite the crew you need"],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="font-[family-name:var(--font-display)] text-4xl font-medium text-white">{stat}</p>
                <p className="mt-1 text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer>
          <MkH2>Built for the people who run the routes</MkH2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Contractors", "/solutions/meter-installation-contractors", "Keep crews productive and exports clean."],
              ["Municipalities", "/solutions/municipalities", "Receive structured submissions with evidence trails."],
              ["Utilities", "/solutions/water-utilities", "Standardise rollout partners on one capture standard."],
            ].map(([title, href, body]) => (
              <Link key={title} href={href} className="rounded-xl border border-line bg-white p-5 mk-card-lift">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--mt-grove)]">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </Link>
            ))}
          </div>
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <MkH2>Paper and chat threads vs one job record</MkH2>
            <MkLead>
              Job cards and WhatsApp photos scatter evidence. Metertron keeps serials, GPS, photos and export mapping on a single
              install record from capture to municipal file.
            </MkLead>
            <Link href="/compare/metertron-vs-paper-job-cards" className="mt-4 inline-flex text-sm font-semibold text-[var(--mt-leaf-deep)] hover:underline">
              Compare to paper job cards →
            </Link>
          </div>
          <img
            src="/images/marketing/before-after.svg"
            alt="Before paper and WhatsApp versus Metertron digital flow"
            className="w-full rounded-xl border border-line"
            width={800}
            height={320}
          />
        </MkContainer>
      </MkSection>

      <MkSection>
        <MkContainer className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <MkH2>Pricing</MkH2>
            <MkLead>
              {PRICING.trialDays}-day free trial. WhatsApp or call us for pricing.
            </MkLead>
          </div>
          <Link href="/pricing" className="inline-flex min-h-12 items-center rounded-md bg-primary px-5 text-sm font-semibold text-on-primary">
            View pricing
          </Link>
        </MkContainer>
      </MkSection>

      <MkSection tone="mist">
        <MkContainer>
          <MkH2>FAQ</MkH2>
          <div className="mt-8">
            <FaqAccordion faqs={faqs} />
          </div>
        </MkContainer>
      </MkSection>

      <CtaBand />
    </>
  );
}
