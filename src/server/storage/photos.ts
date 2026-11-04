import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Tenant-namespaced photo storage.
 * Default driver: local filesystem under STORAGE_ROOT (or .data/storage).
 * S3/Supabase Storage can plug in later via STORAGE_DRIVER=s3.
 */

export function photoObjectKey(organisationId: string, jobId: string, photoId: string) {
  return `${organisationId}/installations/${jobId}/${photoId}.jpg`;
}

export function sha256(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

function storageRoot() {
  return process.env.STORAGE_ROOT?.trim() || path.join(process.cwd(), ".data", "storage");
}

async function putFs(key: string, bytes: Buffer) {
  const file = path.join(storageRoot(), ...key.split("/"));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, bytes);
  return key;
}

async function getFs(key: string) {
  const file = path.join(storageRoot(), ...key.split("/"));
  return readFile(file);
}

/** Dual-write helper: persist to object storage and return key + hash. Keeps bytea in DB for now. */
export async function storePhotoBytes(organisationId: string, jobId: string, photoId: string, bytes: Buffer) {
  const key = photoObjectKey(organisationId, jobId, photoId);
  const driver = process.env.STORAGE_DRIVER?.trim() || "fs";
  if (driver === "fs") await putFs(key, bytes);
  else if (driver === "none") {
    // Tests / dry environments — skip disk write, still return key.
  } else {
    await putFs(key, bytes);
  }
  return { storageKey: key, contentSha256: sha256(bytes) };
}

export async function readPhotoBytes(storageKey: string | null | undefined, fallback: Buffer | null | undefined) {
  if (storageKey) {
    try {
      const driver = process.env.STORAGE_DRIVER?.trim() || "fs";
      if (driver !== "none") return await getFs(storageKey);
    } catch {
      // Fall through to bytea.
    }
  }
  return fallback ?? null;
}
