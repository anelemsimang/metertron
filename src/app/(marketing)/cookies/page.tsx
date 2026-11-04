import { LegalPageView } from "@/components/marketing/legal-page";
import { legalMetadata } from "@/components/marketing/legal-metadata";

export const metadata = legalMetadata("cookies", "/cookies");

export default function CookiesPage() {
  return <LegalPageView slug="cookies" path="/cookies" />;
}
