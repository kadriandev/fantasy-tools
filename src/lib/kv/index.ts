import { Resource } from "sst";
import Redis, { Cluster } from "ioredis";

const kv =
  Resource.App.stage === "production"
    ? new Cluster(
        [{ host: Resource.RedisV2.host, port: Resource.RedisV2.port }],
        {
          slotsRefreshTimeout: 20000,
          redisOptions: {
            tls: { checkServerIdentity: () => undefined },
            username: Resource.RedisV2.username,
            password: Resource.RedisV2.password,
          },
        },
      )
    : new Redis({
        host: Resource.RedisV2.host,
        port: Resource.RedisV2.port,
      });

kv.on("error", (error) => {
  console.info("[ioredis]", error);
});

export function getRedisClient() {
  return kv;
}

/**
 * Cache wrapper for async functions
 * @param key - Cache key
 * @param ttlSeconds - Time to live in seconds
 * @param fn - Async function to execute if cache miss
 * @returns Cached or fresh data
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await kv.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    console.error(`[cache] Error reading cache for key ${key}:`, error);
  }

  // Cache miss - execute function
  const result = await fn();

  try {
    // Store in cache with TTL
    await kv.setex(key, ttlSeconds, JSON.stringify(result));
  } catch (error) {
    console.error(`[cache] Error writing cache for key ${key}:`, error);
  }

  return result;
}
