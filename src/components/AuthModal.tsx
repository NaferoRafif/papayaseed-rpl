import { useEffect, useState } from 'react';
import { LogIn, UserPlus, X, Sprout, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/cn';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAuthed?: () => void;
}

export function AuthModal({ open, onClose, initialMode = 'login', onAuthed }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError(null);
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [open, initialMode]);

  // Lock body scroll while modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const switchMode = (next: 'login' | 'register') => {
    setError(null);
    setMode(next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    if (!email.trim() || !password) {
      setError('Mohon isi username/email dan kata sandi.');
      setBusy(false);
      return;
    }
    if (mode === 'register' && name.trim().length < 2) {
      setError('Nama lengkap minimal 2 karakter.');
      setBusy(false);
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      setBusy(false);
      return;
    }
    const { error: err } =
      mode === 'login'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, name.trim());
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    onAuthed?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Masuk' : 'Daftar'}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className="relative w-[400px] h-[700px] max-w-full max-h-[92vh] glass-dark rounded-3xl shadow-glass overflow-hidden flex flex-col animate-scale-in"
        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}
      >
        {/* Decorative top glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-72 rounded-full bg-luxegreen-500/20 blur-3xl" />

        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-300 ease-luxe"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand */}
        <div className="relative z-10 pt-12 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-glow">
            <Sprout className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight">
            Agro Kates Mandiri
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Benih pepaya californiana premium
          </p>
        </div>

        {/* Sliding panels container */}
        <div className="relative z-10 flex-1 px-8 overflow-hidden">
          {/* Mode toggle pill */}
          <div className="relative grid grid-cols-2 mb-6 p-1 rounded-xl bg-white/5 border border-white/10 text-sm">
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-orange-500 shadow-glow transition-transform duration-500 ease-luxe"
              style={{
                transform: mode === 'register' ? 'translateX(calc(100% + 0px))' : 'translateX(0)',
              }}
            />
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={cn(
                'relative z-10 py-2 font-medium transition-colors duration-300 ease-luxe',
                mode === 'login' ? 'text-white' : 'text-white/50'
              )}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={cn(
                'relative z-10 py-2 font-medium transition-colors duration-300 ease-luxe',
                mode === 'register' ? 'text-white' : 'text-white/50'
              )}
            >
              Daftar
            </button>
          </div>

          {/* Slide panels */}
          <div
            className="flex w-[200%] transition-transform duration-500 ease-luxe"
            style={{ transform: mode === 'register' ? 'translateX(-50%)' : 'translateX(0)' }}
          >
            {/* Login panel */}
            <form onSubmit={submit} className="w-1/2 space-y-4 pr-1">
              <Field
                label="Username / Email"
                type="text"
                value={email}
                onChange={setEmail}
                placeholder="Nafero Rafif atau email"
                autoComplete="username"
              />
              <Field
                label="Kata Sandi"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <ErrorBanner error={mode === 'login' ? error : null} />
              <SubmitButton busy={busy} mode="login" />
              <p className="text-center text-xs text-white/50 pt-1">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 ease-luxe"
                >
                  Daftar di sini
                </button>
              </p>
            </form>

            {/* Register panel */}
            <form onSubmit={submit} className="w-1/2 space-y-4 pl-1">
              <Field
                label="Nama Lengkap"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Nama Anda"
                autoComplete="name"
              />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="nama@email.com"
                autoComplete="email"
              />
              <Field
                label="Kata Sandi"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
              />
              <ErrorBanner error={mode === 'register' ? error : null} />
              <SubmitButton busy={busy} mode="register" />
              <p className="text-center text-xs text-white/50 pt-1">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 ease-luxe"
                >
                  Masuk
                </button>
              </p>
            </form>
          </div>
        </div>

        <div className="relative z-10 px-8 pb-6 text-center">
          <p className="text-[11px] text-white/40 leading-relaxed">
            Dengan masuk, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi
            Agro Kates Mandiri.
          </p>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

function Field({ label, type, value, onChange, placeholder, autoComplete }: FieldProps) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-xs font-medium text-white/70 uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/60 focus:bg-white/10 transition-colors duration-300 ease-luxe"
      />
    </label>
  );
}

function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300 animate-fade-in">
      {error}
    </div>
  );
}

function SubmitButton({ busy, mode }: { busy: boolean; mode: 'login' | 'register' }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full btn-orange py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : mode === 'login' ? (
        <LogIn className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {mode === 'login' ? 'Masuk' : 'Buat Akun'}
    </button>
  );
}
