type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const cache = new Map<string, CacheEntry<any>>();

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  return entry ? entry.data : null;
}

export function setCache<T>(key: string, data: T) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function hasCache(key: string) {
  return cache.has(key);
}

export function clearCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}