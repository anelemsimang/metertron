import { sectionSitemapXml, xmlResponse } from "@/lib/marketing/sitemap-xml";

export function GET() {
  return xmlResponse(sectionSitemapXml("features"));
}
