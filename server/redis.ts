import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redis) return redis;

  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.log('[Redis] REDIS_URL not configured, caching disabled');
    return null;
  }

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    redis.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    redis.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redis.on('close', () => {
      console.log('[Redis] Connection closed');
    });

    // Асинхронное подключение без блокировки запуска сервера
    redis.connect().catch((err) => {
      console.error('[Redis] Failed to connect:', err.message);
      redis = null;
    });

    return redis;
  } catch (error) {
    console.error('[Redis] Initialization error:', error);
    return null;
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const cached = await client.get(key);
    if (!cached) return null;

    return JSON.parse(cached) as T;
  } catch (error) {
    console.error('[Redis] Get error:', error);
    return null;
  }
}

export async function setCache(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('[Redis] Set error:', error);
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`[Redis] Invalidated ${keys.length} keys matching: ${pattern}`);
    }
  } catch (error) {
    console.error('[Redis] Invalidate error:', error);
  }
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
