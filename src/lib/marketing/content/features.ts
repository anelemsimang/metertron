export type FeaturePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  benefits: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  useCase: { title: string; body: string };
  faqs: { q: string; a: string }[];
  related: string[];
};

export const FEATURES: FeaturePage[] = [
  {
    slug: "field-capture-app",
    title: "Field capture app",
    metaTitle: "Water meter field capture app | Metertron",
    metaDescription:
      "Mobile field capture for water meter installs — structured forms, serials, readings, and sync to your office. Built for South African contractors.",
    primaryKeyword: "water meter field capture app",
    secondaryKeywords: ["meter installation app", "field data capture", "mobile meter forms", "contractor field app"],
    heroEyebrow: "Field",
    heroHeadline: "Capture every install once, correctly, on site",
    heroSubhead:
      "Metertron’s field app guides installers through your meter-change forms — serials, readings, seals, and commissioning — then sends completed jobs to review without retyping.",
    benefits: [
      {
        title: "Forms that match how you work",
        body: "Use configurable meter-change templates so installers see only the fields your client requires — account numbers, meter categories, CIU details, and status codes in one flow.",
      },
      {
        title: "Less admin between site and office",
        body: "Data typed in the field lands in the same job record your reviewers and export staff use. No parallel WhatsApp threads or duplicate spreadsheets.",
      },
      {
        title: "Built for meter programmes, not generic tickets",
        body: "Stock links, photo slots, GPS, and municipal export fields are first-class — not bolted onto a generic job ticket.",
      },
      {
        title: "Visible sync status",
        body: "Installers and office staff see what is saved locally, uploaded, or waiting on review so nothing disappears in a dead zone.",
      },
    ],
    steps: [
      {
        title: "Open the assigned job",
        body: "Pick a work order or start a job from your queue. Location and client context travel with the record.",
      },
      {
        title: "Complete the guided form",
        body: "Fill readings, scan or type serials, attach required photos, and confirm commissioning steps before submit.",
      },
      {
        title: "Submit for review",
        body: "The job syncs to your organisation’s review queue. Fix rejections in the field app with clear reasons from office staff.",
      },
    ],
    useCase: {
      title: "Subcontractor teams on municipal routes",
      body: "A supervisor assigns daily routes via work orders. Each installer completes the same meter-change form on phone or tablet. Office reviewers approve batches before export — no one re-keys job cards at month-end.",
    },
    faqs: [
      {
        q: "Do I need a separate app per municipality?",
        a: "No. Your organisation configures forms and export templates per client inside one Metertron account. Installers use the forms you assign to their work.",
      },
      {
        q: "Does the field app work on Android and iPhone?",
        a: "Yes. Use a modern mobile browser — Metertron is built as a progressive web experience suited to field use.",
      },
      {
        q: "Can we enforce required photos before submit?",
        a: "Yes. Form rules and review checks help ensure evidence is captured before a job is treated as complete.",
      },
      {
        q: "Is there a limit on installers?",
        a: "Metertron’s single plan does not cap seats or installs. Add team members and invite them to your organisation.",
      },
      {
        q: "How does the trial work?",
        a: "Start a 7-day trial with full product access. After trial, subscribe at about R1 490 per month excl. VAT, or pay annually as twelve monthly instalments.",
      },
    ],
    related: ["offline-mode", "photo-evidence-gps", "review-approval-workflow", "job-scheduling"],
  },
  {
    slug: "offline-mode",
    title: "Offline mode",
    metaTitle: "Offline meter capture for field teams | Metertron",
    metaDescription:
      "Capture water meter installs without signal. Offline-first field sync for South African townships, estates, and rural routes.",
    primaryKeyword: "offline meter installation app",
    secondaryKeywords: ["offline field data capture", "sync when online", "no signal meter jobs", "PWA field app"],
    heroEyebrow: "Offline-first",
    heroHeadline: "Keep working when the network drops",
    heroSubhead:
      "Save jobs and photos on device in dead zones. Metertron syncs automatically when connectivity returns — so installers are not blocked by patchy mobile coverage.",
    benefits: [
      {
        title: "No lost installs in low-coverage areas",
        body: "Townships, basements, and remote stands often have unreliable signal. Offline capture lets teams finish the form and evidence on site.",
      },
      {
        title: "Clear sync indicators",
        body: "Installers see pending uploads; office staff see what has arrived. Fewer ‘I submitted but you did not get it’ disputes.",
      },
      {
        title: "Photos queued safely",
        body: "Evidence images stay with the job record locally until upload completes, tied to the same job ID as the form data.",
      },
      {
        title: "Same forms online or off",
        body: "Validation and required fields behave consistently — installers are not tempted to skip steps because they are offline.",
      },
    ],
    steps: [
      {
        title: "Load jobs while you have signal",
        body: "Open assigned work orders before heading into poor-coverage areas so job context is on device.",
      },
      {
        title: "Capture offline on site",
        body: "Complete readings, serials, and photos. Metertron stores drafts locally until sync runs.",
      },
      {
        title: "Sync when back online",
        body: "On mobile data or Wi‑Fi, pending jobs upload to your organisation. Review and export proceed as usual.",
      },
    ],
    useCase: {
      title: "Estate and informal-settlement rollouts",
      body: "Teams work streets with intermittent coverage. Installers complete five jobs offline during the morning run; sync completes at lunch from the yard. Reviewers still receive structured records — not paper cards transcribed later.",
    },
    faqs: [
      {
        q: "How much can I store offline?",
        a: "Storage depends on device browser limits. For typical meter jobs with a handful of photos, teams run full days offline before clearing pending uploads.",
      },
      {
        q: "What if two people edit the same job?",
        a: "Your organisation should assign one installer per open job. If conflicts occur, office staff can see audit history and reconcile with your process.",
      },
      {
        q: "Do I need to install an app from the store?",
        a: "Metertron runs in the browser with offline-capable behaviour — no separate app store deployment required for your teams.",
      },
      {
        q: "Does offline affect GPS?",
        a: "GPS capture uses device location when available. If coordinates are missing offline, your process may require a photo of the stand or manual location notes.",
      },
      {
        q: "Is offline included in the standard plan?",
        a: "Yes. Offline field capture is part of full Metertron access — one plan, about R1 490 per month excl. VAT, with a 7-day trial to prove it on your routes.",
      },
    ],
    related: ["field-capture-app", "photo-evidence-gps", "audit-trail", "review-approval-workflow"],
  },
  {
    slug: "photo-evidence-gps",
    title: "Photo evidence and GPS",
    metaTitle: "Meter install photo evidence and GPS | Metertron",
    metaDescription:
      "Attach timestamped photos and GPS to water meter jobs. Defensible evidence for municipalities and internal QA.",
    primaryKeyword: "meter installation photo evidence",
    secondaryKeywords: ["GPS meter install", "proof of installation", "meter change photos", "field evidence capture"],
    heroEyebrow: "Evidence",
    heroHeadline: "Photos and location that stand up to review",
    heroSubhead:
      "Capture meter, seal, and stand evidence with GPS where available. Office reviewers and municipal clients get a consistent evidence pack per job.",
    benefits: [
      {
        title: "Required shots enforced in the field",
        body: "Form design can prompt for old meter, new meter, seal, and stand photos so installers do not discover missing evidence at export time.",
      },
      {
        title: "Org-scoped photo storage",
        body: "Images stay inside your tenant — linked to jobs your team owns, not scattered across personal camera rolls.",
      },
      {
        title: "GPS for dispute resolution",
        body: "Coordinates help prove the team was at the correct erf or stand when clients challenge location or duplicate accounts.",
      },
      {
        title: "Review before export",
        body: "Approvers see evidence alongside form data in one queue, reducing back-and-forth with installers.",
      },
    ],
    steps: [
      {
        title: "Snap evidence in the capture flow",
        body: "Take photos inside the job wizard so they attach to the correct field and serial context.",
      },
      {
        title: "Confirm location",
        body: "Allow GPS capture on submit or use your organisation’s rules for when coordinates are mandatory.",
      },
      {
        title: "Reviewer checks the pack",
        body: "Office staff approve or reject with reasons. Installers add missing shots before the job enters an export batch.",
      },
    ],
    useCase: {
      title: "Municipal rejection recovery",
      body: "A batch comes back because seal photos were unclear. Reviewers filter rejected jobs, see the exact photo slots, and send installers back with targeted fixes — instead of redoing entire spreadsheets.",
    },
    faqs: [
      {
        q: "Are photos compressed on upload?",
        a: "Images are processed for practical upload from the field while keeping enough detail for municipal review. Exact handling may evolve; evidence remains tied to each job.",
      },
      {
        q: "Can we download photos for a client audit?",
        a: "Office workflows focus on job records and exports. For formal audits, use your organisation’s export and reporting practices with Metertron job history.",
      },
      {
        q: "Does GPS work indoors?",
        a: "Accuracy varies. Many teams combine GPS with account numbers, stand photos, and address fields captured on the form.",
      },
      {
        q: "Is photo storage POPIA-aware?",
        a: "Metertron is designed with South African privacy expectations in mind — org isolation, access controls, and audit-friendly history. Your organisation remains responsible for lawful processing of personal information on jobs.",
      },
      {
        q: "How many photos per job?",
        a: "Your form template defines required and optional slots. Meter programmes often need four to eight images per change.",
      },
    ],
    related: ["field-capture-app", "review-approval-workflow", "audit-trail", "municipal-export-templates"],
  },
  {
    slug: "review-approval-workflow",
    title: "Review and approval workflow",
    metaTitle: "Meter job review queue | Metertron",
    metaDescription:
      "Office review queue for water meter installs — approve, reject with reasons, and feed municipal exports from clean data.",
    primaryKeyword: "meter installation review queue",
    secondaryKeywords: ["job approval workflow", "field job QA", "reject reasons installer", "office review meters"],
    heroEyebrow: "Office",
    heroHeadline: "Approve jobs before they hit the client spreadsheet",
    heroSubhead:
      "A dedicated review queue lets coordinators check completeness, evidence, and readings — then approve jobs into export-ready status or send them back with clear reject reasons.",
    benefits: [
      {
        title: "Stop bad rows at the door",
        body: "Catch missing serials, impossible readings, and absent photos before they become municipal rejections.",
      },
      {
        title: "Reject with context",
        body: "Installers see why a job failed review and fix it in the field app instead of guessing from a phone call.",
      },
      {
        title: "Separation of duties",
        body: "Field staff capture; office staff approve. Roles and permissions keep exports in trusted hands.",
      },
      {
        title: "Faster month-end batches",
        body: "Approved jobs map cleanly to export templates — less firefighting when submission deadlines loom.",
      },
      {
        title: "Audit-friendly decisions",
        body: "Review outcomes sit on the job timeline so you can explain who approved what and when.",
      },
    ],
    steps: [
      {
        title: "Jobs arrive from the field",
        body: "Submitted installs land in the review queue with form data, photos, and sync metadata.",
      },
      {
        title: "Coordinator validates",
        body: "Check readings, serials, client rules, and evidence. Approve or reject with a reason installers will understand.",
      },
      {
        title: "Approved jobs export",
        body: "Only vetted records flow into municipal Excel templates and reporting — protecting your scorecard with the client.",
      },
    ],
    useCase: {
      title: "High-volume prepaid rollout",
      body: "Two office reviewers process three hundred jobs per week. They reject twelve percent for fixable issues — wrong CIU serial, blurry seal photo — installers same-day resubmit. Accepted exports go out Friday without a weekend re-keying session.",
    },
    faqs: [
      {
        q: "Can multiple reviewers work the same queue?",
        a: "Yes. Team roles let you assign office staff who can review while admins manage templates and exports.",
      },
      {
        q: "Can we skip review for trusted teams?",
        a: "Your process should define when auto-approval is acceptable. Most municipal contracts expect human QA before submission.",
      },
      {
        q: "Do rejected jobs stay in history?",
        a: "Yes. Job history and audit trails retain submissions and outcomes for later disputes.",
      },
      {
        q: "Does review work with offline capture?",
        a: "Jobs appear in review after sync completes. Office staff see the same record installers submitted once online.",
      },
      {
        q: "Is the review queue included in trial?",
        a: "Full access during the 7-day trial includes review, exports, and team features on the single Metertron plan.",
      },
    ],
    related: ["municipal-export-templates", "team-roles-permissions", "dashboards-reporting", "audit-trail"],
  },
  {
    slug: "municipal-export-templates",
    title: "Municipal export templates",
    metaTitle: "Municipal Excel export templates | Metertron",
    metaDescription:
      "Map meter job data to municipality Excel layouts — including eThekwini-ready templates. One capture, many client formats.",
    primaryKeyword: "municipal meter export template",
    secondaryKeywords: ["Excel meter submission", "eThekwini export", "meter change spreadsheet", "utility data export"],
    heroEyebrow: "Exports",
    heroHeadline: "From field form to municipality columns — without retyping",
    heroSubhead:
      "Export templates translate approved jobs into the Excel layouts your clients expect. Clone, adjust, and version templates as municipal specs change.",
    benefits: [
      {
        title: "Column mapping you control",
        body: "Map internal fields — account, old and new serials, readings, status — to fixed header rows per client.",
      },
      {
        title: "eThekwini-oriented starting point",
        body: "Ship with a practical template aligned to common eThekwini-style submissions; adapt it inside your organisation.",
      },
      {
        title: "Export after review",
        body: "Only approved jobs enter batches, so spreadsheets reflect QA’d data.",
      },
      {
        title: "Fewer transcription errors",
        body: "Eliminate the office step where someone copies from paper or PDFs into client files.",
      },
    ],
    steps: [
      {
        title: "Configure the template",
        body: "Define headers, cell mappings, and any client-specific status values for each municipality or agent.",
      },
      {
        title: "Approve jobs in review",
        body: "Build export batches from jobs that passed your checks.",
      },
      {
        title: "Download and submit",
        body: "Generate the Excel file and send through your client’s intake channel — portal, email, or SFTP per contract.",
      },
    ],
    useCase: {
      title: "Multi-client contractor",
      body: "One organisation serves eThekwini routes and two smaller municipalities. Each client has its own export template; field capture stays standard. Export staff pick the client template and date range — no separate workbook maintenance in Excel.",
    },
    faqs: [
      {
        q: "Can we have multiple templates per organisation?",
        a: "Yes. Maintain templates per client or programme and select the right one at export time.",
      },
      {
        q: "What if the municipality changes headers?",
        a: "Update the template version in Metertron and test a small batch before mass export.",
      },
      {
        q: "Do exports include photos?",
        a: "Primary municipal intake is usually Excel. Photos remain on job records for review and audit; attach separately if your client requires a photo pack.",
      },
      {
        q: "Can exports be automated via API?",
        a: "Use API keys and webhooks to integrate with your back office; many teams still download Excel for direct municipal upload.",
      },
      {
        q: "Is template editing admin-only?",
        a: "Role permissions restrict who can change mappings — typically office admins, not field installers.",
      },
    ],
    related: ["review-approval-workflow", "dashboards-reporting", "api-integrations", "field-capture-app"],
  },
  {
    slug: "dashboards-reporting",
    title: "Dashboards and reporting",
    metaTitle: "Meter programme dashboards and reports | Metertron",
    metaDescription:
      "Track installs, review backlog, and export readiness for water meter programmes. Operational visibility for contractors and utilities.",
    primaryKeyword: "meter installation reporting",
    secondaryKeywords: ["install dashboard", "review backlog", "meter programme KPIs", "contractor reporting"],
    heroEyebrow: "Visibility",
    heroHeadline: "See backlog, throughput, and export readiness",
    heroSubhead:
      "Office dashboards summarise jobs in review, approved for export, and field activity — so managers are not building pivot tables from raw exports every Monday.",
    benefits: [
      {
        title: "Review backlog at a glance",
        body: "Know how many jobs wait on approvers before client deadlines slip.",
      },
      {
        title: "Programme progress",
        body: "Track completed and approved installs against work orders and routes for internal scorecards.",
      },
      {
        title: "Stock and job alignment",
        body: "Pair reporting with stock movements so variances surface before auditors do.",
      },
      {
        title: "Downloadable reports",
        body: "Generate spreadsheets for management and client meetings from the same data that feeds municipal exports.",
      },
    ],
    steps: [
      {
        title: "Field and office capture data",
        body: "Every approved path — capture, review, export — feeds the same job facts.",
      },
      {
        title: "Open office overview",
        body: "Managers see queues, statuses, and recent activity scoped to their organisation.",
      },
      {
        title: "Act before deadlines",
        body: "Shift reviewers, chase rejections, or prioritise export batches using live counts.",
      },
    ],
    useCase: {
      title: "Weekly client stand-up",
      body: "The operations lead pulls approved install counts and open rejections before a call with the municipal programme manager. Numbers match the export file sent Friday — one source of truth.",
    },
    faqs: [
      {
        q: "Can I filter by date or team?",
        a: "Use office views and reports aligned to job dates, statuses, and assignments available in your organisation.",
      },
      {
        q: "Do dashboards replace municipal exports?",
        a: "No. Dashboards are for internal control; client submission still uses configured export templates.",
      },
      {
        q: "Are reports real-time?",
        a: "Counts reflect synced field data and review decisions as they land in your tenant.",
      },
      {
        q: "Can platform admins see my stats?",
        a: "Metertron is multi-tenant with org isolation. Platform support access is separate and auditable when enabled.",
      },
      {
        q: "Is reporting in the trial?",
        a: "Yes — trial includes the same office visibility as the paid plan.",
      },
    ],
    related: ["review-approval-workflow", "municipal-export-templates", "job-scheduling", "audit-trail"],
  },
  {
    slug: "team-roles-permissions",
    title: "Team roles and permissions",
    metaTitle: "Team roles for meter contractors | Metertron",
    metaDescription:
      "Invite field and office staff with roles — installers, reviewers, admins. Multi-tenant org isolation for South African contractors.",
    primaryKeyword: "meter contractor team permissions",
    secondaryKeywords: ["field team roles", "org invites", "reviewer access", "multi-tenant SaaS"],
    heroEyebrow: "Team",
    heroHeadline: "Right access for installers, reviewers, and admins",
    heroSubhead:
      "Invite your organisation, assign roles, and keep municipal templates and exports out of installers’ hands — without paying per seat.",
    benefits: [
      {
        title: "No per-seat pricing",
        body: "Add field and office users on one plan — about R1 490 per month excl. VAT — so you scale teams without licence maths.",
      },
      {
        title: "Role-based office control",
        body: "Separate who captures, who approves, and who changes export templates or billing.",
      },
      {
        title: "Org switcher for groups",
        body: "Users in multiple organisations switch context safely without mixing client data.",
      },
      {
        title: "Invite and onboard quickly",
        body: "Email invites get new starters into the field app or review queue in minutes.",
      },
    ],
    steps: [
      {
        title: "Admin invites members",
        body: "Send invites from office settings with the appropriate role for each person.",
      },
      {
        title: "Members accept and sign in",
        body: "Installers land in field work orders; office staff see review and export tools.",
      },
      {
        title: "Adjust as programmes change",
        body: "Promote reviewers, rotate admins, or deactivate leavers without losing job history.",
      },
    ],
    useCase: {
      title: "Growing subcontractor pool",
      body: "Peak rollout adds twenty temporary installers. Admin invites them as field users only. When the programme ends, deactivate accounts — completed jobs and audit history remain for the client file.",
    },
    faqs: [
      {
        q: "What roles are available?",
        a: "Typical roles cover field capture, office review, and organisation administration — aligned to how meter contractors split duties.",
      },
      {
        q: "Can one person be in two organisations?",
        a: "Yes. Consultants and group companies use org switch without duplicating logins.",
      },
      {
        q: "Is two-factor authentication supported?",
        a: "Metertron supports TOTP for accounts that need stronger sign-in.",
      },
      {
        q: "Who can see billing?",
        a: "Billing and subscription management stay with org admins, separate from field access.",
      },
      {
        q: "Does POPIA affect team setup?",
        a: "Assign access on least-privilege principles. Your organisation controls who sees customer and account data on jobs.",
      },
    ],
    related: ["review-approval-workflow", "audit-trail", "api-integrations", "field-capture-app"],
  },
  {
    slug: "job-scheduling",
    title: "Job scheduling and work orders",
    metaTitle: "Meter work orders and scheduling | Metertron",
    metaDescription:
      "Dispatch meter installation work orders to field teams. Link capture, stock, review, and export to assigned jobs.",
    primaryKeyword: "meter installation work orders",
    secondaryKeywords: ["dispatch meter jobs", "field work orders", "meter route planning", "assign installers"],
    heroEyebrow: "Dispatch",
    heroHeadline: "Assign work orders that field teams can actually close",
    heroSubhead:
      "Create and assign work orders with location and scope so installers open the right job in the field app — tied through capture, review, and export.",
    benefits: [
      {
        title: "Clear assignment",
        body: "Installers see their queue instead of hunting WhatsApp lists for account numbers.",
      },
      {
        title: "Traceability end to end",
        body: "Work orders link dispatch to completed, reviewed, and exported jobs for client proof.",
      },
      {
        title: "Stock alignment",
        body: "Issue meters and CIUs against programmes so consumption matches completed work.",
      },
      {
        title: "Prioritise hot lists",
        body: "Office staff reorder or assign urgent reconnections and complaint jobs ahead of bulk rollout rows.",
      },
    ],
    steps: [
      {
        title: "Create work orders",
        body: "Load accounts, stands, or batch imports from your programme data into assignable jobs.",
      },
      {
        title: "Assign to teams",
        body: "Field users pull assigned orders on mobile; supervisors track open versus complete.",
      },
      {
        title: "Close through review",
        body: "Completed captures on a work order move to review and export like any other job.",
      },
    ],
    useCase: {
      title: "Weekly route packs",
      body: "Monday morning, dispatch loads five work orders per team for a suburb. Installers work offline through the day. Tuesday review clears the pack; Wednesday export hits the municipal portal.",
    },
    faqs: [
      {
        q: "Can work orders be bulk imported?",
        a: "Use office tools and API integrations to load batches from your programme spreadsheets or client files.",
      },
      {
        q: "What if an installer starts the wrong job?",
        a: "Roles and assignment reduce mix-ups; job history shows who captured on which work order.",
      },
      {
        q: "Do work orders support prepaid and conventional?",
        a: "Yes — form templates on each order reflect meter type and client rules.",
      },
      {
        q: "Can we schedule by due date?",
        a: "Work orders carry scheduling metadata your office uses to prioritise field queues.",
      },
      {
        q: "Is scheduling included in one plan?",
        a: "Work orders, field capture, review, and exports are all included — no module upsell.",
      },
    ],
    related: ["field-capture-app", "dashboards-reporting", "review-approval-workflow", "offline-mode"],
  },
  {
    slug: "api-integrations",
    title: "API keys and webhooks",
    metaTitle: "Metertron API and webhooks | Metertron",
    metaDescription:
      "Integrate meter job data with your ERP or dispatch system. Org-scoped API keys and webhooks for South African contractors.",
    primaryKeyword: "meter installation API integration",
    secondaryKeywords: ["webhooks meter jobs", "field service API", "ERP meter data", "API keys SaaS"],
    heroEyebrow: "Integrations",
    heroHeadline: "Connect Metertron to your back office",
    heroSubhead:
      "Use org-scoped API keys and webhooks to push approved jobs, react to events, and reduce double entry between Metertron and your other systems.",
    benefits: [
      {
        title: "Org-scoped credentials",
        body: "Keys belong to your tenant — rotate them from office settings without affecting other customers on the platform.",
      },
      {
        title: "Event-driven webhooks",
        body: "Notify your systems when jobs sync, pass review, or reach statuses your integration cares about.",
      },
      {
        title: "Rate limits that protect uptime",
        body: "Sensible limits keep bulk exports and integrations from overwhelming your org or neighbours on multi-tenant infrastructure.",
      },
      {
        title: "Complement, not replace, exports",
        body: "Keep municipal Excel where the client requires it; use the API for internal BI, billing, or master data updates.",
      },
    ],
    steps: [
      {
        title: "Create an API key",
        body: "An org admin generates a key with the access your integration needs.",
      },
      {
        title: "Register webhooks",
        body: "Point HTTPS endpoints at your service to receive job lifecycle events.",
      },
      {
        title: "Sync approved facts",
        body: "Pull or receive job payloads after review so downstream systems trust the data.",
      },
    ],
    useCase: {
      title: "Billing on accepted installs",
      body: "When jobs approve, a webhook triggers the finance system to raise contractor invoices per municipal acceptance rules — while the Excel batch still goes to the client portal.",
    },
    faqs: [
      {
        q: "Is the API available on trial?",
        a: "Trial orgs can test integrations within trial limits; production volumes apply on subscription.",
      },
      {
        q: "What authentication is used?",
        a: "API keys sent on requests per Metertron API documentation — keep keys secret like passwords.",
      },
      {
        q: "Can we read work orders via API?",
        a: "Public API surfaces focus on operational job data your organisation owns; see docs for current endpoints.",
      },
      {
        q: "Are webhooks retried?",
        a: "Failed deliveries should be handled with retries and idempotency on your endpoint; monitor logs in your integration.",
      },
      {
        q: "Does API access cost extra?",
        a: "API keys and webhooks are included in the single Metertron plan.",
      },
    ],
    related: ["municipal-export-templates", "audit-trail", "team-roles-permissions", "dashboards-reporting"],
  },
  {
    slug: "audit-trail",
    title: "Audit trail",
    metaTitle: "Meter job audit trail | Metertron",
    metaDescription:
      "Auditable history for water meter jobs — submissions, review decisions, and changes. POPIA-aware multi-tenant controls.",
    primaryKeyword: "meter installation audit trail",
    secondaryKeywords: ["job history", "compliance meter data", "POPIA field data", "who approved meter job"],
    heroEyebrow: "Compliance",
    heroHeadline: "History that answers ‘who changed what, when?’",
    heroSubhead:
      "Job timelines capture submissions, review outcomes, and key changes — so disputes with municipalities or internal auditors do not depend on memory.",
    benefits: [
      {
        title: "Defensible approvals",
        body: "See which reviewer approved a job before it entered a client export batch.",
      },
      {
        title: "Rejection paper trail",
        body: "Reject reasons and resubmissions show improvement loops, not hidden rework.",
      },
      {
        title: "Multi-tenant isolation",
        body: "Audit data stays inside your organisation’s boundary on shared infrastructure.",
      },
      {
        title: "Supports POPIA governance",
        body: "Combine access controls, retention choices, and history to demonstrate accountable processing of personal information on installs.",
      },
    ],
    steps: [
      {
        title: "Capture and submit",
        body: "Field events stamp the job record with time and user context after sync.",
      },
      {
        title: "Review decisions logged",
        body: "Approvals and rejections append to the timeline visible to authorised office staff.",
      },
      {
        title: "Export and integrations",
        body: "Batch exports and API calls align to approved snapshots — auditors can tie spreadsheet rows back to jobs.",
      },
    ],
    useCase: {
      title: "Client dispute on a stand",
      body: "A municipality queries an install date. The contractor opens the job history, shows GPS and photo evidence, reviewer approval timestamp, and export batch ID — resolving the query without a site revisit.",
    },
    faqs: [
      {
        q: "How long is history kept?",
        a: "Retention follows your subscription and documented policies. Plan exports and archives for long municipal programmes.",
      },
      {
        q: "Can installers see audit details?",
        a: "Visibility follows role — installers see what they need to fix rejects; sensitive admin actions stay with office roles.",
      },
      {
        q: "Does platform staff access my audit log?",
        a: "Support access is separate, time-bound, and auditable when your org enables it.",
      },
      {
        q: "Is audit trail enough for POPIA compliance?",
        a: "It is one control among many — policies, contracts, and lawful basis remain your organisation’s responsibility.",
      },
      {
        q: "Can audit data be exported?",
        a: "Use job reports and API tools to extract history for formal audits alongside municipal submissions.",
      },
    ],
    related: ["review-approval-workflow", "team-roles-permissions", "photo-evidence-gps", "api-integrations"],
  },
];

export function getFeature(slug: string): FeaturePage | null {
  return FEATURES.find((row) => row.slug === slug) ?? null;
}

export function allFeatures(): FeaturePage[] {
  return FEATURES;
}
