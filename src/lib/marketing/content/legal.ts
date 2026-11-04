export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalPage = {
  slug: string;
  title: string;
  metaDescription: string;
  draftNotice: true;
  sections: LegalSection[];
};

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "terms",
    title: "Terms of Service (Draft)",
    metaDescription:
      "Draft terms for Metertron, a South African SaaS platform for meter contractors. Not legal advice.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "These Terms of Service are a working draft for Metertron (Pty) Ltd and are not final legal advice. Do not rely on this page for compliance decisions until published as a signed-off version with an effective date.",
          "By accessing Metertron during a trial or paid subscription, you agree to use the service in good faith and in line with applicable South African law, including electronic communications and consumer protection rules where they apply to your relationship with us.",
        ],
      },
      {
        heading: "The service",
        paragraphs: [
          "Metertron provides cloud software for meter installation and change contractors: field capture, office review, stock and work-order tooling, and configurable export templates for municipal-style submissions. Features may change as we improve the product; we aim to give reasonable notice of material changes that affect paid customers.",
          "We offer a single subscription plan with a time-limited trial. Trial access is provided as-is so your organisation can evaluate fit; converting to paid access continues under these terms unless superseded by an enterprise agreement in writing.",
        ],
      },
      {
        heading: "Accounts and organisations",
        paragraphs: [
          "You are responsible for users invited into your organisation, for safeguarding login credentials and second factors, and for activity under your tenant. Organisation administrators control roles, exports, and data retention settings exposed in the product.",
          "You must provide accurate billing and contact details. We may suspend access for non-payment after notice, or immediately where we reasonably believe the account is used for fraud, abuse, or unlawful processing of personal information.",
        ],
      },
      {
        heading: "Customer data",
        paragraphs: [
          "You retain ownership of job records, photos, and exports created in your organisation. We process that data only to operate Metertron, provide support you request, and meet legal obligations. Our Privacy Policy and Data Processing Addendum (draft) describe handling in more detail.",
          "You must have a lawful basis to capture and store personal information about property occupants, account holders, or municipal customers in Metertron, including consent or contract where POPIA requires it.",
        ],
      },
      {
        heading: "Acceptable use and limitations",
        paragraphs: [
          "Do not attempt to bypass tenant isolation, probe other organisations’ data, or use the platform to distribute malware. Automated scraping of the marketing site or authenticated APIs outside documented limits is not permitted.",
          "The service is provided with commercially reasonable uptime targets described in our SLA draft. Except where law prohibits exclusion, liability is limited to fees paid in the twelve months before the claim. Nothing in these draft terms limits liability for gross negligence or wilful misconduct.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These draft terms are intended to be governed by the laws of the Republic of South Africa. Disputes should first be raised with hello@metertron.co.za so we can attempt resolution in good faith.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy (Draft)",
    metaDescription:
      "Draft privacy policy for Metertron: what we collect, why, and your choices under POPIA.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "This Privacy Policy is a draft for Metertron and will be updated before formal publication. It explains how we handle personal information when you visit our website, start a trial, or use the product.",
          "Metertron acts as a responsible party for account and billing data, and typically as an operator processing job and customer data on instructions from contractor organisations.",
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "We collect names, email addresses, organisation details, and authentication logs for users who sign up or are invited. Payment processing may involve our payment provider; we store subscription status and invoicing references, not full card numbers on our servers.",
          "Within the product, organisations store job facts, meter serials, photos, GPS where enabled, and free-text notes their field teams enter. That content belongs to the customer organisation; we host it in encrypted storage with tenant isolation.",
        ],
      },
      {
        heading: "How we use information",
        paragraphs: [
          "We use contact data to deliver the service, send transactional email (invites, billing, security alerts), and respond to support requests. With consent where required, we may send product updates relevant to administrators.",
          "We analyse aggregated, de-identified usage to improve reliability and UX. We do not sell personal information.",
        ],
      },
      {
        heading: "Retention and security",
        paragraphs: [
          "We retain account data while your subscription is active and for a reasonable period afterward for backups, billing records, and legal requirements. Organisations can export their operational data; deletion requests for tenant content should be routed through your organisation administrator and our support channel.",
          "We apply access controls, encryption in transit, and monitoring appropriate to a B2B SaaS handling field operations data in South Africa.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "Under POPIA you may request access, correction, or deletion of personal information we hold about you as an account holder. Job-level data about third parties should be directed to the contractor organisation that captured it.",
          "Contact hello@metertron.co.za for privacy queries. You may lodge a complaint with the Information Regulator if unresolved.",
        ],
      },
    ],
  },
  {
    slug: "popia",
    title: "POPIA Summary (Draft)",
    metaDescription:
      "Draft summary of how Metertron supports POPIA-aware workflows for municipal meter contractors.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "This page summarises privacy themes for meter contractors using Metertron. It is not a substitute for your organisation’s POPIA compliance programme or legal counsel.",
        ],
      },
      {
        heading: "Roles",
        paragraphs: [
          "Municipalities and their contractors often process personal information about account holders and occupants when installing or replacing meters. The contractor organisation is usually the responsible party for field capture; Metertron hosts that data as an operator on documented instructions.",
          "Define who may access exports, photos, and review queues inside your tenant. Use least-privilege roles for installers, reviewers, and stock controllers.",
        ],
      },
      {
        heading: "Lawful processing",
        paragraphs: [
          "Align capture fields with your contract and municipality rules—collect only what submissions require. Avoid storing identity numbers or banking details in job notes unless explicitly mandated and secured.",
          "When photos may show people or house numbers, train teams on respectful capture and retention limits agreed with your client.",
        ],
      },
      {
        heading: "Security safeguards",
        paragraphs: [
          "Metertron isolates data per organisation, supports authenticated access, and logs administrative actions. Complement platform controls with device policies: screen locks on field phones, prompt removal of ex-staff accounts, and secure disposal of exported spreadsheets.",
        ],
      },
      {
        heading: "Incidents and cross-border hosting",
        paragraphs: [
          "Notify us promptly if you suspect unauthorised access to your tenant. Our infrastructure providers may process data in regions disclosed in our sub-processor list (to be published with the final policy).",
          "Cross-border transfers require appropriate authorisation under POPIA; enterprise customers may request documentation during procurement.",
        ],
      },
    ],
  },
  {
    slug: "paia-manual",
    title: "PAIA Manual (Draft)",
    metaDescription:
      "Draft Promotion of Access to Information Act manual for Metertron.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "This PAIA Manual is a placeholder prepared for publication once approved by Metertron’s management. It will describe how to request records held by Metertron (Pty) Ltd under the Promotion of Access to Information Act 2 of 2000.",
        ],
      },
      {
        heading: "Purpose",
        paragraphs: [
          "PAIA gives requesters a framework to access records held by private bodies when those records are required for exercise or protection of rights. Metertron primarily holds records about its own business and, as operator, customer tenant data controlled by contractor organisations.",
        ],
      },
      {
        heading: "Requests",
        paragraphs: [
          "Formal PAIA requests should be sent to hello@metertron.co.za with sufficient detail to identify the record. We will respond within statutory timeframes where the request relates to records we control directly.",
          "Requests for job or customer records captured by a contractor organisation may need to be directed to that organisation as the responsible party.",
        ],
      },
      {
        heading: "Fees and refusal",
        paragraphs: [
          "Applicable request fees and access fees will be listed in the final manual. We may refuse access where a ground in PAIA applies, with reasons provided as required.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Notice (Draft)",
    metaDescription:
      "Draft explanation of cookies and similar technologies on metertron.co.za.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "This Cookie Notice is a draft. We will align banner text and consent choices with the final Privacy Policy before go-live.",
        ],
      },
      {
        heading: "What we use",
        paragraphs: [
          "Strictly necessary cookies support login sessions, security, and load balancing. Without them, authenticated areas of Metertron will not function.",
          "Optional analytics cookies, if enabled later, help us understand marketing page performance in aggregate. We will not set non-essential cookies without appropriate consent where required.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can clear cookies via browser settings. Session cookies expire when you log out or after the configured lifetime.",
          "For questions, contact hello@metertron.co.za.",
        ],
      },
    ],
  },
  {
    slug: "dpa",
    title: "Data Processing Addendum (Draft)",
    metaDescription:
      "Draft DPA between Metertron and customer organisations under POPIA.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "This Data Processing Addendum (DPA) template will govern operator processing when customers subscribe to Metertron. Execute the final version with your order or enterprise agreement.",
        ],
      },
      {
        heading: "Subject matter and duration",
        paragraphs: [
          "Metertron processes personal information contained in job records, photos, user accounts, and exports solely to provide the subscription services for the term of the agreement and any short post-termination extraction window.",
        ],
      },
      {
        heading: "Customer instructions",
        paragraphs: [
          "The customer instructs Metertron to store, retrieve, display, and transmit tenant data as users action within the product, including sync from field devices and generation of export files. Processing outside documented features requires written instruction.",
        ],
      },
      {
        heading: "Confidentiality and sub-processors",
        paragraphs: [
          "Personnel with access to production systems are bound by confidentiality obligations. We use infrastructure and email providers as sub-processors under written terms; a list will be maintained on our trust page.",
        ],
      },
      {
        heading: "Security and assistance",
        paragraphs: [
          "We implement technical and organisational measures appropriate to the risk, including tenant isolation and encryption in transit. We assist with reasonable data subject requests that relate to processing we control, and notify customers of personal information breaches without undue delay where legally required.",
        ],
      },
      {
        heading: "Deletion",
        paragraphs: [
          "On termination, customers may export data via product features. After the agreed retention period, we will delete or anonymise tenant content from active systems, subject to backup rotation and legal hold requirements.",
        ],
      },
    ],
  },
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy (Draft)",
    metaDescription:
      "Draft acceptable use rules for Metertron accounts and APIs.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "This Acceptable Use Policy (AUP) supplements the Terms of Service. It applies to all users and API keys under your organisation.",
        ],
      },
      {
        heading: "Permitted use",
        paragraphs: [
          "Use Metertron for lawful meter installation, change-out, prepaid, and related contractor operations aligned with your municipal or utility contracts. Configure exports to match client submission rules you have validated.",
        ],
      },
      {
        heading: "Prohibited use",
        paragraphs: [
          "Do not upload malware, attempt unauthorised access to other tenants, interfere with platform availability, or use the service to harass individuals captured in field photos.",
          "Do not scrape authenticated endpoints beyond documented API limits or share API keys in public repositories.",
        ],
      },
      {
        heading: "Content responsibility",
        paragraphs: [
          "You are responsible for the accuracy of submissions generated from your tenant and for obtaining lawful permission to capture personal information on job sites.",
        ],
      },
      {
        heading: "Enforcement",
        paragraphs: [
          "We may warn, suspend, or terminate access for AUP violations. Report abuse to hello@metertron.co.za.",
        ],
      },
    ],
  },
  {
    slug: "sla",
    title: "Service Level Agreement (Draft)",
    metaDescription:
      "Draft uptime and support targets for Metertron’s single SaaS plan.",
    draftNotice: true,
    sections: [
      {
        heading: "Draft notice",
        paragraphs: [
          "This Service Level Agreement (SLA) is a draft for paid subscriptions on Metertron’s standard plan. Enterprise customers may negotiate separate terms.",
        ],
      },
      {
        heading: "Availability target",
        paragraphs: [
          "We target 99.5% monthly uptime for the hosted application and sync APIs, excluding scheduled maintenance announced in advance and factors outside our reasonable control (including widespread connectivity failures or force majeure).",
        ],
      },
      {
        heading: "Support",
        paragraphs: [
          "Email support is available on business days (South African time) for administrators. Severity definitions and response targets will be listed in the customer help centre when this SLA is finalised.",
        ],
      },
      {
        heading: "Credits",
        paragraphs: [
          "If we fail to meet the published monthly uptime target, eligible customers may request a service credit against the following invoice, capped as described in the final SLA. Credits are your sole remedy for availability failures unless otherwise required by law.",
        ],
      },
      {
        heading: "Field and offline use",
        paragraphs: [
          "Metertron’s field apps are designed for offline capture with later sync. Brief sync delays during connectivity loss are expected behaviour and not counted as platform unavailability if the offline client remains usable.",
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return LEGAL_PAGES.find((page) => page.slug === slug) ?? null;
}

export function allLegalPages() {
  return LEGAL_PAGES;
}
