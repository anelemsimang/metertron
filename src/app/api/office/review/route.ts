import { and, eq, isNull, sql } from "drizzle-orm";
import { missingRequiredPhotos, photoCoverageLabel } from "@/domain/forms/photo-types";
import { isOfficeRole } from "@/lib/roles";
import { dispatchWebhookEvent } from "@/server/api/webhooks";
import { getSessionUser } from "@/server/auth/session";
import { getDb, safeDbMessage, withOrg } from "@/server/db/client";
import { jobPhotos, jobs } from "@/server/db/schema";
import { log } from "@/server/observability/log";

const WAITING = ["submitted", "in_review", "resubmitted"] as const;

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!isOfficeRole(user.orgRole)) return Response.json({ error: "Only a manager can decide." }, { status: 403 });

  const body = (await request.json()) as { jobId?: unknown; decision?: unknown; message?: unknown };
  const jobId = typeof body.jobId === "string" ? body.jobId : "";
  const decision = body.decision === "approved" || body.decision === "rejected" ? body.decision : null;
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!jobId || !decision) return Response.json({ error: "Choose approve or reject." }, { status: 400 });

  try {
    return await withOrg(user.organisationId, async () => {
      const db = getDb();
      const [job] = await db
        .select({ id: jobs.id, status: jobs.status })
        .from(jobs)
        .where(and(eq(jobs.id, jobId), eq(jobs.organisationId, user.organisationId), isNull(jobs.deletedAt)))
        .limit(1);
      if (!job) return Response.json({ error: "That capture was not found." }, { status: 404 });
      if (!WAITING.includes(job.status as (typeof WAITING)[number])) {
        return Response.json({ error: "This capture is not waiting for a decision." }, { status: 409 });
      }
      if (decision === "approved") {
        const photos = await db
          .select({ type: jobPhotos.type })
          .from(jobPhotos)
          .where(and(eq(jobPhotos.jobId, jobId), eq(jobPhotos.organisationId, user.organisationId)));
        const missing = missingRequiredPhotos(photos.map((photo) => photo.type));
        const label = photoCoverageLabel(missing);
        if (label) {
          return Response.json({ error: `Cannot approve yet. Missing photos: ${label}.` }, { status: 409 });
        }
      }
      await db
        .update(jobs)
        .set({
          status: decision,
          lastModifiedBy: user.id,
          updatedAt: new Date(),
          ...(decision === "rejected"
            ? { rejectionMessage: message || null, rejectionCount: sql`${jobs.rejectionCount} + 1` }
            : { rejectionMessage: null }),
        })
        .where(and(eq(jobs.id, jobId), eq(jobs.organisationId, user.organisationId)));

      const event = decision === "approved" ? "job.approved" : "job.rejected";
      try {
        await dispatchWebhookEvent(user.organisationId, event, {
          jobId,
          status: decision,
          rejectionMessage: decision === "rejected" ? message || null : null,
          decidedBy: user.id,
        });
      } catch (error) {
        log.warn("review.webhook_failed", {
          organisationId: user.organisationId,
          error: error instanceof Error ? error.message : String(error),
        });
      }

      return Response.json({ ok: true, status: decision });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
