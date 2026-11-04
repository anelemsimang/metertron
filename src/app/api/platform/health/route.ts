import { count, sql } from "drizzle-orm";
import { requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { organisations, users, jobs, platformSessions } from "@/server/db/schema";

export async function GET() {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  const started = Date.now();
  try {
    const stats = await withBypassRls(async () => {
      const db = getDb();
      await db.execute(sql`select 1`);
      const [orgs] = await db.select({ total: count() }).from(organisations);
      const [userRows] = await db.select({ total: count() }).from(users);
      const [jobRows] = await db.select({ total: count() }).from(jobs);
      const [sessions] = await db.select({ total: count() }).from(platformSessions);
      return {
        organisations: orgs.total,
        users: userRows.total,
        jobs: jobRows.total,
        platformSessions: sessions.total,
      };
    });
    return Response.json({
      ok: true,
      latencyMs: Date.now() - started,
      database: "ok",
      stats,
      env: {
        paystack: Boolean(process.env.PAYSTACK_SECRET_KEY),
        ipAllowlist: Boolean(process.env.PLATFORM_IP_ALLOWLIST?.trim()),
        nodeEnv: process.env.NODE_ENV ?? "development",
      },
    });
  } catch (error) {
    return Response.json({ ok: false, error: safeDbMessage(error), latencyMs: Date.now() - started }, { status: 500 });
  }
}
