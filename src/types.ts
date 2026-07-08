/** Shared domain types for Agro Kates Mandiri. */

export type Category =
  | 'hybrid'
  | 'open-pollinated'
  | 'specialty';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price_cents: number;
  unit: string;
  category: Category;
  origin: string;
  seed_count: string | null;
  gemination_rate: string | null;
  days_to_harvest: string | null;
  badge: string | null;
  image_url: string | null;
  featured: boolean;
  stock: number;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type TabId = 'katalog' | 'tentang' | 'pesanan' | 'profil' | 'admin';

export interface OrderSummary {
  id: string;
  created_at: string;
  total_cents: number;
  status: string;
  item_count: number;
}

/** Computed billing breakdown used by cart sidebar + checkout. */
export interface BillingBreakdown {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  itemCount: number;
}

export const SHIPPING_FLAT_CENTS = 25_000; // Rp 25.000 flat shipping
export const TAX_RATE = 0.11; // PPN 11%
