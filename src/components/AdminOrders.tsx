import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Loader2,
  ChevronDown,
  ChevronUp,
  Truck,
  Ban,
  MapPin,
  Search,
} from 'lucide-react';
import { cn } from '../lib/cn';
import { formatRupiah } from '../lib/format';
import { formatDate } from '../lib/datetime';
import { useAdminOrders, type AdminOrder } from '../hooks/useAdmin';

type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_META: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  paid: { label: 'Dibayar', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  processing: { label: 'Diproses', color: 'bg-amber-100 text-amber-700', icon: <Clock className="h-3 w-3" /> },
  shipped: { label: 'Dikirim', color: 'bg-orange-100 text-orange-700', icon: <Truck className="h-3 w-3" /> },
  delivered: { label: 'Selesai', color: 'bg-luxegreen-100 text-luxegreen-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: <Ban className="h-3 w-3" /> },
};

export function AdminOrders() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useAdminOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchStatus = filter === 'all' || o.status === filter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      o.buyer_name.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.buyer_email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setBusyId(id);
    await updateOrderStatus(id, status);
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Total Pesanan" value={orders.length.toString()} />
        <SummaryCard label="Dibayar" value={orders.filter((o) => o.status === 'paid').length.toString()} />
        <SummaryCard label="Diproses" value={orders.filter((o) => o.status === 'processing').length.toString()} />
        <SummaryCard label="Dikirim" value={orders.filter((o) => o.status === 'shipped').length.toString()} />
      </div>

      {/* Filter & search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {(['all', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ease-luxe',
                filter === s
                  ? 'bg-orange-500 text-white'
                  : 'glass text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              {s === 'all' ? 'Semua' : STATUS_META[s]?.label ?? s}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / ID / email"
            className="w-full pl-9 pr-3 py-2 rounded-lg glass text-sm text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-colors duration-300 ease-luxe"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="luxe-card p-12 text-center">
          <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-zinc-900">Tidak ada pesanan</h2>
          <p className="text-zinc-500 mt-2">Belum ada pesanan yang cocok dengan filter ini.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId((id) => (id === order.id ? null : order.id))}
              onStatusChange={handleStatusChange}
              busy={busyId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="luxe-card p-4 text-center">
      <div className="text-2xl font-bold text-zinc-900">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}

function OrderRow({
  order,
  expanded,
  onToggle,
  onStatusChange,
  busy,
}: {
  order: AdminOrder;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, s: OrderStatus) => void;
  busy: boolean;
}) {
  const meta = STATUS_META[order.status as OrderStatus] ?? {
    label: order.status,
    color: 'bg-zinc-100 text-zinc-700',
    icon: <Clock className="h-3 w-3" />,
  };
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="luxe-card overflow-hidden animate-scale-in">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-zinc-50/50 transition-colors"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
          <Package className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">{order.buyer_name}</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                meta.color
              )}
            >
              {meta.icon}
              {meta.label}
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at)} · {formatRupiah(order.total_cents)}
          </div>
        </div>
        <div className="shrink-0 text-zinc-400">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-zinc-100 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-2">Detail Pembeli</h4>
              <div className="space-y-1 text-sm text-zinc-700">
                <div>{order.buyer_email}</div>
                <div>{order.buyer_phone || '-'}</div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-2">Alamat Pengiriman</h4>
              <div className="flex items-start gap-1.5 text-sm text-zinc-700">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span>
                  {order.shipping_address}, {order.city} {order.postal_code}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wide mb-2">Item Pesanan</h4>
            <ul className="space-y-2">
              {items.map((item: any, i: number) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">
                    {item.qty}× {item.name}
                  </span>
                  <span className="text-zinc-900 font-medium tabular-nums">
                    {formatRupiah((item.price_cents ?? 0) * (item.qty ?? 1))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-sm font-semibold">
              <span className="text-zinc-700">Total</span>
              <span className="text-zinc-900">{formatRupiah(order.total_cents)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 mr-1">Ubah status:</span>
            {(['paid', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((s) => (
              <button
                key={s}
                disabled={busy || order.status === s}
                onClick={() => onStatusChange(order.id, s)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200',
                  order.status === s
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                )}
              >
                {busy && order.status !== s ? <Loader2 className="h-3 w-3 animate-spin" /> : STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
