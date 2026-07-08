import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { BillingBreakdown, CartItem, Product } from '../types';
import { SHIPPING_FLAT_CENTS, TAX_RATE } from '../types';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD'; product: Product; qty?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QTY'; productId: string; qty: number }
  | { type: 'INCREMENT'; productId: string }
  | { type: 'DECREMENT'; productId: string }
  | { type: 'CLEAR' };

const clampQty = (n: number) => Math.max(0, Math.floor(n));

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const qty = clampQty(action.qty ?? 1);
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, qty: clampQty(i.qty + qty) }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, qty }] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.product.id !== action.productId) };
    case 'SET_QTY': {
      const qty = clampQty(action.qty);
      if (qty === 0) {
        return { items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, qty } : i
        ),
      };
    }
    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, qty: clampQty(i.qty + 1) }
            : i
        ),
      };
    case 'DECREMENT':
      return {
        items: state.items
          .map((i) =>
            i.product.id === action.productId
              ? { ...i, qty: clampQty(i.qty - 1) }
              : i
          )
          .filter((i) => i.qty > 0),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  billing: BillingBreakdown;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const billing = useMemo<BillingBreakdown>(() => {
    const subtotalCents = state.items.reduce(
      (sum, i) => sum + i.product.price_cents * i.qty,
      0
    );
    const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);
    const shippingCents = subtotalCents === 0 ? 0 : SHIPPING_FLAT_CENTS;
    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + shippingCents + taxCents;
    return { subtotalCents, shippingCents, taxCents, totalCents, itemCount };
  }, [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      count: state.items.reduce((sum, i) => sum + i.qty, 0),
      add: (product, qty) => dispatch({ type: 'ADD', product, qty }),
      remove: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQty: (productId, qty) => dispatch({ type: 'SET_QTY', productId, qty }),
      increment: (productId) => dispatch({ type: 'INCREMENT', productId }),
      decrement: (productId) => dispatch({ type: 'DECREMENT', productId }),
      clear: () => dispatch({ type: 'CLEAR' }),
      billing,
    }),
    [state.items, billing]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
