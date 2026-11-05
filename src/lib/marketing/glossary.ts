export type GlossaryTerm = {
  slug: string;
  term: string;
  short: string;
  body: string[];
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "meter-change",
    term: "Meter change",
    short: "Replacing an existing utility meter with a new unit and recording the swap for the client.",
    body: [
      "A meter change covers removal of the old meter (with final reading), installation of the new meter (with start reading), seals, and often a CIU for prepaid. The job record must tie account number, location, serial numbers, and photos to one event.",
      "Municipal clients use meter change data for billing updates and asset registers. Incomplete records delay account migration.",
    ],
  },
  {
    slug: "ciu",
    term: "CIU (Customer Interface Unit)",
    short: "The in-home device that lets prepaid customers enter tokens and see credit.",
    body: [
      "On prepaid installations the CIU pairs with the meter via radio or wire. Installers record CIU serial numbers on the job form because mismatches block token loading for the customer.",
      "CIUs are often issued from contractor stock like meters and must be tracked by serial.",
    ],
  },
  {
    slug: "prepaid-meter",
    term: "Prepaid meter",
    short: "A meter that requires upfront purchase of electricity or water credit before consumption.",
    body: [
      "Prepaid meters cut off supply when credit reaches zero. Installations usually include a CIU and strict commissioning steps so the utility’s vending system recognises the new serial.",
      "Contractors must capture commissioning status and any error codes returned from test vend procedures when the client requires them.",
    ],
  },
  {
    slug: "conventional-meter",
    term: "Conventional (postpaid) meter",
    short: "A meter read periodically for billing on account, without customer top-up.",
    body: [
      "Conventional meter changes focus on accurate final and initial readings and seal integrity. Tariff and meter category on the form must match the client’s master data.",
    ],
  },
  {
    slug: "municipal-submission",
    term: "Municipal submission",
    short: "A batch of completed job data sent to a municipality in their required format.",
    body: [
      "Submissions are often Excel files with fixed columns plus optional photo evidence. Rejected batches delay revenue recognition for contractors paid per accepted install.",
      "Each municipality may use different templates; never assume one export fits all clients.",
    ],
  },
  {
    slug: "work-order",
    term: "Work order",
    short: "An assigned job with location, scope, and due date sent to a field team.",
    body: [
      "Work orders link dispatch, stock issue, field capture, review, and export. Closing a work order without review should be exceptional and auditable.",
    ],
  },
  {
    slug: "stock-issue",
    term: "Stock issue",
    short: "Recording meters, seals, or CIUs leaving storeroom control for a team or job.",
    body: [
      "Issues create accountability. Expected consumption on completed jobs should reconcile with issues; variances trigger investigation before month-end.",
    ],
  },
  {
    slug: "first-time-right",
    term: "First-time-right",
    short: "Completing a job so it passes review and client rules without a return visit.",
    body: [
      "First-time-right reduces rework cost and protects contractor scorecards. Validation, required photos, and clear reject reasons in the field app support it.",
    ],
  },
  {
    slug: "review-queue",
    term: "Review queue",
    short: "Office list of submitted jobs waiting for approve or reject decisions.",
    body: [
      "Queues may be split by client, urgency, or validation status. Approved jobs feed export batches; rejected jobs return to installers with reasons.",
    ],
  },
  {
    slug: "export-template",
    term: "Export template",
    short: "A mapping from internal job fields to a client spreadsheet layout.",
    body: [
      "Templates version with municipality spec changes. Office staff should test a small export after any template update.",
    ],
  },
  {
    slug: "offline-sync",
    term: "Offline sync",
    short: "Saving jobs on device when there is no network, then uploading when connectivity returns.",
    body: [
      "Sync status must be visible to installers and office staff. Conflicts when the same job was edited in two places need a defined resolution path.",
    ],
  },
  {
    slug: "gps-proof",
    term: "GPS proof",
    short: "Location metadata attached to photos or job submission for audit.",
    body: [
      "GPS supports dispute resolution when a customer claims no visit occurred. Weak GPS should be recorded honestly rather than omitted.",
    ],
  },
  {
    slug: "photo-evidence",
    term: "Photo evidence",
    short: "Images required by contract showing meter, reading, seal, or site context.",
    body: [
      "Photo slots should match job type. Reviewers reject unreadable glare, wrong subject, or missing angles defined in the client brief.",
    ],
  },
  {
    slug: "seal",
    term: "Meter seal",
    short: "A tamper-evident seal applied so the meter enclosure cannot be opened without visible damage.",
    body: [
      "Seal numbers are often captured on the form. Wrong or missing seals are common rejection reasons on municipal audits.",
    ],
  },
  {
    slug: "final-reading",
    term: "Final reading",
    short: "Last registered value on the removed meter before change.",
    body: [
      "Final readings drive closing bills on postpaid accounts and dispute handling. Capture method (digital display vs mechanical dials) should match client instructions.",
    ],
  },
  {
    slug: "initial-reading",
    term: "Initial reading",
    short: "Starting value on the newly installed meter.",
    body: [
      "Usually zero or a known factory offset. Must align with commissioning reports sent to the utility.",
    ],
  },
  {
    slug: "account-number",
    term: "Account number",
    short: "Client reference linking a property or customer to billing.",
    body: [
      "Typos in account numbers cause exports to fail validation. Barcode or copy-from-work-order reduces manual entry errors.",
    ],
  },
  {
    slug: "erf-or-stand",
    term: "Erf / stand",
    short: "Property identifier used in South African municipal addressing.",
    body: [
      "Jobs may use erf number, stand number, or sectional title unit. Forms should capture what the client master file uses.",
    ],
  },
  {
    slug: "tariff-category",
    term: "Tariff category",
    short: "Billing class such as domestic, business, or indigent.",
    body: [
      "Wrong tariff on a meter change can bill a school as industrial. Use client-supplied pick lists where possible.",
    ],
  },
  {
    slug: "commissioning",
    term: "Commissioning",
    short: "Steps to register a new meter on the utility’s systems and confirm vend or read path.",
    body: [
      "Prepaid commissioning may include test tokens. Record success or failure codes for the office to escalate before export.",
    ],
  },
  {
    slug: "field-capture",
    term: "Field capture",
    short: "Data and media collected on site by installers using mobile tools.",
    body: [
      "Capture should mirror the approved form version for that contract. Using an outdated form version invalidates submissions.",
    ],
  },
  {
    slug: "form-version",
    term: "Form version",
    short: "A numbered definition of fields and rules for a job type.",
    body: [
      "When municipalities change required fields, publish a new version and retire old ones from active work orders.",
    ],
  },
  {
    slug: "validation-rule",
    term: "Validation rule",
    short: "A check that blocks submit until data is plausible or complete.",
    body: [
      "Rules include required photos, serial format, and reading ranges. Too many noisy warnings cause installers to ignore real errors.",
    ],
  },
  {
    slug: "reject-reason",
    term: "Reject reason",
    short: "Office explanation when a job fails review and must be fixed or revisited.",
    body: [
      "Standardised reasons improve reporting. Installers should see the reason on device before travelling back.",
    ],
  },
  {
    slug: "export-batch",
    term: "Export batch",
    short: "A file or set of files generated from approved jobs for one client submission.",
    body: [
      "Batches need IDs and timestamps. Never mix approved and unapproved jobs in one municipal file.",
    ],
  },
  {
    slug: "org-tenant",
    term: "Organisation (tenant)",
    short: "One contractor company’s isolated data space in a multi-customer SaaS product.",
    body: [
      "Each org owns its users, jobs, stock, and exports. Users from one contractor must never see another org’s records.",
    ],
  },
  {
    slug: "row-level-security",
    term: "Row-level security (RLS)",
    short: "Database rules that restrict rows by organisation or role automatically.",
    body: [
      "RLS backs tenant isolation at the data layer so a bug in one API route is less likely to leak cross-client data. It complements app-level checks, not replaces them.",
    ],
  },
  {
    slug: "multi-tenant-saas",
    term: "Multi-tenant SaaS",
    short: "One software instance serving many customer organisations with separated data.",
    body: [
      "Meter contractors share infrastructure but need strong isolation, per-org billing, and admin roles scoped to their company.",
    ],
  },
  {
    slug: "role-based-access",
    term: "Role-based access",
    short: "Permissions tied to installer, reviewer, stock controller, or admin roles.",
    body: [
      "Installers submit jobs; reviewers approve; admins manage users and billing. Separation of duties reduces fraud and accidental exports.",
    ],
  },
  {
    slug: "support-access",
    term: "Support access",
    short: "Time-limited permission for vendor staff to help an org after explicit approval.",
    body: [
      "Support sessions should be logged for trust. Orgs in regulated or tender environments often require this audit trail.",
    ],
  },
  {
    slug: "subscription-billing",
    term: "Subscription billing",
    short: "Recurring charge for software access, often monthly per org or seat.",
    body: [
      "Access changes should be predictable: notify admins, grace period, then feature limits. Field crews need warning before sync stops.",
    ],
  },
  {
    slug: "vat-tax-invoice",
    term: "VAT tax invoice",
    short: "South African invoice showing 15% VAT on standard-rated supplies.",
    body: [
      "B2B buyers need valid tax invoices for input VAT claims. Subscription receipts should show supplier VAT number and invoice number series.",
    ],
  },
  {
    slug: "paystack-webhook",
    term: "Paystack webhook",
    short: "Server notification when a payment succeeds, fails, or is disputed.",
    body: [
      "Webhooks update subscription state in your app. Verify signatures and make handlers idempotent so retries do not double-extend access.",
    ],
  },
  {
    slug: "dunning",
    term: "Dunning",
    short: "Process for retrying failed payments and notifying customers before access changes.",
    body: [
      "Clear emails and in-app banners reduce surprise lockouts. Finance should own escalation after repeated failures.",
    ],
  },
  {
    slug: "usage-metering",
    term: "Usage metering",
    short: "Measuring billable activity such as active users or export volume for a plan.",
    body: [
      "Usage should be visible to org admins before overage. Transparent meters build trust on tender-heavy accounts.",
    ],
  },
  {
    slug: "audit-log",
    term: "Audit log",
    short: "Immutable record of who changed settings, exports, or sensitive data.",
    body: [
      "Logs support security investigations and client audits. Include actor, time, and action—not only error traces.",
    ],
  },
  {
    slug: "barcode-scan",
    term: "Barcode scan",
    short: "Reading meter or CIU serials from printed barcodes in the field app.",
    body: [
      "Scanning beats typing on sunlit screens. Fallback manual entry remains when labels are damaged.",
    ],
  },
  {
    slug: "load-shedding-impact",
    term: "Load shedding (field impact)",
    short: "Planned power cuts affecting tower uptime and charging devices in the field.",
    body: [
      "Offline capture and portable charging are operational requirements in SA, not nice-to-haves. Schedule sync after known shedding blocks when possible.",
    ],
  },
  {
    slug: "indigent-register",
    term: "Indigent register",
    short: "Municipal list of households qualifying for subsidised or free basic services.",
    body: [
      "Meter work on indigent accounts may need extra approval or tariff codes. Capture flags exactly as the client specifies.",
    ],
  },
  {
    slug: "bulk-water-meter",
    term: "Bulk / sub-meter",
    short: "Meters measuring supply to complexes or sections separately from a master meter.",
    body: [
      "Sub-meter changes may require body corporate reference in addition to municipal account. Forms should allow both where needed.",
    ],
  },
];

export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((term) => term.slug === slug);
}

export function allTerms(): GlossaryTerm[] {
  return [...GLOSSARY_TERMS].sort((a, b) =>
    a.term.localeCompare(b.term, undefined, { sensitivity: "base" }),
  );
}
