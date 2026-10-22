<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte';
  import { 
    Briefcase, 
    Sparkles, 
    CheckCircle2, 
    ArrowLeft, 
    ArrowRight, 
    Building2, 
    MapPin, 
    GraduationCap, 
    Award, 
    Calendar, 
    TrendingUp, 
    ShieldCheck, 
    ChevronDown, 
    FileCheck,
    Search,
    Globe2
  } from 'lucide-svelte';

  let openFaq = $state<number | null>(0);

  const careerCategories = [
    {
      title: 'Magang Industri & MSIB',
      badge: 'MAGANG',
      badgeColor: 'bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/20',
      desc: 'Program magang bersertifikat yang dapat dikonversikan ke SKS perkuliahan. Bekerja langsung pada proyek riil di perusahaan mitra BUMN dan swasta.'
    },
    {
      title: 'Lowongan Fresh Graduate & Pekerja',
      badge: 'FULL-TIME',
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
      desc: 'Peluang karier bagi alumni baru dan mahasiswa tingkat akhir. Menghargai etos kerja mandiri khas mahasiswa Universitas Terbuka.'
    },
    {
      title: 'Proyek Kolaborasi & Freelance',
      badge: 'PROYEK',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
      desc: 'Peluang pekerjaan lepas jarak jauh (remote/online) dari jaringan bisnis alumni. Bangun rekam jejak portofolio profesional sejak masih kuliah.'
    },
    {
      title: 'Program Bimbingan Portofolio',
      badge: 'MENTORING',
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200',
      desc: 'Sesi kurasi langsung bersama mentor industri untuk memastikan resume dan portofolio Anda siap bersaing di bursa kerja nasional.'
    }
  ];

  const careerFaqs = [
    {
      q: 'Bagaimana mahasiswa UT dapat melamar lowongan di UT REKA?',
      a: 'Mahasiswa cukup masuk ke Dashboard UT REKA, melengkapi profil biodata & CV, lalu memilih lowongan yang diminati pada menu Peluang Karier. Lamaran akan langsung diteruskan ke mitra atau alumni pembuat lowongan.'
    },
    {
      q: 'Apakah lowongan yang tersedia ramah mahasiswa kuliah sambil bekerja?',
      a: 'Ya. Mayoritas peluang di UT REKA menawarkan opsi kerja Remote (WFH) atau Hybrid, sehingga sangat fleksibel dan dapat disesuaikan dengan ritme belajar mandiri mahasiswa UT.'
    },
    {
      q: 'Apakah alumni atau perusahaan luar bisa memasang lowongan di sini?',
      a: 'Tentu. Alumni terverifikasi dapat mempublikasikan lowongan secara instan melalui Dashboard Alumni. Perusahaan mitra luar juga dapat bekerja sama melalui pengawasan Administrator UT REKA.'
    },
    {
      q: 'Apakah ada biaya administrasi untuk melamar?',
      a: 'Sama sekali tidak ada biaya. UT REKA melarang keras segala bentuk pungutan biaya dalam proses rekrutmen magang maupun kerja.'
    }
  ];
</script>

<svelte:head>
  <title>Peluang Karier & Magang | UT REKA</title>
</svelte:head>

