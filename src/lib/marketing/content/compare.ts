export type CompareRow = {
  criterion: string;
  metertron: string;
  other: string;
};

export type ComparePage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubhead: string;
  otherLabel: string;
  rows: CompareRow[];
  summary: string[];
  faqs: { q: string; a: string }[];
};

export const COMPARE_PAGES: ComparePage[] = [
  {
    slug: "metertron-vs-paper-job-cards",
    title: "Metertron vs paper job cards",
    metaTitle: "Metertron vs paper job cards | Compare",
    metaDescription:
      "Compare Metertron to paper meter job cards for South African install programmes — capture, evidence, review, and municipal export.",
    heroHeadline: "Paper job cards were built for a slower programme",
    heroSubhead:
      "Cards still work for a single stand — until you need photos, GPS, review, and a municipal Excel file at scale. Metertron replaces the retyping step, not the installer’s craft.",
    otherLabel: "Paper job cards",
    rows: [
      {
        criterion: "Data entry",
        metertron: "Installers type once in structured forms; data flows to review and export.",
        other: "Office staff re-key handwriting — errors and delays at every batch.",
      },
      {
        criterion: "Photo evidence",
        metertron: "Photos attach to job fields with org storage and review.",
        other: "Prints glued to cards or photos on personal phones — easy to lose or dispute.",
      },
      {
        criterion: "GPS / location",
        metertron: "Coordinates captured with the job when device allows.",
        other: "Often missing unless manually noted; weak proof in disputes.",
      },
      {
        criterion: "Review before client submission",
        metertron: "Dedicated queue with approve/reject and reasons back to the field.",
        other: "Informal checks; bad rows discovered only when the municipality rejects the batch.",
      },
      {
        criterion: "Municipal Excel export",
        metertron: "Template maps approved jobs to client columns — no parallel workbook.",
        other: "Someone rebuilds the spreadsheet from stacks of cards under deadline pressure.",
      },
      {
        criterion: "Audit trail",
        metertron: "Timestamps for submit, review, and export on each job.",
        other: "Depends on filing cabinets and memory when a stand is questioned months later.",
      },
      {
        criterion: "Offline on site",
        metertron: "Capture offline; sync when back on network.",
        other: "Works without signal — but office still waits for physical cards to arrive.",
      },
      {
        criterion: "Cost at scale",
        metertron: "One plan (~R1 490/mo excl. VAT), unlimited seats; 7-day trial.",
        other: "Low direct cost — hidden cost in rework, rejections, and extra office hours.",
      },
    ],
    summary: [
      "Paper job cards fail quietly. Installers do solid work, but handwriting, missing photos, and late transcription show up as municipal rejections and scorecard hits — not as ‘paper problems’.",
      "Metertron keeps the familiar flow — assign work, visit the stand, record readings — while making capture digital, review explicit, and export repeatable. You still run a physical programme; you stop paying twice for every install.",
      "Teams that outgrow cards usually do not need a massive IT programme. They need one system tuned to meter changes, POPIA-aware handling, and exports their client already expects.",
    ],
    faqs: [
      {
        q: "Can we use Metertron alongside cards during transition?",
        a: "Yes. Run a pilot suburb on Metertron while other teams finish a card backlog. Avoid double capture on the same job.",
      },
      {
        q: "Will older installers cope?",
        a: "The field flow is step-by-step on a phone browser — many teams find it simpler than deciphering their own handwriting for office staff.",
      },
      {
        q: "What about wet or lost cards?",
        a: "Digital capture with offline save removes weather and transport losses — once synced, the record is in your organisation.",
      },
      {
        q: "Do municipalities accept digital origin data?",
        a: "Clients care about correct columns and evidence. Metertron produces the same Excel layouts; origin is your internal quality advantage.",
      },
      {
        q: "Is printing eliminated entirely?",
        a: "Some teams still print dispatch lists. Capture and export do not depend on paper returning to the office.",
      },
    ],
  },
  {
    slug: "metertron-vs-spreadsheets",
    title: "Metertron vs spreadsheets",
    metaTitle: "Metertron vs spreadsheets for meter installs | Compare",
    metaDescription:
      "Why water meter contractors move from shared Excel files to Metertron — field capture, review, evidence, and governed exports.",
    heroHeadline: "Spreadsheets excel at lists — not at meter programmes",
    heroSubhead:
      "Shared workbooks get meter programmes started. They break when installers paste into the wrong tab, photos sit outside the file, and nobody owns review before submission.",
    otherLabel: "Spreadsheets (Excel / Google Sheets)",
    rows: [
      {
        criterion: "Field capture",
        metertron: "Mobile forms with validation, offline support, and photo slots.",
        other: "Installers edit shared files on phones or wait until office entry — fragile and error-prone.",
      },
      {
        criterion: "Version control",
        metertron: "Single job record per install with history.",
        other: "Multiple copies (‘FINAL_v3.xlsx’) circulate; nobody knows which went to the client.",
      },
      {
        criterion: "Evidence management",
        metertron: "Photos and GPS linked to jobs inside your org.",
        other: "Image folders named by date; links break when rows move.",
      },
      {
        criterion: "Review workflow",
        metertron: "Explicit approve/reject queue with installer feedback.",
        other: "Colour coding or hidden columns — easy to bypass under pressure.",
      },
      {
        criterion: "Municipal templates",
        metertron: "Governed mappings from job fields to export columns.",
        other: "Manual copy-paste between internal and client layouts each batch.",
      },
      {
        criterion: "Multi-user access",
        metertron: "Roles for field, review, and admin — POPIA-friendly separation.",
        other: "Everyone edits everything; accidental deletes or formula breaks.",
      },
      {
        criterion: "Integrations",
        metertron: "API keys and webhooks for approved job data.",
        other: "CSV exports and manual imports — brittle and untracked.",
      },
      {
        criterion: "Total cost",
        metertron: "Predictable subscription; no seat caps on the single plan.",
        other: "‘Free’ tools — expensive in senior time fixing rows and rejections.",
      },
    ],
    summary: [
      "Spreadsheets are tempting because every office already knows Excel. The pain starts when field teams treat the workbook as a database, municipal templates diverge from internal columns, and rejections force forensic spreadsheet surgery.",
      "Metertron does not ask you to abandon Excel for the client — it generates the municipal file from approved jobs. Internal spreadsheet gymnastics disappear because capture and review happen upstream.",
      "If your programme still fits comfortably in one sheet with zero rejections, you may not need us yet. When exports weekly and evidence disputes become normal, a purpose-built meter workflow pays back quickly — test it on the 7-day trial.",
    ],
    faqs: [
      {
        q: "Can we still download Excel?",
        a: "Yes. Municipal export is Excel-oriented. Metertron replaces chaotic internal sheets, not client deliverables.",
      },
      {
        q: "What about programme planning sheets?",
        a: "Keep planning in Excel if you like. Import or assign stands via work orders and API rather than living capture in the plan file.",
      },
      {
        q: "Google Sheets on mobile?",
        a: "Sheets on phones struggle with validation, photos, and offline. Metertron targets those field gaps directly.",
      },
      {
        q: "Formulas for readings?",
        a: "Validation belongs in capture — catch impossible readings before they hit export.",
      },
      {
        q: "Migration from our current workbook?",
        a: "Map columns to export templates; run parallel on one route during trial to prove parity with your client layout.",
      },
    ],
  },
  {
    slug: "metertron-vs-generic-field-service-apps",
    title: "Metertron vs generic field service apps",
    metaTitle: "Metertron vs generic field service apps | Compare",
    metaDescription:
      "Compare purpose-built meter capture to generic field service software — municipal exports, meter forms, review, and SA pricing.",
    heroHeadline: "Generic field apps were not built for municipal meter Excel",
    heroSubhead:
      "Horizontal field service tools handle tickets and timesheets well. Meter programmes need serials, CIUs, seal photos, review queues, and client-specific export templates — on day one.",
    otherLabel: "Generic field service apps",
    rows: [
      {
        criterion: "Meter-change data model",
        metertron: "Forms and exports centred on readings, serials, CIU, seals, and status codes.",
        other: "Generic job objects; meter fields become custom fields or notes.",
      },
      {
        criterion: "Municipal export templates",
        metertron: "Built-in template mapping including eThekwini-ready starting points.",
        other: "Usually CSV/PDF job reports — you still build municipal Excel manually.",
      },
      {
        criterion: "Review queue for client QA",
        metertron: "First-class approve/reject for programme scorecards.",
        other: "Optional ‘completed’ flags without meter-specific validation.",
      },
      {
        criterion: "Offline capture",
        metertron: "Offline-first for SA coverage realities on meter routes.",
        other: "Varies by vendor; not always tuned to heavy photo + form programmes.",
      },
      {
        criterion: "Stock (meters / CIU)",
        metertron: "Office stock aligned to install programmes in the same product.",
        other: "Inventory modules often priced separately or absent.",
      },
      {
        criterion: "Pricing model",
        metertron: "Single plan ~R1 490/mo excl. VAT, unlimited seats, 7-day trial.",
        other: "Per-user or per-job pricing scales badly on large rollouts.",
      },
      {
        criterion: "API and webhooks",
        metertron: "Org-scoped keys for approved job integration.",
        other: "Available on some tiers — rarely mapped to meter export rules.",
      },
      {
        criterion: "POPIA-aware multi-tenant SaaS",
        metertron: "Designed for SA contractors with org isolation and audit history.",
        other: "Depends on vendor region and configuration; rarely meter-programme specific.",
      },
    ],
    summary: [
      "Generic field service apps win when your work looks like ‘go fix a leak’ or ‘service a geyser’. Meter replacement contracts look like structured data programmes with photographic evidence and spreadsheet SLAs — a different problem.",
      "Metertron trades breadth for depth: you will not get arbitrary industry modules, but you do get meter capture, review, stock, and municipal exports in one subscription without custom development.",
      "If you already pay per seat for a horizontal tool and still maintain Excel for the municipality, compare total cost — licences plus hidden spreadsheet labour — against one meter-native plan on trial.",
    ],
    faqs: [
      {
        q: "Does Metertron do general plumbing tickets?",
        a: "It is optimised for meter programmes. Many plumbing contractors use it for meter work alongside other systems for general maintenance.",
      },
      {
        q: "Can we customise forms?",
        a: "Yes. Form builder and templates adapt to client rules without writing code for every new column.",
      },
      {
        q: "What about route optimisation?",
        a: "Work orders assign programmes; route optimisation is not the core focus — dispatch from your plan or integrate via API.",
      },
      {
        q: "Mobile app vs browser?",
        a: "Metertron is a modern web experience for field and office — no separate app store dependency for rollouts.",
      },
      {
        q: "Switching mid-programme?",
        a: "Use trial on the next wave; import open work orders; run exports in parallel with your old tool until the client accepts the new batches.",
      },
      {
        q: "Do you integrate with accounting packages?",
        a: "Use exports and webhooks into your finance stack — Metertron focuses on install truth, not invoicing every plumbing job.",
      },
    ],
  },
];

export function getComparePage(slug: string): ComparePage | null {
  return COMPARE_PAGES.find((row) => row.slug === slug) ?? null;
}

export function allComparePages(): ComparePage[] {
  return COMPARE_PAGES;
}
