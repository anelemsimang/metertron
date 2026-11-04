import { headers } from "next/headers";
import { getPlatformStaff, type PlatformStaffSession } from "@/server/platform/session";

export type PlatformCapability =
  | "view"
  | "manage_orgs"
  | "view_as"
  | "manage_staff"
  | "manage_plans"
  | "manage_flags"
  | "manage_announcements"
  | "manage_templates"
  | "write_notes"
  | "danger";

const ROLE_CAPS: Record<PlatformStaffSession["role"], PlatformCapability[]> = {
  owner: [
    "view",
    "manage_orgs",
    "view_as",
    "manage_staff",
    "manage_plans",
    "manage_flags",
    "manage_announcements",
    "manage_templates",
    "write_notes",
    "danger",
  ],
  admin: [
    "view",
    "manage_orgs",
    "view_as",
    "manage_plans",
    "manage_flags",
    "manage_announcements",
    "manage_templates",
    "write_notes",
    "danger",
  ],
  support: ["view", "view_as", "write_notes", "manage_templates"],
  readonly: ["view"],
};

function parseAllowlist() {
  const raw = process.env.PLATFORM_IP_ALLOWLIST?.trim();
  if (!raw) return null;
  return raw.split(",").map((part) => part.trim()).filter(Boolean);
}

export async function clientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return h.get("x-real-ip");
}

export function staffCan(staff: PlatformStaffSession, capability: PlatformCapability) {
  return ROLE_CAPS[staff.role].includes(capability);
}

export async function requirePlatformStaff(capability: PlatformCapability = "view") {
  const allowlist = parseAllowlist();
  if (allowlist) {
    const ip = await clientIp();
    if (!ip || !allowlist.includes(ip)) {
      return { error: Response.json({ error: "IP not allowed for platform access." }, { status: 403 }) };
    }
  }

  const staff = await getPlatformStaff();
  if (!staff) return { error: Response.json({ error: "Platform sign-in required." }, { status: 401 }) };
  if (!staff.totpEnabled || !staff.totpVerified) {
    return { error: Response.json({ error: "Two-factor authentication required.", needsTotp: true }, { status: 403 }) };
  }
  if (!staffCan(staff, capability)) {
    return { error: Response.json({ error: "Insufficient platform permission." }, { status: 403 }) };
  }
  return { staff };
}
