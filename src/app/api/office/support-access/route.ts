import { requireSession } from "@/server/auth/require-admin";
import { listSupportAccessForOrg } from "@/server/platform/support";
import { safeDbMessage } from "@/server/db/client";

export async function GET() {
  const gate = await requireSession();
  if ("error" in gate) return gate.error;
  try {
    const events = await listSupportAccessForOrg(gate.user.organisationId);
    return Response.json({ events });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
