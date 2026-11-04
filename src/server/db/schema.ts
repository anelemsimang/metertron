import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  bigint,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  customType,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const orgRole = pgEnum("org_role", ["admin", "member", "head"]);
/** Spec roles on organisation_memberships. head maps to owner. */
export const membershipRole = pgEnum("membership_role", ["owner", "admin", "supervisor", "technician", "viewer"]);
export const orgStatus = pgEnum("org_status", ["trialing", "active", "past_due", "readonly", "suspended", "deleted"]);
export const contractRole = pgEnum("contract_role", ["technician", "supervisor", "admin", "client_viewer"]);
export const jobStatus = pgEnum("job_status", ["draft", "submitted", "in_review", "approved", "rejected", "resubmitted"]);
export const installationType = pgEnum("installation_type", ["meter_only", "white_and_blue_box", "non_straight"]);
export const premiseType = pgEnum("premise_type", ["business", "domestic"]);
export const faultCode = pgEnum("fault_code", ["rm", "rp", "rn", "rc", "ro", "rv"]);
export const photoType = pgEnum("photo_type", ["meter_number", "new_meter", "old_meter", "water_point", "ciu_card", "other"]);
export const flagSeverity = pgEnum("flag_severity", ["block", "warn", "info"]);
export const workOrderStatus = pgEnum("work_order_status", ["unassigned", "assigned", "in_progress", "completed", "exception"]);
export const stockKind = pgEnum("stock_kind", ["meter", "smart_device"]);
export const stockStatus = pgEnum("stock_status", ["in_stock", "issued", "installed", "returned"]);
export const stockMovement = pgEnum("stock_movement", ["received", "issued", "installed", "returned"]);
export const formStatus = pgEnum("form_status", ["draft", "published", "retired"]);

const bytea = customType<{ data: Buffer; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const authTokenKind = pgEnum("auth_token_kind", ["email_verify", "magic_link", "password_reset"]);

export const organisations = pgTable("organisations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  legalName: text("legal_name").notNull(),
  slug: text("slug").notNull().unique(),
  status: orgStatus("status").notNull().default("trialing"),
  planKey: text("plan_key").notNull().default("metertron"),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  locale: text("locale").notNull().default("en-ZA"),
  timezone: text("timezone").notNull().default("Africa/Johannesburg"),
  currency: text("currency").notNull().default("ZAR"),
  vatRateBps: integer("vat_rate_bps").notNull().default(1500),
  vatNumber: text("vat_number"),
  logoUrl: text("logo_url"),
  supportAccessAllowed: boolean("support_access_allowed").notNull().default(true),
  supportAccessRequiresApproval: boolean("support_access_requires_approval").notNull().default(false),
  customDomain: text("custom_domain"),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  ...timestamps,
});

/** Compatible with a later Better Auth user table: id, name, email, emailVerified, image, createdAt, updatedAt. */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Primary / active organisation. Multi-org users also have organisation_memberships rows. */
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  orgRole: orgRole("org_role").notNull().default("member"),
  name: text("name").notNull(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash"),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /** Encrypted/base32 secret when TOTP is enabled (scaffold until Better Auth). */
  totpSecret: text("totp_secret"),
  totpEnabledAt: timestamp("totp_enabled_at", { withTimezone: true }),
  removedAt: timestamp("removed_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("users_org_username").on(table.organisationId, table.username),
  uniqueIndex("users_email").on(table.email),
]);

export const organisationMemberships = pgTable("organisation_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  role: membershipRole("role").notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("organisation_memberships_user_org").on(table.userId, table.organisationId),
  index("organisation_memberships_org").on(table.organisationId),
]);

export const organisationInvites = pgTable("organisation_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  email: text("email").notNull(),
  role: membershipRole("role").notNull().default("technician"),
  token: text("token").notNull().unique(),
  invitedBy: uuid("invited_by").references(() => users.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("organisation_invites_org").on(table.organisationId),
  index("organisation_invites_email").on(table.email),
]);

/** One-time tokens for email verify, magic link, and password reset (email delivery in Phase 8). */
export const authTokens = pgTable("auth_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  email: text("email").notNull(),
  kind: authTokenKind("kind").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("auth_tokens_email_kind").on(table.email, table.kind),
]);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  organisationId: uuid("organisation_id").references(() => organisations.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  ...timestamps,
});

