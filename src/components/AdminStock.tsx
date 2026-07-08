import { useEffect, useState } from 'react';
import {
  Package,
  Loader2,
  Save,
  Minus,
  Plus,
  Search,
} from 'lucide-react';
import { cn } from '../lib/cn';
import { formatRupiah } from '../lib/format';
import { useAdminProducts } from '../hooks/useAdmin';

export function AdminStock() {
  const { products, loading, fetchProducts, updateStock } = useAdminProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const startEdit = (id: string, current: number) => {
    setEditingId(id);
    setDraft((d) => ({ ...d, [id]: current }));
  };

  const adjust = (id: string, delta: number) => {
    setDraft((d) => {
      const next = Math.max(0, (d[id] ?? products.find((p) => p.id === id)?.stock ?? 0) + delta);
      return { ...d, [id]: next };
    });
  };

  const save = async (id: string) => {
    const value = draft[id];
    if (value === undefined) return;
    setSavingId(id);
    const ok = await updateStock(id, value);
    if (ok) setEditingId(null);
    setSavingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="text-sm text-white/60">
          Total <span className="text-white font-medium">{products.length}</span> produk
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk…"
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
          <h2 className="font-display text-xl font-bold text-zinc-900">Tidak ada produk</h2>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map((p) => {
            const isEditing = editingId === p.id;
            const currentStock = isEditing ? (draft[p.id] ?? p.stock) : p.stock;
            const low = p.stock <= 5;

            return (
              <div
                key={p.id}
                className={cn(
                  'luxe-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-scale-in',
                  low && 'border-orange-300/40'
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-zinc-900 truncate">{p.name}</div>
                    <div className="text-xs text-zinc-500">
                      {p.category} · {formatRupiah(p.price_cents)}
                    </div>
                    {low && (
                      <div className="text-[11px] text-orange-600 font-medium mt-0.5">
                        Stok menipis
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => adjust(p.id, -1)}
                        className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={currentStock}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, [p.id]: Math.max(0, parseInt(e.target.value, 10) || 0) }))
                        }
                        className="w-16 h-8 text-center text-sm font-semibold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => adjust(p.id, 1)}
                        className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => save(p.id)}
                        disabled={savingId === p.id}
                        className="btn-green h-8 px-3 text-xs flex items-center gap-1 disabled:opacity-60"
                      >
                        {savingId === p.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                        Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="h-8 px-3 rounded-lg bg-zinc-100 text-zinc-600 text-xs hover:bg-zinc-200 transition-colors"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-semibold tabular-nums',
                          low
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-zinc-100 text-zinc-700'
                        )}
                      >
                        Stok: {p.stock}
                      </div>
                      <button
                        onClick={() => startEdit(p.id, p.stock)}
                        className="h-8 px-3 rounded-lg bg-orange-100 text-orange-700 text-xs font-medium hover:bg-orange-200 transition-colors"
                      >
                        Ubah
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
