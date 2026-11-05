import { BRAND } from "@/lib/brand";

/** Digits only. Defaults to Orlin (WhatsApp). Override with NEXT_PUBLIC_WHATSAPP_NUMBER. */
const whatsappDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27837915151").replace(/\D/g, "");

function waUrl(digits: string, text: string) {
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const SITE = {
  name: BRAND.name,
  tagline: BRAND.tagline,
  description: BRAND.description,
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://metertron.co.za",
  locale: "en_ZA",
  /** Kept for legal/ops tooling — not shown as a primary public contact channel. */
  email: "hello@metertron.co.za",
  supportEmail: "support@metertron.co.za",
  phones: [
    { name: "Anele Msimang", display: "+27 76 350 3539", tel: "+27763503539", digits: "27763503539" },
    { name: "Orlin Mulumba", display: "+27 83 791 5151", tel: "+27837915151", digits: "27837915151" },
  ],
  /** E.164-ish digits for wa.me (Orlin by default) */
  whatsappNumber: whatsappDigits,
  whatsappName: "Orlin Mulumba",
  whatsappUrl: waUrl(
    whatsappDigits,
    "Hi Metertron — I'd like to talk about Metertron for our meter installation programme.",
  ),
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
