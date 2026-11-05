import { allLongPosts } from "@/lib/marketing/content/blog-long";
import { allComparePages } from "@/lib/marketing/content/compare";
import { allFeatures } from "@/lib/marketing/content/features";
import { allLegalPages } from "@/lib/marketing/content/legal";
import { allMunicipalities } from "@/lib/marketing/content/municipalities";
import { allSolutions } from "@/lib/marketing/content/solutions";
import { allTerms } from "@/lib/marketing/glossary";
import { SITE } from "@/lib/marketing/site";

export type MarketingRoute = {
  path: string;
  title: string;
  description: string;
  section: string;
  lastmod?: string;
  noIndex?: boolean;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export function absoluteUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

const STATIC: MarketingRoute[] = [
  {
    path: "/",
    title: "Metertron – Water Meter Installation Software",
    description:
      "Capture, verify and submit water meter installations from the field to the municipality. Offline app, photo evidence, GPS and instant exports.",
    section: "pages",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/product",
    title: "Product Overview – Metertron",
    description:
      "One platform for meter installation crews: field capture, supervisor review, dashboards and municipal-ready exports.",
    section: "pages",
    priority: 0.9,
  },
  {
    path: "/pricing",
    title: "Pricing – Metertron Meter Installation Software",
    description: "Start a free Metertron trial. WhatsApp or call us for pricing.",
    section: "pages",
    priority: 0.9,
  },
  {
    path: "/demo",
    title: "Book a Demo – Metertron",
    description: "See Metertron in action with a 30-minute walkthrough tailored to your meter installation programme.",
    section: "pages",
    priority: 0.8,
  },
  {
    path: "/contact",
    title: "Contact Metertron",
    description: "Talk to the Metertron team about your meter installation programme, pricing or support.",
    section: "pages",
  },
  {
    path: "/about",
    title: "About Metertron",
    description: "Built in South Africa for the crews who install and replace the country's water meters.",
    section: "pages",
  },
  {
    path: "/security",
    title: "Security & POPIA Compliance – Metertron",
    description:
      "How Metertron protects your installation data: tenant isolation, encryption, audit logs and POPIA compliance.",
    section: "pages",
  },
  {
    path: "/municipalities",
    title: "Municipalities – Metertron",
    description:
      "How Metertron helps contractors prepare meter installation submissions for South African metros — capture, review and export templates.",
    section: "municipalities",
  },
  {
    path: "/blog",
    title: "Blog – Metertron",
    description:
      "Guides for South African water meter installation programmes: capture, evidence, POPIA, exports and rejection reduction.",
    section: "blog",
    changeFrequency: "weekly",
  },
  {
    path: "/glossary",
    title: "Glossary – Metertron",
    description: "Water meter and municipal programme terminology for South African contractors.",
    section: "glossary",
  },
  {
    path: "/careers",
    title: "Careers – Metertron",
    description: "Join Metertron — building water meter installation software for South African contractors.",
    section: "pages",
  },
  {
    path: "/partners",
    title: "Partners – Metertron",
    description:
      "Partner with Metertron to deliver meter installation capture and municipal export workflows to your clients.",
    section: "pages",
  },
  {
    path: "/changelog",
    title: "Changelog – Metertron",
    description: "Product updates for Metertron water meter installation software.",
    section: "pages",
    changeFrequency: "weekly",
  },
  {
    path: "/help",
    title: "Help – Metertron",
    description: "Get help with Metertron — sign in for in-app guidance or contact support.",
    section: "pages",
  },
  {
    path: "/status",
    title: "Status – Metertron",
    description: "Metertron service status and incident updates.",
    section: "pages",
  },
  {
    path: "/resources/templates",
    title: "Templates & checklists – Metertron",
    description:
      "Download a meter installation checklist and sample municipal export template for South African contractor programmes.",
    section: "pages",
  },
  {
    path: "/guides/meter-installation-programme-guide",
    title: "Meter installation programme guide – Metertron",
    description:
      "A South African pillar guide for running water meter installation programmes: capture, evidence, review, stock and municipal exports.",
    section: "pages",
    priority: 0.85,
  },
];

const HUB_LINKS = new Set([
  "/",
  "/product",
  "/pricing",
  "/demo",
  "/contact",
  "/about",
  "/security",
  "/blog",
  "/glossary",
  "/municipalities",
  "/careers",
  "/partners",
  "/changelog",
  "/help",
  "/status",
  "/features/field-capture-app",
  "/solutions/meter-installation-contractors",
  "/solutions/municipalities",
  "/solutions/plumbing-contractors",
  "/solutions/water-utilities",
  "/solutions/smart-prepaid-meter-rollouts",
  "/solutions/meter-replacement-programmes",
  "/solutions/meter-audits",
  "/compare/metertron-vs-spreadsheets",
  "/compare/metertron-vs-paper-job-cards",
  "/compare/metertron-vs-generic-field-service-apps",
  "/guides/meter-installation-programme-guide",
  "/resources/templates",
  "/privacy",
  "/terms",
  "/popia",
  "/cookies",
  "/paia-manual",
  "/dpa",
  "/acceptable-use",
  "/sla",
]);

export function allMarketingRoutes(): MarketingRoute[] {
  const features = allFeatures().map((feature) => ({
    path: `/features/${feature.slug}`,
    title: feature.metaTitle,
    description: feature.metaDescription,
    section: "features",
    priority: 0.8,
  }));
  const solutions = allSolutions().map((solution) => ({
    path: `/solutions/${solution.slug}`,
    title: solution.metaTitle,
    description: solution.metaDescription,
    section: "solutions",
    priority: 0.8,
  }));
  const municipalities = allMunicipalities().map((row) => ({
    path: `/municipalities/${row.slug}`,
    title: row.metaTitle,
    description: row.metaDescription,
    section: "municipalities",
    noIndex: !row.indexable,
    priority: 0.7,
  }));
  const compare = allComparePages().map((page) => ({
    path: `/compare/${page.slug}`,
    title: page.metaTitle,
    description: page.metaDescription,
    section: "pages",
    priority: 0.7,
  }));
  const blog = allLongPosts().map((post) => ({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    section: "blog",
    lastmod: post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const legal = allLegalPages().map((page) => ({
    path: `/${page.slug}`,
    title: page.title,
    description: page.metaDescription,
    section: "pages",
    priority: 0.4,
  }));
  const glossary = allTerms().map((term) => ({
    path: `/glossary/${term.slug}`,
    title: `${term.term} – Metertron glossary`,
    description: term.short.slice(0, 155),
    section: "glossary",
    priority: 0.5,
  }));

  return [...STATIC, ...features, ...solutions, ...municipalities, ...compare, ...blog, ...legal, ...glossary];
}

export function buildMarketingRouteRegistry(): MarketingRoute[] {
  return allMarketingRoutes();
}

export function marketingRoutesForSitemap() {
  return allMarketingRoutes()
.filter((route) => !route.noIndex)
.map((route) => ({
      path: route.path,
      lastModified: route.lastmod,
      changeFrequency: route.changeFrequency ?? "monthly",
      priority: route.priority ?? 0.5,
    }));
}

export function findDuplicateSeo(routes: MarketingRoute[]) {
  const byTitle = new Map<string, string[]>();
  const byDescription = new Map<string, string[]>();
  for (const route of routes) {
    if (route.noIndex) continue;
    byTitle.set(route.title, [...(byTitle.get(route.title) ?? []), route.path]);
    byDescription.set(route.description, [...(byDescription.get(route.description) ?? []), route.path]);
  }
  const duplicates: Array<{ title: string; paths: string[] } | { description: string; paths: string[] }> = [];
  for (const [title, paths] of byTitle) {
    if (paths.length > 1) duplicates.push({ title, paths });
  }
  for (const [description, paths] of byDescription) {
    if (paths.length > 1) duplicates.push({ description, paths });
  }
  return duplicates;
}

export function orphanRouteWarnings(routes: MarketingRoute[]): string[] {
  return routes
.filter((route) => !route.noIndex)
.filter((route) => !HUB_LINKS.has(route.path))
.filter((route) => {
      if (route.path.startsWith("/features/")) return !HUB_LINKS.has("/product");
      if (route.path.startsWith("/solutions/")) return true;
      if (route.path.startsWith("/municipalities/")) return false;
      if (route.path.startsWith("/blog/")) return false;
      if (route.path.startsWith("/glossary/")) return false;
      if (route.path.startsWith("/compare/")) return true;
      return !HUB_LINKS.has(route.path);
    })
.map((route) => route.path);
}
