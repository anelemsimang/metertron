import ExcelJS from "exceljs";
import { openStreetMapUrl } from "@/lib/openstreetmap";
import type { ExportCell } from "./cells";
import { EXPORT_HEADERS, EXPORT_SHEET_NAME, MAP_EXPORT_HEADERS } from "./headers";
import type { ExportJob, PhotoEvidence } from "./job";
import { toExportRow } from "./map";

const ZONE = "Africa/Johannesburg";

export { MAP_EXPORT_HEADERS };

export type ExportWorkbookTemplate = {
  sheetName?: string;
  headers?: string[];
  mapHeaders?: string[];
};

function zoneParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? "0");
  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

/**
 * Excel datetimes are timezone-naive. Build a UTC Date whose clock matches
 * Johannesburg wall time so the serial shows the field time, not a shifted UTC.
 */
function excelWallClock(date: Date, withTime: boolean) {
  const parts = zoneParts(date);
  if (!withTime) return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
}

function writeCell(cell: ExcelJS.Cell, value: ExportCell) {
  switch (value.kind) {
    case "blank":
      cell.value = null;
      return;
    case "text":
      cell.value = value.value;
      return;
    case "number":
      cell.value = value.value;
      return;
    case "bool":
      cell.value = value.value;
      return;
    case "date":
      cell.value = excelWallClock(value.value, false);
      cell.numFmt = "yyyy-mm-dd";
      return;
    case "datetime":
      cell.value = excelWallClock(value.value, true);
      cell.numFmt = "yyyy-mm-dd hh:mm:ss";
      return;
  }
}

function mapUrl(photo: PhotoEvidence | null | undefined) {
  if (photo?.latitude == null || photo?.longitude == null) return null;
  return openStreetMapUrl(photo.latitude, photo.longitude);
}

/** Default OpenStreetMap columns for the three GPS photo slots. */
function defaultMapCells(job: ExportJob): Array<string | null> {
  return [mapUrl(job.photos.meterNumber), mapUrl(job.photos.waterPoint), mapUrl(job.photos.ciu)];
}

export async function buildExportWorkbook(jobs: ExportJob[], template?: ExportWorkbookTemplate) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Metertron";
  workbook.created = new Date();
  const sheetName = template?.sheetName?.trim() || EXPORT_SHEET_NAME;
  const municipalHeaders = template?.headers?.length ? template.headers : [...EXPORT_HEADERS];
  const mapHeaders = template?.mapHeaders ?? [...MAP_EXPORT_HEADERS];
  const headers = [...municipalHeaders, ...mapHeaders];
  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  sheet.addRow(headers);
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  for (const job of jobs) {
    const values = toExportRow(job, municipalHeaders);
    const row = sheet.addRow(new Array(headers.length).fill(null));
    values.forEach((value, index) => writeCell(row.getCell(index + 1), value));
    const maps = defaultMapCells(job);
    mapHeaders.forEach((_, index) => {
      const cell = row.getCell(municipalHeaders.length + index + 1);
      cell.value = maps[index] ?? null;
    });
  }
  sheet.columns.forEach((column) => {
    column.width = 18;
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
