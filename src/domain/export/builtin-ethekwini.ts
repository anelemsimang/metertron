import { EXPORT_HEADERS, EXPORT_SHEET_NAME, MAP_EXPORT_HEADERS } from "./headers";
import { LIST_PHRASES } from "./phrases";

/** Built-in municipal export layout cloned from the current hard-coded headers path. */
export const BUILTIN_ETHEKWINI_KEY = "ethekwini-ws7761";

export const BUILTIN_ETHEKWINI = {
  key: BUILTIN_ETHEKWINI_KEY,
  name: "eThekwini Municipality (WS7761)",
  sheetName: EXPORT_SHEET_NAME,
  statusExportValue: "Final",
  headers: [...EXPORT_HEADERS] as string[],
  mapHeaders: [...MAP_EXPORT_HEADERS] as string[],
  listPhrases: {
    oldMeterSuffix: LIST_PHRASES.oldMeterSuffix,
    connectionValue: LIST_PHRASES.connectionValue,
  },
  sourceBuiltin: BUILTIN_ETHEKWINI_KEY,
} as const;

export type BuiltinExportDefinition = {
  key: string;
  name: string;
  sheetName: string;
  statusExportValue: string;
  headers: string[];
  mapHeaders: string[];
  listPhrases: { oldMeterSuffix: string; connectionValue: string };
  sourceBuiltin: string;
};

export function builtinExportDefinitions(): BuiltinExportDefinition[] {
  return [
    {
      key: BUILTIN_ETHEKWINI.key,
      name: BUILTIN_ETHEKWINI.name,
      sheetName: BUILTIN_ETHEKWINI.sheetName,
      statusExportValue: BUILTIN_ETHEKWINI.statusExportValue,
      headers: [...BUILTIN_ETHEKWINI.headers],
      mapHeaders: [...BUILTIN_ETHEKWINI.mapHeaders],
      listPhrases: { ...BUILTIN_ETHEKWINI.listPhrases },
      sourceBuiltin: BUILTIN_ETHEKWINI.sourceBuiltin,
    },
  ];
}
