import {
  emailField,
  honeypotFilled,
  jsonResponse,
  marketingRateLimit,
  notifyLead,
  parseJsonBody,
  requirePopia,
  strField,
} from "@/server/marketing/forms";
import { SITE } from "@/lib/marketing/site";

const RESOURCES = {
  checklist: "/downloads/meter-installation-checklist.md",
  "export-sample": "/downloads/blank-municipal-export-headers.csv",
  both: "/downloads/meter-installation-checklist.md",
} as const;

export async function POST(request: Request) {
  const limited = marketingRateLimit(request, "templates-lead");
  if (limited) return jsonResponse(limited);

  const parsed = await parseJsonBody(request);
  if (!parsed.success) return jsonResponse(parsed.result);
  const body = parsed.body;

  if (honeypotFilled(body.website)) return jsonResponse({ ok: true });

  const popia = requirePopia(body.popiaConsent);
  if (popia) return jsonResponse(popia);

  const name = strField(body, "name", 120);
  const email = emailField(body);
  const company = strField(body, "company", 200);
  if (!name || !email || !company) {
    return jsonResponse({ ok: false, status: 400, error: "Name, email, and organisation are required." });
  }

  const resourceKey = strField(body, "resource", 40) ?? "checklist";
  const primaryPath =
    resourceKey in RESOURCES ? RESOURCES[resourceKey as keyof typeof RESOURCES] : RESOURCES.checklist;
  const extra =
    resourceKey === "both" ? [`Also: ${SITE.url}/downloads/blank-municipal-export-headers.csv`] : [];

  await notifyLead("Templates resource download", [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Resource: ${resourceKey}`,
    `Primary download: ${SITE.url}${primaryPath}`,
    ...extra,
  ]);

  return Response.json({
    ok: true,
    downloadUrl: primaryPath,
    downloads:
      resourceKey === "both"
        ? ["/downloads/meter-installation-checklist.md", "/downloads/blank-municipal-export-headers.csv"]
        : [primaryPath],
  });
}
