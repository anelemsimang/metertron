import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Security & POPIA Compliance – Metertron",
  description:
    "How Metertron protects your installation data: tenant isolation, encryption, audit logs and POPIA compliance.",
  path: "/security",
});

const topics = [
  {
    title: "Tenant isolation",
    body: "Each contractor organisation is a separate tenant. Jobs, photos, stock and exports are scoped so one company cannot see another’s programme data.",
  },
  {
    title: "Access control",
    body: "Role-based capabilities for technicians, supervisors, admins and viewers. Invite only the people who need access; revoke when they leave.",
  },
  {
    title: "Encryption in transit",
    body: "Traffic to Metertron uses HTTPS/TLS. Keep devices patched and avoid sharing passwords across WhatsApp groups.",
  },
  {
    title: "Audit visibility",
    body: "Submit, review and export events leave a trail so disputed stands can be reconstructed without relying on memory.",
  },
  {
    title: "POPIA mindset",
    body: "Municipal customer identifiers and contact details are personal information. Capture what the programme needs, limit exports to authorised roles, and review our POPIA and DPA drafts with your counsel.",
  },
  {
    title: "Support access",
    body: "Optional, time-boxed support access can be granted by the tenant and remains visible — we do not silently browse customer jobs.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Security", path: "/security" },
            ]}
          />
          <MkH1>Security designed for programme data</MkH1>
          <MkLead>
            Installation records, photos and account identifiers deserve the same discipline as the meters themselves.
            Here is how Metertron approaches protection — without inventing certifications we have not published.
          </MkLead>
          <div className="mt-12 grid gap-6">
            {topics.map((topic) => (
              <article key={topic.title} className="rounded-xl border border-line bg-white p-5">
                <h2 className="font-semibold text-[var(--mt-grove)]">{topic.title}</h2>
                <p className="mt-2 text-sm text-muted">{topic.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-sm">
            <Link href="/popia" className="text-[var(--mt-leaf-deep)] hover:underline">
              POPIA summary
            </Link>
            {" · "}
            <Link href="/privacy" className="text-[var(--mt-leaf-deep)] hover:underline">
              Privacy
            </Link>
            {" · "}
            <Link href="/dpa" className="text-[var(--mt-leaf-deep)] hover:underline">
              DPA
            </Link>
            {" · "}
            <Link href="/contact" className="text-[var(--mt-leaf-deep)] hover:underline">
              Contact
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
