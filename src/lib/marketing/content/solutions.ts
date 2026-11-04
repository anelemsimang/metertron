export type SolutionPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroEyebrow: string;
  heroHeadline: string;
  heroSubhead: string;
  painPoints: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  featuresUsed: string[];
  roi: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const SOLUTIONS: SolutionPage[] = [
  {
    slug: "meter-installation-contractors",
    title: "Meter installation contractors",
    metaTitle: "Software for meter installation contractors | Metertron",
    metaDescription:
      "End-to-end capture, review, and municipal export for water meter installation contractors in South Africa. One plan, 7-day trial.",
    primaryKeyword: "meter installation contractor software",
    secondaryKeywords: ["water meter contractor app", "install tracking", "municipal submission contractor", "field to export"],
    heroEyebrow: "Contractors",
    heroHeadline: "Run meter installs from dispatch to municipal Excel",
    heroSubhead:
      "Metertron gives installation contractors one system for field capture, office review, stock, and client exports — without per-seat licence games.",
    painPoints: [
      {
        title: "Double capture kills margin",
        body: "Installers write job cards; office staff re-type into spreadsheets. Every transcription hour erodes a fixed-price install rate.",
      },
      {
        title: "Rejections arrive too late",
        body: "Municipal batches bounce for missing seals or wrong status codes — after you thought the week was closed.",
      },
      {
        title: "Evidence lives on personal phones",
        body: "Photos in WhatsApp galleries do not survive staff turnover or prove who took what on audit day.",
      },
      {
        title: "Scaling teams means scaling chaos",
        body: "Adding installers without roles, work orders, and review queues multiplies errors faster than revenue.",
      },
    ],
    steps: [
      {
        title: "Dispatch work orders",
        body: "Load programme accounts and assign routes so field teams know exactly which stands to hit.",
      },
      {
        title: "Capture and sync in the field",
        body: "Installers complete meter-change forms offline with photos and GPS; data syncs to your organisation.",
      },
      {
        title: "Review, export, get paid",
        body: "Office approves jobs, generates municipal templates, and hands clients clean batches that match your scorecard.",
      },
    ],
    featuresUsed: [
      "field-capture-app",
      "offline-mode",
      "photo-evidence-gps",
      "review-approval-workflow",
      "municipal-export-templates",
      "job-scheduling",
      "team-roles-permissions",
    ],
    roi: [
      "Cut office re-keying after every route day",
      "Fewer municipal rejections from enforced evidence and review",
      "One subscription (~R1 490/mo excl. VAT) covers unlimited installers on programme peaks",
      "7-day trial proves the workflow on a live suburb before you commit",
    ],
    faqs: [
      {
        q: "Is Metertron only for large contractors?",
        a: "No. Single-team subcontractors and multi-province groups use the same plan — sized for SA meter programmes, not enterprise IT projects.",
      },
      {
        q: "Can we run multiple municipal clients?",
        a: "Yes. Configure separate export templates and forms per client inside one organisation.",
      },
      {
        q: "Do we need IT to deploy?",
        a: "Field teams use mobile browsers; office staff use the web console. Invite users by email and start capturing.",
      },
      {
        q: "How does billing work after trial?",
        a: "Subscribe monthly at about R1 490 excl. VAT or pay annually as twelve monthly instalments. Prices exclude 15% VAT.",
      },
      {
        q: "Can we integrate with our ERP?",
        a: "API keys and webhooks push approved job data to systems you already use for finance or dispatch.",
      },
    ],
    related: ["plumbing-contractors", "meter-replacement-programmes", "municipalities"],
  },
  {
    slug: "plumbing-contractors",
    title: "Plumbing contractors",
    metaTitle: "Meter change software for plumbers | Metertron",
    metaDescription:
      "Plumbing teams doing water meter changes: structured capture, photos, and exports without generic plumbing invoicing clutter.",
    primaryKeyword: "plumber meter change software",
    secondaryKeywords: ["plumbing contractor field app", "water meter plumber", "CIU install capture", "plumber municipal export"],
    heroEyebrow: "Plumbers",
    heroHeadline: "Meter changes are not generic plumbing tickets",
    heroSubhead:
      "When your plumbing business carries municipal meter work, you need serials, readings, CIUs, and Excel submissions — not just quotes and invoices.",
    painPoints: [
      {
        title: "Generic apps miss meter fields",
        body: "Standard field service tools do not understand final readings, CIU pairing, or municipal status columns.",
      },
      {
        title: "Mixed work confuses crews",
        body: "Plumbers toggle between maintenance jobs and meter rollouts; wrong form templates cause client rejections.",
      },
      {
        title: "Office is still the bottleneck",
        body: "Even good plumbers produce bad data if photos and GPS are optional and nobody reviews before export.",
      },
    ],
    steps: [
      {
        title: "Assign meter work orders",
        body: "Separate meter-change orders from other plumbing work so crews open the correct checklist every time.",
      },
      {
        title: "Capture on site with evidence",
        body: "Record old and new serials, seals, and commissioning with photos while still on the stand.",
      },
      {
        title: "Hand municipal-ready files to the client",
        body: "Reviewers approve; export staff download the client spreadsheet layout without rebuilding it from job cards.",
      },
    ],
    featuresUsed: ["field-capture-app", "photo-evidence-gps", "review-approval-workflow", "municipal-export-templates", "job-scheduling"],
    roi: [
      "Win meter tenders with a credible digital process, not paper promises",
      "Reduce callback visits from rejections on serials and evidence",
      "Keep plumbing and meter programmes in one org with role separation",
    ],
    faqs: [
      {
        q: "We only do a few meter jobs a month — is it worth it?",
        a: "If those jobs carry municipal submission rules, one rejection week often costs more than a month of Metertron. Use the trial on your next batch.",
      },
      {
        q: "Can apprentices capture under supervision?",
        a: "Yes. Assign field roles and use review so seniors approve quality before export.",
      },
      {
        q: "Does it replace our plumbing CRM?",
        a: "Metertron focuses on meter programme capture to export. Many plumbers integrate via API or run it beside existing quoting tools.",
      },
      {
        q: "Offline for estate work?",
        a: "Yes. Offline mode supports stands with weak signal common on complex plumbing routes.",
      },
    ],
    related: ["meter-installation-contractors", "smart-prepaid-meter-rollouts", "meter-replacement-programmes"],
  },
  {
    slug: "municipalities",
    title: "Municipalities and metros",
    metaTitle: "Meter programme oversight for municipalities | Metertron",
    metaDescription:
      "Help implementing agents deliver cleaner meter-change data. Review-friendly submissions and audit trails for municipal programmes.",
    primaryKeyword: "municipal meter programme software",
    secondaryKeywords: ["metro meter rollout", "contractor submission quality", "meter data intake", "implementing agent oversight"],
    heroEyebrow: "Municipalities",
    heroHeadline: "Better submissions from contractors you already appoint",
    heroSubhead:
      "Metertron is built for contractors — but municipalities benefit when implementing agents capture once, review internally, and export to your column rules instead of improvised spreadsheets.",
    painPoints: [
      {
        title: "Inconsistent batch quality",
        body: "Each contractor uses a different layout; intake teams spend weeks normalising files before billing updates.",
      },
      {
        title: "Weak evidence chains",
        body: "Disputes on stands lack GPS, photos, or clear approval timestamps when data was re-keyed from paper.",
      },
      {
        title: "Programme visibility gaps",
        body: "You hear install counts in meetings that do not match what arrives in the submission portal.",
      },
    ],
    steps: [
      {
        title: "Share template expectations",
        body: "Provide header specs; contractors map Metertron export templates to your intake format.",
      },
      {
        title: "Require contractor-side review",
        body: "Agents approve jobs before export so your team sees QA’d rows, not raw field notes.",
      },
      {
        title: "Audit disputes with job history",
        body: "When a stand is questioned, contractors produce timelines, photos, and approver records from one system.",
      },
    ],
    featuresUsed: [
      "municipal-export-templates",
      "review-approval-workflow",
      "photo-evidence-gps",
      "audit-trail",
      "dashboards-reporting",
    ],
    roi: [
      "Lower cost per accepted row in intake",
      "Faster billing updates when serials and readings are right first time",
      "Clearer accountability from contractors on programme KPIs",
    ],
    faqs: [
      {
        q: "Does Metertron replace our asset register?",
        a: "No. It helps contractors deliver structured submissions you ingest. Your master systems remain authoritative.",
      },
      {
        q: "Can multiple contractors use different templates for one metro?",
        a: "Each organisation maintains templates aligned to your spec. Standardise the header pack you publish to all agents.",
      },
      {
        q: "Is data hosted in South Africa?",
        a: "Discuss hosting and POPIA expectations with Metertron when onboarding implementing agents.",
      },
      {
        q: "Can we get read-only visibility?",
        a: "Programme oversight is typically via contractor exports and reports. Direct municipal tenants may be arranged for larger programmes — contact hello@metertron.co.za.",
      },
      {
        q: "What about eThekwini-style layouts?",
        a: "Metertron includes an eThekwini-oriented export starting point contractors can align to your published rules.",
      },
    ],
    related: ["water-utilities", "meter-replacement-programmes", "meter-audits"],
  },
  {
    slug: "water-utilities",
    title: "Water utilities and boards",
    metaTitle: "Water utility meter programme software | Metertron",
    metaDescription:
      "Support bulk meter replacement and prepaid programmes with contractor-ready capture, review, and export for water utilities.",
    primaryKeyword: "water utility meter software",
    secondaryKeywords: ["water board meter rollout", "utility contractor management", "meter data quality", "prepaid water programme"],
    heroEyebrow: "Utilities",
    heroHeadline: "Align contractors to one meter-change standard",
    heroSubhead:
      "Water utilities running replacement or prepaid programmes need consistent job facts from many teams. Metertron gives each contractor the same discipline — without you building custom apps.",
    painPoints: [
      {
        title: "Fragmented contractor tooling",
        body: "Every agent brings spreadsheets and paper; your integration team becomes a translation service.",
      },
      {
        title: "Stock and install mismatches",
        body: "Meters issued do not match completed jobs when capture happens days later in the office.",
      },
      {
        title: "Regulatory and POPIA scrutiny",
        body: "Personal and account data on installs needs accountable handling, not ad hoc files on laptops.",
      },
    ],
    steps: [
      {
        title: "Publish your export spec",
        body: "Utilities share column rules; contractors configure Metertron templates to match.",
      },
      {
        title: "Mandate review before intake",
        body: "Programme rules require contractor QA so your validators see complete evidence.",
      },
      {
        title: "Measure throughput honestly",
        body: "Contractors report from the same job statuses you eventually receive in batches.",
      },
    ],
    featuresUsed: [
      "municipal-export-templates",
      "review-approval-workflow",
      "audit-trail",
      "api-integrations",
      "dashboards-reporting",
      "team-roles-permissions",
    ],
    roi: [
      "Shorter cycle from install to accepted master data",
      "Less integration rework when all agents speak the same export language",
      "Stronger POPIA posture via contractor org isolation and access controls",
    ],
    faqs: [
      {
        q: "Is this a customer billing system?",
        a: "Metertron is operational capture to export for install programmes, not a full CIS/billing replacement.",
      },
      {
        q: "Can utilities mandate Metertron in tenders?",
        a: "Yes. Specify export format and evidence rules; contractors subscribe independently on one transparent plan.",
      },
      {
        q: "How do webhooks help utilities?",
        a: "Contractors can push approved jobs to utility middleware if you provide endpoints — alongside Excel intake if required.",
      },
      {
        q: "Multi-province rollouts?",
        a: "Each contractor org is isolated; utilities run parallel programmes with consistent specs.",
      },
    ],
    related: ["municipalities", "smart-prepaid-meter-rollouts", "meter-replacement-programmes"],
  },
  {
    slug: "smart-prepaid-meter-rollouts",
    title: "Smart and prepaid meter rollouts",
    metaTitle: "Prepaid and smart meter rollout software | Metertron",
    metaDescription:
      "Commission prepaid and smart water meters with CIU capture, evidence, review, and municipal export for SA rollouts.",
    primaryKeyword: "prepaid meter rollout software",
    secondaryKeywords: ["smart meter installation", "CIU capture", "prepaid water programme", "commissioning meter jobs"],
    heroEyebrow: "Prepaid",
    heroHeadline: "Commission prepaid installs with the fields vending needs",
    heroSubhead:
      "Prepaid and smart rollouts fail when CIU serials, commissioning status, and meter categories are wrong. Metertron forms and review catch those before export.",
    painPoints: [
      {
        title: "CIU pairing errors block customers",
        body: "One wrong serial means tokens fail — and your helpdesk pays the price.",
      },
      {
        title: "Commissioning proof is scattered",
        body: "Test vend outcomes and photos live outside the job record if capture is free-text.",
      },
      {
        title: "High volume magnifies mistakes",
        body: "A one percent error rate on ten thousand installs is a hundred angry account holders.",
      },
    ],
    steps: [
      {
        title: "Configure prepaid forms",
        body: "Include CIU, radio, tariff, and commissioning fields your client mandates on every install.",
      },
      {
        title: "Capture evidence on commission",
        body: "Photos and GPS tie the installed unit to the account before the CIU leaves the box.",
      },
      {
        title: "Review then export to vending intake",
        body: "Approvers validate serials and status; export batches feed municipal or utility spreadsheets for master updates.",
      },
    ],
    featuresUsed: [
      "field-capture-app",
      "photo-evidence-gps",
      "review-approval-workflow",
      "municipal-export-templates",
      "offline-mode",
      "job-scheduling",
    ],
    roi: [
      "Fewer vending failures and customer callbacks from serial mismatches",
      "Higher first-time-right on high-volume prepaid waves",
      "Offline capture keeps rollout velocity in low-signal areas",
    ],
    faqs: [
      {
        q: "Does Metertron talk to vending systems directly?",
        a: "Primary delivery is structured job data and Excel export. Use API integrations where your vending team provides endpoints.",
      },
      {
        q: "Can we track CIU stock?",
        a: "Office stock tools align issues with completed jobs so variances show before programme close.",
      },
      {
        q: "Smart meter specific fields?",
        a: "Form templates are configurable — add AMI identifiers, signal tests, or client codes your programme requires.",
      },
      {
        q: "Trial on a pilot ward?",
        a: "Use the 7-day trial on a controlled pilot before the main prepaid wave.",
      },
      {
        q: "Annual billing for programme length?",
        a: "Annual subscription equals twelve monthly payments at the same ex-VAT rate — predictable for multi-month rollouts.",
      },
    ],
    related: ["meter-replacement-programmes", "meter-installation-contractors", "water-utilities"],
  },
  {
    slug: "meter-replacement-programmes",
    title: "Meter replacement programmes",
    metaTitle: "Bulk meter replacement programme software | Metertron",
    metaDescription:
      "Manage bulk water meter replacement programmes — work orders, field capture, review, and exports at programme scale.",
    primaryKeyword: "meter replacement programme software",
    secondaryKeywords: ["bulk meter change", "meter rollout management", "replacement wave planning", "programme export"],
    heroEyebrow: "Programmes",
    heroHeadline: "Keep replacement waves on rhythm",
    heroSubhead:
      "Large replacement programmes drown in paper when waves overlap. Metertron ties dispatch, capture, review, and export so each wave closes before the next lands.",
    painPoints: [
      {
        title: "Wave handover gaps",
        body: "Week four teams inherit half-captured jobs from week three with no single status view.",
      },
      {
        title: "Export deadlines stack",
        body: "Multiple suburbs due for submission on the same Friday with different templates.",
      },
      {
        title: "Scorecard surprises",
        body: "Client KPIs drop because rejections were hidden in individual installers’ notebooks.",
      },
    ],
    steps: [
      {
        title: "Plan work orders by wave",
        body: "Load each suburb or zone as assignable orders with due dates your office can track.",
      },
      {
        title: "Execute with offline-capable teams",
        body: "Field crews capture consistently; sync clears backlog daily at the depot.",
      },
      {
        title: "Close waves with approved exports",
        body: "Reviewers zero the queue; export staff pull template-specific batches per client deadline.",
      },
    ],
    featuresUsed: [
      "job-scheduling",
      "field-capture-app",
      "offline-mode",
      "review-approval-workflow",
      "municipal-export-templates",
      "dashboards-reporting",
      "audit-trail",
    ],
    roi: [
      "Predictable weekly export rhythm across overlapping waves",
      "Dashboards expose backlog before client scorecards do",
      "Unlimited seats let you surge teams without new licences each wave",
    ],
    faqs: [
      {
        q: "Can we pause between programme phases?",
        a: "Yes. Subscription is monthly; historical jobs remain for audits when you scale down between phases.",
      },
      {
        q: "How do we handle conventional vs prepaid in one programme?",
        a: "Use different form templates on work orders so crews see the right fields per meter type.",
      },
      {
        q: "Bulk import stands from client files?",
        a: "Use office tooling and API integrations to seed work orders from programme spreadsheets.",
      },
      {
        q: "Reporting for programme managers?",
        a: "Office dashboards and reports show approved counts and open rejections aligned to export data.",
      },
    ],
    related: ["meter-installation-contractors", "municipalities", "smart-prepaid-meter-rollouts"],
  },
  {
    slug: "meter-audits",
    title: "Meter audits and verification",
    metaTitle: "Meter audit and verification capture | Metertron",
    metaDescription:
      "Support meter audit programmes with photo evidence, GPS, structured findings, and auditable history for South African utilities.",
    primaryKeyword: "meter audit software",
    secondaryKeywords: ["meter verification field capture", "audit trail meters", "inspection evidence GPS", "meter audit export"],
    heroEyebrow: "Audits",
    heroHeadline: "Audit findings that hold up after the team leaves site",
    heroSubhead:
      "Verification and audit programmes need structured findings, photos, and location — not handwritten notes scanned later. Metertron captures audit-grade records in the field.",
    painPoints: [
      {
        title: "Findings without evidence",
        body: "Auditors note tampering or bypass but lack photos tied to account and serial context.",
      },
      {
        title: "Disputes lack timestamps",
        body: "Without audit trails, contractors and customers challenge when an inspection occurred and who signed it off.",
      },
      {
        title: "Slow reporting to clients",
        body: "Audit summaries rebuilt in Excel delay enforcement and billing corrections.",
      },
    ],
    steps: [
      {
        title: "Define audit forms",
        body: "Configure checklists for condition codes, readings, and anomalies your client expects.",
      },
      {
        title: "Capture on site with GPS and photos",
        body: "Document meter state, seals, and stand context while inspectors are at the erf.",
      },
      {
        title: "Review and export findings",
        body: "Office validates records and exports batches or pushes via API to client case systems.",
      },
    ],
    featuresUsed: [
      "field-capture-app",
      "photo-evidence-gps",
      "review-approval-workflow",
      "audit-trail",
      "municipal-export-templates",
      "api-integrations",
    ],
    roi: [
      "Faster turnaround from inspection to client action file",
      "Defensible evidence reduces contested findings",
      "Same platform as install programmes if you run mixed contracts",
    ],
    faqs: [
      {
        q: "Is Metertron only for new installs?",
        a: "No. Configurable forms support audit and verification workflows alongside change-outs.",
      },
      {
        q: "Can auditors work offline?",
        a: "Yes. Offline mode suits complexes and rural areas where audit routes lack signal.",
      },
      {
        q: "Who can see audit photos?",
        a: "Org roles restrict access; personal data handling stays under your POPIA policies.",
      },
      {
        q: "Export format for audit batches?",
        a: "Map findings to client templates the same way install exports work — one mapping per intake spec.",
      },
      {
        q: "Trial for a short audit contract?",
        a: "Seven-day full trial covers short programmes; monthly billing fits seasonal audit work.",
      },
    ],
    related: ["municipalities", "photo-evidence-gps", "audit-trail", "water-utilities"],
  },
];

export function getSolution(slug: string): SolutionPage | null {
  return SOLUTIONS.find((row) => row.slug === slug) ?? null;
}

export function allSolutions(): SolutionPage[] {
  return SOLUTIONS;
}
