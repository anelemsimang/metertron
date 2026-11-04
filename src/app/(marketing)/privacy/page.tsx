import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("privacy", "/privacy");

export default function PrivacyPage() {
  return <LegalPageView slug="privacy" path="/privacy" />;
}
