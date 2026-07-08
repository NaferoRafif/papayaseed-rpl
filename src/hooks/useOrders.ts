import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { CartItem, OrderSummary } from '../types';

interface PlaceOrderInput {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  notes: string;
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

interface PlaceOrderResult {
  order: OrderSummary | null;
  error: string | null;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('id, created_at, total_cents, status, items')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      setOrders([]);
    } else {
      const summaries: OrderSummary[] = (data ?? []).map((o: any) => ({
        id: o.id,
        created_at: o.created_at,
        total_cents: o.total_cents,
        status: o.status,
        item_count: Array.isArray(o.items) ? o.items.length : 0,
      }));
      setOrders(summaries);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = useCallback(
    async (input: PlaceOrderInput): Promise<PlaceOrderResult> => {
      const userId = user?.id ?? null;
      const itemsPayload = input.items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        price_cents: i.product.price_cents,
        qty: i.qty,
        unit: i.product.unit,
      }));

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          buyer_name: input.buyerName,
          buyer_email: input.buyerEmail,
          buyer_phone: input.buyerPhone,
          shipping_address: input.shippingAddress,
          city: input.city,
          postal_code: input.postalCode,
          notes: input.notes,
          items: itemsPayload,
          subtotal_cents: input.subtotalCents,
          shipping_cents: input.shippingCents,
          tax_cents: input.taxCents,
          total_cents: input.totalCents,
          status: 'paid',
        })
        .select('id, created_at, total_cents, status, items')
        .single();

      if (error) {
        return { order: null, error: 'Gagal memproses pesanan. Coba lagi.' };
      }

      const summary: OrderSummary = {
        id: (data as any).id,
        created_at: (data as any).created_at,
        total_cents: (data as any).total_cents,
        status: (data as any).status,
        item_count: itemsPayload.length,
      };
      // Refresh order history in background.
      fetchOrders();
      return { order: summary, error: null };
    },
    [user, fetchOrders]
  );

  return { orders, loading, placeOrder, fetchOrders };
}
