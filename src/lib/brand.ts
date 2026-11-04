/** Product names and browser storage keys. Legacy MeterVault keys are read once for migration. */
export const BRAND = {
  name: "Metertron",
  mark: "MT",
  tagline: "Every meter, accounted for.",
  description: "Field-to-municipality meter installation software. Capture. Verify. Submit.",
  fieldAppName: "Metertron Field",
  fieldDescription: "Meter-change capture for Metertron field technicians.",
  officeAppName: "Metertron Manager",
  officeDescription: "Review captures, stock, and municipal exports.",
  themeColor: "#147A45",
  backgroundColor: "#F7FAF8",
  grove: "#0E3D24",
  leaf: "#147A45",
  leafDeep: "#0F5C34",
  citrus: "#F07A1A",
  citrusDeep: "#C45A08",
  mist: "#E8F5EE",
  fault: "#D92D20",
} as const;

export const STORAGE = {
  theme: "metertron-theme",
  sunlight: "metertron-sunlight",
  tech: "metertron-tech",
  pauseSync: "metertron-pause-sync",
  fieldDb: "metertron-field",
  outbox: "metertron-outbox",
  cache: "metertron-field-v1",
} as const;

/** Previous product keys — read during one-time client migration, then ignore. */
export const LEGACY_STORAGE = {
  theme: "metervault-theme",
  sunlight: "metervault-sunlight",
  tech: "metervault-tech",
  pauseSync: "metervault-pause-sync",
  fieldDb: "metervault-field",
  outbox: "metervault-outbox",
  cache: "metervault-field-v1",
} as const;

export const SESSION_COOKIE = "metertron-session";
export const LEGACY_SESSION_COOKIE = "metervault-session";

export function readMigratedStorage(key: keyof typeof STORAGE): string | null {
  if (typeof window === "undefined") return null;
  try {
    const current = localStorage.getItem(STORAGE[key]);
    if (current != null) return current;
    const legacy = localStorage.getItem(LEGACY_STORAGE[key]);
    if (legacy == null) return null;
    localStorage.setItem(STORAGE[key], legacy);
    localStorage.removeItem(LEGACY_STORAGE[key]);
    return legacy;
  } catch {
    return null;
  }
}
