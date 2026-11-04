import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, CtaBand, MkContainer, MkH1, MkLead, MkSection } from "@/components/marketing/ui";
import { allLongPosts } from "@/lib/marketing/content/blog-long";
import { pageMetadata } from "@/lib/marketing/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog – Metertron",
  description:
    "Guides for South African water meter installation programmes: capture, evidence, POPIA, exports and rejection reduction.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = allLongPosts();

  return (
    <>
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ]}
          />
          <MkH1>Field notes for meter programmes</MkH1>
          <MkLead>
            Practical writing for operations managers and contractors — capture, evidence, review and municipal submissions.
          </MkLead>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block h-full rounded-xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-[var(--mt-leaf)]"
                >
                  <p className="text-xs text-muted">
                    {new Date(post.publishedAt).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {post.readingMinutes} min
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">{post.title}</h2>
                  <p className="mt-3 text-sm text-muted">{post.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm">
            <Link href="/glossary" className="text-[var(--mt-leaf-deep)] hover:underline">
              Glossary
            </Link>
            {" · "}
            <Link href="/guides/meter-installation-programme-guide" className="text-[var(--mt-leaf-deep)] hover:underline">
              Programme guide
            </Link>
            {" · "}
            <Link href="/resources/templates" className="text-[var(--mt-leaf-deep)] hover:underline">
              Templates
            </Link>
          </p>
        </MkContainer>
      </MkSection>
      <CtaBand />
    </>
  );
}
