import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Status – Metertron",
  description: "Metertron service status and incident updates.",
  path: "/status",
});

export default function StatusPage() {
  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;

  return (
    <MkSection className="pt-10 md:pt-14">
      <MkContainer className="max-w-3xl">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Status", path: "/status" },
          ]}
        />
        <MkH1>System status</MkH1>
        <MkLead>Operational updates for Metertron field sync, office app and exports.</MkLead>
        <div className="mt-10 rounded-xl border border-line bg-white p-6">
          {statusUrl ? (
            <p className="text-muted">
              Live status is published at{" "}
              <a
                href={statusUrl}
                className="font-semibold text-[var(--mt-leaf-deep)] hover:underline"
                rel="noreferrer"
                target="_blank"
              >
                our status page
              </a>
              .
            </p>
          ) : (
            <>
              <p className="flex items-center gap-2 font-semibold text-[var(--mt-grove)]">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--mt-leaf)]" aria-hidden />
                All systems operational
              </p>
              <p className="mt-3 text-sm text-muted">
                If you are seeing an outage, contact{" "}
                <a href="mailto:support@metertron.co.za" className="text-[var(--mt-leaf-deep)] hover:underline">
                  support@metertron.co.za
                </a>
                .
              </p>
            </>
          )}
        </div>
        <p className="mt-8 text-sm">
          <Link href="/changelog" className="text-[var(--mt-leaf-deep)] hover:underline">
            Changelog
          </Link>
          {" · "}
          <Link href="/help" className="text-[var(--mt-leaf-deep)] hover:underline">
            Help
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
