export type ChangelogEntry = {
  date: string;
  title: string;
  body: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-03-15",
    title: "Marketing site rebuild",
    body: [
      "Public marketing pages expanded with product, features, solutions, municipality hubs and long-form resources.",
      "Trial messaging aligned to the 7-day Metertron access.",
    ],
  },
  {
    date: "2026-02-20",
    title: "Municipal export templates",
    body: [
      "Organisations can publish and clone Excel export templates, including an eThekwini-oriented starting layout for validation against client packs.",
    ],
  },
  {
    date: "2026-01-28",
    title: "Field offline sync improvements",
    body: [
      "Clearer sync status in the field app so installers know what is saved locally versus uploaded for review.",
    ],
  },
  {
    date: "2025-12-10",
    title: "Review queue reasons",
    body: [
      "Supervisors can reject jobs with structured reasons that surface back to field teams for first-time-right follow-ups.",
    ],
  },
  {
    date: "2025-11-01",
    title: "Metertron",
    body: [
      "Access simplified to full product access per organisation with a 7-day trial. WhatsApp or call us for pricing.",
    ],
  },
];
