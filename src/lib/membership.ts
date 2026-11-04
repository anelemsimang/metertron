import type { OrgRole } from "@/lib/roles";

export type MembershipRole = "owner" | "admin" | "supervisor" | "technician" | "viewer";

export const MEMBERSHIP_ROLES: MembershipRole[] = ["owner", "admin", "supervisor", "technician", "viewer"];

export function isMembershipRole(value: unknown): value is MembershipRole {
  return typeof value === "string" && (MEMBERSHIP_ROLES as string[]).includes(value);
}

/** Map legacy org_role → membership_role (Owner ≡ head). */
export function membershipFromOrgRole(role: OrgRole | string): MembershipRole {
  if (role === "head") return "owner";
  if (role === "admin") return "admin";
  return "technician";
}

export function orgRoleFromMembership(role: MembershipRole): OrgRole {
  if (role === "owner") return "head";
  if (role === "admin" || role === "supervisor") return "admin";
  return "member";
}
