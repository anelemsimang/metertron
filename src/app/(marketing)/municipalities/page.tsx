import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { allMunicipalities } from "@/lib/marketing/content/municipalities";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Municipalities – Metertron",
  description:
    "How Metertron helps contractors prepare meter installation submissions for South African metros — capture, review and export templates.",
  path: "/municipalities",
});

export default function MunicipalitiesHubPage() {
  const rows = allMunicipalities();

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Municipalities", path: "/municipalities" },
            ]}
          />
          <MkH1>Built for metro meter programmes across South Africa</MkH1>
          <MkLead>
            Export templates adapt to the spreadsheet your client issues. These pages explain how contractors working in each
            metro use Metertron — without inventing unpublished municipal programme details.
          </MkLead>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <li key={row.slug}>
                <Link
                  href={`/municipalities/${row.slug}`}
                  className="block rounded-xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-[var(--mt-leaf)]"
                >
                  <p className="font-semibold text-[var(--mt-grove)]">{row.name}</p>
                  <p className="mt-1 text-sm text-muted">{row.province}</p>
                  <p className="mt-3 text-sm text-muted line-clamp-3">{row.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm">
            <Link href="/solutions/meter-installation-contractors" className="text-[var(--mt-leaf-deep)] hover:underline">
              Contractor solutions
            </Link>
            {" · "}
            <Link href="/features/municipal-export-templates" className="text-[var(--mt-leaf-deep)] hover:underline">
              Export templates
            </Link>
            {" · "}
            <Link href="/pricing" className="text-[var(--mt-leaf-deep)] hover:underline">
              Pricing
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
