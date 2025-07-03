import { useCallback, useEffect, useState } from 'react';

interface CacheOptions {
    ttl?: number; // Time to live in milliseconds
    staleWhileRevalidate?: boolean;
}

export function useCache<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(
        async (force = false) => {
            try {
                setLoading(true);
                const result = await fetcher();
                setData(result);
                setError(null);

                // Guardar en caché
                const cacheData = {
                    data: result,
                    timestamp: Date.now(),
                };
                localStorage.setItem(key, JSON.stringify(cacheData));
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        [key, fetcher],
    );

    useEffect(() => {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
            const { data: cachedValue, timestamp } = JSON.parse(cachedData);
            const isStale = options.ttl ? Date.now() - timestamp > options.ttl : false;

            if (!isStale) {
                setData(cachedValue);
                setLoading(false);
                if (options.staleWhileRevalidate) {
                    fetchData(true);
                }
                return;
            }
        }

        fetchData();
    }, [key, fetchData, options.ttl, options.staleWhileRevalidate]);

    const invalidate = useCallback(() => {
        localStorage.removeItem(key);
        fetchData(true);
    }, [key, fetchData]);

    return {
        data,
        error,
        invalidate,
        loading,
        refetch: () => fetchData(true),
    };
}