<div class="min-h-screen bg-[#F7F6F2] text-[#20283B] antialiased selection:bg-[#3157D5] selection:text-white pb-24 md:pb-16">
  <!-- Top Header Bar -->
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E8EF] px-4 sm:px-6 h-16 flex items-center justify-between">
    <a 
      href="/" 
      class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#101B35] hover:text-[#3157D5] transition touch-manipulation"
    >
      <ArrowLeft class="w-4 h-4" />
      <span class="hidden sm:inline">Kembali ke Beranda</span>
    </a>

    <a href="/" title="UT REKA" class="flex items-center gap-2">
      <img src="/images/ut-reka-logo-transparent.png" alt="UT REKA Relasi Karir" class="h-10 sm:h-11 w-auto object-contain" />
    </a>

    <div class="flex items-center gap-2">
      {#if authStore.isAuthenticated}
        <a 
          href="/dashboard/opportunities" 
          class="px-4 py-2 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition touch-manipulation shadow-xs"
        >
          Lihat Semua Lowongan
        </a>
      {:else}
        <a 
          href="/login" 
          class="px-4 py-2 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition touch-manipulation shadow-xs"
        >
          Masuk Akun
        </a>
      {/if}
    </div>
  </header>

  <!-- Hero Section -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-8 space-y-6">
    <div class="relative overflow-hidden rounded-3xl bg-[#101B35] p-6 sm:p-10 text-white shadow-xl border border-[#101B35]/40">
      <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-[#3157D5]/25 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -top-12 w-48 h-48 bg-[#5478FF]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 space-y-4 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#FFC83D] uppercase tracking-wider">
          <Briefcase class="w-3.5 h-3.5 text-[#FFC83D]" />
          <span>Portal Peluang Karier Resmi</span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black font-heading tracking-tight leading-tight text-white">
          Akselerasi Karier Profesional Bersama Jaringan Industri UT
        </h1>

        <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Temukan lowongan magang MSIB, peluang kerja remote, proyek kolaborasi, dan rekrutmen eksklusif yang dibuka khusus oleh mitra industri dan jaringan alumni Universitas Terbuka.
        </p>

        <!-- Trust Badges -->
        <div class="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white font-medium border border-white/15">
            <Building2 class="w-3.5 h-3.5 text-[#3157D5]" />
            Mitra Industri & BUMN
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white font-medium border border-white/15">
            <Globe2 class="w-3.5 h-3.5 text-[#FFC83D]" />
            Opsi Remote & Fleksibel
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white font-medium border border-white/15">
            <ShieldCheck class="w-3.5 h-3.5 text-blue-300" />
            Lowongan Terverifikasi Bebas Biaya
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 flex flex-wrap items-center gap-3">
          <a 
            href={authStore.isAuthenticated ? '/dashboard/opportunities' : '/register?role=student'}
            class="px-5 py-3 rounded-2xl bg-[#3157D5] text-white text-xs sm:text-sm font-bold hover:bg-[#2646B8] transition shadow-md touch-manipulation flex items-center gap-2"
          >
            <span>Jelajahi Lowongan Karier</span>
            <ArrowRight class="w-4 h-4" />
          </a>
          <a 
            href="/register?role=alumni"
            class="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition touch-manipulation"
          >
            Publikasikan Lowongan (Alumni)
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 4 Kategori Peluang Karier -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    <div class="text-center space-y-1">
      <h2 class="text-xl sm:text-2xl font-black font-heading text-[#101B35]">
        Kategori Peluang Karier yang Tersedia
      </h2>
      <p class="text-xs sm:text-sm text-[#68738A]">
        Dirancang khusus untuk mendukung perkembangan mahasiswa dan alumni UT
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each careerCategories as item}
        <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3 hover:border-[#3157D5]/40 transition">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg {item.badgeColor}">
              {item.badge}
            </span>
          </div>
          <h3 class="text-sm font-extrabold text-[#101B35]">{item.title}</h3>
          <p class="text-xs text-[#68738A] leading-relaxed">{item.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Mengapa Mahasiswa UT Dicari Industri? -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-5">
      <div class="space-y-1">
        <span class="text-[11px] font-bold uppercase tracking-wider text-[#3157D5]">Nilai Lebih Mahasiswa UT</span>
        <h2 class="text-xl sm:text-2xl font-black font-heading text-[#101B35]">
          Karakter Mandiri yang Dihargai Perusahaan
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] space-y-2">
          <div class="font-extrabold text-[#101B35] flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-[#3157D5]" />
            <span>Kemandirian Tinggi</span>
          </div>
          <p class="text-[#68738A] leading-relaxed">
            Mahasiswa UT terbiasa dengan metode <em>self-directed learning</em>, memecahkan masalah tanpa perlu supervisi konstan.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] space-y-2">
          <div class="font-extrabold text-[#101B35] flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-[#3157D5]" />
            <span>Manajemen Waktu Teruji</span>
          </div>
          <p class="text-[#68738A] leading-relaxed">
            Mampu menyeimbangkan antara komitmen belajar, pekerjaan sehari-hari, dan target profesional secara konsisten.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] space-y-2">
          <div class="font-extrabold text-[#101B35] flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-[#3157D5]" />
            <span>Jaringan Nasional 39 UPBJJ</span>
          </div>
          <p class="text-[#68738A] leading-relaxed">
            Perusahaan dapat merekrut talenta lokal berbakat di seluruh kota di Indonesia tanpa batasan geografis.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Karier Section -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
    <div class="text-center space-y-1">
      <h2 class="text-xl font-black font-heading text-[#101B35]">
        Pertanyaan Seputar Peluang Karier
      </h2>
      <p class="text-xs text-[#68738A]">Informasi seputar magang, rekrutmen, dan tata cara melamar</p>
    </div>

    <div class="space-y-3">
      {#each careerFaqs as item, i}
        <div class="rounded-2xl bg-white border border-[#E5E8EF] shadow-xs overflow-hidden">
          <button 
            type="button"
            onclick={() => openFaq = openFaq === i ? null : i}
            class="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-extrabold text-[#101B35] hover:bg-[#F7F6F2] transition touch-manipulation"
          >
            <span>{item.q}</span>
            <ChevronDown class="w-4 h-4 text-[#68738A] shrink-0 transition-transform {openFaq === i ? 'rotate-180' : ''}" />
          </button>
          {#if openFaq === i}
            <div class="px-4 pb-4 pt-1 text-xs text-[#68738A] leading-relaxed border-t border-[#F7F6F2]">
              {item.a}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>
</div>
