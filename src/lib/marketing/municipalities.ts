export type MunicipalityPage = {
  slug: string;
  name: string;
  province: string;
  summary: string;
  body: string[];
  /** Only index pages with unique substance. */
  indexable: boolean;
};

export const MUNICIPALITIES: MunicipalityPage[] = [
  {
    slug: "ethekwini",
    name: "eThekwini Municipality",
    province: "KwaZulu-Natal",
    summary: "How Metertron helps contractors prepare meter-change exports aligned to eThekwini-style Excel submissions.",
    indexable: true,
    body: [
      "eThekwini water meter programmes typically require structured Excel submissions with fixed headers, meter identifiers, and status values that match the municipality’s intake process. Contractors who capture cleanly in the field still lose days when office staff re-type columns by hand.",
      "Metertron ships an eThekwini-oriented export template as a starting point your organisation can clone and adjust. Field forms collect the facts once; review locks quality; export maps answers into the sheet the client expects.",
      "If you run routes in eThekwini and need template alignment reviewed against your current contract pack, WhatsApp or call us with a redacted sample header row — not customer PII.",
    ],
  },
  {
    slug: "city-of-cape-town",
    name: "City of Cape Town",
    province: "Western Cape",
    summary: "Placeholder for Cape Town meter installation programmes — publish unique guidance when available.",
    indexable: false,
    body: [
      "City of Cape Town meter and prepaid programmes use municipality-specific submission rules. Metertron supports per-organisation export templates so contractors can match the layout their contract requires.",
      "We will publish Cape Town-specific guidance when we have unique, non-duplicative operational detail. Until then this page is not indexed.",
    ],
  },
  {
    slug: "city-of-johannesburg",
    name: "City of Johannesburg",
    province: "Gauteng",
    summary: "Placeholder for Johannesburg meter installation programmes — publish unique guidance when available.",
    indexable: false,
    body: [
      "Johannesburg metro work often spans multiple implementing agents and spreadsheet conventions. Metertron keeps capture, review, and export inside one organisation so you are not inventing a new process for each suburb batch.",
      "Unique Jo’burg guidance will be published when we can add substance beyond a generic municipal landing page.",
    ],
  },
];

export function getMunicipality(slug: string) {
  return MUNICIPALITIES.find((row) => row.slug === slug) ?? null;
}

export function allMunicipalities() {
  return MUNICIPALITIES;
}
