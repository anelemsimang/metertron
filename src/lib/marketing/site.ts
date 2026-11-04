import { BRAND } from "@/lib/brand";

export const SITE = {
  name: BRAND.name,
  tagline: BRAND.tagline,
  description: BRAND.description,
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://metertron.co.za",
  locale: "en_ZA",
  email: "hello@metertron.co.za",
  supportEmail: "support@metertron.co.za",
} as const;

export const NAV = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
  { href: "/blog", label: "Blog" },
  { href: "/glossary", label: "Glossary" },
] as const;

export const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/pricing", label: "Pricing" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/glossary", label: "Glossary" },
      { href: "/municipalities", label: "Municipalities" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Sign in" },
    ],
  },
] as const;
