import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb, withBypassRls } from "@/server/db/client";
import { users } from "@/server/db/schema";

/** Scaffold: store a base32-ish secret; full TOTP verify lands with Better Auth / Phase 8 email. */
export function generateTotpSecret() {
  return randomBytes(20).toString("base64url").slice(0, 32);
}

export async function enableTotpScaffold(userId: string) {
  const secret = generateTotpSecret();
  await withBypassRls(async () => {
    await getDb()
      .update(users)
      .set({ totpSecret: secret, totpEnabledAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  });
  return { secret, otpauthUrl: `otpauth://totp/Metertron:${userId}?secret=${secret}&issuer=Metertron` };
}

export async function disableTotpScaffold(userId: string) {
  await withBypassRls(async () => {
    await getDb()
      .update(users)
      .set({ totpSecret: null, totpEnabledAt: null, updatedAt: new Date() })
      .where(eq(users.id, userId));
  });
}
