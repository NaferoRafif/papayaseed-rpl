import { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  Truck,
  ShieldCheck,
  Loader2,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth, getStoredProfileName } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { formatRupiah } from '../lib/format';
import { BillingBreakdownView } from './BillingBreakdownView';
import type { OrderSummary } from '../types';

interface CheckoutProps {
  onBack: () => void;
  onAuthRequired: () => void;
  onSuccess: (summary: { orderId: string; totalCents: number; itemCount: number }) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  notes: string;
}

export function Checkout({ onBack, onAuthRequired, onSuccess }: CheckoutProps) {
  const { items, billing, clear } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => ({
    name: getStoredProfileName() || '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    city: '',
    postal: '',
    notes: '',
  }));

  const update = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim().length >= 6 &&
    form.address.trim().length >= 5 &&
    form.city.trim().length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      onAuthRequired();
      return;
    }
    if (!valid) {
      setError('Lengkapi semua data pengiriman dengan benar.');
      return;
    }
    setBusy(true);
    const { order, error: ordErr } = await placeOrder({
      buyerName: form.name.trim(),
      buyerEmail: form.email.trim(),
      buyerPhone: form.phone.trim(),
      shippingAddress: form.address.trim(),
      city: form.city.trim(),
      postalCode: form.postal.trim(),
      notes: form.notes.trim(),
      items,
      subtotalCents: billing.subtotalCents,
      shippingCents: billing.shippingCents,
      taxCents: billing.taxCents,
      totalCents: billing.totalCents,
    });
    setBusy(false);
    if (ordErr || !order) {
      setError(ordErr ?? 'Gagal memproses pesanan.');
      return;
    }
    const summary: { orderId: string; totalCents: number; itemCount: number } = {
      orderId: (order as OrderSummary).id,
      totalCents: (order as OrderSummary).total_cents,
      itemCount: (order as OrderSummary).item_count,
    };
    clear(); // auto-reset cart
    onSuccess(summary);
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 ease-luxe mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <div className="luxe-card p-12 text-center">
          <Package className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-zinc-900">
            Keranjang kosong
          </h2>
          <p className="text-zinc-500 mt-2">
            Tambahkan produk ke keranjang sebelum checkout.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 ease-luxe mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
      </button>

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-orange-400 text-xs font-medium tracking-wide mb-3">
          <Lock className="h-3.5 w-3.5" />
          Checkout Aman
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Pembayaran
        </h1>
      </div>

      {!user && (
        <div className="mb-6 rounded-2xl bg-orange-500/10 border border-orange-500/30 px-4 py-3 text-sm text-orange-300 flex items-center justify-between gap-3">
          <span>Masuk untuk menyimpan pesanan ke riwayat akun Anda.</span>
          <button onClick={onAuthRequired} className="btn-orange px-3 py-1.5 text-xs shrink-0">
            Masuk
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-5 gap-6 items-start"
      >
        {/* Billing form */}
        <div className="lg:col-span-3 luxe-card p-6 space-y-5">
          <SectionTitle icon={<Truck className="h-4 w-4" />}>Detail Pengiriman</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Nama Lengkap" value={form.name} onChange={(v) => update('name', v)} placeholder="Nama penerima" />
            <Input label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="nama@email.com" />
            <Input label="Nomor Telepon" value={form.phone} onChange={(v) => update('phone', v)} placeholder="08xxxxxxxxxx" />
            <Input label="Kota" value={form.city} onChange={(v) => update('city', v)} placeholder="Jakarta" />
            <div className="sm:col-span-2">
              <Input label="Alamat Lengkap" value={form.address} onChange={(v) => update('address', v)} placeholder="Jalan, RT/RW, kelurahan" />
            </div>
            <Input label="Kode Pos" value={form.postal} onChange={(v) => update('postal', v)} placeholder="12345" />
          </div>
          <label className="block">
            <span className="block mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Catatan (opsional)
            </span>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
              placeholder="Catatan untuk kurir…"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors duration-300 ease-luxe resize-none"
            />
          </label>

          <div className="pt-2">
            <SectionTitle icon={<CreditCard className="h-4 w-4" />}>Metode Pembayaran</SectionTitle>
            <div className="rounded-2xl border-2 border-orange-500 bg-orange-50 p-4 flex items-center gap-3 animate-fade-in">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900">Transfer Virtual Account</div>
                <div className="text-xs text-zinc-500">BCA, Mandiri, BRI, BNI</div>
              </div>
              <span className="text-xs font-semibold text-luxegreen-600">Gratis biaya admin</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-2 lg:sticky lg:top-24 space-y-4">
          <div className="luxe-card p-6">
            <SectionTitle icon={<Package className="h-4 w-4" />}>Ringkasan Pesanan</SectionTitle>
            <ul className="space-y-3 max-h-56 overflow-y-auto mb-4">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3 items-center">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-800 line-clamp-1">
                      {item.product.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {item.qty} × {formatRupiah(item.product.price_cents)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 tabular-nums">
                    {formatRupiah(item.product.price_cents * item.qty)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-zinc-100">
              <BillingBreakdownView billing={billing} />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-green w-full mt-5 py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Bayar {formatRupiah(billing.totalCents)}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-luxegreen-500" />
              Transaksi dienkripsi & aman
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 mb-4">
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
        {icon}
      </span>
      {children}
    </h3>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

function Input({ label, value, onChange, placeholder, type = 'text' }: InputProps) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors duration-300 ease-luxe"
      />
    </label>
  );
}
