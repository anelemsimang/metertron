import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("dpa", "/dpa");

export default function DpaPage() {
  return <LegalPageView slug="dpa" path="/dpa" />;
}
