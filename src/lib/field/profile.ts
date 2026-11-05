import { readMigratedStorage, STORAGE } from "@/lib/brand";

export type TechProfile = { username: string; name: string; organisationName?: string };

export function readTechProfile(): TechProfile {
  if (typeof window === "undefined") return { username: "tech", name: "Technician", organisationName: "" };
  try {
    const raw = readMigratedStorage("tech");
    if (!raw) return { username: "tech", name: "Technician", organisationName: "" };
    const parsed = JSON.parse(raw) as TechProfile;
    if (!parsed.username || !parsed.name) return { username: "tech", name: "Technician", organisationName: "" };
    return {
      username: parsed.username,
      name: parsed.name,
      organisationName: typeof parsed.organisationName === "string" ? parsed.organisationName : "",
    };
  } catch {
    return { username: "tech", name: "Technician", organisationName: "" };
  }
}

export function writeTechProfile(profile: TechProfile) {
  localStorage.setItem(STORAGE.tech, JSON.stringify(profile));
}

/** Registered tenant name for locked company fields on capture forms. */
export function organisationCompanyName() {
  return readTechProfile().organisationName?.trim() || "";
}

export function syncPaused() {
  return typeof window !== "undefined" && readMigratedStorage("pauseSync") === "on";
}

export function setSyncPaused(paused: boolean) {
  localStorage.setItem(STORAGE.pauseSync, paused ? "on" : "off");
}
