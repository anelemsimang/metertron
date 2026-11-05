import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NavigationLoadingBoundary } from "@/components/brand/navigation-loading-boundary";
import { BRAND, STORAGE } from "@/lib/brand";
import { SITE } from "@/lib/marketing/site";
import "./globals.css";

/** Self-hosted to avoid flaky next/font/google builds when Google returns extensionless font URLs. */
const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "500 600",
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "400 600",
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "500",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  appleWebApp: {
    capable: true,
    title: BRAND.name,
    statusBarStyle: "default",
    startupImage: ["/splash.png"],
  },
  openGraph: {
    siteName: BRAND.name,
    title: BRAND.name,
    description: BRAND.description,
    images: [{ url: "/brand/og-default.png", width: 1200, height: 630, alt: BRAND.name }],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/mark.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: BRAND.themeColor,
};

const themeScript = `
try {
  var t = localStorage.getItem("${STORAGE.theme}") || localStorage.getItem("metervault-theme");
  if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
  if (t && !localStorage.getItem("${STORAGE.theme}")) localStorage.setItem("${STORAGE.theme}", t);
} catch (e) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <NavigationLoadingBoundary>{children}</NavigationLoadingBoundary>
      </body>
    </html>
  );
}
