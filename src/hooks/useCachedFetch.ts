import { useEffect, useState } from "react";
import { getCache, setCache } from '../utils/Cache';

type Options = {
  staleTime?: number; // ms
};

export function useCachedFetch<T>(
  key: string | undefined,
  fetcher: (() => Promise<T>) | undefined,
  options?: Options
) {
  const staleTime = options?.staleTime ?? 5 * 60 * 1000; // default 5 min
  const cached = getCache<T>(key ?? '');
  const [data, setData] = useState<T | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setData(cached);
  }, [cached]);

  useEffect(() => {
    let isMounted = true;

    const shouldRefetch = () => {
      if (!cached) return true;

      const entryTime = Date.now();
      return entryTime - (entryTime - staleTime) > staleTime;
    };

    if (!cached || shouldRefetch()) {
      setLoading(true);
      if (!fetcher || !key) return;
      fetcher()
        .then((res) => {
          if (!isMounted) return;

          setCache(key, res);
          setData(res);
        })
        .catch((err) => {
          if (!isMounted) return;
          setError(err);
        })
        .finally(() => {
          if (!isMounted) return;
          setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [key, fetcher, cached]);

  if (!key || !fetcher) {
    return { data: null, loading: false, error: null };
  }

  return { data, loading, error };
}