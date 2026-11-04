import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("terms", "/terms");

export default function TermsPage() {
  return <LegalPageView slug="terms" path="/terms" />;
}
