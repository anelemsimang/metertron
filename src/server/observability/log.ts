type LogFields = Record<string, unknown> & { organisationId?: string | null };

function line(level: string, message: string, fields?: LogFields) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    org_id: fields?.organisationId ?? null,
    ...fields,
  };
  delete (payload as { organisationId?: unknown }).organisationId;
  const serialized = JSON.stringify(payload);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.log(serialized);
}

export const log = {
  info: (message: string, fields?: LogFields) => line("info", message, fields),
  warn: (message: string, fields?: LogFields) => line("warn", message, fields),
  error: (message: string, fields?: LogFields) => line("error", message, fields),
};

export async function captureException(error: unknown, fields?: LogFields) {
  const message = error instanceof Error ? error.message : String(error);
  log.error("exception", {
    ...fields,
    error: message,
    stack: error instanceof Error ? error.stack : undefined,
    sentryConfigured: Boolean(process.env.SENTRY_DSN?.trim()),
  });
}