export const contracts = pgTable("contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  municipalityName: text("municipality_name").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  deploymentName: text("deployment_name").notNull(),
  companyName: text("company_name").notNull(),
  exportFilenamePattern: text("export_filename_pattern").notNull(),
  exportSheetName: text("export_sheet_name").notNull().default("Main"),
  /** Word written to the Status column for an approved job. eThekwini sample is "Final". */
  statusExportValue: text("status_export_value").notNull(),
  approvalLevels: integer("approval_levels").notNull().default(1),
  listPhrases: jsonb("list_phrases").$type<{ oldMeterSuffix: string; connectionValue: string }>().notNull(),
  timezone: text("timezone").notNull().default("Africa/Johannesburg"),
  ...timestamps,
}, (table) => [
  uniqueIndex("contracts_org_code").on(table.organisationId, table.code),
]);

export const contractGrants = pgTable("contract_grants", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  role: contractRole("role").notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("contract_grants_user_contract").on(table.userId, table.contractId),
  index("contract_grants_org").on(table.organisationId),
]);

export const towns = pgTable("towns", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  name: text("name").notNull(),
  normalisedName: text("normalised_name").notNull(),
  ...timestamps,
}, (table) => [
  uniqueIndex("towns_contract_name").on(table.contractId, table.normalisedName),
  index("towns_org").on(table.organisationId),
]);

export const installers = pgTable("installers", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  userId: uuid("user_id").references(() => users.id),
  displayName: text("display_name").notNull(),
  active: boolean("active").notNull().default(true),
  ...timestamps,
}, (table) => [
  index("installers_org").on(table.organisationId),
]);

export const meterSizes = pgTable("meter_sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  code: text("code").notNull(),
  exportString: text("export_string").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
}, (table) => [
  index("meter_sizes_org").on(table.organisationId),
]);

export const meterClasses = pgTable("meter_classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  code: text("code").notNull(),
  exportString: text("export_string").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
}, (table) => [
  index("meter_classes_org").on(table.organisationId),
]);

export const meterTypes = pgTable("meter_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  code: text("code").notNull(),
  exportString: text("export_string").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
}, (table) => [
  index("meter_types_org").on(table.organisationId),
]);

export const formVersions = pgTable("form_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  key: text("key").notNull(),
  version: integer("version").notNull(),
  status: formStatus("status").notNull().default("draft"),
  schema: jsonb("schema").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("form_versions_contract_key_version").on(table.contractId, table.key, table.version),
  index("form_versions_org").on(table.organisationId),
]);

