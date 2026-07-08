import { Sprout, ArrowDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onBrowse: () => void;
}

export function Hero({ onBrowse }: HeroProps) {
  return (
    <section className="relative pt-24 sm:pt-28 pb-2 sm:pb-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-dark px-6 py-12 sm:px-12 sm:py-16">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-luxegreen-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-orange-400 text-xs font-medium tracking-wide mb-5 animate-slide-up">
              <Sparkles className="h-3.5 w-3.5" />
              Benih Pepaya Premium Pilihan
            </div>
            <h1
              className="font-display text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.05] text-balance animate-slide-up"
              style={{ animationDelay: '60ms' }}
            >
              Tanam Hari Ini,
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-luxegreen-400 bg-clip-text text-transparent">
                Panen Melimpah
              </span>
            </h1>
            <p
              className="mt-5 text-white/70 text-base sm:text-lg leading-relaxed max-w-xl animate-slide-up"
              style={{ animationDelay: '120ms' }}
            >
              Delapan varietas benih pepaya unggulan — California Gold, Red Lady,
              Hawaii Solo, dan lainnya. Daya tumbuh teruji, produktivitas tinggi.
            </p>
            <div
              className="mt-8 flex flex-wrap items-center gap-3 animate-slide-up"
              style={{ animationDelay: '180ms' }}
            >
              <button
                onClick={onBrowse}
                className="btn-orange px-6 py-3 flex items-center gap-2 text-sm"
              >
                <Sprout className="h-4 w-4" />
                Jelajahi Katalog
              </button>
              <a
                href="#tentang"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('eduksi-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white text-sm font-medium hover:bg-white/10 transition-colors duration-300 ease-luxe"
              >
                Tentang & Edukasi
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
