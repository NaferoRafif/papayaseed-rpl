import { useEffect, useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  Sprout,
  Star,
  CheckCircle2,
  Beaker,
  CalendarDays,
} from 'lucide-react';
import type { Product } from '../types';
import { formatRupiah } from '../lib/format';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, qty: number) => void;
}

export function QuickView({ product, onClose, onAdd }: QuickViewProps) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) setQty(1);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAdd(product, qty);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${product.name}`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-luxewhite text-zinc-900 shadow-luxe-lg animate-scale-in flex flex-col">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur text-zinc-600 hover:bg-white hover:text-zinc-900 transition-colors duration-300 ease-luxe shadow-sm"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 overflow-y-auto">
          {/* Image side */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[460px] bg-zinc-100">
            <img
              src={product.image_url ?? ''}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
                {product.badge}
              </span>
            )}
          </div>

          {/* Content side */}
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {product.origin}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="inline-flex items-center gap-1 capitalize">
                <Sprout className="h-3.5 w-3.5" />
                {product.category.replace('-', ' ')}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight text-balance">
              {product.name}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              {product.tagline}
            </p>

            <div className="mt-3 flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-1.5 text-xs text-zinc-500">Premium grade</span>
            </div>

            <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Spec icon={<Beaker className="h-4 w-4" />} label="Tunas" value={product.gemination_rate ?? '-'} />
              <Spec icon={<CalendarDays className="h-4 w-4" />} label="Panen" value={product.days_to_harvest ?? '-'} />
              <Spec icon={<Sprout className="h-4 w-4" />} label="Isi" value={product.seed_count ?? '-'} />
              <Spec icon={<CheckCircle2 className="h-4 w-4" />} label="Stok" value={`${product.stock} ${product.unit}`} />
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-zinc-900">
                    {formatRupiah(product.price_cents)}
                  </div>
                  <div className="text-xs text-zinc-400">{product.unit}</div>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Kurangi jumlah"
                    className="p-2 rounded-lg hover:bg-white text-zinc-700 disabled:opacity-30 transition-colors duration-300 ease-luxe"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                    aria-label="Tambah jumlah"
                    className="p-2 rounded-lg hover:bg-white text-zinc-700 disabled:opacity-30 transition-colors duration-300 ease-luxe"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="btn-orange w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5" />
                Tambah ke Keranjang · {formatRupiah(product.price_cents * qty)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3">
      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-zinc-800 capitalize">{value}</div>
    </div>
  );
}
