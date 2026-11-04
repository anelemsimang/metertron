import { desc, eq } from "drizzle-orm";
import { writePlatformAudit } from "@/server/platform/audit";
import { clientIp, requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { organisationSupportNotes, platformStaff } from "@/server/db/schema";

export async function GET(request: Request) {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  const organisationId = new URL(request.url).searchParams.get("organisationId");
  if (!organisationId) return Response.json({ error: "organisationId required." }, { status: 400 });
  try {
    const notes = await withBypassRls(async () =>
      getDb()
        .select({
          id: organisationSupportNotes.id,
          body: organisationSupportNotes.body,
          createdAt: organisationSupportNotes.createdAt,
          staffName: platformStaff.name,
          staffEmail: platformStaff.email,
        })
        .from(organisationSupportNotes)
        .leftJoin(platformStaff, eq(organisationSupportNotes.staffId, platformStaff.id))
        .where(eq(organisationSupportNotes.organisationId, organisationId))
        .orderBy(desc(organisationSupportNotes.createdAt))
        .limit(100),
    );
    return Response.json({ notes });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gate = await requirePlatformStaff("write_notes");
  if ("error" in gate) return gate.error;
  const body = (await request.json()) as { organisationId?: unknown; body?: unknown };
  const organisationId = typeof body.organisationId === "string" ? body.organisationId : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!organisationId || !text) return Response.json({ error: "organisationId and body required." }, { status: 400 });

  try {
    const [note] = await withBypassRls(async () =>
      getDb()
        .insert(organisationSupportNotes)
        .values({ organisationId, staffId: gate.staff.id, body: text })
        .returning(),
    );
    await writePlatformAudit({
      staffId: gate.staff.id,
      organisationId,
      action: "support.note.create",
      targetType: "support_note",
      targetId: note.id,
      summary: "Added support note",
      ipAddress: await clientIp(),
    });
    return Response.json({ note });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
