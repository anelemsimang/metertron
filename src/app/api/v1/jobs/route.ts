import { and, desc, eq, isNull } from "drizzle-orm";
import { requireApiKey } from "@/server/api/require-api-key";
import { getDb, safeDbMessage, withOrg } from "@/server/db/client";
import { jobs } from "@/server/db/schema";

export async function GET(request: Request) {
  const gate = await requireApiKey(request, "read:jobs");
  if ("error" in gate) return gate.error;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 25) || 25));

  try {
    const rows = await withOrg(gate.key.organisationId, async () => {
      const filters = [eq(jobs.organisationId, gate.key.organisationId), isNull(jobs.deletedAt)];
      if (
        status === "draft" ||
        status === "submitted" ||
        status === "in_review" ||
        status === "approved" ||
        status === "rejected" ||
        status === "resubmitted"
      ) {
        filters.push(eq(jobs.status, status));
      }
      return getDb()
        .select({
          id: jobs.id,
          status: jobs.status,
          responseCode: jobs.responseCode,
          jobDate: jobs.jobDate,
          street: jobs.street,
          newMeterNumber: jobs.newMeterNumber,
          submittedOn: jobs.submittedOn,
          updatedAt: jobs.updatedAt,
        })
        .from(jobs)
        .where(and(...filters))
        .orderBy(desc(jobs.updatedAt))
        .limit(limit);
    });
    return Response.json(
      { jobs: rows },
      { headers: { "x-ratelimit-remaining": String(gate.remaining) } },
    );
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
