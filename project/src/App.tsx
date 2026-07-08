import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog, type CategoryFilter } from './components/Catalog';
import { QuickView } from './components/QuickView';
import { CartSidebar } from './components/CartSidebar';
import { Checkout } from './components/Checkout';
import { PaymentSuccess } from './components/PaymentSuccess';
import { AuthModal } from './components/AuthModal';
import { About } from './components/About';
import { Pesanan } from './components/Pesanan';
import { Profil } from './components/Profil';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { ChatBox } from './components/ChatBox';
import { useProducts } from './hooks/useProducts';
import { useAdmin }  from './hooks/useAdmin';
import type { Product, TabId } from './types';

type View = TabId | 'checkout';

function AppShell() {
  const { user } = useAuth();
  const { add, count } = useCart();
  const { products, loading, error } = useProducts();
  const { isAdmin } = useAdmin();
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const adminAccess = isAdmin || adminUnlocked;

  const [view, setView] = useState<View>('katalog');
  const [activeTab, setActiveTab] = useState<TabId>('katalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [success, setSuccess] = useState<{
    open: boolean;
    orderId: string | null;
    totalCents: number;
    itemCount: number;
  }>({ open: false, orderId: null, totalCents: 0, itemCount: 0 });

  const catalogRef = useRef<HTMLDivElement>(null);

  const goTab = useCallback((tab: TabId) => {
    setView(tab);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Auto-scroll to catalog when search query changes
  useEffect(() => {
    if (searchQuery.trim() && view === 'katalog') {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchQuery, view]);

  const handleAdd = useCallback(
    (p: Product, qty = 1) => {
      add(p, qty);
      setCartOpen(true);
    },
    [add]
  );

  const handleCheckout = useCallback(() => {
    if (count === 0) return;
    setCartOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [count]);

  const requireAuth = useCallback(() => {
    if (user) return;
    setAuthMode('login');
    setAuthOpen(true);
  }, [user]);

  const handleCheckoutSuccess = useCallback(
    (summary: { orderId: string; totalCents: number; itemCount: number }) => {
      setSuccess({
        open: true,
        orderId: summary.orderId,
        totalCents: summary.totalCents,
        itemCount: summary.itemCount,
      });
    },
    []
  );

  const handleSuccessContinue = useCallback(() => {
    setSuccess((s) => ({ ...s, open: false }));
    goTab('katalog');
  }, [goTab]);

  // Close auth modal after successful auth from within modal context.
  const handleAuthed = useCallback(() => {
    setAuthOpen(false);
  }, []);

  // ESC closes success (in addition to auto-continue timer).
  useEffect(() => {
    if (!success.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSuccessContinue();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [success.open, handleSuccessContinue]);

  return (
    <div className="min-h-screen">
      <Header
        activeTab={activeTab}
        onTabChange={goTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={count}
        onOpenCart={() => setCartOpen(true)}
        isAuthed={!!user}
        onOpenAuth={() => {
          setAuthMode('login');
          setAuthOpen(true);
        }}
        isAdmin={adminAccess}
      />

      <main>
        {view === 'katalog' && (
          <>
            <Hero onBrowse={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })} />
            <div ref={catalogRef}>
              <Catalog
                products={products}
                loading={loading}
                error={error}
                searchQuery={searchQuery}
                category={category}
                onCategoryChange={setCategory}
                onQuickView={setQuickViewProduct}
                onAdd={handleAdd}
              />
            </div>
          </>
        )}

        {view === 'checkout' && (
          <Checkout
            onBack={() => goTab('katalog')}
            onAuthRequired={requireAuth}
            onSuccess={handleCheckoutSuccess}
          />
        )}

        {view === 'tentang' && <About />}

        {view === 'pesanan' && (
          <Pesanan onAuthRequired={requireAuth} onBrowse={() => goTab('katalog')} />
        )}

        {view === 'profil' && (
          <Profil
            onAuthRequired={requireAuth}
            onViewOrders={() => goTab('pesanan')}
          />
        )}

        {view === 'admin' && adminAccess && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 2C8 6 8 10 12 14c4-4 4-8 0-12zM12 14c-3 1-6 4-6 8h12c0-4-3-7-6-8z" />
                </svg>
              </span>
              <div>
                <div className="font-display text-sm font-semibold text-white">
                  Agro Kates Mandiri
                </div>
                <div className="text-[11px] text-white/50">
                  Benih pepaya premium · Indonesia
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/50">
              <button onClick={() => goTab('katalog')} className="hover:text-white transition-colors duration-300 ease-luxe">
                Katalog
              </button>
              <button onClick={() => goTab('tentang')} className="hover:text-white transition-colors duration-300 ease-luxe">
                Tentang
              </button>
              <button onClick={() => goTab('pesanan')} className="hover:text-white transition-colors duration-300 ease-luxe">
                Pesanan
              </button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-white/40">
            © {new Date().getFullYear()} Agro Kates Mandiri. Semua hak dilindungi.
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <QuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAdd={handleAdd}
      />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onAuthed={handleAuthed}
      />

      <PaymentSuccess
        open={success.open}
        orderId={success.orderId}
        totalCents={success.totalCents}
        itemCount={success.itemCount}
        onClose={handleSuccessContinue}
        onContinue={handleSuccessContinue}
      />

      {/* Admin login gate */}
      {view === 'admin' && !adminAccess && (
        <AdminLogin
          onSuccess={() => setAdminUnlocked(true)}
          onBack={() => setView('katalog')}
        />
      )}

      {/* Customer Chat */}
      {!adminAccess && (
        <ChatBox onOpenAuth={requireAuth} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AuthProvider>
  );
}
