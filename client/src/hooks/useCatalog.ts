import { useEffect, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import type { ProductCatalog } from '../../../server/catalog-storage';

const CATALOG_CACHE_KEY = 'peaceful-taste-catalog-cache-v1';
const CATALOG_CACHE_TTL = 1000 * 60 * 30;

function readCachedCatalog(): ProductCatalog | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const raw = window.localStorage.getItem(CATALOG_CACHE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as { cachedAt: number; data: unknown };
    if (!parsed?.cachedAt || !parsed?.data) return undefined;
    if (Date.now() - parsed.cachedAt > CATALOG_CACHE_TTL) return undefined;

    return parsed.data as ProductCatalog;
  } catch {
    return undefined;
  }
}

export function useCatalog() {
  const catalogQuery = trpc.catalog.getCatalog.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    placeholderData: readCachedCatalog,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !catalogQuery.data) return;

    try {
      window.localStorage.setItem(
        CATALOG_CACHE_KEY,
        JSON.stringify({
          cachedAt: Date.now(),
          data: catalogQuery.data,
        })
      );
    } catch {
      // Ignore storage failures so the storefront still renders.
    }
  }, [catalogQuery.data]);

  const categories = useMemo(
    () => catalogQuery.data?.categories ?? [],
    [catalogQuery.data]
  );
  const products = useMemo(
    () => (catalogQuery.data?.products ?? []).filter((product) => product.isActive !== false),
    [catalogQuery.data]
  );

  return {
    ...catalogQuery,
    categories,
    products,
    settings: catalogQuery.data?.settings,
  };
}
