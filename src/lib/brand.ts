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
  themeColor: "#00B4C8",
  backgroundColor: "#F4F7F9",
  reservoir: "#0B1F33",
  flow: "#00B4C8",
  flowDeep: "#00849A",
  verified: "#A8E63A",
  signal: "#FFB020",
  fault: "#E5484D",
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
