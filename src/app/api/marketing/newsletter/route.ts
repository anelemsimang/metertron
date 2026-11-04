import {
  emailField,
  honeypotFilled,
  jsonResponse,
  marketingRateLimit,
  notifyLead,
  parseJsonBody,
  requirePopia,
} from "@/server/marketing/forms";

export async function POST(request: Request) {
  const limited = marketingRateLimit(request, "newsletter");
  if (limited) return jsonResponse(limited);

  const parsed = await parseJsonBody(request);
  if (!parsed.success) return jsonResponse(parsed.result);
  const body = parsed.body;

  if (honeypotFilled(body.website)) return jsonResponse({ ok: true });

  const popia = requirePopia(body.popiaConsent);
  if (popia) return jsonResponse(popia);

  const email = emailField(body);
  if (!email) {
    return jsonResponse({ ok: false, status: 400, error: "A valid work email is required." });
  }

  await notifyLead("Newsletter signup", [`Email: ${email}`]);

  return jsonResponse({ ok: true });
}
