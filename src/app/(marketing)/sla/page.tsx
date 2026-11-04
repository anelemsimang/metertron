import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("sla", "/sla");

export default function SlaPage() {
  return <LegalPageView slug="sla" path="/sla" />;
}
