import { allPosts } from "@/lib/marketing/blog";
import { absoluteUrl } from "@/lib/marketing/routes";
import { SITE } from "@/lib/marketing/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = [...allPosts()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const items = posts
    .map((post) => {
      const link = absoluteUrl(`/blog/${post.slug}`);
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  <description>${escapeXml(post.description)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE.name)} Blog</title>
  <link>${absoluteUrl("/blog")}</link>
  <description>${escapeXml(SITE.description)}</description>
  <language>en-za</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
