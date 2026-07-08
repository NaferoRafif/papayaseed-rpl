import { useState } from 'react';
import { cn } from '../lib/cn';
import { AdminStock } from './AdminStock';
import { AdminOrders } from './AdminOrders';
import { AdminWithdrawals } from './AdminWithdrawals';
import { AdminChat } from './AdminChat';
import {
  Package,
  Truck,
  Wallet,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

export type AdminTab = 'pesanan' | 'stok' | 'saldo' | 'chat';

const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'pesanan', label: 'Pesanan', icon: <Truck className="h-4 w-4" /> },
  { id: 'stok', label: 'Stok Produk', icon: <Package className="h-4 w-4" /> },
  { id: 'saldo', label: 'Saldo & Tarik', icon: <Wallet className="h-4 w-4" /> },
  { id: 'chat', label: 'Chat', icon: <MessageCircle className="h-4 w-4" /> },
];

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('pesanan');

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-orange-400 text-xs font-medium tracking-wide mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          Panel Admin
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Dashboard Admin
        </h1>
        <p className="mt-2 text-white/60 text-sm max-w-xl">
          Kelola pesanan, stok produk, dan saldo toko dari satu tempat.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 -mx-1 px-1">
        {ADMIN_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-luxe',
              tab === t.id
                ? 'bg-orange-500 text-white shadow-glow'
                : 'glass text-white/70 hover:text-white hover:bg-white/10'
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pesanan' && <AdminOrders />}
      {tab === 'stok' && <AdminStock />}
      {tab === 'saldo' && <AdminWithdrawals />}
      {tab === 'chat' && <AdminChat />}
    </section>
  );
}
