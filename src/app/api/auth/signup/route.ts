import { eq } from "drizzle-orm";
import { hashPassword } from "@/server/auth/password";
import { createSession } from "@/server/auth/session";
import { issueAuthToken } from "@/server/auth/tokens";
import { getDb, safeDbMessage, withBypassRls } from "@/server/db/client";
import { organisationMemberships, users } from "@/server/db/schema";
import { ensureTrialSubscription } from "@/server/billing/subscriptions";
import { hasUsedFreeTrial, recordFreeTrialClaim } from "@/server/billing/trial-claims";
import { createOrganisation } from "@/server/orgs/create";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: unknown;
    username?: unknown;
    email?: unknown;
    password?: unknown;
    companyName?: unknown;
  };
  const name = clean(body.name);
  const username = clean(body.username);
  const email = clean(body.email).toLowerCase();
  const companyName = clean(body.companyName);
  const password = typeof body.password === "string" ? body.password : "";
  if (name.length < 2) return Response.json({ error: "Enter your name." }, { status: 400 });
  if (companyName.length < 2) return Response.json({ error: "Enter your company name." }, { status: 400 });
  if (!/^[A-Za-z0-9._-]{2,40}$/.test(username)) {
    return Response.json({ error: "Username must be 2–40 letters, numbers, dots, or hyphens." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email." }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  try {
    const existing = await withBypassRls(async () => {
      const [row] = await getDb().select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      return row ?? null;
    });
    if (existing) return Response.json({ error: "An account with that email already exists." }, { status: 409 });

    if (await hasUsedFreeTrial(email)) {
      return Response.json(
        {
          error: "This email has already used the free trial. WhatsApp or call us to arrange paid access.",
        },
        { status: 403 },
      );
    }

    const organisation = await createOrganisation({ name: companyName });
    const passwordHash = await hashPassword(password);
    const created = await withBypassRls(async () => {
      const db = getDb();
      const [user] = await db
        .insert(users)
        .values({
          organisationId: organisation.id,
          orgRole: "head",
          name,
          username,
          email,
          passwordHash,
          emailVerified: false,
        })
        .returning({
          id: users.id,
          name: users.name,
          username: users.username,
          email: users.email,
          orgRole: users.orgRole,
        });
      await db.insert(organisationMemberships).values({
        userId: user.id,
        organisationId: organisation.id,
        role: "owner",
      });
      return user;
    });

    await ensureTrialSubscription(organisation.id);
    await recordFreeTrialClaim(email, organisation.id);
    const verify = await issueAuthToken({ kind: "email_verify", email, userId: created.id, ttlHours: 48 });
    await createSession(created.id, organisation.id);

    return Response.json({
      user: { ...created, membershipRole: "owner" as const },
      organisation: {
        id: organisation.id,
        name: organisation.name,
        slug: organisation.slug,
        trialEndsAt: organisation.trialEndsAt,
      },
      onboardingRequired: true,
      // Email delivery is Phase 8; token returned for local/dev verify until then.
      emailVerifyToken: verify.token,
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
