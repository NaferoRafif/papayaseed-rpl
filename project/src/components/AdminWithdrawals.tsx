import { useEffect, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  Trash2,
} from 'lucide-react';
import { cn } from '../lib/cn';
import { formatRupiah } from '../lib/format';
import { formatDate } from '../lib/datetime';
import { useWithdrawals, useAdminOrders, useBalanceSummary, type Withdrawal } from '../hooks/useAdmin';

export function AdminWithdrawals() {
  const { orders, fetchOrders } = useAdminOrders();
  const { withdrawals, loading, fetchWithdrawals, createWithdrawal, updateStatus, deleteWithdrawal } =
    useWithdrawals();
  const balance = useBalanceSummary(orders, withdrawals);
  const [showForm, setShowForm] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchWithdrawals();
  }, [fetchOrders, fetchWithdrawals]);

  return (
    <div className="space-y-8">
      {/* Balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard
          label="Total Pendapatan"
          value={formatRupiah(balance.totalRevenue)}
          icon={<TrendingUp className="h-5 w-5" />}
          color="text-luxegreen-600 bg-luxegreen-100"
        />
        <BalanceCard
          label="Saldo Tersedia"
          value={formatRupiah(balance.availableBalance)}
          icon={<Wallet className="h-5 w-5" />}
          color="text-orange-600 bg-orange-100"
          highlight
        />
        <BalanceCard
          label="Menunggu Proses"
          value={formatRupiah(balance.pendingWithdrawals)}
          icon={<Clock className="h-5 w-5" />}
          color="text-amber-600 bg-amber-100"
        />
        <BalanceCard
          label="Total Ditarik"
          value={formatRupiah(balance.totalWithdrawn)}
          icon={<ArrowDownCircle className="h-5 w-5" />}
          color="text-zinc-600 bg-zinc-100"
        />
      </div>

      {/* Header + create button */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-white">Riwayat Penarikan</h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-orange inline-flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Tarik Saldo
        </button>
      </div>

      {/* Withdrawal form */}
      {showForm && (
        <WithdrawalForm
          availableBalance={balance.availableBalance}
          onSubmit={async (input) => {
            const ok = await createWithdrawal({ ...input, status: 'pending' });
            if (ok) setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
        </div>
      )}

      {!loading && withdrawals.length === 0 && (
        <div className="luxe-card p-12 text-center">
          <ArrowDownCircle className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-zinc-900">Belum ada penarikan</h2>
          <p className="text-zinc-500 mt-2">Ajukan penarikan saldo pertama Anda.</p>
        </div>
      )}

      {!loading && withdrawals.length > 0 && (
        <div className="space-y-3">
          {withdrawals.map((w) => (
            <WithdrawalRow
              key={w.id}
              withdrawal={w}
              busy={busyId === w.id}
              onUpdateStatus={async (id, s) => {
                setBusyId(id);
                await updateStatus(id, s);
                setBusyId(null);
              }}
              onDelete={async (id) => {
                setBusyId(id);
                await deleteWithdrawal(id);
                setBusyId(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BalanceCard({
  label,
  value,
  icon,
  color,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'luxe-card p-4 space-y-3',
        highlight && 'ring-2 ring-orange-400/40'
      )}
    >
      <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', color)}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-zinc-500 uppercase tracking-wide">{label}</div>
        <div className="text-lg font-bold text-zinc-900 tabular-nums mt-0.5">{value}</div>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<Withdrawal['status'], { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700', icon: <Clock className="h-3 w-3" /> },
  approved: { label: 'Disetujui', color: 'bg-luxegreen-100 text-luxegreen-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
};

function WithdrawalRow({
  withdrawal: w,
  busy,
  onUpdateStatus,
  onDelete,
}: {
  withdrawal: Withdrawal;
  busy: boolean;
  onUpdateStatus: (id: string, s: Withdrawal['status']) => void;
  onDelete: (id: string) => void;
}) {
  const style = STATUS_STYLE[w.status];

  return (
    <div className="luxe-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-scale-in">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
          <ArrowDownCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 tabular-nums">
              {formatRupiah(w.amount_cents)}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                style.color
              )}
            >
              {style.icon}
              {style.label}
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            {w.bank_name} · {w.account_number} · {w.account_name}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">{formatDate(w.created_at)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {w.status === 'pending' && (
          <>
            <button
              disabled={busy}
              onClick={() => onUpdateStatus(w.id, 'approved')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-luxegreen-100 text-luxegreen-700 text-xs font-medium hover:bg-luxegreen-200 transition-colors disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
              Setujui
            </button>
            <button
              disabled={busy}
              onClick={() => onUpdateStatus(w.id, 'rejected')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-60"
            >
              <XCircle className="h-3 w-3" />
              Tolak
            </button>
          </>
        )}
        <button
          disabled={busy}
          onClick={() => onDelete(w.id)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-500 text-xs hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

interface WithdrawalFormValues {
  amount_cents: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  notes: string;
}

function WithdrawalForm({
  availableBalance,
  onSubmit,
  onClose,
}: {
  availableBalance: number;
  onSubmit: (v: Omit<Withdrawal, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<WithdrawalFormValues>({
    amount_cents: 0,
    bank_name: '',
    account_number: '',
    account_name: '',
    notes: '',
  });
  const [amountStr, setAmountStr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof WithdrawalFormValues>(k: K, v: WithdrawalFormValues[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    setAmountStr(digits);
    update('amount_cents', parseInt(digits, 10) || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.amount_cents <= 0) return setError('Jumlah harus lebih dari 0.');
    if (form.amount_cents > availableBalance)
      return setError(`Jumlah melebihi saldo tersedia (${formatRupiah(availableBalance)}).`);
    if (!form.bank_name.trim() || !form.account_number.trim() || !form.account_name.trim())
      return setError('Lengkapi info rekening bank.');
    setBusy(true);
    await onSubmit({ ...form, status: 'pending' });
    setBusy(false);
  };

  return (
    <div className="luxe-card p-5 animate-scale-in">
      <h4 className="font-display text-lg font-bold text-zinc-900 mb-4">Ajukan Penarikan</h4>
      <div className="text-sm text-zinc-500 mb-4">
        Saldo tersedia:{' '}
        <span className="font-semibold text-luxegreen-600">{formatRupiah(availableBalance)}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Jumlah (Rp)
            </span>
            <input
              type="text"
              value={amountStr}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="contoh: 500000"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors"
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Nama Bank
            </span>
            <input
              value={form.bank_name}
              onChange={(e) => update('bank_name', e.target.value)}
              placeholder="BCA / Mandiri / BRI"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors"
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Nomor Rekening
            </span>
            <input
              value={form.account_number}
              onChange={(e) => update('account_number', e.target.value)}
              placeholder="1234567890"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors"
            />
          </label>
          <label className="block">
            <span className="block mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Nama Pemilik Rekening
            </span>
            <input
              value={form.account_name}
              onChange={(e) => update('account_name', e.target.value)}
              placeholder="Nama sesuai bank"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="block mb-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Catatan (opsional)
            </span>
            <input
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Catatan tambahan"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-colors"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="btn-orange px-5 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Ajukan Penarikan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
