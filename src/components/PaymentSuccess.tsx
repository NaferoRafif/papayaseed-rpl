import { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { formatRupiah } from '../lib/format';

interface PaymentSuccessProps {
  open: boolean;
  totalCents: number;
  itemCount: number;
  orderId: string | null;
  onClose: () => void;
  onContinue: () => void;
}

export function PaymentSuccess({
  open,
  totalCents,
  itemCount,
  orderId,
  onClose,
  onContinue,
}: PaymentSuccessProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onContinue();
    }, 3500);
    return () => clearTimeout(t);
  }, [open, onContinue]);

  if (!open) return null;

  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : '—';

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Pembayaran berhasil"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-luxe-lg animate-scale-in">
        {/* Green-orange gradient header */}
        <div className="relative h-36 bg-gradient-to-br from-luxegreen-500 via-luxegreen-600 to-orange-500 flex items-end justify-center pb-6">
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-300 ease-luxe"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="relative">
            <div className="absolute inset-0 -m-3 rounded-full bg-white/30 blur-xl animate-pulse" />
            <CheckCircle2
              className="relative h-16 w-16 text-white drop-shadow-lg animate-check-pop"
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Body */}
        <div className="bg-luxewhite text-zinc-900 px-7 py-6 text-center">
          <h2 className="font-display text-2xl font-bold text-zinc-900">
            Pembayaran Berhasil!
          </h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            Terima kasih atas pesanan Anda. Benih pilihan sedang dipersiapkan untuk
            dikirim.
          </p>

          <div className="mt-5 rounded-2xl bg-zinc-50 border border-zinc-100 p-4 text-left space-y-2">
            <Row label="Nomor Pesanan" value={`#${shortId}`} mono />
            <Row label="Item" value={`${itemCount} produk`} />
            <Row label="Total Dibayar" value={formatRupiah(totalCents)} highlight />
          </div>

          <button
            onClick={onContinue}
            className="btn-green w-full mt-5 py-3 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Lanjut Belanja
          </button>

          <p className="mt-3 text-[11px] text-zinc-400">
            Halaman akan dialihkan otomatis…
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span
        className={
          (highlight ? 'text-luxegreen-600 font-bold ' : 'text-zinc-800 font-medium ') +
          (mono ? 'font-mono tracking-wide' : '')
        }
      >
        {value}
      </span>
    </div>
  );
}
