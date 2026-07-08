import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error: err }) => {
        if (!mounted) return;
        if (err) {
          setError('Gagal memuat katalog produk.');
          setProducts([]);
        } else {
          setProducts((data ?? []) as Product[]);
        }
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [tick]);

  return { products, loading, error, refetch };
}

/** Real-time smart filter across name, tagline, origin, badge, category. */
export function filterProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.tagline,
      p.origin,
      p.badge ?? '',
      p.category,
      p.description,
    ]
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((term) => haystack.includes(term));
  });
}
