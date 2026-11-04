import { clearPlatformSession } from "@/server/platform/session";
import { endSupportSession } from "@/server/platform/support";

export async function POST() {
  await endSupportSession();
  await clearPlatformSession();
  return Response.json({ ok: true });
}
