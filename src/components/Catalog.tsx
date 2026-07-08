import { useMemo } from 'react';
import { Search, SlidersHorizontal, Sprout, Loader2 } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { filterProducts } from '../hooks/useProducts';
import { cn } from '../lib/cn';

interface CatalogProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  category: CategoryFilter;
  onCategoryChange: (c: CategoryFilter) => void;
  onQuickView: (p: Product) => void;
  onAdd: (p: Product) => void;
}

export type CategoryFilter = 'all' | 'hybrid' | 'open-pollinated' | 'specialty';

const FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'hybrid', label: 'Hibrida' },
  { id: 'open-pollinated', label: 'Open Pollinated' },
  { id: 'specialty', label: 'Spesial' },
];

export function Catalog({
  products,
  loading,
  error,
  searchQuery,
  category,
  onCategoryChange,
  onQuickView,
  onAdd,
}: CatalogProps) {
  const filtered = useMemo(() => {
    const searched = filterProducts(products, searchQuery);
    if (category === 'all') return searched;
    return searched.filter((p) => p.category === category);
  }, [products, searchQuery, category]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-orange-400 text-xs font-medium tracking-wide mb-3">
            <Sprout className="h-3.5 w-3.5" />
            Katalog Premium
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
            Benih Pepaya Pilihan
          </h1>
          <p className="mt-2 text-white/60 text-sm max-w-xl">
            Delapan varietas premium — dari California Gold hingga Hawaii Solo.
            Dipanen dengan standar tertinggi untuk produktivitas maksimal.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <SlidersHorizontal className="h-4 w-4 text-white/40 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onCategoryChange(f.id)}
              className={cn(
                'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-luxe',
                category === f.id
                  ? 'bg-orange-500 text-white shadow-glow'
                  : 'glass text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-5 text-xs text-white/50">
        {searchQuery ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300">
              <Search className="h-3 w-3" />
              "{searchQuery}"
            </span>
            <span>
              Menampilkan <span className="text-white/80 font-medium">{filtered.length}</span> hasil
            </span>
          </div>
        ) : (
          <>
            <span className="text-white/80 font-medium">{filtered.length}</span> produk tersedia
          </>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-white/60">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
          Memuat katalog…
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 text-white/70">
          <Search className="h-10 w-10 text-white/30 mb-3" />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-white/70">
          <Search className="h-10 w-10 text-white/30 mb-3" />
          <p className="font-medium">Tidak ada produk yang cocok.</p>
          <p className="text-sm text-white/50 mt-1">
            Coba kata kunci lain atau ubah filter kategori.
          </p>
        </div>
      )}

      {/* Bento grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[1fr]">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              onAdd={onAdd}
              span={p.featured && i < 2 ? 'lg' : 'sm'}
            />
          ))}
        </div>
      )}
    </section>
  );
}
