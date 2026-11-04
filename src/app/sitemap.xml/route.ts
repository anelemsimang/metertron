import { sitemapIndexXml, xmlResponse } from "@/lib/marketing/sitemap-xml";

export function GET() {
  return xmlResponse(sitemapIndexXml());
}
