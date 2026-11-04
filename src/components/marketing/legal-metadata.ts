import type { Metadata } from "next";
import { getLegalPage } from "@/lib/marketing/content/legal";
import { pageMetadata } from "@/lib/marketing/seo";

export function legalMetadata(slug: string, path: string): Metadata {
  const page = getLegalPage(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.metaDescription,
    path,
  });
}
