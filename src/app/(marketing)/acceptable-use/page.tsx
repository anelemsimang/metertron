import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("acceptable-use", "/acceptable-use");

export default function AcceptableUsePage() {
  return <LegalPageView slug="acceptable-use" path="/acceptable-use" />;
}
