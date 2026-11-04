import { eq } from "drizzle-orm";
import { verifyPassword } from "@/server/auth/password";
import { writePlatformAudit } from "@/server/platform/audit";
import { clientIp } from "@/server/platform/require";
import { createPlatformSession } from "@/server/platform/session";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { platformStaff } from "@/server/db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return Response.json({ error: "Enter email and password." }, { status: 400 });

  try {
    const staff = await withBypassRls(async () => {
      const [row] = await getDb().select().from(platformStaff).where(eq(platformStaff.email, email)).limit(1);
      return row ?? null;
    });
    if (!staff || !(await verifyPassword(password, staff.passwordHash))) {
      return Response.json({ error: "Email or password is wrong." }, { status: 401 });
    }
    if (staff.disabledAt) return Response.json({ error: "This staff account is disabled." }, { status: 403 });

    const ip = await clientIp();
    const allowlist = process.env.PLATFORM_IP_ALLOWLIST?.trim();
    if (allowlist) {
      const allowed = allowlist.split(",").map((p) => p.trim()).filter(Boolean);
      if (!ip || !allowed.includes(ip)) {
        return Response.json({ error: "IP not allowed for platform access." }, { status: 403 });
      }
    }

    await createPlatformSession(staff.id, {
      totpVerified: false,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent"),
    });
    await writePlatformAudit({
      staffId: staff.id,
      action: "platform.login",
      summary: `Password accepted for ${staff.email}`,
      ipAddress: ip,
    });

    return Response.json({
      staff: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        totpEnabled: Boolean(staff.totpEnabledAt),
      },
      needsTotpSetup: !staff.totpEnabledAt,
      needsTotp: true,
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
