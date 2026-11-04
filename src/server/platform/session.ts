import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { PLATFORM_SESSION_COOKIE } from "@/lib/brand";
import { getDb, withBypassRls } from "@/server/db/client";
import { platformSessions, platformStaff } from "@/server/db/schema";

const TWELVE_HOURS = 60 * 60 * 12;

export type PlatformStaffSession = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "support" | "readonly";
  totpEnabled: boolean;
  totpVerified: boolean;
  sessionId: string;
};

function cookieOptions(maxAge = TWELVE_HOURS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function createPlatformSession(
  staffId: string,
  opts?: { totpVerified?: boolean; ipAddress?: string | null; userAgent?: string | null },
) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TWELVE_HOURS * 1000);
  await withBypassRls(async () => {
    await getDb().insert(platformSessions).values({
      staffId,
      token,
      expiresAt,
      totpVerifiedAt: opts?.totpVerified ? new Date() : null,
      ipAddress: opts?.ipAddress ?? null,
      userAgent: opts?.userAgent ?? null,
    });
    await getDb()
      .update(platformStaff)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(platformStaff.id, staffId));
  });
  const store = await cookies();
  store.set(PLATFORM_SESSION_COOKIE, token, cookieOptions());
  return token;
}

export async function markPlatformTotpVerified() {
  const store = await cookies();
  const token = store.get(PLATFORM_SESSION_COOKIE)?.value;
  if (!token) return false;
  await withBypassRls(async () => {
    await getDb()
      .update(platformSessions)
      .set({ totpVerifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(platformSessions.token, token));
  });
  return true;
}

export async function clearPlatformSession() {
  const store = await cookies();
  const token = store.get(PLATFORM_SESSION_COOKIE)?.value;
  if (token) {
    await withBypassRls(async () => {
      await getDb().delete(platformSessions).where(eq(platformSessions.token, token));
    });
  }
  store.delete(PLATFORM_SESSION_COOKIE);
}

export async function getPlatformStaff(): Promise<PlatformStaffSession | null> {
  const store = await cookies();
  const token = store.get(PLATFORM_SESSION_COOKIE)?.value;
  if (!token) return null;

  return withBypassRls(async () => {
    const [row] = await getDb()
      .select({
        sessionId: platformSessions.id,
        totpVerifiedAt: platformSessions.totpVerifiedAt,
        expiresAt: platformSessions.expiresAt,
        id: platformStaff.id,
        email: platformStaff.email,
        name: platformStaff.name,
        role: platformStaff.role,
        totpEnabledAt: platformStaff.totpEnabledAt,
        disabledAt: platformStaff.disabledAt,
      })
      .from(platformSessions)
      .innerJoin(platformStaff, eq(platformSessions.staffId, platformStaff.id))
      .where(and(eq(platformSessions.token, token), gt(platformSessions.expiresAt, new Date()), isNull(platformStaff.disabledAt)))
      .limit(1);

    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      totpEnabled: Boolean(row.totpEnabledAt),
      totpVerified: Boolean(row.totpVerifiedAt),
      sessionId: row.sessionId,
    };
  });
}
