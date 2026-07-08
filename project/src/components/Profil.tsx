import { User, Mail, LogOut, Sprout, Package, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth, getStoredProfileName } from '../context/AuthContext';

interface ProfilProps {
  onAuthRequired: () => void;
  onViewOrders: () => void;
}

export function Profil({ onAuthRequired, onViewOrders }: ProfilProps) {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="luxe-card p-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
            <User className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-zinc-900">
            Selamat datang
          </h2>
          <p className="text-zinc-500 mt-2 mb-6">
            Masuk atau daftar untuk mengelola profil dan pesanan Anda.
          </p>
          <button onClick={onAuthRequired} className="btn-orange px-6 py-3 text-sm">
            Masuk / Daftar
          </button>
        </div>
      </section>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string) || getStoredProfileName() || 'Pengguna';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-orange-400 text-xs font-medium tracking-wide mb-3">
          <User className="h-3.5 w-3.5" />
          Akun Saya
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Profil
        </h1>
      </div>

      {/* Profile card */}
      <div className="luxe-card p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-glow">
            <span className="font-display text-2xl sm:text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 truncate">
              {displayName}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-luxegreen-100 text-luxegreen-700 text-[11px] font-medium">
              <ShieldCheck className="h-3 w-3" />
              Terverifikasi
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="luxe-card divide-y divide-zinc-100 overflow-hidden">
        <MenuItem
          icon={<Sprout className="h-4 w-4" />}
          label="Jelajahi Katalog"
          desc="Lihat semua benih pepaya premium"
          onClick={() => {}}
        />
        <MenuItem
          icon={<Package className="h-4 w-4" />}
          label="Riwayat Pesanan"
          desc="Lihat pesanan Anda sebelumnya"
          onClick={onViewOrders}
        />
      </div>

      <button
        onClick={handleSignOut}
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 py-3.5 font-medium hover:bg-red-500/20 transition-colors duration-300 ease-luxe"
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </button>
    </section>
  );
}

function MenuItem({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 hover:bg-zinc-50 transition-colors duration-300 ease-luxe text-left"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-zinc-900">{label}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-zinc-300" />
    </button>
  );
}
