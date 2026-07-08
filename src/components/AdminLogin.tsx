import { useState } from 'react';
import { ShieldCheck, LogIn, Loader2, Lock, User } from 'lucide-react';
import { cn } from '../lib/cn';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError('Mohon isi username/email dan kata sandi.');
      return;
    }

    setBusy(true);

    // Simulate brief async for UX feedback
    await new Promise((r) => setTimeout(r, 400));

    const id = identifier.trim().toLowerCase();
    if (id === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setBusy(false);
      onSuccess();
    } else {
      setBusy(false);
      setError('Username/email atau kata sandi salah.');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-96 rounded-full bg-luxegreen-500/15 blur-3xl" />

      <div
        className="relative w-[420px] max-w-full glass-dark rounded-3xl shadow-glass overflow-hidden flex flex-col animate-scale-in"
        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}
      >
        {/* Top glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-orange-500/30 blur-3xl" />

        {/* Brand */}
        <div className="relative z-10 pt-12 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-glow">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight">
            Login Admin
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Masuk untuk mengakses dashboard admin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="relative z-10 flex-1 px-8 space-y-4">
          <label className="block">
            <span className="block mb-1.5 text-xs font-medium text-white/70 uppercase tracking-wide">
              Username atau Email
            </span>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/60 focus:bg-white/10 transition-colors duration-300 ease-luxe"
              />
            </div>
          </label>

          <label className="block">
            <span className="block mb-1.5 text-xs font-medium text-white/70 uppercase tracking-wide">
              Kata Sandi
            </span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/60 focus:bg-white/10 transition-colors duration-300 ease-luxe"
              />
            </div>
          </label>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full btn-orange py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Masuk sebagai Admin
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-xs text-white/50 hover:text-white/80 font-medium transition-colors duration-300 ease-luxe pt-1"
          >
            Kembali ke beranda
          </button>
        </form>

        <div className="relative z-10 px-8 pb-6 pt-2 text-center">
          <p className="text-[11px] text-white/40 leading-relaxed">
            Akses khusus admin. Kredensial default: <span className="text-white/60">admin</span> / <span className="text-white/60">admin123</span>
          </p>
        </div>
      </div>
    </section>
  );
}
