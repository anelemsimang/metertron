import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaPrimary, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Help – Metertron",
  description: "Get help with Metertron — sign in for in-app guidance or contact support.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <MkSection className="pt-10 md:pt-14">
      <MkContainer className="max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Help", path: "/help" },
          ]}
        />
        <MkH1>Help Centre</MkH1>
        <MkLead>
          In-app help lives beside the workflows your team already uses. Sign in to your organisation for contextual
          guidance, or contact us if you are evaluating Metertron.
        </MkLead>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link href="/login" className="rounded-xl border border-line bg-white p-5 hover:border-[var(--mt-leaf)]">
            <h2 className="font-semibold text-[var(--mt-grove)]">Sign in to the app</h2>
            <p className="mt-2 text-sm text-muted">Access field and office help for your tenant.</p>
          </Link>
          <Link href="/contact" className="rounded-xl border border-line bg-white p-5 hover:border-[var(--mt-leaf)]">
            <h2 className="font-semibold text-[var(--mt-grove)]">Contact support</h2>
            <p className="mt-2 text-sm text-muted">Email or form — we respond during business hours (SAST).</p>
          </Link>
          <Link href="/security" className="rounded-xl border border-line bg-white p-5 hover:border-[var(--mt-leaf)]">
            <h2 className="font-semibold text-[var(--mt-grove)]">Security &amp; POPIA</h2>
            <p className="mt-2 text-sm text-muted">How we protect installation and customer data.</p>
          </Link>
          <Link href="/guides/meter-installation-programme-guide" className="rounded-xl border border-line bg-white p-5 hover:border-[var(--mt-leaf)]">
            <h2 className="font-semibold text-[var(--mt-grove)]">Programme guide</h2>
            <p className="mt-2 text-sm text-muted">Long-form playbook for running installs without losing data.</p>
          </Link>
        </div>
        <div className="mt-10">
          <CtaPrimary href="/demo">Book a demo</CtaPrimary>
        </div>
      </MkContainer>
    </MkSection>
  );
}
