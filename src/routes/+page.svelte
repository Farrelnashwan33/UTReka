<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte';
  import { 
    Search, 
    ArrowRight, 
    Sparkles, 
    GraduationCap, 
    Briefcase, 
    Users, 
    Globe, 
    CheckCircle2, 
    BookOpen, 
    Building2, 
    Lightbulb, 
    Target, 
    Quote, 
    ExternalLink,
    ChevronRight,
    Award,
    Scale,
    TrendingUp,
    MessageSquare,
    ShieldCheck,
    Home,
    User,
    LogIn
  } from 'lucide-svelte';

  onMount(async () => {
    await authStore.init();
  });

  const specializations = [
    {
      icon: '💻',
      title: 'S1 Sistem Informasi & Teknologi',
      desc: 'Software engineering, cloud computing, data science, dan product management di tech industry.',
      category: 'Teknologi Informasi'
    },
    {
      icon: '📈',
      title: 'S1 Manajemen & Bisnis Digital',
      desc: 'Digital marketing, supply chain, kewirausahaan modern, dan strategi manajemen operasional.',
      category: 'Bisnis & Manajemen'
    },
    {
      icon: '⚖️',
      title: 'S1 Ilmu Hukum & Advokasi',
      desc: 'Legal corporate, paralegal industri, tata kelola kepatuhan, dan perancangan hukum bisnis.',
      category: 'Hukum'
    },
    {
      icon: '🏦',
      title: 'S1 Akuntansi & Keuangan',
      desc: 'Financial analyst, audit perbankan BUMN, konsultan pajak, dan manajemen risiko korporasi.',
      category: 'Keuangan'
    },
    {
      icon: '🌐',
      title: 'S1 Ilmu Komunikasi & Media',
      desc: 'Public relations korporat, brand communications, content strategy, dan jurnalisme digital.',
      category: 'Komunikasi'
    },
    {
      icon: '📜',
      title: 'Program Sertifikasi & Pascasarjana',
      desc: 'Persiapan uji kompetensi profesi, TOEFL/IELTS, magister, dan persiapan karier internasional.',
      category: 'Pengembangan Diri'
    }
  ];

  const stories = [
    {
      tag: 'TEKNOLOGI',
      tagColor: 'bg-emerald-50 text-emerald-700',
      title: 'Mahasiswa UT Raih Juara Kompetisi Software & AI Nasional 2026',
      author: 'Tim Mahasiswa SI UPBJJ Jakarta'
    },
    {
      tag: 'KARIER BUMN',
      tagColor: 'bg-blue-50 text-blue-700',
      title: '28 Alumni UT Lolos Rekrutmen Bersama BUMN Sektor Jasa Keuangan',
      author: 'Kemitraan IKA UT & Forum Human Capital'
    },
    {
      tag: 'TIPS KULIAH',
      tagColor: 'bg-amber-50 text-amber-700',
      title: 'Strategi Membagi Waktu Antara Bekerja Full-Time & Kuliah Daring Fleksibel',
      author: 'Sarah Wijaya, Alumni Mentor GoTo'
    },
    {
      tag: 'KOMUNITAS',
      tagColor: 'bg-purple-50 text-purple-700',
      title: 'Ikatan Alumni UT Resmikan Program 100 Portofolio Digital Gratis',
      author: 'Pengurus Pusat IKA UT'
    }
  ];
</script>

<svelte:head>
  <title>UT REKA — Universitas Terbuka Karier | Relasi Tepat, Peluang Nyata</title>
  <meta name="description" content="Platform jejaring karier dan mentoring eksklusif mahasiswa dan alumni Universitas Terbuka. Dari Kampus Terbuka, Menuju Karier Tanpa Batas." />
</svelte:head>

