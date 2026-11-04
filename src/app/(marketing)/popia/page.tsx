import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("popia", "/popia");

export default function PopiaPage() {
  return <LegalPageView slug="popia" path="/popia" />;
}
