import { SITE } from "@/lib/marketing/site";
import { rateLimit } from "@/server/api/rate-limit";
import { log } from "@/server/observability/log";

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 8;

export type MarketingFormResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function marketingRateLimit(request: Request, scope: string): MarketingFormResult | null {
  const ip = clientIp(request);
  const result = rateLimit(`${scope}:${ip}`, LIMIT, WINDOW_MS);
  if (!result.ok) {
    return { ok: false, status: 429, error: "Too many requests. Try again in a few minutes." };
  }
  return null;
}

export function honeypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function requirePopia(consent: unknown): MarketingFormResult | null {
  if (consent !== true) {
    return { ok: false, status: 400, error: "POPIA consent is required." };
  }
  return null;
}

export type ParsedJsonBody =
  | { success: true; body: Record<string, unknown> }
  | { success: false; result: Extract<MarketingFormResult, { ok: false }> };

export async function parseJsonBody(request: Request): Promise<ParsedJsonBody> {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object") {
      return { success: false, result: { ok: false, status: 400, error: "Invalid JSON body." } };
    }
    return { success: true, body };
  } catch {
    return { success: false, result: { ok: false, status: 400, error: "Invalid JSON body." } };
  }
}

/** Plain-text lead notify — avoids react-dom/server in the marketing request path. */
export async function notifyLead(subject: string, lines: string[]) {
  const to = process.env.MARKETING_LEADS_EMAIL?.trim() || SITE.email;
  const from = process.env.EMAIL_FROM || "Metertron <noreply@metertron.co.za>";
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const text = lines.join("\n");
  const html = `<h1>${escapeHtml(subject)}</h1><ul>${lines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("")}</ul>`;

  if (!apiKey) {
    log.info("marketing.lead.stub", { to, subject, preview: text.slice(0, 180) });
    return { provider: "stub" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[Metertron marketing] ${subject}`,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    log.error("marketing.lead.failed", { status: response.status, body: body.slice(0, 200) });
    throw new Error("Failed to send marketing lead email");
  }

  return { provider: "resend" as const };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function jsonResponse(result: MarketingFormResult) {
  if (result.ok) {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false, error: result.error }, { status: result.status });
}

export function strField(body: Record<string, unknown>, key: string, max = 500): string | null {
  const value = body[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export function emailField(body: Record<string, unknown>, key = "email"): string | null {
  const value = strField(body, key, 320);
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return value.toLowerCase();
}
