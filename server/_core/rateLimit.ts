import type { Request } from 'express';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function getRequestKey(req: Request | undefined, namespace: string, scope?: string) {
  if (!req || !('headers' in req) || !req.headers) {
    return `${namespace}:${scope || 'test-runner'}`;
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim();
  const resolvedScope = scope || ip || ('ip' in req ? req.ip : '') || 'unknown';
  return `${namespace}:${resolvedScope}`;
}

export function enforceRateLimit(
  req: Request | undefined,
  namespace: string,
  limit: number,
  windowMs: number,
  scope?: string
) {
  const key = getRequestKey(req, namespace, scope);
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    const seconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    throw new Error(`Too many requests. Please try again in ${seconds} seconds.`);
  }

  existing.count += 1;
  buckets.set(key, existing);
}
