import { getPlatformOverview } from "@/server/platform/overview";
import { requirePlatformStaff } from "@/server/platform/require";
import { safeDbMessage } from "@/server/db/client";

export async function GET() {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  try {
    const overview = await getPlatformOverview();
    return Response.json({ overview, staff: gate.staff });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
