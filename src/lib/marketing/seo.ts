import type { Metadata } from "next";
import { SITE } from "@/lib/marketing/site";

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
};

export function pageMetadata(input: PageSeo): Metadata {
  const url = `${SITE.url}${input.path === "/" ? "" : input.path}`;
  const og = input.ogImage ?? `/og?title=${encodeURIComponent(input.title)}`;
  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
      languages: {
        "en-ZA": input.path,
        "x-default": input.path,
      },
    },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: SITE.name,
      title: input.title,
      description: input.description,
      locale: "en_ZA",
      images: [{ url: og, width: 1200, height: 630, alt: input.title }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [og],
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/brand/mark.png`,
    telephone: SITE.phones.map((p) => p.tel),
    contactPoint: SITE.phones.map((person) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: person.tel,
      name: person.name,
      areaServed: "ZA",
      availableLanguage: ["en"],
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
