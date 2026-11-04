import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { CHANGELOG } from "@/lib/marketing/content/changelog";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Changelog – Metertron",
  description: "Product updates for Metertron water meter installation software.",
  path: "/changelog",
});

export default function ChangelogPage() {
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Changelog", path: "/changelog" },
            ]}
          />
          <MkH1>Changelog</MkH1>
          <MkLead>Selected product updates that matter to contractors and office teams running meter programmes.</MkLead>
          <ol className="mt-12 space-y-10">
            {CHANGELOG.map((entry) => (
              <li key={entry.date + entry.title} className="border-l-2 border-[var(--mt-leaf)] pl-5">
                <p className="font-mono text-xs text-[var(--mt-leaf)]">{entry.date}</p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">{entry.title}</h2>
                <div className="mt-3 space-y-2 text-muted">
                  {entry.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm">
            <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
              Product
            </Link>
            {" · "}
            <Link href="/help" className="text-[var(--mt-leaf-deep)] hover:underline">
              Help
            </Link>
            {" · "}
            <Link href="/status" className="text-[var(--mt-leaf-deep)] hover:underline">
              Status
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
