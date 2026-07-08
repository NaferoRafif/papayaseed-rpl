import { Sprout, Leaf, Award, Globe as Globe2, BookOpen, Tractor, TrendingUp, ShieldCheck } from 'lucide-react';

export function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Hero */}
      <div className="rounded-3xl glass-dark p-8 sm:p-12 mb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-luxegreen-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-luxegreen-400 text-xs font-medium tracking-wide mb-4">
            <Leaf className="h-3.5 w-3.5" />
            Sejak 2018
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight text-balance max-w-3xl">
            Benih pepaya premium untuk petani Indonesia
          </h1>
          <p className="mt-4 text-white/70 text-base leading-relaxed max-w-2xl">
            Agro Kates Mandiri memilih dan mendistribusikan varietas benih pepaya
            unggulan — dari hibrida komersial hingga strains langka — dengan jaminan
            kemurnian dan daya tumbuh yang teruji.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Stat icon={<Sprout className="h-5 w-5" />} value="8+" label="Varietas premium" />
        <Stat icon={<Globe2 className="h-5 w-5" />} value="6" label="Negara asal benih" />
        <Stat icon={<Award className="h-5 w-5" />} value="92%" label="Rata-rata daya tumbuh" />
        <Stat icon={<Tractor className="h-5 w-5" />} value="1.200+" label="Petani terlayani" />
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        <ValueCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Kemurnian Teruji"
          body="Setiap batch benih diuji laboratorium untuk viabilitas, kemurnian genetik, dan bebas patogen."
        />
        <ValueCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Produktivitas Tinggi"
          body="Varietas terpilih menghasilkan tonase per hektar di atas rata-rata industri."
        />
        <ValueCard
          icon={<Globe2 className="h-5 w-5" />}
          title="Jejaring Global"
          body="Mitra breeding dari Taiwan, Hawaii, Meksiko, hingga Amerika Selatan."
        />
      </div>

      {/* Edukasi */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-orange-400" />
          <h2 className="font-display text-2xl font-bold text-white">Edukasi Budidaya</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <EduCard
            step="01"
            title="Persiapan Lahan & Penyemaian"
            body="Pilih lahan drainase baik dengan pH 6-6.5. Semai benih dalam polybag berisi media campuran tanah + pupuk kandang (1:1). Jaga kelembaban, hindari genangan air. Perkecambahan ideal 7-14 hari pada 25-30°C."
          />
          <EduCard
            step="02"
            title="Pindah Tanam & Penjarangan"
            body="Pindahkan bibit berdaun 4-5 ke lahan jarak tanam 2×2m. Tanam 3 bibit per lubang, lalu sisakan tanaman betina terbaik setelah bunga muncul pada umur 3-4 bulan."
          />
          <EduCard
            step="03"
            title="Pemupukan & Irigasi"
            body="Beri pupuk NPK 16-16-16 100g/pohon/bulan. Siram pagi-sore secara konsisten, terutama fase pembungaan dan pembuahan. Mulsa rumput menjaga kelembaban tanah."
          />
          <EduCard
            step="04"
            title="Panen & Penanganan Pascapanen"
            body="Buah siap panen 7-12 bulan tergantung varietas, ditandai warna kulit mulai menguning. Panen pagi hari, sortasi berdasar ukuran, simpan pada 10-12°C untuk memperpanjang umur simpan."
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 mb-3">
        {icon}
      </div>
      <div className="font-display text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/50 mt-0.5">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl glass p-6 hover:bg-white/10 transition-colors duration-500 ease-luxe">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxegreen-500 to-luxegreen-700 text-white mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{body}</p>
    </div>
  );
}

function EduCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <article className="rounded-2xl glass p-6 hover:bg-white/8 transition-colors duration-500 ease-luxe group">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-display text-3xl font-bold text-orange-500/40 group-hover:text-orange-500/70 transition-colors duration-500 ease-luxe">
          {step}
        </span>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-white/60 leading-relaxed">{body}</p>
    </article>
  );
}
