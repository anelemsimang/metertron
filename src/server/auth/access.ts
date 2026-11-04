import type { MembershipRole } from "@/lib/membership";
import { orgRoleFromMembership } from "@/lib/membership";
import type { JobStatus } from "../../domain/export/job";
import { isOfficeRole, type OrgRole } from "../../lib/roles";

export const CONTRACT_ROLES = ["technician", "supervisor", "admin", "client_viewer"] as const;
export type ContractRole = (typeof CONTRACT_ROLES)[number];

export const CAPABILITIES = [
  "capture_own_draft",
  "see_own_jobs",
  "see_contract_jobs",
  "see_approved_only",
  "edit_submitted",
  "assign_and_stock",
  "approve_or_reject",
  "unlock_approved",
  "manage_setup",
  "manage_billing",
  "invite_members",
  "export",
] as const;

export type Capability = (typeof CAPABILITIES)[number];

const FULL_OFFICE: Record<Capability, boolean> = {
  capture_own_draft: false,
  see_own_jobs: false,
  see_contract_jobs: true,
  see_approved_only: false,
  edit_submitted: true,
  assign_and_stock: true,
  approve_or_reject: true,
  unlock_approved: true,
  manage_setup: true,
  manage_billing: true,
  invite_members: true,
  export: true,
};

/** Spec product roles → capabilities. Contract grants still apply for technicians. */
export const MEMBERSHIP_MATRIX: Record<MembershipRole, Record<Capability, boolean>> = {
  owner: FULL_OFFICE,
  admin: { ...FULL_OFFICE, manage_billing: false },
  supervisor: {
    capture_own_draft: false,
    see_own_jobs: false,
    see_contract_jobs: true,
    see_approved_only: false,
    edit_submitted: true,
    assign_and_stock: true,
    approve_or_reject: true,
    unlock_approved: false,
    manage_setup: false,
    manage_billing: false,
    invite_members: false,
    export: true,
  },
  technician: {
    capture_own_draft: true,
    see_own_jobs: true,
    see_contract_jobs: false,
    see_approved_only: false,
    edit_submitted: false,
    assign_and_stock: false,
    approve_or_reject: false,
    unlock_approved: false,
    manage_setup: false,
    manage_billing: false,
    invite_members: false,
    export: false,
  },
  viewer: {
    capture_own_draft: false,
    see_own_jobs: false,
    see_contract_jobs: false,
    see_approved_only: true,
    edit_submitted: false,
    assign_and_stock: false,
    approve_or_reject: false,
    unlock_approved: false,
    manage_setup: false,
    manage_billing: false,
    invite_members: false,
    export: true,
  },
};

/** Org admin is not a contract role. They can do every capability on every contract in the organisation. */
export const ROLE_MATRIX: Record<ContractRole | "org_admin", Record<Capability, boolean>> = {
  technician: MEMBERSHIP_MATRIX.technician,
  supervisor: MEMBERSHIP_MATRIX.supervisor,
  admin: {
    ...MEMBERSHIP_MATRIX.admin,
    manage_billing: false,
  },
  client_viewer: MEMBERSHIP_MATRIX.viewer,
  org_admin: MEMBERSHIP_MATRIX.owner,
};

export type Grant = { contractId: string; role: ContractRole };

export type Actor = {
  userId: string;
  organisationId: string;
  orgRole: OrgRole;
  membershipRole: MembershipRole;
  grants: Grant[];
};

export type JobRef = {
  contractId: string;
  organisationId: string;
  enumeratorId: string;
  status: JobStatus;
};

export class AccessError extends Error {
  constructor(message = "Not allowed") {
    super(message);
    this.name = "AccessError";
  }
}

export type ContractScope =
  | { contractId: string; mode: "own"; userId: string }
  | { contractId: string; mode: "all" }
  | { contractId: string; mode: "approved" };

function roleOn(actor: Actor, contractId: string): ContractRole | "org_admin" | MembershipRole | null {
  if (actor.membershipRole === "owner" || actor.membershipRole === "admin") return "org_admin";
  if (actor.membershipRole === "supervisor") return "supervisor";
  if (actor.membershipRole === "viewer") return "client_viewer";
  if (isOfficeRole(actor.orgRole)) return "org_admin";
  return actor.grants.find((grant) => grant.contractId === contractId)?.role ?? (actor.membershipRole === "technician" ? "technician" : null);
}