<!-- Root App Shell Container: Full-width, overflow-x-hidden, mobile safe padding -->
<div class="min-h-screen bg-[#FAF9F6] text-[#202124] antialiased selection:bg-[#FFD43B] selection:text-[#183153] font-sans w-full max-w-full overflow-x-hidden pb-20 md:pb-0">
  
  <!-- ========================================================
       1. HERO SECTION (Turquoise Canvas with Illustrated Campus)
       ======================================================== -->
  <section class="relative bg-gradient-to-b from-[#1DB5A0] via-[#1AA693] to-[#169886] text-white pt-3 sm:pt-6 pb-12 sm:pb-20 px-3.5 sm:px-6 lg:px-8 overflow-hidden rounded-b-[28px] sm:rounded-b-[48px] shadow-md w-full">
    <div class="max-w-6xl mx-auto w-full">
      
      <!-- Top Pill Navbar (Adaptive 360px - Desktop) -->
      <header class="flex items-center justify-between py-2 mb-6 sm:mb-12 gap-2">
        <!-- Brand Logo -->
        <a href="/" class="flex items-center gap-2 shrink-0 group py-1" title="UT REKA">
          <img 
            src="/images/ut-reka-logo.png" 
            alt="UT REKA Relasi Karir" 
            class="h-11 sm:h-12 w-auto rounded-xl object-contain shadow-xs group-hover:scale-102 transition-transform" 
          />
        </a>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-1 text-xs font-bold text-white/90">
          <a href="/mentor" class="hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition">
            Program Mentor
          </a>
          <a href="/karier" class="hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition">
            Peluang Karier
          </a>
          <a href="/panduan" class="hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition">
            Panduan & Bantuan
          </a>
        </div>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {#if authStore.isAuthenticated}
            <a 
              href={authStore.role === 'alumni' ? '/dashboard/alumni' : '/dashboard/student'}
              class="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#183153] text-[#FFD43B] text-xs sm:text-sm font-black hover:bg-[#102138] transition shadow-xs touch-manipulation min-h-[38px]"
            >
              <span>Dashboard</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          {:else}
            <a 
              href="/login" 
              class="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-bold transition backdrop-blur-xs touch-manipulation min-h-[36px]"
            >
              <span>Masuk</span>
            </a>
            <a 
              href="/register" 
              class="inline-flex items-center justify-center gap-1 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#183153] hover:bg-[#102138] text-[#FFD43B] text-xs sm:text-sm font-black transition shadow-xs touch-manipulation min-h-[36px]"
            >
              <span>Daftar</span>
              <ArrowRight class="w-3 h-3 hidden sm:inline" />
            </a>
          {/if}
        </div>
      </header>

      <!-- Hero Headline & Description -->
      <div class="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4 mb-6 sm:mb-10 px-1">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-xs">
          <Sparkles class="w-3 h-3 text-[#FFD43B]" />
          <span>Jejaring Karier Komunitas UT</span>
        </div>

        <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] sm:leading-[1.12] text-white font-heading">
          Relasi Tepat. Peluang Nyata.<br class="hidden sm:inline" />
          <span class="text-[#FFD43B]">Raih Masa Depan.</span>
        </h1>

        <p class="text-xs sm:text-sm md:text-base text-white/90 max-w-xl mx-auto font-normal leading-relaxed">
          Platform jejaring karier & mentoring eksklusif mahasiswa dan alumni Universitas Terbuka. Dari Kampus Terbuka, Menuju Karier Tanpa Batas.
        </p>

        <!-- Touch-Friendly Hero Buttons -->
        <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 max-w-xs sm:max-w-none mx-auto w-full">
          <a 
            href={authStore.isAuthenticated ? "/dashboard/student" : "/register"}
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#183153] hover:bg-gray-100 text-xs sm:text-sm font-black transition shadow-md touch-manipulation min-h-[44px]"
          >
            <span>Mulai Eksplorasi</span>
            <ArrowRight class="w-4 h-4 text-[#18866B]" />
          </a>
          <a 
            href="#keunggulan"
            class="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-bold transition backdrop-blur-xs touch-manipulation min-h-[44px]"
          >
            <span>Pelajari Fitur</span>
            <ChevronRight class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Hero Central Illustration (Framed, Proportional 16:10 aspect, fully responsive) -->
      <div class="relative max-w-4xl mx-auto mt-2 rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-white/30 shadow-xl bg-white w-full">
        <img 
          src="/images/ut_campus_hero.jpg" 
          alt="Ilustrasi Kampus Universitas Terbuka dengan Menara Jam dan Mahasiswa" 
          class="w-full h-auto aspect-16/10 sm:aspect-16/9 object-cover object-center"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none"></div>
      </div>

    </div>
  </section>

  <!-- ========================================================
       2. STATS BAR (Dark Navy Bar with Big Bold Metrics)
       ======================================================== -->
  <section class="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-4 sm:-mt-8 relative z-20">
    <div class="bg-[#183153] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-white/10 text-center">
      <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FFD43B] mb-4 sm:mb-6 font-heading">
        Jejaring Terbesar Mahasiswa & Alumni Seluruh Indonesia
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
        <!-- Metric 1 -->
        <div class="pt-2 sm:pt-0 sm:px-2 space-y-1">
          <div class="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-heading">
            96%
          </div>
          <p class="text-[11px] sm:text-xs text-gray-300 font-medium max-w-xs mx-auto leading-relaxed">
            Tingkat kepuasan bimbingan & pendampingan karier mahasiswa
          </p>
        </div>

        <!-- Metric 2 -->
        <div class="pt-3 sm:pt-0 sm:px-2 space-y-1">
          <div class="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FFD43B] tracking-tight font-heading">
            39 UPBJJ
          </div>
          <p class="text-[11px] sm:text-xs text-gray-300 font-medium max-w-xs mx-auto leading-relaxed">
            Terhubung di seluruh nusantara & Sentra Luar Negeri
          </p>
        </div>

        <!-- Metric 3 -->
        <div class="pt-3 sm:pt-0 sm:px-2 space-y-1">
          <div class="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1DB5A0] tracking-tight font-heading">
            10.000+
          </div>
          <p class="text-[11px] sm:text-xs text-gray-300 font-medium max-w-xs mx-auto leading-relaxed">
            Mahasiswa aktif dan alumni profesional terverifikasi
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       3. QUOTE STATEMENT SECTION (Editorial Elegant Quote)
       ======================================================== -->
  <section class="py-12 sm:py-20 px-4 sm:px-6 text-center max-w-3xl mx-auto">
    <div class="w-10 h-10 rounded-xl bg-[#1DB5A0]/15 text-[#18866B] flex items-center justify-center mx-auto mb-4">
      <Quote class="w-5 h-5 stroke-[2.5]" />
    </div>

    <blockquote class="text-base sm:text-xl md:text-2xl font-black text-[#183153] leading-snug tracking-tight font-heading px-2">
      “<span class="text-[#18866B]">Pendidikan tinggi berkualitas</span> dan kesempatan karier profesional terbuka bagi siapa saja, dari Sabang sampai Merauke hingga mancanegara tanpa batas ruang dan waktu.”
    </blockquote>

    <div class="mt-4 flex flex-col items-center">
      <span class="text-xs sm:text-sm font-extrabold text-gray-900">Prof. Ojat Darojat, M.Bus., Ph.D.</span>
      <span class="text-[10px] sm:text-xs text-gray-500 mt-0.5">Rektor Universitas Terbuka & Pembina UT REKA</span>
    </div>
  </section>

  <!-- ========================================================
       4. 3 PASTEL FEATURE CARDS (Blue, Peach, Lavender)
       ======================================================== -->
  <section id="keunggulan" class="pb-12 sm:pb-20 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      
      <!-- Card 1: Soft Cyan/Blue -->
      <div class="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#EAF4FF] border border-[#D0E6FF] flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-1 duration-200">
        <div class="space-y-3">
          <div class="w-11 h-11 rounded-xl bg-[#CBE4FF] text-[#0066CC] flex items-center justify-center shadow-xs">
            <Lightbulb class="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 class="text-base sm:text-lg font-black text-[#183153] leading-tight font-heading">
            REKA Match™ Smart Mentoring
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Sistem pencocokan cerdas yang mempertemukan mahasiswa dengan alumni mentor berpengalaman berdasarkan program studi, industri impian, dan target keahlian.
          </p>
        </div>
        <a href="/dashboard/connections" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] hover:underline pt-1">
          <span>Eksplorasi Mentoring</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <!-- Card 2: Soft Peach/Orange -->
      <div class="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#FFF3E8] border border-[#FFE2CC] flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-1 duration-200">
        <div class="space-y-3">
          <div class="w-11 h-11 rounded-xl bg-[#FFE0C4] text-[#D96B00] flex items-center justify-center shadow-xs">
            <Target class="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 class="text-base sm:text-lg font-black text-[#183153] leading-tight font-heading">
            Peluang Karier & Magang
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Akses lowongan pekerjaan eksklusif, program magang MSIB, dan bimbingan langsung dari alumni di GoTo, Bank Mandiri, BCA, Telkom, dan multinasional.
          </p>
        </div>
        <a href="/dashboard/opportunities" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#D96B00] hover:underline pt-1">
          <span>Jelajahi Lowongan</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <!-- Card 3: Soft Lavender/Purple -->
      <div class="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#F4EEFF] border border-[#E4D4FF] flex flex-col justify-between space-y-4 transition-transform hover:-translate-y-1 duration-200 sm:col-span-2 lg:col-span-1">
        <div class="space-y-3">
          <div class="w-11 h-11 rounded-xl bg-[#E4D4FF] text-[#6B28D9] flex items-center justify-center shadow-xs">
            <Globe class="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 class="text-base sm:text-lg font-black text-[#183153] leading-tight font-heading">
            Jejaring 39 UPBJJ & Luar Negeri
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Komunitas terbuka dan inklusif yang menghubungkan mahasiswa dari Sabang sampai Merauke serta Sentra Layanan Luar Negeri seperti Malaysia, Korea, Taiwan, dan Hong Kong.
          </p>
        </div>
        <a href="/dashboard/connections" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B28D9] hover:underline pt-1">
          <span>Gabung Komunitas</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  </section>

  <!-- ========================================================
       5. JALUR PROGRAM & SPESIALISASI KARIER
       ======================================================== -->
  <section class="py-12 sm:py-20 bg-white border-y border-[#E7E5E0]">
    <div class="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-14">
        <span class="inline-block px-3 py-0.5 rounded-full bg-[#1DB5A0]/15 text-[#18866B] text-[10px] sm:text-xs font-black uppercase tracking-wider">
          JALUR SPESIALISASI
        </span>
        <h2 class="text-xl sm:text-3xl font-black text-[#183153] tracking-tight font-heading">
          Pilihan Bidang & Program Karier
        </h2>
        <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Eksplorasi jejaring dan bimbingan karier terarah sesuai dengan program studi akademik Anda di Universitas Terbuka.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {#each specializations as spec}
          <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FAF9F6] border border-[#E7E5E0] hover:border-[#1DB5A0] hover:bg-white transition-all duration-200 group flex flex-col justify-between space-y-3 shadow-2xs">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-2xl p-1.5 rounded-xl bg-white border border-[#E7E5E0] shadow-2xs group-hover:scale-105 transition-transform">
                  {spec.icon}
                </span>
                <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#183153]/5 text-[#183153] uppercase">
                  {spec.category}
                </span>
              </div>
              <h3 class="text-xs sm:text-sm font-extrabold text-[#183153] group-hover:text-[#18866B] transition-colors font-heading leading-snug">
                {spec.title}
              </h3>
              <p class="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                {spec.desc}
              </p>
            </div>

            <a href="/dashboard/connections" class="inline-flex items-center gap-1 text-[11px] font-bold text-[#18866B] hover:underline pt-2 border-t border-[#E7E5E0]/70">
              <span>Temukan Mentor Bidang Ini</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </a>
          </div>
        {/each}
      </div>

    </div>
  </section>

  <!-- ========================================================
       6. CAMPUS LIFE / EKOSISTEM KOMUNITAS UT REKA
       ======================================================== -->
  <section class="py-12 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
      
      <!-- Left: Big Illustrated Campus Life Card -->
      <div class="lg:col-span-7 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7E5E0] shadow-md bg-white group">
        <div class="p-4 sm:p-6 space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-[#FFD43B]/30 text-[#183153] text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
            EKOSISTEM KAMPUS
          </span>
          <h2 class="text-lg sm:text-2xl font-black text-[#183153] tracking-tight font-heading">
            Kehidupan Komunitas & Bimbingan Mahasiswa
          </h2>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Meskipun belajar daring dan mandiri, Anda selalu terhubung dengan ribuan kawan seperjuangan dan kakak tingkat di industri.
          </p>
        </div>
        
        <div class="overflow-hidden">
          <img 
            src="/images/ut_campus_life.jpg" 
            alt="Mahasiswa UT Berdiskusi di Halaman Kampus" 
            class="w-full h-44 sm:h-64 md:h-72 object-cover group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </div>

      <!-- Right: 2 Stacked Feature Cards -->
      <div class="lg:col-span-5 space-y-4 sm:space-y-5">
        
        <!-- Subcard 1 -->
        <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#E7E5E0] shadow-2xs space-y-2.5">
          <div class="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#0066CC] flex items-center justify-center">
            <Users class="w-5 h-5 stroke-[2.3]" />
          </div>
          <h3 class="text-sm sm:text-base font-black text-[#183153] font-heading">
            Klub Diskusi & Networking Mahasiswa
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Bergabung dengan study-circle per wilayah UPBJJ, kelompok belajar persiapan ujian, coding jam, dan diskusi karier terstruktur.
          </p>
          <a href="/dashboard/connections" class="inline-flex items-center gap-1 text-xs font-bold text-[#18866B] hover:underline pt-1">
            <span>Jelajahi Komunitas</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
        </div>

        <!-- Subcard 2 -->
        <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#E7E5E0] shadow-2xs space-y-2.5">
          <div class="w-10 h-10 rounded-xl bg-[#FFF3E8] text-[#D96B00] flex items-center justify-center">
            <MessageSquare class="w-5 h-5 stroke-[2.3]" />
          </div>
          <h3 class="text-sm sm:text-base font-black text-[#183153] font-heading">
            Bimbingan Karier & Mentoring 1-on-1
          </h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            Dapatkan saran langsung dari praktisi industri: bedah resume ATS, review portofolio, simulasi wawancara, dan tips karier.
          </p>
          <a href="/dashboard/opportunities" class="inline-flex items-center gap-1 text-xs font-bold text-[#D96B00] hover:underline pt-1">
            <span>Daftar Bimbingan</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  </section>

  <!-- ========================================================
       7. OUR LATEST STORIES / KABAR & KISAH INSPIRATIF
       ======================================================== -->
  <section class="py-12 sm:py-20 bg-[#FAF9F6] border-t border-[#E7E5E0]">
    <div class="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-12">
        <div>
          <span class="inline-block px-3 py-0.5 rounded-full bg-[#1DB5A0]/15 text-[#18866B] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
            KISAH INSPIRATIF
          </span>
          <h2 class="text-xl sm:text-3xl font-black text-[#183153] tracking-tight font-heading">
            Cerita Alumni & Kabar Terkini
          </h2>
        </div>
        <a href="/dashboard/connections" class="text-xs font-bold text-[#18866B] hover:underline flex items-center gap-1">
          <span>Lihat Semua Kabar</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        <!-- Left: Featured Story with City Career Illustration -->
        <div class="lg:col-span-7 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7E5E0] bg-white shadow-sm hover:shadow-md transition">
          <img 
            src="/images/ut_city_career.jpg" 
            alt="Ilustrasi Lanskap Karier Kota Modern dan Mahasiswa Menuju Masa Depan" 
            class="w-full h-40 sm:h-56 md:h-64 object-cover"
            loading="lazy"
          />
          <div class="p-4 sm:p-6 space-y-2.5">
            <span class="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase">
              KISAH SUKSES ALUMNI
            </span>
            <h3 class="text-sm sm:text-base font-black text-[#183153] leading-snug font-heading">
              Menembus Tech Unicorn Nasional dari Bangku Kuliah Mandiri Universitas Terbuka
            </h3>
            <p class="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-normal">
              Bagaimana fleksibilitas kuliah online di Universitas Terbuka dipadukan dengan bimbingan mentor alumni UT REKA mengantarkan lulusan meraih karier impian di industri teknologi terkemuka.
            </p>
            <div class="pt-2 flex items-center justify-between text-xs font-bold text-gray-500">
              <span class="text-[11px]">Budi S. & Kak Sarah</span>
              <a href="/dashboard/connections" class="text-[#18866B] hover:underline flex items-center gap-1 text-[11px]">
                <span>Baca Kisah</span>
                <ArrowRight class="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <!-- Right: 4 Story Feed Items -->
        <div class="lg:col-span-5 space-y-3">
          {#each stories as story}
            <div class="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E7E5E0] hover:border-[#1DB5A0] transition shadow-2xs space-y-1.5">
              <span class="inline-block px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase {story.tagColor}">
                {story.tag}
              </span>
              <h4 class="text-xs font-bold text-[#183153] leading-snug hover:text-[#18866B] transition-colors cursor-pointer">
                {story.title}
              </h4>
              <p class="text-[10px] text-gray-500">
                Oleh {story.author}
              </p>
            </div>
          {/each}
        </div>

      </div>

    </div>
  </section>

  <!-- ========================================================
       8. CALL TO ACTION BANNER (Turquoise Curved Container)
       ======================================================== -->
  <section class="py-12 sm:py-16 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <div class="relative bg-gradient-to-r from-[#1DB5A0] via-[#169886] to-[#148373] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center shadow-lg overflow-hidden">
      <!-- Decorative Backdrop Circles -->
      <div class="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-black/10 blur-xl pointer-events-none"></div>

      <div class="relative z-10 max-w-xl mx-auto space-y-3">
        <span class="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
          MULAI HARI INI
        </span>
        <h2 class="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight font-heading">
          Wujudkan Potensi Kariermu Bersama UT REKA
        </h2>
        <p class="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
          Bergabunglah bersama ribuan rekan mahasiswa dan alumni berprestasi dari seluruh Indonesia. Mulai koneksi pertamamu hari ini secara gratis.
        </p>
        <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 max-w-xs sm:max-w-none mx-auto w-full">
          <a 
            href="/register" 
            class="px-6 py-3 rounded-full bg-[#183153] text-[#FFD43B] font-black text-xs sm:text-sm hover:bg-[#102138] transition shadow-md touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Daftar Akun Mahasiswa / Alumni
          </a>
          <a 
            href="/login" 
            class="px-5 py-3 rounded-full bg-white text-[#183153] font-bold text-xs sm:text-sm hover:bg-gray-100 transition shadow-xs touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Masuk ke Akun
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       9. FOOTER (Adaptive Mobile 2-Cols / Desktop 5-Cols)
       ======================================================== -->
  <footer class="bg-[#183153] text-white pt-12 pb-10 border-t border-[#183153]/50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Top Columns: 2 Columns on Mobile, 4-5 on Desktop -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 pb-10 border-b border-white/10">
        
        <!-- Col 1: Brand Info (Spans 2 columns on mobile) -->
        <div class="col-span-2 md:col-span-1 lg:col-span-2 space-y-3">
          <a href="/" class="inline-block group" title="UT REKA">
            <img 
              src="/images/ut-reka-logo.png" 
              alt="UT REKA Relasi Karir" 
              class="h-14 w-auto rounded-xl object-contain shadow-sm group-hover:scale-102 transition-transform" 
            />
          </a>
          <p class="text-xs text-gray-300 leading-relaxed max-w-sm">
            Platform jejaring karier resmi mahasiswa dan Ikatan Alumni Universitas Terbuka (IKA UT). Menghubungkan potensi seluruh nusantara menuju kesuksesan profesional.
          </p>
          <div class="text-[11px] text-[#FFD43B] font-bold pt-1">
            #DariKampusTerbukaMenujuKarierTanpaBatas
          </div>
        </div>

        <!-- Col 2: Mahasiswa -->
        <div class="space-y-2.5">
          <h3 class="text-xs font-black uppercase tracking-wider text-[#FFD43B]">Mahasiswa</h3>
          <ul class="space-y-1.5 text-xs text-gray-300">
            <li><a href="/login" class="hover:text-white transition">Dashboard</a></li>
            <li><a href="/mentor" class="hover:text-white transition">Mentor REKA</a></li>
            <li><a href="/karier" class="hover:text-white transition">Magang MSIB</a></li>
            <li><a href="/dashboard/messages" class="hover:text-white transition">Pesan Chat</a></li>
          </ul>
        </div>

        <!-- Col 3: Alumni -->
        <div class="space-y-2.5">
          <h3 class="text-xs font-black uppercase tracking-wider text-[#FFD43B]">Alumni</h3>
          <ul class="space-y-1.5 text-xs text-gray-300">
            <li><a href="/mentor#daftar-mentor" class="hover:text-white transition">Jadi Mentor</a></li>
            <li><a href="/dashboard/alumni" class="hover:text-white transition">Dashboard</a></li>
            <li><a href="/karier" class="hover:text-white transition">Lowongan</a></li>
            <li><a href="/mentor" class="hover:text-white transition">Direktori</a></li>
          </ul>
        </div>

        <!-- Col 4: Informasi & Legal (Spans 2 columns on mobile if needed) -->
        <div class="col-span-2 sm:col-span-1 space-y-2.5">
          <h3 class="text-xs font-black uppercase tracking-wider text-[#FFD43B]">Bantuan</h3>
          <ul class="space-y-1.5 text-xs text-gray-300">
            <li><a href="/panduan" class="hover:text-white transition">Panduan</a></li>
            <li><a href="/forgot-password" class="hover:text-white transition">Lupa Password</a></li>
            <li><a href="/privasi-syarat" class="hover:text-white transition">Privasi & Syarat</a></li>
          </ul>
        </div>

      </div>

      <!-- Bottom Credits -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 text-center sm:text-left">
        <p>© 2026 UT REKA — Universitas Terbuka.</p>
        <p class="flex items-center gap-1.5 text-gray-400">
          <ShieldCheck class="w-3.5 h-3.5 text-[#1DB5A0]" />
          <span>Sistem Terverifikasi Akademik UT</span>
        </p>
      </div>

    </div>
  </footer>

  <!-- ========================================================
       10. FIXED BOTTOM APP BAR FOR MOBILE DEVICES (< 768px)
       ======================================================== -->
  <div class="block md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E5E0] shadow-[0_-4px_20px_rgba(24,49,83,0.08)]">
    <div class="max-w-md mx-auto flex items-center justify-around px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <a 
        href="/"
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-[#183153] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg bg-[#FFD43B] text-[#183153]">
          <Home class="w-4 h-4 stroke-[2.5]" />
        </div>
        <span class="text-[9px] mt-0.5 font-black text-[#183153]">Beranda</span>
      </a>

      <a 
        href="/mentor"
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-gray-500 hover:text-[#183153] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg hover:bg-gray-100">
          <Users class="w-4 h-4 stroke-2" />
        </div>
        <span class="text-[9px] mt-0.5 font-medium text-gray-600">Mentor</span>
      </a>

      <a 
        href="/karier"
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-gray-500 hover:text-[#183153] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg hover:bg-gray-100">
          <Briefcase class="w-4 h-4 stroke-2" />
        </div>
        <span class="text-[9px] mt-0.5 font-medium text-gray-600">Karier</span>
      </a>

      <a 
        href={authStore.isAuthenticated ? (authStore.role === 'alumni' ? '/dashboard/alumni' : '/dashboard/student') : '/login'}
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-gray-500 hover:text-[#183153] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg hover:bg-gray-100">
          {#if authStore.isAuthenticated}
            <User class="w-4 h-4 stroke-2" />
          {:else}
            <LogIn class="w-4 h-4 stroke-2" />
          {/if}
        </div>
        <span class="text-[9px] mt-0.5 font-medium text-gray-600">
          {authStore.isAuthenticated ? 'Akun' : 'Masuk'}
        </span>
      </a>
    </div>
  </div>

</div>
