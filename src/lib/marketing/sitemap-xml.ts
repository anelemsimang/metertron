import { absoluteUrl, allMarketingRoutes, type MarketingRoute } from "@/lib/marketing/routes";

export type SitemapSection =
  | "pages"
  | "features"
  | "solutions"
  | "municipalities"
  | "blog"
  | "glossary";

const SECTION_FILES: Record<SitemapSection, string> = {
  pages: "sitemap-pages.xml",
  features: "sitemap-features.xml",
  solutions: "sitemap-solutions.xml",
  municipalities: "sitemap-municipalities.xml",
  blog: "sitemap-blog.xml",
  glossary: "sitemap-glossary.xml",
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function routesForSection(section: SitemapSection): MarketingRoute[] {
  return allMarketingRoutes().filter((route) => !route.noIndex && route.section === section);
}

function urlEntry(route: MarketingRoute, images?: Array<{ loc: string; title: string }>) {
  const lastmod = route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : "";
  const imageXml =
    images
      ?.map(
        (image) => `<image:image>
      <image:loc>${escapeXml(absoluteUrl(image.loc))}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
    </image:image>`,
      )
      .join("") ?? "";
  return `<url>
  <loc>${escapeXml(absoluteUrl(route.path))}</loc>
  ${lastmod}
  <changefreq>${route.changeFrequency ?? "monthly"}</changefreq>
  <priority>${(route.priority ?? 0.5).toFixed(1)}</priority>
  ${imageXml}
</url>`;
}

export function sitemapIndexXml() {
  const now = new Date().toISOString().slice(0, 10);
  const parts = (Object.keys(SECTION_FILES) as SitemapSection[])
    .map((section) => {
      const file = SECTION_FILES[section];
      return `<sitemap>
  <loc>${escapeXml(absoluteUrl(`/${file}`))}</loc>
  <lastmod>${now}</lastmod>
</sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${parts}
</sitemapindex>`;
}

export function sectionSitemapXml(section: SitemapSection) {
  const routes = routesForSection(section);
  const urls = routes
    .map((route) => {
      if (route.path === "/") {
        return urlEntry(route, [
          { loc: "/images/marketing/how-it-works.svg", title: "How Metertron works" },
          { loc: "/images/marketing/before-after.svg", title: "Before and after Metertron" },
        ]);
      }
      if (route.path.startsWith("/features/")) {
        const slug = route.path.split("/").pop() ?? "alerts";
        const artMap: Record<string, string> = {
          "field-capture-app": "camera-evidence",
          "offline-mode": "offline-sync",
          "photo-evidence-gps": "gps-pin",
          "review-approval-workflow": "approval-check",
          "municipal-export-templates": "excel-export",
          "dashboards-reporting": "map",
          "team-roles-permissions": "team-roles",
          "job-scheduling": "scheduling",
          "api-integrations": "api-webhooks",
          "audit-trail": "shield-popia",
        };
        const art = artMap[slug] ?? "alerts";
        return urlEntry(route, [
          {
            loc: `/images/marketing/illustrations/${art}.svg`,
            title: route.title,
          },
        ]);
      }
      return urlEntry(route);
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export { SECTION_FILES };
