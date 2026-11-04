"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const KEY = "metertron-cookie-consent";

export function MarketingAnalytics() {
  const [allowed, setAllowed] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  useEffect(() => {
    function read() {
      try {
        setAllowed(localStorage.getItem(KEY) === "all");
      } catch {
        setAllowed(false);
      }
    }
    read();
    window.addEventListener("metertron-consent", read);
    return () => window.removeEventListener("metertron-consent", read);
  }, []);

  if (!allowed) return null;

  return (
    <>
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-consent" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'update', { analytics_storage: 'granted' });
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
      {plausible ? (
        <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      ) : null}
    </>
  );
}
