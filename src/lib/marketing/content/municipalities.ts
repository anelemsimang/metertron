export type MunicipalityFaq = { q: string; a: string };

export type MunicipalityPage = {
  slug: string;
  name: string;
  province: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  summary: string;
  body: string[];
  faqs: MunicipalityFaq[];
  nearby: string[];
  indexable: boolean;
};

export const MUNICIPALITIES: MunicipalityPage[] = [
  {
    slug: "ethekwini",
    name: "eThekwini Municipality",
    province: "KwaZulu-Natal",
    metaTitle: "Metertron for eThekwini meter contractors | Export-ready capture",
    metaDescription:
      "Prepare eThekwini-style meter change submissions from one capture flow. Field forms, office review, and configurable Excel exports for KZN contractors.",
    primaryKeyword: "eThekwini meter installation submission",
    summary:
      "Contractors working in eThekwini need capture that survives coastal routes and exports that match client spreadsheet conventions—without retyping every install.",
    indexable: true,
    nearby: ["msunduzi", "johannesburg", "cape-town"],
    faqs: [
      {
        q: "Does Metertron replace the municipality’s official template?",
        a: "No. Obtain the latest intake layout from your client engineer. Metertron maps reviewed job data into an export template you configure—including an eThekwini-oriented starting point you validate against your contract pack.",
      },
      {
        q: "Can field teams work offline in eThekwini?",
        a: "Yes. Installers complete forms and photos offline and sync when connectivity returns—important across valleys, flats, and load-shedding gaps.",
      },
      {
        q: "How does the 7-day trial work?",
        a: "Start a trial on Metertron, invite a pilot team, and test capture-to-export with redacted sample headers before you commit.",
      },
    ],
    body: [
      "Meter installation and change-out work in the eThekwini municipal area spans dense urban wards, coastal estates, and inland nodes where connectivity and access vary street by street. Contractors are typically judged on throughput, but cash flow often depends on whether office staff can turn field facts into a spreadsheet batch the client will accept on first submission. When reviewers reject a file for header mismatches, ambiguous status values, or serial formatting, the cost is not only admin time—it delays recognition of completed work and erodes trust with programme managers.",
      "In KwaZulu-Natal, many intake processes still centre on Excel workbooks with fixed column order and labels that must match engineering templates exactly. Installers may capture accurate old and new meter numbers on site, yet those values pass through WhatsApp photos, paper job cards, and manual re-keying before they land in the submission sheet. Each handoff introduces trim errors, duplicated rows, and inconsistent date formats. Metertron keeps the job record authoritative from capture through review, so export is mapping—not reconstruction.",
      "eThekwini-oriented work often involves photo evidence for meter position, seals, and installation context. Municipal reviewers may compare spreadsheet rows against images stored in separate folders or portals. Without a single job identifier threading photos to rows, contractors waste days reconciling filenames. Metertron attaches photos to the job record, surfaces them in review, and lets your export include references only where the client spec allows—keeping the spreadsheet clean when that is what intake requires.",
      "Coastal humidity, shared courtyards, and multi-dwelling complexes create capture nuances that free-text notes handle poorly. Dropdowns for installation type, seal colour, and fault codes reduce ambiguity for reviewers who never visited the stand. Validation at capture time—required photos per job type, serial fields that reject obvious placeholders—stops predictable rejections before sync. Office reviewers then focus on policy checks rather than chasing installers for missing evidence.",
      "Contractors frequently run multiple concurrent packages for different implementing agents, each with slightly different export expectations. Maintaining one spreadsheet macro per client does not scale when headers change mid-financial year. Metertron stores export templates per organisation: clone the baseline, adjust column mappings when you receive an updated pack, and version the template name so historical exports remain explainable during audits.",
      "The product includes an eThekwini-ready export template as a practical starting point, not a guarantee of acceptance. Engineering teams update layouts; your obligation is to validate against the current contract documents. WhatsApp or call us with a redacted header row if you want alignment checked before a large batch—never customer ID numbers or account PII. After validation, field teams should not need to know column letters; they complete the form once.",
      "Stock control interacts tightly with submissions: a meter serial in the spreadsheet must match what left your storeroom and what the installer fitted. When stock issues are disconnected from jobs, variances appear only at month-end. Metertron links consumption expectations to work orders where you configure it, helping supervisors catch swaps before export. That discipline matters when clients sample serial ranges for fraud and quality audits.",
      "Training installers for first-time-right capture pays off on eThekwini routes where return visits are expensive and programme windows are tight. Use review rejection reasons that sync back to the field app so the next visit is targeted, not a full repeat. Measure rejections by reason code to fix forms and training rather than blaming individuals. Over a quarter, teams that treat export quality as a field metric—not only an office chore—see smoother batch releases.",
      "Metertron is offered on a full product access with a 7-day trial so owners can prove the capture-to-export loop with a real supervisor team before rolling out to every crew. There are no seat caps designed to punish growth; the goal is reliable municipal-style submissions from one tenant your organisation controls. If you operate across eThekwini and neighbouring KZN municipalities, reuse forms and clone export templates per client rather than multiplying ad hoc spreadsheets.",
      "Winter rainfall and summer heat both affect field hardware and photo quality in eThekwini. Standardise spare battery packs and shade breaks for serial photography so crews do not rush blurry evidence. Office reviewers should feed recurring retake reasons back into weekly toolbox talks—especially for complex stands where first access was partial and a follow-up visit is already scheduled.",
    ],
  },
  {
    slug: "johannesburg",
    name: "City of Johannesburg",
    province: "Gauteng",
    metaTitle: "Metertron for Johannesburg meter contractors | Gauteng submissions",
    metaDescription:
      "Unify Joburg field capture, review, and Excel exports across agents and suburbs. Full-access SaaS with a 7-day trial for Gauteng contractors.",
    primaryKeyword: "Johannesburg meter contractor submission",
    summary:
      "Johannesburg’s scale and agent landscape reward contractors who capture once and export consistently—without suburb-specific shadow processes.",
    indexable: true,
    nearby: ["ekurhuleni", "tshwane", "mangaung"],
    faqs: [
      {
        q: "We work for more than one implementing agent in Joburg. One tenant?",
        a: "Use separate export templates (and optionally separate orgs) per client contract so headers never cross-contaminate, while keeping field forms consistent for installers.",
      },
      {
        q: "How do we handle high-density suburbs and complex stands?",
        a: "Structured address fields, GPS when available, and photo sets per job type help reviewers match rows to sites—record when GPS is weak instead of blocking save.",
      },
      {
        q: "Is there a separate enterprise tier?",
        a: "Metertron offers full product access with a 7-day trial; scale comes from your team size and templates, not from install caps on the subscription.",
      },
    ],
    body: [
      "The City of Johannesburg metropolitan area combines high-density housing, estate complexes, and industrial corridors where meter programmes move quickly and submission standards are strict. Contractors rarely interact with a single monolithic process: implementing agents, regional depots, and engineering reviewers each add checks before a batch is accepted. The operational risk for installers is familiar—teams capture diligently—while the office becomes a bottleneck translating job cards into client spreadsheets that must align with templates from the current financial year.",
      "Gauteng’s connectivity is better than many provinces, yet basements, lift shafts, and load-shedding still interrupt sync at the wrong moment. A capture app that refuses to save without live signal pushes crews back to paper, and paper re-enters the business as a second payroll. Metertron is offline-first: complete the job, attach compressed photos, and sync when the tower returns. Supervisors see queue status instead of guessing which installs never uploaded.",
      "Johannesburg submissions often expect consistent formatting for meter numbers, CIU identifiers, and installation outcomes drawn from controlled vocabularies. Free-text entries that look right to installers fail when reviewers apply dropdown rules in Excel. Metertron forms use catalogs you maintain per contract—seal types, fault codes, disposal routes—so export values map predictably. Reviewers lock a job before it enters an export batch, preserving an audit trail when a client questions a row months later.",
      "Multi-suburb routing amplifies small errors. A date typed as DD/MM/YYYY in one team and ISO format in another produces a batch that looks fine until engineering sorts and finds impossible sequences. Standardise in the export template, not in each installer’s head. Run a five-row pilot export and ask the client to confirm before submitting hundreds of installs from a peak week.",
      "Photo evidence standards in metro programmes typically require clear serials, sealed connections, and contextual shots that prove access was lawful and work completed. Filename chaos—duplicate phone camera names—destroys reviewer confidence. Photos in Metertron stay on the job; reviewers open them beside the record; exports include links or filenames only when permitted. Train teams to retake blurry serials on site, not after sync when the truck has left.",
      "Agent diversity means header rows differ even within the same city. Avoid the Joburg spreadsheet living on one supervisor’s laptop. Centralise templates in Metertron, document the version in the export name, and restrict who can publish mappings. When an agent publishes an updated pack, clone the prior template, adjust mappings, and keep the old version for historical resubmissions.",
      "Security of customer-related data matters under POPIA: minimise fields to what submissions require, restrict exports to role holders, and remove departed staff promptly. Johannesburg programmes may include occupied stands where installers interact with residents; capture only what the contract mandates and keep notes professional. Metertron’s org-scoped storage supports least-privilege roles for field, review, and stock functions.",
      "Peak periods—month-end pushes, storm recovery, prepaid conversions—expose review queues. Prioritise by client SLA inside the office, but fix root causes in the field form when the same rejection reason clusters on one crew. Metertron’s review workflow is designed so rejections carry reasons installers can act on, reducing unpaid return visits that destroy margin on tight tenders.",
      "Start with Metertron and 7-day trial: onboard one depot, validate export headers against your agent’s pack, then expand invites. The economic case is straightforward—fewer retyped rows, fewer rejected batches, and one system for capture, stock, and export instead of parallel WhatsApp and Excel cultures. For contractors also active in Ekurhuleni and Tshwane, reuse training materials and differentiate only at export mapping.",
      "Johannesburg clients sometimes request resubmission of corrected rows rather than whole batches. Locked job history in Metertron makes it practical to regenerate exports from reviewed records instead of reconstructing installs from memory or partial chat logs. That responsiveness protects relationships with agents who manage multiple contractors on shared programmes.",
      "Finally, treat export template ownership like stock policy: named administrators, change logs via template versioning, and no ‘private’ macros on personal laptops. When auditors ask how a March batch was built, you should trace from export file to template version to reviewed jobs—not reconstruct from a departed supervisor’s Downloads folder.",
      "Sandton, Alexandra, and Soweto runs may share crews but never share export files without checking the implementing agent on each work order. A single misrouted batch can contaminate client trust across programmes. Metertron work-order metadata should drive template selection in the office, not guesswork from suburb names alone.",
    ],
  },
  {
    slug: "cape-town",
    name: "City of Cape Town",
    province: "Western Cape",
    metaTitle: "Metertron for Cape Town meter contractors | Western Cape exports",
    metaDescription:
      "Field-to-Excel workflows for City of Cape Town meter work: offline capture, review, and template-based exports on full product access with a trial.",
    primaryKeyword: "Cape Town water meter submission contractor",
    summary:
      "Western Cape contractors need disciplined capture across varied terrain and export templates that mirror client intake—without inventing parallel admin systems.",
    indexable: true,
    nearby: ["nelson-mandela-bay", "buffalo-city", "ethekwini"],
    faqs: [
      {
        q: "Do you ship a City of Cape Town official template?",
        a: "We provide configurable export templates you align to the workbook your client supplies. Obtain the current layout from the municipality or agent and map fields after a small pilot export.",
      },
      {
        q: "Wind and weather affect our photos—any tips?",
        a: "Capture serials in shade where possible; use required-photo prompts per job type; reviewers should reject only with clear retake guidance.",
      },
      {
        q: "Trial length?",
        a: "Seven days on Metertron—enough for a crew-week pilot if you prepare sample headers in advance.",
      },
    ],
    body: [
      "City of Cape Town meter and water-related field programmes operate across formal suburbs, informal settlements on difficult terrain, and coastal zones where access and wind complicate every install. Contractors are measured on installs completed, but payment often follows documentation: spreadsheets whose columns match engineering templates, serials that reconcile to stock, and photos that satisfy audit sampling. When any layer fails, teams revisit sites at their own cost while client queues grow.",
      "Western Cape clients frequently emphasise water accountability and evidence quality—without contractors needing to guess unpublished internal targets. Treat submission packs as contractual instruments: obtain the latest Excel layout, confirm date and status conventions, and do not rely on last year’s macro. Metertron separates capture from presentation: installers never edit column headers; mappers in export templates translate reviewed jobs into the client sheet.",
      "Terrain drives offline behaviour. Signal fades on mountain slopes and in basement flats; load-shedding schedules differ by suburb. Offline-first capture lets installers finish on site, with sync status visible to office staff. Compress photos on device so a full job does not block the queue behind oversized uploads when teams return to LTE at the depot.",
      "Cape Town programmes may span prepaid, conventional meter change, and specialised installations where catalogues differ. Use form variants per job type with mandatory fields tuned to client checklists. Dropdowns beat narrative notes for outcomes reviewers filter in Excel. Where GPS is available, record it; where blocked, note the limitation instead of failing the save—reviewers prefer honest metadata over repeated retries in direct sun.",
      "Export templates should version with client updates. Store the template name and date in export filenames your office already uses for email submissions. Metertron supports cloning mappings when a column is renamed—common when bilingual headers or punctuation changes. Keep a redacted sample header on file internally; never email customer PII when asking for mapping help.",
      "Photo standards often require readable serials, sealed connections, and context showing meter position relative to property access. Train teams to wipe condensation from glass covers before macro shots. Link photos to jobs so sampling reviewers can open evidence quickly; avoid parallel folders on shared drives that diverge from the spreadsheet after a week of peak production.",
      "Stock and serial integrity matter when clients spot-check ranges. Issue high-value units against work orders, and investigate mismatches before export—not after rejection. Metertron helps supervisors compare expected consumption to captured serials while memory is fresh. Month-end reconciliation with client received lists should be routine, not a fire drill.",
      "POPIA-aware practice on occupied stands means collecting only required identifiers, securing devices with screen locks, and removing users who leave the company. Exports sent by email should go to client addresses defined in contracts; avoid personal inboxes for batch files containing account-related fields.",
      "Metertron includes a 7-day trial for Cape Town contractors evaluating a move off paper job cards. Prove the loop from capture through review to export with one team before network-wide rollout. If you also work Eastern Cape metros, reuse operational playbooks and maintain separate export templates per client jurisdiction.",
      "Cape Town’s mix of estate access rules and informal settlement pathways means installers often need structured ‘access outcome’ values rather than long narratives. Catalog those outcomes once in Metertron and map them to client columns so reviewers filter consistently. When access is denied, capture the fact clearly so the office does not export rows that look like completed installs.",
      "Seasonal tourism and holiday periods can compress programme windows—precisely when supervisors are on leave. Build export and review coverage into rosters before peak weeks, and keep template versions stable unless the client formally publishes changes. Rushed header edits during leave periods cause batches that fail for preventable formatting reasons.",
      "Atlantic seaboard salt exposure and inland heat both affect outdoor meter cabinets—evidence photos should show seals and serials after basic cleaning, not through dirty glass. Reviewers reject unreadable serials even when installs are physically correct; retakes on site are cheaper than return trips from Kraaifontein to Simon’s Town.",
      "Cape Town contractors often participate in regional forums where agents share general guidance without publishing internal targets. Treat verbal hints as cues to validate templates, not as substitutes for the official workbook. Metertron mappings should always trace to a named file version stored in your compliance folder.",
    ],
  },
  {
    slug: "tshwane",
    name: "City of Tshwane",
    province: "Gauteng",
    metaTitle: "Metertron for Tshwane meter contractors | Pretoria export workflows",
    metaDescription:
      "Capture, review, and Excel exports for City of Tshwane meter programmes. Offline field apps and template mapping on Metertron.",
    primaryKeyword: "Tshwane meter installation contractor Excel",
    summary:
      "Tshwane’s spread-from-Pretoria geography rewards contractors who standardise capture in the field and map exports per client template—not per depot spreadsheet.",
    indexable: true,
    nearby: ["johannesburg", "ekurhuleni", "mangaung"],
    faqs: [
      {
        q: "We cover wide Tshwane routes—does sync cope?",
        a: "Jobs save offline first; sync runs when teams hit connectivity at depots or along main routes. Supervisors monitor the sync queue rather than assuming upload at the stand.",
      },
      {
        q: "Can we match different client header rows?",
        a: "Yes—maintain one or more export templates in your tenant and validate against the workbook your implementing agent issued for the current contract.",
      },
      {
        q: "What about trial and pricing?",
        a: "Full product access, 7-day trial, no install caps—evaluate with a single supervisor team before inviting all installers.",
      },
    ],
    body: [
      "The City of Tshwane metropolitan municipality covers Pretoria, vast residential sprawl, and industrial nodes where meter contractors run long daily routes. Programme managers expect steady install counts, but finance teams release payment against submission quality: Excel batches with stable headers, serials that match stock records, and photos that survive audit sampling. Contractors who treat documentation as secondary work discover rejections weeks after the install window closes.",
      "Tshwane field work encounters gated estates, government campuses with access control, and peri-urban areas where GPS and signal fluctuate. An always-online capture tool forces installers to choose between incomplete records and delayed saves. Metertron records the job locally, attaches photos with compression, and uploads when practical—so the stand visit is complete even if the tower is not.",
      "Implementing agents and municipal engineers often publish template changes without fanfare. A column renamed for clarity becomes a rejection reason for the entire batch. Metertron export templates encode mappings from your canonical job fields to client columns; when headers shift, clone the template, adjust, and label the version. Field crews should not learn new spreadsheet tricks each month—they keep using the same validated form.",
      "Review queues matter in Tshwane when multiple teams feed one client inbox. Lock jobs only when photos, serials, and catalog values align with contract rules. Reject with structured reasons installers see on device before the next visit. Measuring rejection themes by team reveals training gaps—especially on seal photography and old-meter disposal codes—without guessing from informal WhatsApp complaints.",
      "Prepaid and conventional meter jobs may coexist under different form variants. Catalogs for seal colour, meter type, and fault classification should mirror client dropdowns to avoid ‘close enough’ text that fails Excel validation. Standardise dates in export to the format the template expects; never mix formats within one file because different supervisors typed rows differently.",
      "Stock discipline protects margin on long Tshwane routes where returning for a swapped serial burns half a day. Tie issues to work orders where possible and compare captured new-meter serials to morning issues before batch export. Investigators on the client side correlate random samples; internal consistency beats heroic month-end fixes.",
      "POPIA and professional conduct apply when installers interact with residents at occupied stands. Capture the minimum fields required for submission; avoid identity numbers in free text unless contractually required and secured. Role-based access in Metertron limits who can download full exports containing account-related data.",
      "Contractors operating in both Tshwane and Johannesburg should not duplicate processes—use the same field training and differentiate at export templates per agent. Metertron with a 7-day trial lets you pilot in one depot serving Pretoria north, validate a pilot export with the client, then scale invites without negotiating tiered feature gates.",
      "When engineering requests corrections, resubmit from locked history rather than retyping from memory. Job records with timestamps and reviewer identity support constructive disputes if a rejection seems inconsistent. Over time, export accuracy becomes a competitive advantage in Gauteng tenders where reference checks include submission reliability, not only price.",
      "Tshwane routes through Mabopane, Soshanguve, Centurion, and central Pretoria vary in language preference on site; keep form labels plain and train for photo clarity rather than lengthy notes. Bilingual Excel headers on the client side still require exact character matches—validate Afrikaans or English punctuation in templates when agents supply bilingual packs.",
      "If your depot serves both Tshwane and Ekurhuleni contracts, schedule export batches separately even when crews overlap. Mixed batches sent to the wrong inbox delay acceptance and create confusion about which template version applies. Metertron org settings keep one capture standard while letting you publish distinct export templates per client.",
      "Government precinct access can delay installs without reducing reporting pressure—capture partial visits with structured outcomes so monthly exports reflect reality. Rows that imply completion when only a survey happened will fail client audits and invite penalties under tight SLAs.",
      "Pretoria North and Centurion estates often require appointment windows; align work-order scheduling with review capacity so jobs captured Friday still export Monday when clients expect weekly batches. Backlogs hidden until month-end create artificial rejection spikes unrelated to field quality.",
      "Metertron’s 7-day trial with full product access is enough for a Tshwane depot to validate one export template against a client workbook before you invite every installer—use that week to fix catalogs and photo rules, not only to test login flows.",
    ],
  },
  {
    slug: "ekurhuleni",
    name: "City of Ekurhuleni",
    province: "Gauteng",
    metaTitle: "Metertron for Ekurhuleni meter contractors | East Rand submissions",
    metaDescription:
      "Meter capture and municipal-style Excel exports for Ekurhuleni contractors. Offline sync, review queues, and configurable templates.",
    primaryKeyword: "Ekurhuleni meter change submission",
    summary:
      "East Rand contractors juggling industrial and residential routes need one capture standard and export templates aligned to each client pack.",
    indexable: true,
    nearby: ["johannesburg", "tshwane", "mangaung"],
    faqs: [
      {
        q: "Industrial sites dominate our week—any form tips?",
        a: "Use job-type-specific required photos and serial fields; record access constraints in structured notes so reviewers understand delays without rejecting valid work.",
      },
      {
        q: "How do export templates help Ekurhuleni batches?",
        a: "They map reviewed jobs to the exact column order and labels your client template uses—after you validate against the current workbook.",
      },
      {
        q: "Ready to trial?",
        a: "Yes—seven days to test capture, review, and export with a redacted header row before full rollout.",
      },
    ],
    body: [
      "Ekurhuleni combines industrial corridors, airport-adjacent logistics hubs, and residential townships where meter programmes run at high volume. Contractors serving the East Rand often dispatch multiple crews daily across contrasting site types—large commercial meters, compact domestic units, and complex access arrangements. Clients still judge delivery through structured spreadsheets and evidence packs, not through verbal assurances that ‘the team was there.’",
      "Industrial installs introduce safety and access documentation that must appear consistently in job records without cluttering domestic forms. Metertron supports form variants and catalogs so teams select the right capture path per work order. Reviewers see a uniform job timeline—photos, serials, catalog selections—regardless of whether the stand was a factory boundary or a RDP housing block.",
      "Connectivity around OR Tambo and warehouse districts can be uneven; residential areas face load-shedding like the rest of Gauteng. Offline-first capture prevents installers from leaving sites with partial records. Sync status dashboards show which trucks still owe uploads before the office closes export for the week—a common Ekurhuleni failure mode when supervisors assume LTE matched tar road quality.",
      "Excel submissions remain the lingua franca for many implementing agents in the region. Headers may include precise punctuation copied from legacy systems; a extra space breaks VLOOKUP chains on the client side. Metertron keeps mapping logic in export templates your admin maintains, not in installer muscle memory. Pilot five rows with the client engineer before sending peak-week volumes.",
      "Serial integrity interacts with stock: industrial jobs may consume different SKUs than domestic routes. Issue stock against teams or orders and compare to captured serials pre-export. When mismatches appear, fix while installers are still in the area—not after a rejection email lands three days later.",
      "Photo evidence for industrial sites may need wider context shots for safety and location, while domestic jobs emphasise seal and serial clarity. Configure required photo slots per job type so reviewers are not negotiating ad hoc over WhatsApp. Filename and job linkage beats shared drive folders that diverge from spreadsheet rows.",
      "Agents working across Ekurhuleni and Johannesburg may use different templates even when branding looks similar. Maintain separate export templates and naming conventions; never overwrite mappings for one client when updating another. Version labels in export filenames reduce confusion when two inboxes receive files the same afternoon.",
      "Under POPIA, limit personal data to contract requirements; secure field devices; revoke access for leavers immediately. Batch files should route to client emails defined in agreements.",
      "Metertron and 7-day trial let Ekurhuleni contractors prove ROI on one depot before enterprise-wide rollout—fewer retyped cells, fewer rejected batches, and one tenant for capture, review, stock, and export. Scale teams without hitting artificial install caps designed to force upgrades.",
      "Shift handovers on industrial jobs should include meter serial confirmation before the truck leaves site—update the job record immediately so night-shift office staff do not export provisional values. Ekurhuleni’s mix of shift work and tight client cut-offs rewards same-day review more than weekly batch marathons.",
      "When clients request anonymised samples for quality review, export from locked jobs without copying rows into ad hoc sheets that strip photo links. Metertron keeps evidence attached to the same identifiers reviewers already use, reducing back-and-forth when a sample fails for missing context rather than bad serials.",
      "Warehouse and factory meters may require additional safety briefings—record briefing completion in structured fields if your client checklist asks for it. Free-text essays in notes fields do not export cleanly into Excel columns clients actually read.",
      "Ekurhuleni teams sharing vehicles should hand over open work orders in Metertron, not on paper, so afternoon crews do not duplicate installs or overwrite morning serials during sync conflicts.",
      "Airport cargo peaks should not excuse missing photo evidence—preconfigure compressed photo limits so sync completes at the depot before drivers leave for home routes across the East Rand.",
      "Ekurhuleni contractors measuring success only by installs per day should add exports accepted without correction as a paired KPI—Metertron review and template versioning make that metric visible without guessing from client email tone.",
      "Night-shift industrial completions should still sync before the morning export cut-off—supervisors can assign review priority flags in the office queue so critical rows are not buried beneath domestic jobs from the previous afternoon.",
      "Full-access Metertron pricing means Ekurhuleni owners can expand crews after a successful trial without renegotiating feature gates—scale capture and export together.",
    ],
  },
  {
    slug: "nelson-mandela-bay",
    name: "Nelson Mandela Bay Municipality",
    province: "Eastern Cape",
    metaTitle: "Metertron for Nelson Mandela Bay meter contractors",
    metaDescription:
      "Capture, review, and Excel exports for Nelson Mandela Bay meter work. Offline-first field sync and template mapping for Eastern Cape contractors.",
    primaryKeyword: "Nelson Mandela Bay meter contractor submission",
    summary:
      "Bay contractors face logistics and connectivity constraints; disciplined capture and template-based exports keep client batches moving.",
    indexable: true,
    nearby: ["buffalo-city", "cape-town", "mangaung"],
    faqs: [
      {
        q: "Connectivity is patchy in parts of the Bay—will crews cope?",
        a: "Jobs and photos save offline; sync when back at depot or when signal returns. Supervisors track pending uploads explicitly.",
      },
      {
        q: "Do you provide an official Nelson Mandela Bay template?",
        a: "You configure export templates against the workbook your client provides; we help with mapping discipline, not unpublished municipal specs.",
      },
      {
        q: "Can we trial before paying?",
        a: "Seven days on Metertron—pilot one team and validate headers with your client contact.",
      },
    ],
    body: [
      "Nelson Mandela Bay spans Port Elizabeth, Uitenhage, and Despatch with industrial port activity, sprawling residential areas, and routes where connectivity and travel time shape daily productivity. Meter contractors are tendered on install capacity, yet cash flow follows accepted submissions: Excel files whose structure matches engineering templates, serial lists that agree with stock, and photos that survive spot checks.",
      "Eastern Cape programmes often arrive through implementing agents with explicit spreadsheet conventions. Installers working correctly on site still lose when office staff re-key rows from paper or fragmented chat threads. Metertron makes the synced job record the source of truth—review locks quality, export maps to client columns once.",
      "Wind, salt air, and outdoor cabinets affect photo clarity for meter serials. Train teams to stabilise phones, clean glass, and retake on site. Required photo slots per job type prevent ‘we’ll send it later’ gaps that block review. Link images to jobs so auditors do not chase unrelated camera rolls.",
      "Offline capture is essential across valleys and warehouse districts where LTE is inconsistent. Save completed jobs before driving to the next stand; upload batches at the depot with clear sync indicators. Compress photos so one install does not stall the queue.",
      "Export templates must track client updates. Obtain the latest header row from your engineer contact; clone Metertron mappings when labels change. Run pilot exports before month-end peaks common in municipal billing cycles.",
      "Stock variances hurt margin on long Bay routes. Match issued serials to captured new meters before export; investigate swaps while crews are still local. Client sampling may flag impossible sequences if disposal codes or old serials were mistyped during manual transcription—another reason to eliminate re-keying.",
      "POPIA applies to resident interactions and account-related fields in submissions. Minimise collection, secure devices, and restrict export downloads to trusted office roles.",
      "Contractors also working Buffalo City or Western Cape clients should clone templates per jurisdiction—never assume one Eastern Cape file fits all agents.",
      "Metertron offers full product access with a 7-day trial: prove capture-to-export with a single supervisor team, then expand without per-install licensing friction.",
      "Port-side humidity and wind affect both meter cabinets and phone lenses. Standardise lens wipes and a retake checklist in toolbox talks so reviewers are not rejecting the same glare issue across crews. Link every retake to the original job rather than creating duplicate rows that confuse batch counts.",
      "Bay clients may schedule intake windows around billing cycles—build office capacity for review and export before those cut-offs rather than after installers finish. Late exports look like low productivity even when field work was on target; the bottleneck is documentation, not wrenches.",
      "When implementing agents change contact emails or portal instructions, update internal runbooks and export routing the same day. Misaddressed batches stall payment while everyone confirms receipt. Keep a single internal checklist: template version, row count, date range, and named reviewer approval.",
      "Subcontractor crews are common on Eastern Cape programmes—use consistent Metertron forms so main contractors inherit quality data instead of normalising paper from multiple vendors. Export templates should remain under the principal contractor’s admin control with role boundaries for subs.",
      "Uitenhage industrial routes benefit from the same serial confirmation discipline as port-side domestic work—mixing sloppy industrial exports with tight domestic batches drags down overall client scores even when volumes differ.",
      "Despatch depots should be sync checkpoints: no truck leaves for home until the supervisor clears the upload queue or flags exceptions with named follow-ups. Assuming uploads finished on the N2 is how Eastern Cape contractors lose days of invisible backlog.",
      "Seasonal wind can knock over temporary signage but should not knock out metadata—GPS and timestamp fields help honest reviewers even when photos must be retaken for clarity.",
      "Nelson Mandela Bay payment cycles reward contractors who treat export mapping as living configuration—when agents rename columns, clone templates the same week rather than patching spreadsheets manually for each batch.",
      "Bay-area subcontractors should not email photos separately from principal contractors’ spreadsheets—Metertron keeps evidence on the job record the principal exports, avoiding mismatches that delay acceptance for the whole chain.",
      "Port Elizabeth depots should treat Friday sync backlog as a Monday rejection risk—clear queues before weekend cut-offs clients enforce even when field teams are off shift.",
      "Treat Nelson Mandela Bay export quality as a standing tender reference, not a month-end scramble.",
    ],
  },
  {
    slug: "buffalo-city",
    name: "Buffalo City Metropolitan Municipality",
    province: "Eastern Cape",
    metaTitle: "Metertron for Buffalo City meter contractors | East London exports",
    metaDescription:
      "Field capture and municipal Excel exports for Buffalo City meter programmes. Review queues and offline sync on a Metertron.",
    primaryKeyword: "Buffalo City meter installation submission",
    summary:
      "East London and surrounds demand reliable offline capture and export templates tuned to your client workbook—not ad hoc depot spreadsheets.",
    indexable: true,
    nearby: ["nelson-mandela-bay", "mangaung", "cape-town"],
    faqs: [
      {
        q: "We serve both East London and rural stretches—one workflow?",
        a: "Use one field form standard with offline saves everywhere; differentiate only at export templates per client contract.",
      },
      {
        q: "How to avoid rejection for date formats?",
        a: "Fix date formatting in export templates after confirming with the client; never mix formats in one batch.",
      },
      {
        q: "Trial period?",
        a: "Seven days on Metertron before subscription.",
      },
    ],
    body: [
      "Buffalo City Metropolitan Municipality covers East London, Bhisho, and King William’s Town with coastal humidity, hillside suburbs, and rural approaches where meter contractors balance volume against travel cost. Payment often trails accepted Excel submissions and evidence, not installer effort alone.",
      "Implementing agents expect batches that mirror template column order and controlled values for outcomes, disposal, and meter types. Paper job cards re-entered at night introduce errors Buffalo City reviewers flag as ‘data quality’ issues. Metertron captures once, reviews centrally, exports with mapped columns.",
      "Connectivity drops on rural legs of otherwise urban routes. Offline-first workflows let teams complete jobs before returning to LTE at the depot. Supervisors must monitor sync backlog—assuming uploads happened on site is a common failure mode.",
      "Photo standards require legible serials and seal evidence; coastal glare demands deliberate retakes. Configure mandatory photos by job type; reviewers reject with actionable reasons visible to installers.",
      "Maintain versioned export templates when clients adjust headers. Pilot small exports after any template change. Keep redacted sample headers internally for mapping checks—never share customer PII with vendors.",
      "Stock control ties to serial rows: issue units to teams or orders and reconcile before export. Client audits sample serial continuity; fix mismatches while crews are still in the area.",
      "Cross-border work with Nelson Mandela Bay agents may use different templates even within the Eastern Cape. Clone templates and naming conventions per client.",
      "POPIA: collect only required fields; manage user access tightly; route batch emails to contractual client addresses.",
      "Start Metertron’s 7-day trial with full product access—validate the export loop with one team serving Buffalo City before scaling invites across all installers.",
      "East London’s coastal weather patterns mirror Nelson Mandela Bay—plan photo retakes on site rather than after sync. Required photo slots per job type prevent ‘we’ll upload later’ promises that break review SLAs when clients expect batch closure.",
      "Bhisho and King William’s Town legs add travel time; offline capture ensures those jobs are complete before returning to depot LTE. Supervisors should not assume uploads happened on the N2—check sync queues explicitly each evening.",
      "When clients reject rows for old-meter disposal codes, fix catalogs and training rather than retyping disposal values only in Excel. Metertron dropdowns aligned to client vocabularies stop the same rejection from repeating on the next hundred installs.",
      "Principal contractors working Buffalo City and Nelson Mandela Bay concurrently should label export filenames with client and template version codes both offices recognise. Similar agent branding does not mean interchangeable spreadsheets—validate headers separately.",
      "Audit samples often focus on serial continuity and seal photos. Pre-export spot checks by team leaders—five random jobs per day—catch systemic issues before they become batch-level rejections that delay payment for the whole company.",
      "Rural approaches from East London may leave crews offline for hours—design lunch stops as sync opportunities where LTE returns, not as unstructured downtime that pushes uploads to midnight.",
      "King William’s Town historical precincts sometimes restrict vehicle access—capture access denial codes so exports do not show phantom completions when installers could not reach the stand.",
      "Buffalo City implementing agents may share reviewers with Nelson Mandela Bay contractors—consistent export filenames and template version tags help those reviewers process files faster, indirectly improving your acceptance times.",
      "Train new installers on Metertron before peak programme weeks; onboarding during peak guarantees rejection clusters from basic photo omissions that veterans avoid without thinking.",
      "Buffalo City clients evaluating contractor references increasingly ask about documentation discipline—demonstrate Metertron review history and template versioning in tenders without citing unpublished municipal performance figures you cannot verify.",
      "East London harbour humidity corrodes cheap phone mounts—stabilise devices for serial macros anyway; blurry exports cost more than a better mount.",
      "When Buffalo City batches bounce for trim errors on meter numbers, fix barcode scanner settings in the field app rather than correcting hundreds of rows manually in Excel after export.",
      "Buffalo City office staff should never ‘fix’ exports in Excel without updating the underlying Metertron job—otherwise the next resubmission contradicts the audit trail clients sample during disputes.",
      "East London team leaders should sign off Metertron review queues daily during active programmes so Buffalo City exports reflect the same jobs installers believe they finished—not a drifting subset missing Friday uploads.",
      "Start Buffalo City pilots on Metertron’s seven-day trial before tender peaks demand instant scale.",
    ],
  },
  {
    slug: "mangaung",
    name: "Mangaung Metropolitan Municipality",
    province: "Free State",
    metaTitle: "Metertron for Mangaung meter contractors | Bloemfontein submissions",
    metaDescription:
      "Offline capture, review, and Excel export templates for Mangaung meter contractors. Full product access with a 7-day trial.",
    primaryKeyword: "Mangaung Bloemfontein meter contractor Excel",
    summary:
      "Free State contractors serving Bloemfontein and Mangaung need consistent field capture and client-aligned exports without duplicate admin.",
    indexable: true,
    nearby: ["johannesburg", "tshwane", "buffalo-city"],
    faqs: [
      {
        q: "We sometimes subcontract Gauteng teams—does multi-region work?",
        a: "Use separate export templates per client jurisdiction; field forms can stay consistent so training travels with crews.",
      },
      {
        q: "Template updates mid-contract?",
        a: "Clone and version Metertron export mappings when you receive a new workbook layout; rerun a five-row pilot with the client.",
      },
      {
        q: "Pricing model?",
        a: "Metertron, 7-day trial—no tier maze for install volume.",
      },
    ],
    body: [
      "Mangaung Metropolitan Municipality centres on Bloemfontein with surrounding towns where meter programmes combine residential density and long travel legs. Contractors compete on price and reliability, yet client retention often hinges on submission quality—Excel batches accepted without repeated correction cycles.",
      "Free State implementing agents use spreadsheet intake familiar across South Africa: fixed headers, strict serial formatting, and status values drawn from small allowed sets. Installers capture accurately while office staff re-type into client files—a duplication Mangaung supervisors feel during winter peaks and end-of-month pushes.",
      "Connectivity in Bloemfontein is generally usable but not universal in basements and remote stands. Offline capture ensures jobs finish on site; sync at the depot with visible queue status. Load-shedding still interrupts towers; design workflows assuming sync is asynchronous.",
      "Metertron catalogs align field dropdowns with export values—seal types, faults, disposal routes—reducing ‘looks fine to us’ rows that fail client validation. Reviewers approve only complete jobs, creating an audit trail if disputes arise later.",
      "Export templates encode how job fields become client columns. When engineers rename headers, clone templates rather than editing history blindly. Document template version in export filenames your office already uses.",
      "Photos must prove serials and seals; train retakes on site. Job-linked photos beat shared folders that desynchronise from spreadsheet rows after busy weeks.",
      "Stock issued to teams should match captured new meters before export. Investigate variances early—return visits across Mangaung sprawl are costly.",
      "POPIA-aware capture minimises personal data; revoke access for departed staff; limit export permissions to office leads.",
      "Prove value with Metertron’s 7-day trial with full product access: one Bloemfontein depot, one validated pilot export, then scale. Contractors with Gauteng contracts reuse training and swap export templates only.",
      "Bloemfontein winter mornings and dust on outdoor cabinets affect serial photos—train crews to pause and retake rather than exporting unreadable evidence. Reviewers should reject with one clear reason so return visits are minimal on Mangaung’s wide geography.",
      "University and government housing pockets may have access rules that delay installs—capture structured access outcomes so exports distinguish incomplete visits from finished work. Misclassified rows create client disputes that are expensive to unwind after batch acceptance.",
      "Free State agents may share template conventions with Gauteng counterparts; still obtain the workbook issued for your contract rather than copying from a sister company. Metertron template cloning makes alignment fast once you have the authoritative header row.",
      "Stock controllers in Mangaung should reconcile weekly during active programmes, not only at month-end when variances require forensic phone calls to installers. Tie issues to work orders where possible so export serials match storeroom records before files leave the office.",
      "When tender references ask about submission reliability, show internal rejection-rate trends by reason code after implementing review discipline—not anecdotal claims. Metertron history supports operational KPIs clients increasingly expect from contractors.",
      "Bloemfontein heat and thunderstorms affect both crews and office power—offline capture and local photo storage keep field progress independent of office load-shedding schedules.",
      "Mangaung hostel and student housing areas may have high turnover of occupants—keep notes factual and minimal; avoid storing personal details beyond contract requirements in job records.",
      "Free State travel distances make return visits expensive—invest in first-time-right validation rules in forms even if they add thirty seconds per install on site.",
      "When Gauteng teams rotate into Mangaung for peak support, keep their export permissions restricted to the templates they are trained on to prevent accidental cross-client submissions.",
      "Mangaung owners can start Metertron’s 7-day trial, validate one Bloemfontein export against a redacted client header, and only then scale invites—simple access pricing avoids negotiating tier upgrades mid-programme.",
      "Winter frost on outdoor dials is not an excuse for skipping seal photos—reviewers need evidence the installation was finished and secured, not only that the crew visited before frost melted.",
      "Keep a printed one-page export checklist at the Bloemfontein office desk: template version, row count, reviewer initials—human habit reinforces Metertron discipline when month-end pressure rises.",
      "Mangaung implementing agents may request resubmission samples—regenerate from locked jobs in Metertron instead of editing last month’s Excel from memory.",
      "Bloemfontein supervisors should align stock issues with daily Metertron sync status so serial rows exported for Mangaung clients never reference meters still sitting in the storeroom.",
      "Mangaung field and office teams share one Metertron organisation—no tier negotiation while programmes are live in South Africa.",
    ],
  },
  {
    slug: "msunduzi",
    name: "Msunduzi Local Municipality",
    province: "KwaZulu-Natal",
    metaTitle: "Metertron for Msunduzi meter contractors | Pietermaritzburg exports",
    metaDescription:
      "Capture and Excel exports for Msunduzi meter work near Pietermaritzburg. Template mapping and offline field sync on Metertron.",
    primaryKeyword: "Msunduzi Pietermaritzburg meter submission",
    summary:
      "Pietermaritzburg-area contractors benefit from the same capture discipline as coastal KZN metros—with export templates per client pack.",
    indexable: true,
    nearby: ["ethekwini", "johannesburg", "cape-town"],
    faqs: [
      {
        q: "We work both Msunduzi and eThekwini—one system?",
        a: "Yes—shared field forms, separate export templates per client template. Validate each header row independently.",
      },
      {
        q: "Hilly routes and estates affect GPS—what then?",
        a: "Record coordinates when available; note weak GPS instead of blocking save so reviewers understand context.",
      },
      {
        q: "How to start?",
        a: "Seven-day trial on Metertron; pilot with redacted client headers before full crew rollout.",
      },
    ],
    body: [
      "Msunduzi Local Municipality around Pietermaritzburg sits inland from Durban with hilly suburbs, university housing, and commercial strips where meter contractors balance local programmes with overflow work from broader KZN clients. Submissions still flow through structured spreadsheets and evidence expectations set by implementing agents—not informal summaries.",
      "Inland KZN routes share connectivity challenges with eThekwini—pockets of weak signal and load-shedding despite proximity to major corridors. Offline-first capture prevents paper fallback when apps refuse to save without LTE. Metertron completes jobs on device, syncs when practical, and shows supervisors what remains queued.",
      "Contractors doubling between Msunduzi and eThekwini must not assume one export file serves both clients. Header rows and status vocabularies differ by contract even within one province. Metertron clones templates per client while keeping installer training stable—same form, different export mapping.",
      "Pietermaritzburg estates and multi-dwelling units need structured addresses and photo sets proving access and install location. Dropdown catalogs reduce ambiguous free text that breaks client filters. Review queues catch incomplete jobs before they pollute a batch export.",
      "Validate export templates against the latest workbook from your engineer—never a forwarded copy from another contractor. Run five-row pilots after any header change. Metertron includes an eThekwini-oriented baseline useful as a reference for KZN-style mappings, but Msunduzi packages require their own validated template.",
      "Serial and stock alignment matters for client sampling. Issue meters to teams or work orders; compare to captured serials pre-export. Fix swaps while crews are still in Msunduzi rather than after rejection.",
      "Photo clarity on inland humidity days still matters—wipe covers, avoid glare, retake serials on site. Link photos to jobs for reviewer efficiency.",
      "POPIA: minimum necessary fields, secured phones, prompt removal of leavers from the tenant.",
      "Metertron and 7-day trial let Msunduzi contractors test capture-to-export without negotiating feature tiers—scale installers when pilot exports pass client review.",
      "Pietermaritzburg’s elevation and weather shifts can surprise crews accustomed to coastal humidity—keep serial photography standards identical to eThekwini routes so reviewers apply one evidence rulebook across your KZN operations.",
      "Msunduzi programmes may include stands where account identifiers are sensitive—use role limits on exports and avoid forwarding batches through personal email. POPIA accountability sits with your organisation even when clients drive field requirements.",
      "When installers work Msunduzi in the morning and eThekwini in the afternoon, same-day review prevents mixing jobs into the wrong export template. Office discipline—template choice checked against work-order client ID—beats heroic end-of-week sorting.",
      "Hilly suburbs challenge GPS; honest metadata about weak fixes helps client GIS teams more than fabricated precision. Train crews to note ‘GPS unavailable’ states rather than retrying until batteries drain.",
      "Local implementing agents update templates with little notice—subscribe to their communication channels and schedule template cloning in Metertron the same week you receive a new pack. Delayed mapping updates cause preventable rejections that look like field errors.",
      "Msunduzi stands near commercial corridors may share boundary walls with eThekwini clients operationally—your contracts still define which template applies; never default by geography alone.",
      "Pietermaritzburg rainfall can delay outdoor serial photography—carry small shelters or use vehicle shade; reviewers treat unreadable serials as rejections regardless of weather excuses.",
      "Inland KZN crews rotating from Durban should not reuse eThekwini export files for Msunduzi batches without explicit template selection—similar province, different client rules.",
      "University term breaks shift access patterns—update work-order scheduling and review rosters when student housing installs cluster in short windows.",
      "Msunduzi contractors paired with eThekwini work should document which client owns each stand in work orders so export staff never apply the wrong template because the suburb ‘felt like Durban’.",
      "Midlands mist can weaken GPS and photos alike—capture stand identifiers from work orders in structured fields so reviewers can match rows even when coordinates are absent.",
      "Use Metertron’s trial week to train Pietermaritzburg team leaders on rejection reasons, not only installers on capture—review quality determines export acceptance as much as field speed.",
      "Msunduzi batches sent alongside eThekwini work should use distinct export filenames even when uploaded the same day—reviewers process files in parallel and confusion delays both payments.",
      "Pietermaritzburg review leads should reject incomplete Msunduzi jobs before they enter export batches—partial rows are harder to unwind than upfront retake requests to field teams.",
      "Msunduzi contractors can evaluate Metertron on the standard seven-day trial before rolling capture out across every Pietermaritzburg crew.",
    ],
  },
];

export function getMunicipality(slug: string) {
  return MUNICIPALITIES.find((row) => row.slug === slug) ?? null;
}

export function allMunicipalities() {
  return MUNICIPALITIES;
}
