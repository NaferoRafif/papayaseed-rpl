import { useEffect, useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Sprout, Shield } from 'lucide-react';
import { cn } from '../lib/cn';
import type { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isAuthed: boolean;
  onOpenAuth: () => void;
  isAdmin: boolean;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'katalog', label: 'Katalog' },
  { id: 'tentang', label: 'Tentang & Edukasi' },
  { id: 'pesanan', label: 'Pesanan' },
  { id: 'profil', label: 'Profil' },
];

const ADMIN_TAB: { id: TabId; label: string } = { id: 'admin', label: 'Admin' };

export function Header({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  isAuthed,
  onOpenAuth,
  isAdmin,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-luxe',
        scrolled
          ? 'glass-dark shadow-glass'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <button
            onClick={() => onTabChange('katalog')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-glow transition-transform duration-500 ease-luxe group-hover:scale-105">
              <Sprout className="h-5 w-5 text-white" />
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base font-semibold text-white tracking-tight">
                Agro Kates
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-[0.2em]">
                Mandiri
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ease-luxe',
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-orange-500" />
                )}
              </button>
            ))}
            {isAdmin && (
              <button
                key={ADMIN_TAB.id}
                onClick={() => onTabChange(ADMIN_TAB.id)}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ease-luxe',
                  activeTab === ADMIN_TAB.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                )}
              >
                <Shield className="h-3.5 w-3.5" />
                {ADMIN_TAB.label}
                {activeTab === ADMIN_TAB.id && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-orange-500" />
                )}
              </button>
            )}
            {!isAdmin && (
              <button
                onClick={() => onTabChange(ADMIN_TAB.id)}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ease-luxe',
                  activeTab === ADMIN_TAB.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                )}
              >
                <Shield className="h-3.5 w-3.5" />
                {ADMIN_TAB.label}
                {activeTab === ADMIN_TAB.id && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-orange-500" />
                )}
              </button>
            )}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-auto hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => onTabChange('katalog')}
                placeholder="Cari biji pepaya…"
                className="w-full pl-9 pr-3 py-2 rounded-lg glass text-sm text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-colors duration-300 ease-luxe"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors duration-300 ease-luxe"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {/* Cart with badge — solid black font for the count */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl glass text-white hover:bg-white/15 transition-colors duration-300 ease-luxe"
              aria-label={`Keranjang dengan ${cartCount} item`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-black shadow-glow animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / profile */}
            <button
              onClick={() => onTabChange(isAuthed ? 'profil' : 'katalog')}
              className="hidden sm:flex p-2.5 rounded-xl glass text-white hover:bg-white/15 transition-colors duration-300 ease-luxe"
              aria-label="Profil"
            >
              <User className="h-5 w-5" />
            </button>

            {!isAuthed && (
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex btn-orange px-4 py-2 text-sm"
              >
                Masuk
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-xl glass text-white"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-500 ease-luxe',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 pb-4 space-y-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => onTabChange('katalog')}
              placeholder="Cari biji pepaya…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg glass text-sm text-white placeholder-white/40 focus:outline-none"
            />
          </div>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setMobileOpen(false);
              }}
              className={cn(
                'block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 ease-luxe',
                activeTab === tab.id
                  ? 'bg-orange-500/15 text-white'
                  : 'text-white/70 hover:bg-white/10'
              )}
            >
              {tab.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                onTabChange(ADMIN_TAB.id);
                setMobileOpen(false);
              }}
              className={cn(
                'block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 ease-luxe',
                activeTab === ADMIN_TAB.id
                  ? 'bg-orange-500/15 text-white'
                  : 'text-white/70 hover:bg-white/10'
              )}
            >
              Admin
            </button>
          )}
          {!isAuthed && (
            <button
              onClick={() => {
                onOpenAuth();
                setMobileOpen(false);
              }}
              className="block w-full text-center btn-orange px-4 py-2.5 text-sm mt-2"
            >
              Masuk / Daftar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
