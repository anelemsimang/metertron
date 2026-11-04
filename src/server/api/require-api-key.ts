import { authenticateApiKey } from "@/server/api/keys";
import { rateLimit } from "@/server/api/rate-limit";

export async function requireApiKey(request: Request, scope?: string) {
  const header = request.headers.get("authorization") || "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const raw = bearer || request.headers.get("x-api-key")?.trim() || "";
  if (!raw) return { error: Response.json({ error: "API key required." }, { status: 401 }) };

  const limited = rateLimit(`api:${raw.slice(0, 16)}`, 120, 60_000);
  if (!limited.ok) {
    return {
      error: Response.json(
        { error: "Rate limit exceeded." },
        { status: 429, headers: { "retry-after": String(Math.ceil((limited.resetAt - Date.now()) / 1000)) } },
      ),
    };
  }

  const key = await authenticateApiKey(raw);
  if (!key) return { error: Response.json({ error: "Invalid API key." }, { status: 401 }) };
  if (scope && !key.scopes.includes(scope) && !key.scopes.includes("*")) {
    return { error: Response.json({ error: `Missing scope: ${scope}` }, { status: 403 }) };
  }
  return { key, remaining: limited.remaining };
}
