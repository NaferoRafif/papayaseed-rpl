import type { BillingBreakdown } from '../types';
import { formatRupiah } from '../lib/format';

interface BillingBreakdownProps {
  billing: BillingBreakdown;
  compact?: boolean;
}

export function BillingBreakdownView({ billing, compact = false }: BillingBreakdownProps) {
  const rows = [
    { label: 'Subtotal', value: billing.subtotalCents },
    { label: 'Ongkos Kirim', value: billing.shippingCents },
    { label: 'PPN 11%', value: billing.taxCents },
  ];
  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between text-sm">
          <span className="text-white/60">{row.label}</span>
          <span className="text-white/90 font-medium tabular-nums">
            {formatRupiah(row.value)}
          </span>
        </div>
      ))}
      <div
        className={
          'flex items-center justify-between pt-3 mt-1 border-t border-white/10 ' +
          (compact ? '' : '')
        }
      >
        <span className="text-white font-semibold">Total</span>
        <span className="text-orange-400 font-bold text-lg tabular-nums">
          {formatRupiah(billing.totalCents)}
        </span>
      </div>
    </div>
  );
}
