import type { MembershipRole } from "@/lib/membership";

export type OrgRole = "head" | "admin" | "member";

/** Office UI: owner, admin, and supervisor. Viewer uses a limited office path. */
export function isOfficeRole(role: string): role is "head" | "admin" {
  return role === "head" || role === "admin";
}

export function isOfficeMembership(role: MembershipRole | string): boolean {
  return role === "owner" || role === "admin" || role === "supervisor" || role === "viewer";
}

export function isFieldMembership(role: MembershipRole | string): boolean {
  return role === "technician";
}

export function roleLabel(role: string) {
  if (role === "head" || role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "supervisor") return "Supervisor";
  if (role === "viewer") return "Viewer";
  if (role === "technician" || role === "member") return "Technician";
  return role;
}

export function membershipLabel(role: MembershipRole) {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "supervisor") return "Supervisor";
  if (role === "viewer") return "Viewer";
  return "Technician";
}
