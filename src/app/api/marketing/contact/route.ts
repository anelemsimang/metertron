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

const TOPICS = new Set(["sales", "support", "partners", "other"]);

export async function POST(request: Request) {
  const limited = marketingRateLimit(request, "contact");
  if (limited) return jsonResponse(limited);

  const parsed = await parseJsonBody(request);
  if (!parsed.success) return jsonResponse(parsed.result);
  const body = parsed.body;

  if (honeypotFilled(body.website)) return jsonResponse({ ok: true });

  const popia = requirePopia(body.popiaConsent);
  if (popia) return jsonResponse(popia);

  const name = strField(body, "name", 120);
  const email = emailField(body);
  const message = strField(body, "message", 8000);
  const topic = strField(body, "topic", 40);
  if (!name || !email || !message || !topic || !TOPICS.has(topic)) {
    return jsonResponse({ ok: false, status: 400, error: "Please complete all required fields." });
  }

  const company = strField(body, "company", 200) ?? "—";

  await notifyLead(`Contact (${topic})`, [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company}`,
    `Topic: ${topic}`,
    `Message: ${message}`,
  ]);

  return jsonResponse({ ok: true });
}
