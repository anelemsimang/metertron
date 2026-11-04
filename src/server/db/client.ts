import { AsyncLocalStorage } from "node:async_hooks";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Sql = ReturnType<typeof postgres>;
export type AppDb = PostgresJsDatabase<typeof schema>;

/** Single connection so session GUCs apply to every query (pooler-safe alternative to BEGIN). */
const poolSettings = "max1-idle60-connect30-rls";

const globalForDb = globalThis as unknown as {
  metertronSql?: Sql;
  metertronUrl?: string;
  metertronPool?: string;
};

const dbStore = new AsyncLocalStorage<AppDb>();
const orgStore = new AsyncLocalStorage<string | "bypass">();

/** Serialize RLS context switches on the shared connection. */
let gate: Promise<unknown> = Promise.resolve();
function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = gate.then(fn, fn);
  gate = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function databaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not set. Add the Supabase connection string to .env and restart.");
  return url;
}

export function resetDb() {
  void globalForDb.metertronSql?.end({ timeout: 1 });
  globalForDb.metertronSql = undefined;
}

export function getSql() {
  const url = databaseUrl();
  const supabase = url.includes("supabase");
  if (globalForDb.metertronUrl !== url || globalForDb.metertronPool !== poolSettings) {
    resetDb();
    globalForDb.metertronUrl = url;
    globalForDb.metertronPool = poolSettings;
  }
  globalForDb.metertronSql ??= postgres(url, {
    max: 1,
    idle_timeout: 60,
    connect_timeout: 30,
    prepare: !supabase,
    ssl: supabase ? "require" : undefined,
  });
  return globalForDb.metertronSql;
}

function rootDb() {
  return drizzle(getSql(), { schema });
}

/** Returns the request-scoped DB (inside withOrg / withBypassRls) or the root pool. */
export function getDb(): AppDb {
  return dbStore.getStore() ?? rootDb();
}

/**
 * Run work with RLS GUC set to the tenant (session-level on the single pooled connection).
 * Re-entrant when already inside the same org (or bypass) context.
 */
export async function withOrg<T>(organisationId: string, fn: () => Promise<T>): Promise<T> {
  const active = orgStore.getStore();
  if (active === organisationId || active === "bypass") return fn();
  return exclusive(async () => {
    const client = getSql();
    await client`select set_config('app.current_org_id', ${organisationId}, false)`;
    await client`select set_config('app.bypass_rls', ${"off"}, false)`;
    try {
      return await orgStore.run(organisationId, () => dbStore.run(rootDb(), fn));
    } finally {
      await client`select set_config('app.current_org_id', ${""}, false)`;
      await client`select set_config('app.bypass_rls', ${"off"}, false)`;
    }
  });
}

/** Auth, migrations, and platform tools — RLS bypass for the connection. */
export async function withBypassRls<T>(fn: () => Promise<T>): Promise<T> {
  if (orgStore.getStore() === "bypass") return fn();
  return exclusive(async () => {
    const client = getSql();
    await client`select set_config('app.bypass_rls', ${"on"}, false)`;
    await client`select set_config('app.current_org_id', ${""}, false)`;
    try {
      return await orgStore.run("bypass", () => dbStore.run(rootDb(), fn));
    } finally {
      await client`select set_config('app.bypass_rls', ${"off"}, false)`;
    }
  });
}

const transientCodes = new Set(["CONNECT_TIMEOUT", "ENOTFOUND", "EAI_AGAIN", "ETIMEDOUT", "ECONNRESET", "ECONNREFUSED"]);

export function isTransientDbError(error: unknown) {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    if ("code" in current && typeof current.code === "string" && transientCodes.has(current.code)) return true;
    if ("message" in current && typeof current.message === "string" && /ENOTFOUND|EAI_AGAIN|CONNECT_TIMEOUT|ETIMEDOUT/.test(current.message)) return true;
    current = "cause" in current ? current.cause : undefined;
  }
  return false;
}

export function safeDbMessage(error: unknown) {
  if (isTransientDbError(error)) return "The database could not be reached. Check your connection and refresh.";
  const cause = error instanceof Error && "cause" in error && error.cause instanceof Error ? error.cause.message : "";
  const message = cause || (error instanceof Error ? error.message : "The database could not be reached.");
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://…");
}
