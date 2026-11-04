type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Simple in-memory fixed window. Enough for single-node / serverless warm instances. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    buckets.set(key, next);
    return { ok: true as const, remaining: limit - 1, resetAt: next.resetAt };
  }
  if (current.count >= limit) {
    return { ok: false as const, remaining: 0, resetAt: current.resetAt };
  }
  current.count += 1;
  return { ok: true as const, remaining: limit - current.count, resetAt: current.resetAt };
}
