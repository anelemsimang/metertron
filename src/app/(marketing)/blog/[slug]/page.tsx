import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox, BlogTrialPrompt, TableOfContents } from "@/components/marketing/blog-ui";
import { JsonLd } from "@/components/marketing/json-ld";
import {
  Breadcrumbs,
  CtaBand,
  FaqAccordion,
  MkContainer,
  MkH1,
  MkSection,
  RelatedLinks,
} from "@/components/marketing/ui";
import { allLongPosts, getLongPost } from "@/lib/marketing/content/blog-long";
import { pageMetadata } from "@/lib/marketing/seo";
import { SITE } from "@/lib/marketing/site";

export function generateStaticParams() {
  return allLongPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getLongPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getLongPost(slug);
  if (!post) notFound();

  const toc = post.body.slice(0, 6).map((paragraph, index) => ({
    id: `section-${index + 1}`,
    label: paragraph.split(".")[0]?.slice(0, 72) || `Section ${index + 1}`,
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          author: { "@type": "Person", name: post.author.name },
          publisher: { "@type": "Organization", name: SITE.name, logo: `${SITE.url}/brand/mark.png` },
          mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
        }}
      />
      <MkSection className="pt-10 md:pt-14">
        <MkContainer>
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
          />
          <div className="mt-6 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <TableOfContents items={toc} />
            <article>
              <p className="text-xs text-muted">
                {new Date(post.publishedAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · {post.readingMinutes} min read
              </p>
              <MkH1>{post.title}</MkH1>
              <div className="mt-8 space-y-5 text-muted">
                {post.body.map((paragraph, index) => (
                  <p key={paragraph.slice(0, 32)} id={index < 6 ? `section-${index + 1}` : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <AuthorBox name={post.author.name} role={post.author.role} />
              <div className="mt-12">
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mt-grove)]">FAQ</h2>
                <div className="mt-4">
                  <FaqAccordion faqs={post.faqs} />
                </div>
              </div>
              <div className="mt-12">
                <RelatedLinks
                  title="Related articles"
                  links={post.relatedSlugs.map((relatedSlug) => {
                    const related = getLongPost(relatedSlug);
                    return {
                      href: `/blog/${relatedSlug}`,
                      label: related?.title ?? relatedSlug,
                    };
                  })}
                />
              </div>
              <p className="mt-8 text-sm">
                <Link href="/guides/meter-installation-programme-guide" className="text-[var(--mt-leaf-deep)] hover:underline">
                  Programme guide
                </Link>
                {" · "}
                <Link href="/product" className="text-[var(--mt-leaf-deep)] hover:underline">
                  Product
                </Link>
                {" · "}
                <Link href="/demo" className="text-[var(--mt-leaf-deep)] hover:underline">
                  Book a demo
                </Link>
              </p>
            </article>
          </div>
        </MkContainer>
      </MkSection>
      <BlogTrialPrompt />
      <CtaBand />
    </>
  );
}
