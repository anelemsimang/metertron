import { desc, eq, ilike, or } from "drizzle-orm";
import { requirePlatformStaff } from "@/server/platform/require";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { organisationMemberships, organisations, users } from "@/server/db/schema";

export async function GET(request: Request) {
  const gate = await requirePlatformStaff("view");
  if ("error" in gate) return gate.error;
  const q = (new URL(request.url).searchParams.get("q") ?? "").trim();
  try {
    const rows = await withBypassRls(async () => {
      const db = getDb();
      if (!q) {
        return db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            organisationId: users.organisationId,
            organisationName: organisations.name,
            removedAt: users.removedAt,
            createdAt: users.createdAt,
          })
          .from(users)
          .innerJoin(organisations, eq(users.organisationId, organisations.id))
          .orderBy(desc(users.createdAt))
          .limit(50);
      }
      const pattern = `%${q}%`;
      return db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          organisationId: users.organisationId,
          organisationName: organisations.name,
          removedAt: users.removedAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .innerJoin(organisations, eq(users.organisationId, organisations.id))
        .where(or(ilike(users.email, pattern), ilike(users.name, pattern), ilike(users.username, pattern)))
        .orderBy(desc(users.createdAt))
        .limit(50);
    });

    const withMemberships = await withBypassRls(async () => {
      const db = getDb();
      const out = [];
      for (const row of rows) {
        const memberships = await db
          .select({
            organisationId: organisationMemberships.organisationId,
            role: organisationMemberships.role,
            orgName: organisations.name,
          })
          .from(organisationMemberships)
          .innerJoin(organisations, eq(organisationMemberships.organisationId, organisations.id))
          .where(eq(organisationMemberships.userId, row.id));
        out.push({ ...row, memberships });
      }
      return out;
    });

    return Response.json({ users: withMemberships });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
