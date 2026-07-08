import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';

export interface AdminOrder {
  id: string;
  created_at: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  items: any[];
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  status: string;
  notes: string;
}

export interface Withdrawal {
  id: string;
  amount_cents: number;
  status: 'pending' | 'approved' | 'rejected';
  bank_name: string;
  account_number: string;
  account_name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BalanceSummary {
  totalRevenue: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  availableBalance: number;
}

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }
    let mounted = true;
    supabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        setIsAdmin(!!data);
        setAdminLoading(false);
      });
    return () => { mounted = false; };
  }, [user]);

  return { isAdmin, adminLoading };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setOrders(data as AdminOrder[]);
    }
    setLoading(false);
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      return true;
    }
    return false;
  }, []);

  return { orders, loading, fetchOrders, updateOrderStatus };
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }, []);

  const updateStock = useCallback(async (id: string, stock: number) => {
    const { error } = await supabase
      .from('products')
      .update({ stock })
      .eq('id', id);
    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock } : p))
      );
      return true;
    }
    return false;
  }, []);

  return { products, loading, fetchProducts, updateStock };
}

export function useWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setWithdrawals(data as Withdrawal[]);
    }
    setLoading(false);
  }, []);

  const createWithdrawal = useCallback(
    async (input: Omit<Withdrawal, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('withdrawals')
        .insert(input)
        .select()
        .single();
      if (!error && data) {
        setWithdrawals((prev) => [data as Withdrawal, ...prev]);
        return true;
      }
      return false;
    },
    []
  );

  const updateStatus = useCallback(async (id: string, status: Withdrawal['status']) => {
    const { error } = await supabase
      .from('withdrawals')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status, updated_at: new Date().toISOString() } : w))
      );
      return true;
    }
    return false;
  }, []);

  const deleteWithdrawal = useCallback(async (id: string) => {
    const { error } = await supabase.from('withdrawals').delete().eq('id', id);
    if (!error) {
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
      return true;
    }
    return false;
  }, []);

  return { withdrawals, loading, fetchWithdrawals, createWithdrawal, updateStatus, deleteWithdrawal };
}

export function useBalanceSummary(orders: AdminOrder[], withdrawals: Withdrawal[]): BalanceSummary {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_cents, 0);
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount_cents, 0);
  const pendingWithdrawals = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount_cents, 0);
  const availableBalance = totalRevenue - totalWithdrawn - pendingWithdrawals;

  return { totalRevenue, totalWithdrawn, pendingWithdrawals, availableBalance };
}