export const workOrders = pgTable("work_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").references(() => contracts.id),
  townId: uuid("town_id").references(() => towns.id),
  townName: text("town_name"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  status: workOrderStatus("status").notNull().default("unassigned"),
  externalRef: text("external_ref"),
  houseNumber: text("house_number"),
  street: text("street"),
  unitNumber: text("unit_number"),
  lotNumber: text("lot_number"),
  oldMeterNumber: text("old_meter_number"),
  connectionNumber: text("connection_number"),
  accountNumber: text("account_number"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  ...timestamps,
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").references(() => contracts.id),
  formVersionId: uuid("form_version_id").references(() => formVersions.id),
  workOrderId: uuid("work_order_id").references(() => workOrders.id),
  enumeratorId: uuid("enumerator_id").notNull().references(() => users.id),
  installerId: uuid("installer_id").references(() => installers.id),
  townId: uuid("town_id").references(() => towns.id),
  meterSizeId: uuid("meter_size_id").references(() => meterSizes.id),
  meterClassId: uuid("meter_class_id").references(() => meterClasses.id),
  meterTypeId: uuid("meter_type_id").references(() => meterTypes.id),
  status: jobStatus("status").notNull().default("draft"),
  responseCode: text("response_code"),
  draftedOn: timestamp("drafted_on", { withTimezone: true }),
  submittedOn: timestamp("submitted_on", { withTimezone: true }),
  draftName: text("draft_name"),
  lastModifiedBy: uuid("last_modified_by").references(() => users.id),
  approvalLevel: integer("approval_level"),
  rejectionMessage: text("rejection_message"),
  rejectionCount: integer("rejection_count").notNull().default(0),
  editCount: integer("edit_count").notNull().default(0),
  submitIp: text("submit_ip"),
  jobDate: date("job_date"),
  installation: installationType("installation"),
  premise: premiseType("premise"),
  companyName: text("company_name"),
  cardNumber: text("card_number"),
  jobNumber: text("job_number"),
  houseNumber: text("house_number"),
  street: text("street"),
  unitNumber: text("unit_number"),
  lotNumber: text("lot_number"),
  otherReason: text("other_reason"),
  newMeterNumber: text("new_meter_number"),
  smartDeviceNumber: text("smart_device_number"),
  smartDeviceReading: bigint("smart_device_reading", { mode: "number" }),
  oldMeterNumber: text("old_meter_number"),
  oldMeterNotOnList: boolean("old_meter_not_on_list").notNull().default(false),
  oldMeterListNote: text("old_meter_list_note"),
  oldMeterReading: bigint("old_meter_reading", { mode: "number" }),
  connectionNumber: text("connection_number"),
  connectionNotOnList: boolean("connection_not_on_list").notNull().default(false),
  connectionListNote: text("connection_list_note"),
  connectionAnsweredAt: timestamp("connection_answered_at", { withTimezone: true }),
  accountNumber: text("account_number"),
  answers: jsonb("answers").$type<Record<string, unknown>>().notNull().default({}),
  legacyRaw: jsonb("legacy_raw"),
  idempotencyKey: text("idempotency_key"),
  exportedAt: timestamp("exported_at", { withTimezone: true }),
  invoicedAt: timestamp("invoiced_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("jobs_response_code").on(table.responseCode),
  uniqueIndex("jobs_idempotency").on(table.enumeratorId, table.idempotencyKey),
  uniqueIndex("jobs_new_meter_uq").on(table.contractId, table.newMeterNumber).where(sql`${table.deletedAt} IS NULL AND ${table.newMeterNumber} IS NOT NULL`),
  uniqueIndex("jobs_smart_device_uq").on(table.contractId, table.smartDeviceNumber).where(sql`${table.deletedAt} IS NULL AND ${table.smartDeviceNumber} IS NOT NULL`),
  index("jobs_contract_status").on(table.contractId, table.status),
]);

export const jobFaults = pgTable("job_faults", {
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  jobId: uuid("job_id").notNull().references(() => jobs.id),
  code: faultCode("code").notNull(),
}, (table) => [
  uniqueIndex("job_faults_pk").on(table.jobId, table.code),
  index("job_faults_org").on(table.organisationId),
]);

export const jobPhotos = pgTable("job_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  jobId: uuid("job_id").notNull().references(() => jobs.id),
  type: photoType("type").notNull(),
  sequence: integer("sequence").notNull().default(0),
  storageKey: text("storage_key"),
  legacyUrl: text("legacy_url"),
  content: bytea("content"),
  idempotencyKey: text("idempotency_key"),
  contentSha256: text("content_sha256"),
  capturedAt: timestamp("captured_at", { withTimezone: true }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  accuracy: doublePrecision("accuracy"),
  altitude: doublePrecision("altitude"),
  ...timestamps,
}, (table) => [
  uniqueIndex("job_photos_idempotency").on(table.organisationId, table.idempotencyKey),
  index("job_photos_org").on(table.organisationId),
]);

export const qualityFlags = pgTable("quality_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  jobId: uuid("job_id").notNull().references(() => jobs.id),
  ruleId: text("rule_id").notNull(),
  severity: flagSeverity("severity").notNull(),
  message: text("message").notNull(),
  ...timestamps,
}, (table) => [
  index("quality_flags_org").on(table.organisationId),
]);

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").references(() => organisations.id),
  jobId: uuid("job_id").references(() => jobs.id),
  actorId: uuid("actor_id").references(() => users.id),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  field: text("field"),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  reason: text("reason"),
  ipAddress: text("ip_address"),
}, (table) => [
  index("audit_events_org").on(table.organisationId),
]);

export const stockItems = pgTable("stock_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").references(() => contracts.id),
  kind: stockKind("kind").notNull(),
  serial: text("serial").notNull(),
  status: stockStatus("status").notNull().default("in_stock"),
  issuedTo: uuid("issued_to").references(() => users.id),
  jobId: uuid("job_id").references(() => jobs.id),
  ...timestamps,
}, (table) => [
  uniqueIndex("stock_items_org_serial").on(table.organisationId, table.kind, table.serial),
]);

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  stockItemId: uuid("stock_item_id").notNull().references(() => stockItems.id),
  kind: stockKind("kind").notNull(),
  serial: text("serial").notNull(),
  action: stockMovement("action").notNull(),
  actorId: uuid("actor_id").references(() => users.id),
  holderId: uuid("holder_id").references(() => users.id),
  jobId: uuid("job_id").references(() => jobs.id),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("stock_movements_org_at").on(table.organisationId, table.at),
  index("stock_movements_item").on(table.stockItemId),
]);

