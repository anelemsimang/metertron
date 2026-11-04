import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

/** React Email–style layout (rendered via react-dom/server). */
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <html lang="en-ZA">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>{preview}</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#F7FAF8", fontFamily: "Segoe UI, Helvetica, Arial, sans-serif", color: "#14241a" }}>
        <div style={{ display: "none", maxHeight: 0, overflow: "hidden" }}>{preview}</div>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#F7FAF8", padding: "24px 12px" }}>
          <tbody>
            <tr>
              <td align="center">
                <table role="presentation" width="560" cellPadding={0} cellSpacing={0} style={{ maxWidth: 560, background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #d7e2db" }}>
                  <tbody>
                    <tr>
                      <td style={{ background: "#0E3D24", padding: "20px 24px", color: "#ffffff", fontSize: 20, fontWeight: 600 }}>
                        {BRAND.name}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "28px 24px", fontSize: 15, lineHeight: 1.55 }}>{children}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "16px 24px 24px", fontSize: 12, color: "#667d70", borderTop: "1px solid #eef3ef" }}>
                        {BRAND.tagline} · You received this because of activity on your {BRAND.name} organisation.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

export function EmailButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        marginTop: 16,
        background: "#147A45",
        color: "#ffffff",
        textDecoration: "none",
        padding: "12px 18px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {label}
    </a>
  );
}