export function allows(actor: Actor, capability: Capability, contractId?: string): boolean {
  if (MEMBERSHIP_MATRIX[actor.membershipRole][capability]) {
    if (actor.membershipRole === "technician" && contractId) {
      const grant = actor.grants.find((g) => g.contractId === contractId);
      if (grant) return ROLE_MATRIX[grant.role][capability];
    }
    return true;
  }
  if (isOfficeRole(actor.orgRole) && ROLE_MATRIX.org_admin[capability]) return true;
  if (!contractId) return actor.grants.some((grant) => ROLE_MATRIX[grant.role][capability]);
  const role = roleOn(actor, contractId);
  if (role == null) return false;
  if (role === "org_admin") return ROLE_MATRIX.org_admin[capability];
  if (role === "owner" || role === "admin" || role === "supervisor" || role === "technician" || role === "viewer") {
    return MEMBERSHIP_MATRIX[role][capability];
  }
  return ROLE_MATRIX[role][capability];
}

export function jobScopes(actor: Actor): ContractScope[] | "organisation" {
  if (actor.membershipRole === "owner" || actor.membershipRole === "admin" || isOfficeRole(actor.orgRole)) return "organisation";
  if (actor.membershipRole === "supervisor") return "organisation";
  if (actor.membershipRole === "viewer") {
    return actor.grants.length
      ? actor.grants.map((grant) => ({ contractId: grant.contractId, mode: "approved" as const }))
      : "organisation";
  }
  return actor.grants.map((grant) => {
    if (grant.role === "technician") return { contractId: grant.contractId, mode: "own" as const, userId: actor.userId };
    if (grant.role === "client_viewer") return { contractId: grant.contractId, mode: "approved" as const };
    return { contractId: grant.contractId, mode: "all" as const };
  });
}

export function canReadJob(actor: Actor, job: JobRef): boolean {
  if (job.organisationId !== actor.organisationId) return false;
  const role = roleOn(actor, job.contractId);
  if (role == null && actor.membershipRole === "technician") return job.enumeratorId === actor.userId;
  if (role == null) return false;
  if (role === "org_admin" || role === "owner" || role === "admin" || role === "supervisor") return true;
  if (role === "client_viewer" || role === "viewer") return job.status === "approved";
  return job.enumeratorId === actor.userId;
}

export function canMutateJob(actor: Actor, capability: Capability, job: JobRef): boolean {
  if (!canReadJob(actor, job) && capability !== "capture_own_draft") return false;
  if (!allows(actor, capability, job.contractId)) return false;
  if (capability === "capture_own_draft") {
    return job.enumeratorId === actor.userId && (job.status === "draft" || job.status === "rejected");
  }
  if (capability === "unlock_approved") return job.status === "approved";
  if (capability === "approve_or_reject") return job.status === "submitted" || job.status === "in_review" || job.status === "resubmitted";
  if (capability === "edit_submitted") return job.status === "submitted" || job.status === "in_review" || job.status === "resubmitted" || job.status === "rejected";
  return true;
}

export function assertCan(actor: Actor, capability: Capability, job?: JobRef): void {
  const allowed = job
    ? canMutateJob(actor, capability, job) || (capability === "export" && canReadJob(actor, job))
    : allows(actor, capability);
  if (!allowed) throw new AccessError();
}

export function actorFromSession(
  user: { id: string; organisationId: string; orgRole: OrgRole; membershipRole?: MembershipRole },
  grants: Grant[] = [],
): Actor {
  const membershipRole = user.membershipRole ?? (isOfficeRole(user.orgRole) ? (user.orgRole === "head" ? "owner" : "admin") : "technician");
  return {
    userId: user.id,
    organisationId: user.organisationId,
    orgRole: user.orgRole ?? orgRoleFromMembership(membershipRole),
    membershipRole,
    grants,
  };
}

/** Client viewers may export only the approved jobs their read scope already allows. */
export function exportStatuses(actor: Actor, contractId: string): JobStatus[] | "all" {
  const role = roleOn(actor, contractId);
  if (role == null || !allows(actor, "export", contractId)) return [];
  if (role === "client_viewer" || role === "viewer") return ["approved"];
  return "all";
}