export const exportRuns = pgTable("export_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  requestedBy: uuid("requested_by").references(() => users.id),
  status: text("status").notNull().default("queued"),
  filters: jsonb("filters").notNull().default({}),
  fileKey: text("file_key"),
  ...timestamps,
}, (table) => [
  index("export_runs_org").on(table.organisationId),
]);

/** Snapshot of a municipal/Excel export layout for a tenant (Phase 4 builds the editor). */
export const exportTemplates = pgTable("export_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  key: text("key").notNull(),
  name: text("name").notNull(),
  sheetName: text("sheet_name").notNull().default("Main"),
  statusExportValue: text("status_export_value").notNull().default("Final"),
  headers: jsonb("headers").$type<string[]>().notNull(),
  mapHeaders: jsonb("map_headers").$type<string[]>().notNull().default([]),
  listPhrases: jsonb("list_phrases").$type<{ oldMeterSuffix: string; connectionValue: string }>().notNull(),
  sourceBuiltin: text("source_builtin"),
  isDefault: boolean("is_default").notNull().default(false),
  ...timestamps,
}, (table) => [
  uniqueIndex("export_templates_org_key").on(table.organisationId, table.key),
  index("export_templates_org").on(table.organisationId),
]);

export const billingInterval = pgEnum("billing_interval", ["monthly", "annual"]);
export const subscriptionStatus = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "grace",
  "cancelled",
  "expired",
]);
export const invoiceStatus = pgEnum("invoice_status", ["draft", "open", "paid", "void", "uncollectible"]);

/** Catalog of Metertron plans. Amounts are excl. VAT, in ZAR cents. */
export const plans = pgTable("plans", {
  key: text("key").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  amountMonthlyZarCents: integer("amount_monthly_zar_cents"),
  seatLimit: integer("seat_limit"),
  installsPerMonth: integer("installs_per_month"),
  storageBytes: bigint("storage_bytes", { mode: "number" }),
  paystackPlanCodeMonthly: text("paystack_plan_code_monthly"),
  paystackPlanCodeAnnual: text("paystack_plan_code_annual"),
  isPublic: boolean("is_public").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const organisationSubscriptions = pgTable("organisation_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  planKey: text("plan_key").notNull().references(() => plans.key),
  interval: billingInterval("interval").notNull().default("monthly"),
  status: subscriptionStatus("status").notNull().default("trialing"),
  paystackCustomerCode: text("paystack_customer_code"),
  paystackSubscriptionCode: text("paystack_subscription_code"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  graceEndsAt: timestamp("grace_ends_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("organisation_subscriptions_org").on(table.organisationId),
  index("organisation_subscriptions_plan").on(table.planKey),
]);

export const usagePeriods = pgTable("usage_periods", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  seatsUsed: integer("seats_used").notNull().default(0),
  installsCount: integer("installs_count").notNull().default(0),
  storageBytes: bigint("storage_bytes", { mode: "number" }).notNull().default(0),
  ...timestamps,
}, (table) => [
  uniqueIndex("usage_periods_org_start").on(table.organisationId, table.periodStart),
  index("usage_periods_org").on(table.organisationId),
]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  number: text("number").notNull(),
  status: invoiceStatus("status").notNull().default("draft"),
  currency: text("currency").notNull().default("ZAR"),
  subtotalZarCents: integer("subtotal_zar_cents").notNull(),
  vatRateBps: integer("vat_rate_bps").notNull().default(1500),
  vatZarCents: integer("vat_zar_cents").notNull(),
  totalZarCents: integer("total_zar_cents").notNull(),
  vatNumber: text("vat_number"),
  paystackReference: text("paystack_reference"),
  lineItems: jsonb("line_items").$type<Array<{ description: string; amountZarCents: number; quantity: number }>>().notNull().default([]),
  periodStart: timestamp("period_start", { withTimezone: true }),
  periodEnd: timestamp("period_end", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("invoices_org_number").on(table.organisationId, table.number),
  index("invoices_org").on(table.organisationId),
]);

export const billingEvents = pgTable("billing_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").references(() => organisations.id),
  kind: text("kind").notNull(),
  provider: text("provider").notNull().default("paystack"),
  externalId: text("external_id"),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  ...timestamps,
}, (table) => [
  index("billing_events_org").on(table.organisationId),
  index("billing_events_kind").on(table.kind),
]);

