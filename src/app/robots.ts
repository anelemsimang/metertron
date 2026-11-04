import type { MetadataRoute } from "next";
import { SITE } from "@/lib/marketing/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/office", "/field", "/platform", "/api", "/onboarding", "/invite"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
