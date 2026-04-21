import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

export function useCatalog() {
  const catalogQuery = trpc.catalog.getCatalog.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

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
  };
}
