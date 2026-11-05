import { METER_CHANGE_V1 } from "@/domain/forms/meter-change-v1";
import { organisationCompanyName, readTechProfile } from "@/lib/field/profile";
import type { Answers } from "@/domain/forms/types";

export const ADDRESS_FIELDS = ["houseNumber", "street", "unitNumber", "lotNumber", "townId"] as const;

const meterCatalog = {
  size: [{ code: "15mm", label: "15mm", isDefault: true }],
  class: [{ code: "class_d", label: "Class D", isDefault: true }],
  type: [{ code: "ultrasonic", label: "Ultrasonic", isDefault: true }],
};

export function defaultAnswers(): Answers {
  const tech = readTechProfile();
  const companyName = organisationCompanyName();
  return {
    date: new Date().toISOString().slice(0, 10),
    ...(companyName ? { companyName } : {}),
    other: "Meter replacement",
    meterSizeId: meterCatalog.size[0].code,
    meterClassId: meterCatalog.class[0].code,
    meterTypeId: meterCatalog.type[0].code,
    installerId: tech.name,
    smartDeviceReading: 0,
  };
}

/** Keep locked org fields aligned with the signed-in tenant (overrides local edits). */
export function applyOrganisationDefaults(answers: Answers): Answers {
  const companyName = organisationCompanyName();
  if (!companyName) return answers;
  return { ...answers, companyName };
}

export function catalogOptions(kind: "size" | "class" | "type") {
  return meterCatalog[kind].map((row) => ({ value: row.code, label: row.label }));
}

export function installerOptions() {
  const tech = readTechProfile();
  return [{ value: tech.name, label: `${tech.name} (you)` }];
}

export { METER_CHANGE_V1 };