/** Platform control panel — separate from tenant users. */
export const platformStaffRole = pgEnum("platform_staff_role", ["owner", "admin", "support", "readonly"]);

export const platformStaff = pgTable("platform_staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: platformStaffRole("role").notNull().default("support"),
  totpSecret: text("totp_secret"),
  totpEnabledAt: timestamp("totp_enabled_at", { withTimezone: true }),
  disabledAt: timestamp("disabled_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  uniqueIndex("platform_staff_email").on(table.email),
]);

export const platformSessions = pgTable("platform_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffId: uuid("staff_id").notNull().references(() => platformStaff.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  totpVerifiedAt: timestamp("totp_verified_at", { withTimezone: true }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  ...timestamps,
}, (table) => [
  index("platform_sessions_staff").on(table.staffId),
]);

export const platformAuditEvents = pgTable("platform_audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffId: uuid("staff_id").references(() => platformStaff.id),
  organisationId: uuid("organisation_id").references(() => organisations.id),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  summary: text("summary").notNull().default(""),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  ipAddress: text("ip_address"),
  ...timestamps,
}, (table) => [
  index("platform_audit_events_staff").on(table.staffId),
  index("platform_audit_events_org").on(table.organisationId),
  index("platform_audit_events_action").on(table.action),
]);

/** Tenant-visible log of Metertron support accessing their org. */
export const supportAccessEvents = pgTable("support_access_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  staffId: uuid("staff_id").references(() => platformStaff.id),
  staffEmail: text("staff_email").notNull(),
  staffName: text("staff_name").notNull(),
  reason: text("reason").notNull().default(""),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("support_access_events_org").on(table.organisationId),
]);

export const platformSupportSessions = pgTable("platform_support_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffId: uuid("staff_id").notNull().references(() => platformStaff.id),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  accessEventId: uuid("access_event_id").references(() => supportAccessEvents.id),
  token: text("token").notNull().unique(),
  reason: text("reason").notNull().default(""),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("platform_support_sessions_staff").on(table.staffId),
  index("platform_support_sessions_org").on(table.organisationId),
]);

export const organisationSupportNotes = pgTable("organisation_support_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  staffId: uuid("staff_id").references(() => platformStaff.id),
  body: text("body").notNull(),
  ...timestamps,
}, (table) => [
  index("organisation_support_notes_org").on(table.organisationId),
]);

export const featureFlags = pgTable("feature_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),
  description: text("description").notNull().default(""),
  enabled: boolean("enabled").notNull().default(false),
  /** Optional org id — null means global default. */
  organisationId: uuid("organisation_id").references(() => organisations.id),
  ...timestamps,
}, (table) => [
  uniqueIndex("feature_flags_key_org").on(table.key, table.organisationId),
  index("feature_flags_org").on(table.organisationId),
]);

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  severity: text("severity").notNull().default("info"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull().defaultNow(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  audience: text("audience").notNull().default("all"),
  createdByStaffId: uuid("created_by_staff_id").references(() => platformStaff.id),
  ...timestamps,
});

/** Public REST API keys (hashed). Prefix shown once at creation. */
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  name: text("name").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHash: text("key_hash").notNull(),
  scopes: jsonb("scopes").$type<string[]>().notNull().default(["read:jobs"]),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdByUserId: uuid("created_by_user_id").references(() => users.id),
  ...timestamps,
}, (table) => [
  uniqueIndex("api_keys_prefix").on(table.keyPrefix),
  index("api_keys_org").on(table.organisationId),
]);

export const webhookEndpoints = pgTable("webhook_endpoints", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  url: text("url").notNull(),
  secret: text("secret").notNull(),
  events: jsonb("events").$type<string[]>().notNull().default(["job.approved", "job.rejected"]),
  disabledAt: timestamp("disabled_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("webhook_endpoints_org").on(table.organisationId),
]);

export const webhookDeliveries = pgTable("webhook_deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").notNull().references(() => organisations.id),
  endpointId: uuid("endpoint_id").notNull().references(() => webhookEndpoints.id),
  event: text("event").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  statusCode: integer("status_code"),
  success: boolean("success").notNull().default(false),
  error: text("error"),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
}, (table) => [
  index("webhook_deliveries_org").on(table.organisationId),
  index("webhook_deliveries_endpoint").on(table.endpointId),
]);

