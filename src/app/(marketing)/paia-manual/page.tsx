import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("paia-manual", "/paia-manual");

export default function PaiaManualPage() {
  return <LegalPageView slug="paia-manual" path="/paia-manual" />;
}
