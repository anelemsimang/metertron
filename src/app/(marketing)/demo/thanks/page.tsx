import type { Metadata } from "next";
import Link from "next/link";
import { CtaPrimary, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Demo request received – Metertron",
  description: "Thanks for booking a Metertron demo. We will confirm a time shortly.",
  path: "/demo/thanks",
  noIndex: true,
});

export default function DemoThanksPage() {
  const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL;

  return (
    <MkSection className="pt-10 md:pt-14">
      <MkContainer className="max-w-2xl">
        <MkH1>Thanks — we have your demo request</MkH1>
        <MkLead>
          A Metertron teammate will confirm a 30-minute slot. Meanwhile you can start a 7-day trial and explore with your own
          organisation.
        </MkLead>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaPrimary />
          <Link href="/product" className="inline-flex min-h-12 items-center text-sm font-semibold text-[var(--mt-leaf-deep)] hover:underline">
            Explore the product
          </Link>
        </div>
        {calendarUrl ? (
          <div className="mt-12 overflow-hidden rounded-xl border border-line bg-white">
            <iframe title="Book a calendar slot" src={calendarUrl} className="h-[640px] w-full" />
          </div>
        ) : (
          <p className="mt-10 rounded-xl border border-dashed border-line bg-[var(--mt-mist)]/40 p-6 text-sm text-muted">
            Calendar booking embed will appear here when <code className="font-mono">NEXT_PUBLIC_CALENDAR_URL</code> is set.
          </p>
        )}
      </MkContainer>
    </MkSection>
  );
}
