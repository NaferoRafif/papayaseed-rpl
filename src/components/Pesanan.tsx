import { useEffect } from 'react';
import { Package, Loader2, Clock, CheckCircle2, MapPin, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { formatRupiah } from '../lib/format';
import { formatDate } from '../lib/datetime';

const JNE_WA_NUMBER = '6285692634430';

interface PesananProps {
  onAuthRequired: () => void;
  onBrowse: () => void;
}

export function Pesanan({ onAuthRequired, onBrowse }: PesananProps) {
  const { user } = useAuth();
  const { orders, loading, fetchOrders } = useOrders();

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, fetchOrders]);

  if (!user) {
    return (
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="luxe-card p-10">
          <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-zinc-900">
            Masuk untuk melihat pesanan
          </h2>
          <p className="text-zinc-500 mt-2 mb-6">
            Riwayat pesanan tersimpan di akun Anda.
          </p>
          <button onClick={onAuthRequired} className="btn-orange px-5 py-2.5 text-sm">
            Masuk / Daftar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-orange-400 text-xs font-medium tracking-wide mb-3">
          <Package className="h-3.5 w-3.5" />
          Riwayat Pesanan
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Pesanan Anda
        </h1>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="luxe-card p-12 text-center">
          <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-zinc-900">
            Belum ada pesanan
          </h2>
          <p className="text-zinc-500 mt-2 mb-6">
            Pesanan Anda akan muncul di sini setelah checkout.
          </p>
          <button onClick={onBrowse} className="btn-orange px-5 py-2.5 text-sm">
            Mulai Belanja
          </button>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="luxe-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxegreen-100 text-luxegreen-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wide">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {order.item_count} {order.item_count === 1 ? 'produk' : 'produk'}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {formatDate(order.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                <div className="text-lg font-bold text-zinc-900 tabular-nums">
                  {formatRupiah(order.total_cents)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-luxegreen-100 text-luxegreen-700 text-[11px] font-medium capitalize">
                    <MapPin className="h-3 w-3" />
                    {order.status}
                  </span>
                  <a
                    href={`https://wa.me/${JNE_WA_NUMBER}?text=${encodeURIComponent(`Halo, saya ingin mengecek status pengiriman pesanan #${order.id.slice(0, 8).toUpperCase()}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Chat Ekspedisi</span>
                    <span className="sm:hidden">Ekspedisi</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
