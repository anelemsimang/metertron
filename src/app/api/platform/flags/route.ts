import { desc, eq } from "drizzle-orm";
import { writePlatformAudit } from "@/server/platform/audit";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { featureFlags } from "@/server/db/schema";

export async function GET() {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  try {
    const flags = await withBypassRls(async () =>
      getDb().select().from(featureFlags).orderBy(desc(featureFlags.updatedAt)).limit(200),
    );
    return Response.json({ flags });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requirePlatformStaff("manage_flags");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as {
    key?: unknown;
    description?: unknown;
    enabled?: unknown;
    organisationId?: unknown;
  };
  const key = typeof body.key === "string" ? body.key.trim().toLowerCase().replace(/\s+/g, "_") : "";
  if (!key) return Response.json({ error: "Flag key required." }, { status: 400 });

  try {
    const [flag] = await withBypassRls(async () =>
      getDb()
        .insert(featureFlags)
        .values({
          key,
          description: typeof body.description === "string" ? body.description : "",
          enabled: body.enabled === true,
          organisationId: typeof body.organisationId === "string" ? body.organisationId : null,
        })
        .returning(),
    );
    await writePlatformAudit({
      staffId: gate.staff.id,
      organisationId: typeof body.organisationId === "string" ? body.organisationId : null,
      action: "flag.upsert",
      targetType: "feature_flag",
      targetId: flag.id,
      summary: `Upserted flag ${key}`,
      ipAddress: await clientIp(),
    });
    return Response.json({ flag });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const gate = await requirePlatformStaff("manage_flags");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { id?: unknown; enabled?: unknown };
  const id = typeof body.id === "string" ? body.id : "";
  if (!id || typeof body.enabled !== "boolean") return Response.json({ error: "id and enabled required." }, { status: 400 });
  const enabled = body.enabled;
  try {
    await withBypassRls(async () => {
      await getDb()
        .update(featureFlags)
        .set({ enabled, updatedAt: new Date() })
        .where(eq(featureFlags.id, id));
    });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
