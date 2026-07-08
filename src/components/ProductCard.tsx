import { Eye, Plus, MapPin, Sprout, Star } from 'lucide-react';
import type { Product } from '../types';
import { formatRupiah } from '../lib/format';
import { cn } from '../lib/cn';

interface ProductCardProps {
  product: Product;
  onQuickView: (p: Product) => void;
  onAdd: (p: Product) => void;
  /** bento span hint — featured products get larger cells */
  span?: 'sm' | 'lg';
}

const BADGE_STYLES: Record<string, string> = {
  'Best Seller': 'bg-orange-500 text-white',
  Premium: 'bg-black text-white',
  Rare: 'bg-luxegreen-500 text-white',
  Pro: 'bg-blue-600 text-white',
  Local: 'bg-amber-600 text-white',
  Featured: 'bg-purple-600 text-white',
};

export function ProductCard({ product, onQuickView, onAdd, span = 'sm' }: ProductCardProps) {
  const isLarge = span === 'lg';
  const badgeClass = product.badge
    ? BADGE_STYLES[product.badge] ?? 'bg-zinc-800 text-white'
    : '';

  return (
    <article
      className={cn(
        'group luxe-card overflow-hidden flex flex-col transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-luxe-lg',
        isLarge && 'sm:col-span-2 sm:row-span-1'
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-zinc-200 aspect-square sm:aspect-[4/3]">
        <img
          src={product.image_url ?? ''}
          alt={product.name}
          loading="lazy"
          className={cn(
            'h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105',
            isLarge && 'aspect-[16/10]'
          )}
        />
        {product.badge && (
          <span
            className={cn(
              'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm',
              badgeClass
            )}
          >
            {product.badge}
          </span>
        )}
        <button
          onClick={() => onQuickView(product)}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md text-zinc-900 text-xs font-medium opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-luxe hover:bg-white"
        >
          <Eye className="h-3.5 w-3.5" />
          Quick View
        </button>
        {product.stock <= 30 && product.stock > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium">
            Sisa {product.stock} stok
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-500 mb-1">
          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span>{product.origin}</span>
          <span className="mx-1 text-zinc-300">·</span>
          <Sprout className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
        </div>
        <h3 className="font-display text-base sm:text-lg font-semibold text-zinc-900 leading-tight text-balance">
          {product.name}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2">
          {product.tagline}
        </p>

        <div className="mt-2 sm:mt-3 flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
          ))}
          <span className="ml-1 text-[10px] sm:text-[11px] text-zinc-400">Premium grade</span>
        </div>

        <div className="mt-auto pt-3 sm:pt-4 border-t border-zinc-100">
          <div className="text-lg sm:text-xl font-bold text-zinc-900">
            {formatRupiah(product.price_cents)}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-400 mb-3">{product.unit}</div>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => onQuickView(product)}
              aria-label={`Detail ${product.name}`}
              className="p-2.5 sm:p-3 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors duration-300 ease-luxe"
            >
              <Eye className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </button>
            <button
              onClick={() => onAdd(product)}
              disabled={product.stock === 0}
              className="btn-orange flex-1 px-3 py-2.5 sm:py-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Tambah
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
