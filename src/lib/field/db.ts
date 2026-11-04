import Dexie, { type EntityTable } from "dexie";
import { LEGACY_STORAGE, STORAGE } from "@/lib/brand";

export type SyncState = "local" | "syncing" | "synced" | "failed";

export type DraftRecord = {
  id: string;
  idempotencyKey: string;
  formKey: "meter-change";
  formVersion: number;
  answers: Record<string, unknown>;
  lifecycle: "draft" | "queued";
  syncState: SyncState;
  serverId?: string;
  lastError?: string;
  createdAt: number;
  updatedAt: number;
};

export type PhotoRecord = {
  id: string;
  draftId: string;
  fieldId: string;
  sequence: number;
  blob: Blob;
  capturedAt: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  idempotencyKey: string;
  syncState: SyncState;
};

export type OutboxRecord = {
  id?: number;
  kind: "job" | "photo";
  idempotencyKey: string;
  draftId: string;
  photoId?: string;
  attempts: number;
  nextAttemptAt: number;
};

class FieldDb extends Dexie {
  drafts!: EntityTable<DraftRecord, "id">;
  photos!: EntityTable<PhotoRecord, "id">;
  outbox!: EntityTable<OutboxRecord, "id">;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      drafts: "id, updatedAt, syncState, idempotencyKey",
      photos: "id, draftId, fieldId, idempotencyKey",
      outbox: "++id, idempotencyKey, draftId, nextAttemptAt",
    });
  }
}

export const fieldDb = new FieldDb(STORAGE.fieldDb);

let migrated = false;

/** One-time copy from the previous IndexedDB name so offline drafts survive rebrand. */
export async function migrateLegacyFieldDb() {
  if (migrated || typeof indexedDB === "undefined") return;
  migrated = true;
  try {
    const names = await indexedDB.databases?.();
    const hasLegacy = names?.some((db) => db.name === LEGACY_STORAGE.fieldDb) ?? true;
    if (!hasLegacy) return;
    const currentCount = await fieldDb.drafts.count();
    if (currentCount > 0) return;

    const legacy = new FieldDb(LEGACY_STORAGE.fieldDb);
    await legacy.open();
    const [drafts, photos, outbox] = await Promise.all([
      legacy.drafts.toArray(),
      legacy.photos.toArray(),
      legacy.outbox.toArray(),
    ]);
    if (drafts.length === 0 && photos.length === 0 && outbox.length === 0) {
      legacy.close();
      return;
    }
    await fieldDb.transaction("rw", fieldDb.drafts, fieldDb.photos, fieldDb.outbox, async () => {
      if (drafts.length) await fieldDb.drafts.bulkPut(drafts);
      if (photos.length) await fieldDb.photos.bulkPut(photos);
      if (outbox.length) {
        for (const row of outbox) {
          const { id: _id, ...rest } = row;
          await fieldDb.outbox.add(rest);
        }
      }
    });
    legacy.close();
  } catch {
    // Ignore migration failures — fresh DB is still usable.
  }
}

const listeners = new Set<() => void>();

export function subscribeField(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyField() {
  listeners.forEach((listener) => listener());
}
