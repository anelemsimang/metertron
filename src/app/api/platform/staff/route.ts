import { desc, eq } from "drizzle-orm";
import { hashPassword } from "@/server/auth/password";
import { writePlatformAudit } from "@/server/platform/audit";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { platformStaff } from "@/server/db/schema";

export async function GET() {
  const gate = await requirePlatformStaff("manage_staff");
  if ("error" in gate) return gate.error;
  try {
    const staff = await withBypassRls(async () =>
      getDb()
        .select({
          id: platformStaff.id,
          email: platformStaff.email,
          name: platformStaff.name,
          role: platformStaff.role,
          totpEnabledAt: platformStaff.totpEnabledAt,
          disabledAt: platformStaff.disabledAt,
          lastLoginAt: platformStaff.lastLoginAt,
          createdAt: platformStaff.createdAt,
        })
        .from(platformStaff)
        .orderBy(desc(platformStaff.createdAt)),
    );
    return Response.json({ staff });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requirePlatformStaff("manage_staff");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as {
    email?: unknown;
    name?: unknown;
    password?: unknown;
    role?: unknown;
  };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role =
    body.role === "owner" || body.role === "admin" || body.role === "support" || body.role === "readonly"
      ? body.role
      : "support";
  if (!email || !name || password.length < 10) {
    return Response.json({ error: "Email, name, and password (≥10) required." }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(password);
    const [row] = await withBypassRls(async () =>
      getDb().insert(platformStaff).values({ email, name, passwordHash, role }).returning({
        id: platformStaff.id,
        email: platformStaff.email,
        name: platformStaff.name,
        role: platformStaff.role,
      }),
    );
    await writePlatformAudit({
      staffId: gate.staff.id,
      action: "staff.create",
      targetType: "platform_staff",
      targetId: row.id,
      summary: `Created staff ${email}`,
      ipAddress: await clientIp(),
    });
    return Response.json({ staff: row });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const gate = await requirePlatformStaff("manage_staff");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { id?: unknown; disabled?: unknown; role?: unknown };
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return Response.json({ error: "id required." }, { status: 400 });

  const patch: Partial<typeof platformStaff.$inferInsert> = { updatedAt: new Date() };
  if (typeof body.disabled === "boolean") patch.disabledAt = body.disabled ? new Date() : null;
  if (body.role === "owner" || body.role === "admin" || body.role === "support" || body.role === "readonly") {
    patch.role = body.role;
  }

  try {
    await withBypassRls(async () => {
      await getDb().update(platformStaff).set(patch).where(eq(platformStaff.id, id));
    });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
