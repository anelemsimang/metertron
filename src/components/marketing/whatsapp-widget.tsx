import type { ReactNode } from "react";
import { SITE } from "@/lib/marketing/site";

/** Floating WhatsApp entry — Orlin by default (see SITE.whatsappNumber). */
export function WhatsappWidget() {
  if (!SITE.whatsappUrl) return null;

  return (
    <a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Metertron on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(14,61,36,0.55)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mt-leaf)]"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.43-9.91 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.91C21.94 6.43 17.5 2 12.04 2zm5.79 14.18c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.18-4.93-4.37-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.5c.24-.37.53-.46.71-.46h.51c.16 0 .38-.06.59.45.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.16-.3.36-.43.49-.14.14-.29.29-.12.56.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.6-.07.17-.19.72-.84.91-1.13.19-.28.38-.24.64-.14.26.1 1.66.78 1.95.93.28.14.47.21.54.33.07.12.07.7-.17 1.38z" />
      </svg>
    </a>
  );
}

export function WhatsappCta({
  children = "Chat on WhatsApp",
  light = false,
  className = "",
}: {
  children?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  if (!SITE.whatsappUrl) {
    const phone = SITE.phones[0];
    return (
      <a
        href={`tel:${phone.tel}`}
        className={`inline-flex min-h-12 items-center justify-center rounded-md border px-5 text-sm font-semibold ${
          light ? "border-white/30 text-white hover:bg-white/10" : "border-line text-[var(--mt-grove)] hover:bg-[var(--mt-mist)]"
        } ${className}`}
      >
        Call {phone.name}
      </a>
    );
  }

  return (
    <a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex min-h-12 items-center justify-center rounded-md border px-5 text-sm font-semibold ${
        light ? "border-white/30 text-white hover:bg-white/10" : "border-line text-[var(--mt-grove)] hover:bg-[var(--mt-mist)]"
      } ${className}`}
    >
      {children}
    </a>
  );
}
