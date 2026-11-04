import { desc } from "drizzle-orm";
import { writePlatformAudit } from "@/server/platform/audit";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { announcements } from "@/server/db/schema";

export async function GET() {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  try {
    const rows = await withBypassRls(async () =>
      getDb().select().from(announcements).orderBy(desc(announcements.createdAt)).limit(100),
    );
    return Response.json({ announcements: rows });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requirePlatformStaff("manage_announcements");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as {
    title?: unknown;
    body?: unknown;
    severity?: unknown;
    endsAt?: unknown;
    audience?: unknown;
  };
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!title || !text) return Response.json({ error: "Title and body required." }, { status: 400 });

  try {
    const [row] = await withBypassRls(async () =>
      getDb()
        .insert(announcements)
        .values({
          title,
          body: text,
          severity: typeof body.severity === "string" ? body.severity : "info",
          audience: typeof body.audience === "string" ? body.audience : "all",
          endsAt: typeof body.endsAt === "string" && body.endsAt ? new Date(body.endsAt) : null,
          createdByStaffId: gate.staff.id,
        })
        .returning(),
    );
    await writePlatformAudit({
      staffId: gate.staff.id,
      action: "announcement.create",
      targetType: "announcement",
      targetId: row.id,
      summary: title,
      ipAddress: await clientIp(),
    });
    return Response.json({ announcement: row });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
