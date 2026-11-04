import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { MarketingAnalytics } from "@/components/marketing/analytics";
import { CookieBanner } from "@/components/marketing/cookie-banner";
import { JsonLd } from "@/components/marketing/json-ld";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { organizationJsonLd, websiteJsonLd } from "@/lib/marketing/seo";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-root min-h-screen bg-[var(--mt-slate-50)] text-[var(--mt-slate-900)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--mt-grove)]"
      >
        Skip to content
      </a>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <SiteHeader />
      </div>
      <div id="main">{children}</div>
      <SiteFooter />
      <CookieBanner />
      <MarketingAnalytics />
    </div>
  );
}
