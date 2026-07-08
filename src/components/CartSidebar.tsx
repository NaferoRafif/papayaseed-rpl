import { useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/format';
import { BillingBreakdownView } from './BillingBreakdownView';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartSidebar({ open, onClose, onCheckout }: CartSidebarProps) {
  const { items, increment, decrement, remove, clear, billing, count } = useCart();

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={
          'fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-luxe ' +
          (open ? 'opacity-100' : 'opacity-0 pointer-events-none')
        }
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={
          'fixed top-0 right-0 z-[85] h-full w-full max-w-md glass-dark flex flex-col shadow-glass ' +
          'transition-transform duration-500 ease-luxe ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">Keranjang</h2>
              <p className="text-[11px] text-white/50">
                {count} {count === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-300 ease-luxe"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/60 py-16">
              <Sparkles className="h-10 w-10 text-white/20 mb-3" />
              <p className="font-medium text-white/80">Keranjang masih kosong</p>
              <p className="text-sm text-white/50 mt-1 max-w-[260px]">
                Jelajahi katalog dan tambahkan benih pepaya pilihan Anda.
              </p>
              <button
                onClick={onClose}
                className="mt-5 btn-orange px-5 py-2.5 text-sm"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 p-3 animate-fade-in"
                >
                  <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-white/10">
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => remove(item.product.id)}
                        aria-label={`Hapus ${item.product.name}`}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors duration-300 ease-luxe"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {formatRupiah(item.product.price_cents)} · {item.product.unit}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="flex items-center gap-0.5 rounded-lg bg-white/10 p-0.5">
                        <button
                          onClick={() => decrement(item.product.id)}
                          aria-label="Kurangi"
                          className="p-1.5 rounded-md hover:bg-white/10 text-white/80 transition-colors duration-300 ease-luxe"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular-nums text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increment(item.product.id)}
                          disabled={item.qty >= item.product.stock}
                          aria-label="Tambah"
                          className="p-1.5 rounded-md hover:bg-white/10 text-white/80 disabled:opacity-30 transition-colors duration-300 ease-luxe"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-orange-400 tabular-nums">
                        {formatRupiah(item.product.price_cents * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}

              {items.length > 0 && (
                <button
                  onClick={clear}
                  className="w-full text-center text-xs text-white/40 hover:text-red-400 py-2 transition-colors duration-300 ease-luxe"
                >
                  Kosongkan keranjang
                </button>
              )}
            </ul>
          )}
        </div>

        {/* Footer with billing + checkout */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4 space-y-4">
            <BillingBreakdownView billing={billing} compact />
            <button
              onClick={onCheckout}
              className="btn-orange w-full py-3.5 flex items-center justify-center gap-2 group"
            >
              Lanjut ke Pembayaran
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-luxe group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
