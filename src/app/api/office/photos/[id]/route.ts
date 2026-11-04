import { and, eq, isNull } from "drizzle-orm";
import { requireAdmin } from "@/server/auth/require-admin";
import { getDb, safeDbMessage, withOrg } from "@/server/db/client";
import { jobPhotos, jobs } from "@/server/db/schema";
import { readPhotoBytes } from "@/server/storage/photos";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const { id } = await context.params;
  try {
    return await withOrg(gate.user.organisationId, async () => {
      const [photo] = await getDb()
        .select({ content: jobPhotos.content, storageKey: jobPhotos.storageKey })
        .from(jobPhotos)
        .innerJoin(jobs, eq(jobPhotos.jobId, jobs.id))
        .where(
          and(
            eq(jobPhotos.id, id),
            eq(jobPhotos.organisationId, gate.user.organisationId),
            eq(jobs.organisationId, gate.user.organisationId),
            isNull(jobs.deletedAt),
          ),
        )
        .limit(1);
      const bytes = await readPhotoBytes(photo?.storageKey, photo?.content ?? null);
      if (!bytes) return new Response("Photo not found.", { status: 404 });
      return new Response(new Uint8Array(bytes), {
        headers: {
          "content-type": "image/jpeg",
          "cache-control": "private, max-age=3600",
        },
      });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
