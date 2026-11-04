import { eq } from "drizzle-orm";
import { requireApiKey } from "@/server/api/require-api-key";
import { getDb, safeDbMessage, withOrg } from "@/server/db/client";
import { organisations } from "@/server/db/schema";

export async function GET(request: Request) {
  const gate = await requireApiKey(request, "read:org");
  if ("error" in gate) return gate.error;
  try {
    const [org] = await withOrg(gate.key.organisationId, async () =>
      getDb()
        .select({
          id: organisations.id,
          name: organisations.name,
          slug: organisations.slug,
          status: organisations.status,
          planKey: organisations.planKey,
          locale: organisations.locale,
          timezone: organisations.timezone,
          currency: organisations.currency,
        })
        .from(organisations)
        .where(eq(organisations.id, gate.key.organisationId))
        .limit(1),
    );
    return Response.json(
      { organisation: org },
      { headers: { "x-ratelimit-remaining": String(gate.remaining) } },
    );
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
