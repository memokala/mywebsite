export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  // Bypasses limit if Vercel KV is not configured (e.g. local dev)
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  const now = Math.floor(Date.now() / 1000);
  const rateLimitKey = `ratelimit:${key}`;

  try {
    // Dynamic import to prevent module-level crash when KV env vars are missing
    const { kv } = await import("@vercel/kv");

    const current = await kv.get<number>(rateLimitKey);

    if (current !== null && current >= limit) {
      const ttl = await kv.ttl(rateLimitKey);
      return {
        success: false,
        limit,
        remaining: 0,
        reset: now + (ttl > 0 ? ttl : windowSeconds),
      };
    }

    const multi = kv.multi();
    multi.incr(rateLimitKey);
    multi.ttl(rateLimitKey);
    const results = await multi.exec();

    if (!results || results.length < 2) {
      return { success: true, limit, remaining: 1, reset: 0 };
    }

    const count = results[0] as number;
    const ttl = results[1] as number;

    if (ttl === -1 || ttl === null) {
      await kv.expire(rateLimitKey, windowSeconds);
    }

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - count),
      reset: now + (ttl > 0 ? ttl : windowSeconds),
    };
  } catch (error) {
    console.error("Rate limiting storage error:", error);
    // Fail-open to ensure service availability if Vercel KV is temporarily down
    return { success: true, limit, remaining: 1, reset: 0 };
  }
}
