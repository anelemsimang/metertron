import { eq } from "drizzle-orm";
import { writePlatformAudit } from "@/server/platform/audit";
import { clientIp } from "@/server/platform/require";
import { getPlatformStaff, markPlatformTotpVerified } from "@/server/platform/session";
import { generateTotpSecret, totpUri, verifyTotp } from "@/server/platform/totp";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { platformStaff } from "@/server/db/schema";

export async function GET() {
  const staff = await getPlatformStaff();
  if (!staff) return Response.json({ error: "Sign in first." }, { status: 401 });
  if (staff.totpEnabled) return Response.json({ enabled: true });

  try {
    const secret = generateTotpSecret();
    await withBypassRls(async () => {
      await getDb()
        .update(platformStaff)
        .set({ totpSecret: secret, updatedAt: new Date() })
        .where(eq(platformStaff.id, staff.id));
    });
    return Response.json({
      enabled: false,
      secret,
      otpauthUrl: totpUri(secret, staff.email),
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const staff = await getPlatformStaff();
  if (!staff) return Response.json({ error: "Sign in first." }, { status: 401 });
  const body = (await request.json()) as { code?: unknown; action?: unknown };
  const code = typeof body.code === "string" ? body.code : "";
  const action = body.action === "setup" ? "setup" : "verify";

  try {
    const row = await withBypassRls(async () => {
      const [found] = await getDb().select().from(platformStaff).where(eq(platformStaff.id, staff.id)).limit(1);
      return found ?? null;
    });
    if (!row?.totpSecret) return Response.json({ error: "TOTP secret missing. Reload setup." }, { status: 400 });
    if (!verifyTotp(row.totpSecret, code)) return Response.json({ error: "Invalid authenticator code." }, { status: 401 });

    if (action === "setup" || !row.totpEnabledAt) {
      await withBypassRls(async () => {
        await getDb()
          .update(platformStaff)
          .set({ totpEnabledAt: new Date(), updatedAt: new Date() })
          .where(eq(platformStaff.id, staff.id));
      });
    }

    const verified = await markPlatformTotpVerified();
    if (!verified) {
      return Response.json({ error: "Session expired. Sign in again, then enter your code." }, { status: 401 });
    }
    await writePlatformAudit({
      staffId: staff.id,
      action: action === "setup" ? "platform.totp.setup" : "platform.totp.verify",
      summary: `2FA ${action} for ${staff.email}`,
      ipAddress: await clientIp(),
    });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
