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

export async function POST(request: Request) {
  const limited = marketingRateLimit(request, "demo");
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
    return jsonResponse({ ok: false, status: 400, error: "Name, email, and company are required." });
  }

  const role = strField(body, "role", 120) ?? "—";
  const teamSize = strField(body, "teamSize", 40) ?? "—";
  const municipality = strField(body, "municipality", 200) ?? "—";
  const phone = strField(body, "phone", 40) ?? "—";
  const message = strField(body, "message", 4000) ?? "—";

  await notifyLead("Demo request", [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Role: ${role}`,
    `Team size: ${teamSize}`,
    `Municipality: ${municipality}`,
    `Phone: ${phone}`,
    `Message: ${message}`,
  ]);

  return jsonResponse({ ok: true });
}
