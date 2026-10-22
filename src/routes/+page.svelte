<script lang="ts">
  import { onMount } from 'svelte';
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
    ChevronDown,
    Award, 
    Scale, 
    TrendingUp, 
    MessageSquare, 
    ShieldCheck, 
    Home, 
    User, 
    LogIn, 
    Menu, 
    X, 
    Star, 
    Calendar, 
    MapPin, 
    ArrowUpRight
  } from 'lucide-svelte';

  let isMobileMenuOpen = $state(false);

  onMount(async () => {
    await authStore.init();
  });

  const featuredMentors = [
    {
      id: 'mentor-1',
      name: 'Tasya Angelicia Tenggara',
      role: 'Associate Product Manager',
      company: 'GoTo Ecosystem',
      prodi: 'S1 Sistem Informasi · 2024',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      match: '98% Cocok',
      tags: ['Product Strategy', 'UI/UX Research'],
      topics: 'Review CV & Product Portfolio'
    },
    {
      id: 'mentor-2',
      name: 'Azdzikri Muhammad Hisyam Soleh',
      role: 'Cloud & DevOps Specialist',
      company: 'Telkom Indonesia',
      prodi: 'S1 Sistem Informasi · 2023',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      match: '96% Cocok',
      tags: ['Cloud Infrastructure', 'Linux Systems'],
      topics: 'Infrastruktur IT & Sertifikasi Cloud'
    },
    {
      id: 'mentor-3',
      name: 'Maulana Chrysant',
      role: 'Senior Software Engineer',
      company: 'Google',
      prodi: 'S1 Sistem Informasi · 2022',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      match: '99% Cocok',
      tags: ['Cloud Architecture', 'Distributed Systems'],
      topics: 'Simulasi Technical Interview & Software Engineering'
    },
    {
      id: 'mentor-4',
      name: 'Keisha Refanaura Hakim',
      role: 'Data Analyst & BI Lead',
      company: 'Bank Mandiri (BUMN)',
      prodi: 'S1 Akuntansi & Sistem Informasi · 2023',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      match: '95% Cocok',
      tags: ['Data Analytics', 'Financial Modeling'],
      topics: 'Bimbingan Karier Perbankan & Data Science'
    },
    {
      id: 'mentor-5',
      name: 'Akhmad Farrel Nashwan',
      role: 'Fullstack & AI Solutions Engineer',
      company: 'BCA (Bank Central Asia)',
      prodi: 'S1 Sistem Informasi · 2024',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
      match: '97% Cocok',
      tags: ['Fullstack Web', 'AI Automation'],
      topics: 'Bedah Portofolio & Kiat Sukses Rekrutmen Tech'
    }
  ];

  const featuredJobs = [
    {
      id: 'job-1',
      title: 'Junior Software Engineer (Web & Mobile)',
      company: 'Tech Partner Ecosystem',
      location: 'Remote (Online)',
      type: 'Magang MSIB',
      tagColor: 'bg-[#EEF2FF] text-[#3157D5] border-[#D5E0FF]',
      desc: 'Pengembangan fitur web frontend dan backend microservices menggunakan framework TypeScript dan Cloud.',
      deadline: 'Dibuka untuk Semester 3 - 7'
    },
    {
      id: 'job-2',
      title: 'Associate Business Analyst',
      company: 'BUMN Jasa Keuangan & Perbankan',
      location: 'Hybrid • Jakarta & Remote',
      type: 'Fresh Graduate',
      tagColor: 'bg-[#FFF8E6] text-[#B38600] border-[#FFE8A3]',
      desc: 'Menganalisis proses operasional digital, riset kepatuhan regulasi, dan perancangan laporan bisnis korporasi.',
      deadline: 'Terbuka bagi S1 Manajemen & Akuntansi'
    },
    {
      id: 'job-3',
      title: 'UI/UX Researcher & Design Apprentice',
      company: 'Studio Produk Digital Kreatif',
      location: 'Remote (Fleksibel)',
      type: 'Proyek Kolaborasi',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Membantu riset pengguna, wireframing, dan usability testing untuk produk digital sektor edukasi dan publik.',
      deadline: 'Portofolio awal diutamakan'
    }
  ];

  const howItWorks = [
    {
      num: '01',
      title: 'Daftar & Terverifikasi',
      desc: 'Mahasiswa dan alumni UT mendaftar dengan identitas akademik untuk menciptakan lingkungan profesional yang kredibel dan aman.'
    },
    {
      num: '02',
      title: 'Pencocokan REKA Match™',
      desc: 'Algoritma cerdas merekomendasikan mentor alumni dan kesempatan magang sesuai dengan program studi dan aspirasi karier Anda.'
    },
    {
      num: '03',
      title: 'Bimbingan 1-on-1 Terarah',
      desc: 'Konsultasi kurasi CV, bedah portofolio proyek, simulasi wawancara kerja, dan diskusi strategi berkarier secara daring.'
    },
    {
      num: '04',
      title: 'Akses Peluang Nyata',
      desc: 'Lamar lowongan kerja terverifikasi, program magang MSIB, dan proyek kolaboratif tanpa perantara dan bebas biaya.'
    }
  ];

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
      tagColor: 'bg-[#EEF2FF] text-[#3157D5]',
      title: 'Mahasiswa UT Raih Juara Kompetisi Software & AI Nasional 2026',
      author: 'Tim Mahasiswa SI UPBJJ Jakarta'
    },
    {
      tag: 'KARIER BUMN',
      tagColor: 'bg-emerald-50 text-emerald-700',
      title: '28 Alumni UT Lolos Rekrutmen Bersama BUMN Sektor Jasa Keuangan',
      author: 'Kemitraan IKA UT & Forum Human Capital'
    },
    {
      tag: 'TIPS KULIAH',
      tagColor: 'bg-[#FFF8E6] text-[#B38600]',
      title: 'Strategi Membagi Waktu Antara Bekerja Full-Time & Kuliah Daring Fleksibel',
      author: 'Tasya Angelicia Tenggara, Alumni Mentor GoTo'
    },
    {
      tag: 'KOMUNITAS',
      tagColor: 'bg-indigo-50 text-indigo-700',
      title: 'Ikatan Alumni UT Resmikan Program 100 Portofolio Digital Gratis',
      author: 'Pengurus Pusat IKA UT'
    }
  ];
</script>

<svelte:head>
  <title>UT REKA — Ekosistem Karier & Mentoring Universitas Terbuka</title>
  <meta name="description" content="Platform jejaring karier, profesional networking, dan mentoring terpercaya mahasiswa dan alumni Universitas Terbuka." />
</svelte:head>

<!-- Root App Shell Container -->
<div class="min-h-screen bg-[#FBFBFA] text-[#1E293B] antialiased selection:bg-[#1E40AF] selection:text-white font-sans w-full max-w-full overflow-x-hidden pb-20 md:pb-0">
  
  <!-- ========================================================
       HERO WRAPPER: LUMINOUS WARM ACADEMIC UT STAGE
       ======================================================== -->
  <div class="relative bg-gradient-to-b from-[#EFF6FF] via-[#FAF9F5] to-[#FBFBFA] text-[#0F172A] overflow-hidden pb-12 sm:pb-16 lg:pb-20 border-b border-[#E2E8F0]">
    
    <!-- Soft Warm Ambient Radial Glow Behind Hero -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-0">
      <div class="w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,rgba(30,64,175,0.08),rgba(251,251,250,0))]"></div>
    </div>
    <div class="absolute -top-32 left-1/4 w-96 h-96 bg-[#1E40AF]/6 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-48 right-1/4 w-96 h-96 bg-[#F59E0B]/8 rounded-full blur-3xl pointer-events-none"></div>

    <!-- ========================================================
         TOP NAVIGATION BAR (WARM ACADEMIC UT NAVIGATION)
         ======================================================== -->
    <header class="relative z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Left: Brand Logo -->
        <a href="/" class="flex items-center gap-3 group py-1" title="UT REKA">
          <div class="h-12 w-auto flex items-center gap-2.5">
            <img 
              src="/images/ut-reka-logo-transparent.png" 
              alt="UT REKA Universitas Terbuka Karier" 
              class="h-10 sm:h-11 md:h-12 w-auto object-contain group-hover:scale-103 transition-transform" 
            />
          </div>
        </a>

        <!-- Center: Desktop Navigation Links with subtle Dropdown Chevrons -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold text-[#475569]">
          <a href="/mentor" class="px-3.5 py-2 rounded-lg hover:text-[#1E40AF] hover:bg-[#EFF6FF]/70 transition flex items-center gap-1">
            <span>Program Mentor</span>
            <ChevronDown class="w-3.5 h-3.5 opacity-60" />
          </a>
          <a href="/karier" class="px-3.5 py-2 rounded-lg hover:text-[#1E40AF] hover:bg-[#EFF6FF]/70 transition flex items-center gap-1">
            <span>Peluang Karier</span>
            <ChevronDown class="w-3.5 h-3.5 opacity-60" />
          </a>
          <a href="/dashboard/connections" class="px-3.5 py-2 rounded-lg hover:text-[#1E40AF] hover:bg-[#EFF6FF]/70 transition flex items-center gap-1">
            <span>Jejaring Alumni</span>
            <ChevronDown class="w-3.5 h-3.5 opacity-60" />
          </a>
          <a href="/panduan" class="px-3.5 py-2 rounded-lg hover:text-[#1E40AF] hover:bg-[#EFF6FF]/70 transition flex items-center gap-1">
            <span>Panduan & Bantuan</span>
            <ChevronDown class="w-3.5 h-3.5 opacity-60" />
          </a>
        </nav>

        <!-- Right: Action Buttons -->
        <div class="flex items-center gap-3 sm:gap-4">
          {#if authStore.isAuthenticated}
            <a 
              href={authStore.role === 'admin' ? '/admin' : (authStore.role === 'alumni' ? '/dashboard/alumni' : '/dashboard/student')}
              class="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold transition shadow-md shadow-[#1E40AF]/20 touch-manipulation min-h-[40px]"
            >
              <span>Buka Dashboard</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          {:else}
            <a 
              href="/login" 
              class="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#475569] hover:text-[#1E40AF] transition touch-manipulation"
            >
              <span>Masuk Mahasiswa</span>
              <span class="text-slate-400">›</span>
            </a>
            <a 
              href="/register" 
              class="inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold transition shadow-md shadow-[#1E40AF]/25 touch-manipulation min-h-[40px] active:scale-95"
            >
              <span>Daftar Sekarang</span>
              <span class="text-white font-extrabold">›</span>
            </a>
          {/if}

          <!-- Mobile Menu Toggle Button -->
          <button 
            type="button"
            onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
            class="md:hidden p-2 rounded-xl text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition focus:outline-none"
            aria-label="Toggle Menu"
          >
            {#if isMobileMenuOpen}
              <X class="w-5 h-5" />
            {:else}
              <Menu class="w-5 h-5" />
            {/if}
          </button>
        </div>

      </div>

      <!-- Mobile Drawer Dropdown -->
      {#if isMobileMenuOpen}
        <div class="md:hidden bg-white border-t border-[#E2E8F0] px-5 py-5 space-y-4 animate-in fade-in duration-150 text-[#1E293B] shadow-lg">
          <nav class="flex flex-col space-y-2 text-sm font-semibold text-[#475569]">
            <a href="/mentor" onclick={() => isMobileMenuOpen = false} class="py-2 hover:text-[#1E40AF] flex items-center justify-between">
              <span>Program Mentor</span>
              <ChevronRight class="w-4 h-4 opacity-50" />
            </a>
            <a href="/karier" onclick={() => isMobileMenuOpen = false} class="py-2 hover:text-[#1E40AF] flex items-center justify-between">
              <span>Peluang Karier</span>
              <ChevronRight class="w-4 h-4 opacity-50" />
            </a>
            <a href="/dashboard/connections" onclick={() => isMobileMenuOpen = false} class="py-2 hover:text-[#1E40AF] flex items-center justify-between">
              <span>Jejaring Alumni</span>
              <ChevronRight class="w-4 h-4 opacity-50" />
            </a>
            <a href="/panduan" onclick={() => isMobileMenuOpen = false} class="py-2 hover:text-[#1E40AF] flex items-center justify-between">
              <span>Panduan & Bantuan</span>
              <ChevronRight class="w-4 h-4 opacity-50" />
            </a>
          </nav>
          <div class="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2.5">
            {#if !authStore.isAuthenticated}
              <a href="/login" class="text-center py-2.5 font-bold text-[#1E40AF] border border-[#BFDBFE] bg-[#EFF6FF] rounded-xl hover:bg-[#DBEAFE]">
                Masuk Mahasiswa
              </a>
              <a href="/register" class="text-center py-2.5 font-bold bg-[#1E40AF] text-white rounded-xl hover:bg-[#1D4ED8] shadow-md">
                Daftar Akun Baru
              </a>
            {/if}
          </div>
        </div>
      {/if}
    </header>

    <!-- ========================================================
         HERO SECTION: CENTERED EDITORIAL STATEMENT & CTAs
         ======================================================== -->
    <section class="relative z-10 pt-12 sm:pt-18 lg:pt-22 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      
      <!-- UT REKA Brand Badge / Header -->
      <div class="flex flex-col items-center justify-center mb-6 sm:mb-8">
        <div class="inline-flex items-center gap-3.5 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl bg-white/95 border border-[#E2E8F0] shadow-sm backdrop-blur-md hover:border-[#1E40AF]/30 transition group">
          <img 
            src="/images/ut-reka-logo-transparent.png" 
            alt="Logo UT REKA Relasi Karir" 
            class="h-14 sm:h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
          <div class="text-left">
            <span class="block text-xl sm:text-2xl font-black font-heading text-[#0F172A] tracking-tight leading-none">
              UT REKA
            </span>
            <span class="block text-xs sm:text-sm font-bold text-[#1E40AF] tracking-wider uppercase leading-none mt-1 sm:mt-1.5">
              Relasi Karir
            </span>
          </div>
        </div>
      </div>

      <!-- Trustpilot-style Pill Review Badge -->
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] backdrop-blur-md mb-6 sm:mb-8 shadow-xs hover:border-[#F59E0B] transition cursor-default">
        <div class="flex items-center gap-1 text-[#F59E0B]">
          <Star class="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <Star class="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <Star class="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <Star class="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <Star class="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
        </div>
        <span class="text-[#D97706]/40">|</span>
        <span class="font-medium text-[#78350F]">
          <strong class="text-[#0F172A] font-bold">4.9/5</strong> • Ekosistem Karier Terpercaya Mahasiswa & Alumni UT
        </span>
        <ArrowRight class="w-3.5 h-3.5 text-[#92400E] hidden sm:inline" />
      </div>

      <!-- Main Headline: "Bangun Relasi. Wujudkan Masa Depan" -->
      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] font-heading text-[#0F172A] max-w-4xl mx-auto">
        Bangun Relasi.<br />
        <span class="bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
          Wujudkan Masa Depan
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto font-normal leading-relaxed mt-5 sm:mt-6">
        Ruang terhubungnya mahasiswa, alumni, mentor profesional, dan peluang karier untuk tumbuh bersama dari mana saja.
      </p>

      <!-- Dual Action Buttons -->
      <div class="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto">
        <a 
          href={authStore.isAuthenticated ? "/dashboard/student" : "/register"}
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-sm sm:text-base font-bold transition shadow-lg shadow-[#1E40AF]/25 active:scale-95 min-h-[48px]"
        >
          <span>Mulai Perjalanan</span>
        </a>
        <a 
          href="/mentor"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] text-sm sm:text-base font-bold transition shadow-xs active:scale-95 min-h-[48px]"
        >
          <span>Konsultasi Karier Gratis</span>
        </a>
      </div>

      <!-- AS SEEN ON / JARINGAN INDUSTRI MITRA (INFINITE CONTINUOUS MARQUEE: KANAN KE KIRI) -->
      <div class="mt-14 sm:mt-18 pt-6 w-full max-w-6xl mx-auto overflow-hidden">
        <span class="text-[11px] font-bold uppercase tracking-widest text-[#64748B] block mb-6">
          DIDUKUNG OLEH & JEJARING INDUSTRI ALUMNI TERVERIFIKASI
        </span>
        
        <!-- Smooth Infinite Marquee Ticker with Edge Mask Fade -->
        <div class="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-2">
          <div class="animate-marquee flex items-center gap-12 sm:gap-16">
            <!-- Set 1 -->
            <div class="flex items-center gap-12 sm:gap-16 shrink-0">
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                BANK MANDIRI <span class="text-xs font-semibold text-[#1E40AF] ml-1">BUMN</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                TELKOM <span class="text-xs font-semibold text-rose-600 ml-1">INDONESIA</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                GOTO <span class="text-xs font-semibold text-emerald-600 ml-1">ECOSYSTEM</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                GOOGLE <span class="text-xs font-semibold text-amber-600 ml-1">CLOUD</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                BCA
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                KOMINFO <span class="text-xs font-semibold text-blue-600 ml-1">RI</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                SHOPEE <span class="text-xs font-semibold text-orange-600 ml-1">SEA GROUP</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                TOKOPEDIA <span class="text-xs font-semibold text-emerald-600 ml-1">TECH</span>
              </span>
            </div>

            <!-- Set 2 (Duplicate for seamless infinite scroll) -->
            <div class="flex items-center gap-12 sm:gap-16 shrink-0" aria-hidden="true">
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                BANK MANDIRI <span class="text-xs font-semibold text-[#1E40AF] ml-1">BUMN</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                TELKOM <span class="text-xs font-semibold text-rose-600 ml-1">INDONESIA</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                GOTO <span class="text-xs font-semibold text-emerald-600 ml-1">ECOSYSTEM</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                GOOGLE <span class="text-xs font-semibold text-amber-600 ml-1">CLOUD</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                BCA
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                KOMINFO <span class="text-xs font-semibold text-blue-600 ml-1">RI</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                SHOPEE <span class="text-xs font-semibold text-orange-600 ml-1">SEA GROUP</span>
              </span>
              <span class="text-base sm:text-lg font-black tracking-tight font-heading text-[#1E293B] select-none shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                TOKOPEDIA <span class="text-xs font-semibold text-emerald-600 ml-1">TECH</span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>

  <!-- ========================================================
       LIGHT CANVAS (WARM IVORY / PURE WHITE)
       ======================================================== -->
  <div class="py-12 sm:py-16 md:py-20">

    <!-- ========================================================
         TRUST & COMMUNITY STATS STRIP
         ======================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E5E8EF]">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E8EF]">
          
          <!-- Stat 1 -->
          <div class="pt-2 sm:pt-0 sm:px-4 space-y-1 text-center sm:text-left">
            <div class="text-2xl sm:text-4xl font-black text-[#101B35] font-heading tracking-tight">96%</div>
            <p class="text-xs font-bold text-[#68738A] uppercase tracking-wider">Kepuasan Bimbingan</p>
            <p class="text-[11px] text-[#68738A] leading-relaxed">Rasio mahasiswa yang merekomendasikan sesi mentoring.</p>
          </div>

          <!-- Stat 2 -->
          <div class="pt-4 sm:pt-0 sm:px-4 space-y-1 text-center sm:text-left">
            <div class="text-2xl sm:text-4xl font-black text-[#3157D5] font-heading tracking-tight">39 UPBJJ</div>
            <p class="text-xs font-bold text-[#68738A] uppercase tracking-wider">Wilayah & Luar Negeri</p>
            <p class="text-[11px] text-[#68738A] leading-relaxed">Terhubung dari Sabang hingga Sentra Layanan Mancanegara.</p>
          </div>

          <!-- Stat 3 -->
          <div class="pt-4 sm:pt-0 sm:px-4 space-y-1 text-center sm:text-left">
            <div class="text-2xl sm:text-4xl font-black text-[#101B35] font-heading tracking-tight">10.000+</div>
            <p class="text-xs font-bold text-[#68738A] uppercase tracking-wider">Komunitas Terhubung</p>
            <p class="text-[11px] text-[#68738A] leading-relaxed">Mahasiswa aktif dan alumni profesional terdaftar.</p>
          </div>

          <!-- Stat 4 -->
          <div class="pt-4 sm:pt-0 sm:px-4 space-y-1 text-center sm:text-left">
            <div class="text-2xl sm:text-4xl font-black text-[#3157D5] font-heading tracking-tight">100% Bebas Biaya</div>
            <p class="text-xs font-bold text-[#68738A] uppercase tracking-wider">Akses Inklusif</p>
            <p class="text-[11px] text-[#68738A] leading-relaxed">Inisiatif jejaring karier mandiri tanpa pungutan biaya rekrutmen.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- ========================================================
         HOW UT REKA WORKS (CARA KERJA EKOSISTEM KARIER)
         ======================================================== -->
    <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
        <span class="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-xs font-bold uppercase tracking-wider">
          LANGKAH MUDAH
        </span>
        <h2 class="text-2xl sm:text-4xl font-black text-[#101B35] tracking-tight font-heading">
          Cara Kerja Ekosistem Karier
        </h2>
        <p class="text-xs sm:text-sm text-[#68738A] leading-relaxed">
          Dari pendaftaran akun akademik hingga terhubung langsung dengan mentor dan peluang karier impian.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {#each howItWorks as step}
          <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs hover:shadow-md hover:border-[#3157D5]/40 transition-all duration-200 group flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <span class="text-3xl font-black font-heading text-[#3157D5]/20 group-hover:text-[#3157D5] transition-colors">
                {step.num}
              </span>
              <h3 class="text-base font-extrabold text-[#101B35] font-heading">
                {step.title}
              </h3>
              <p class="text-xs text-[#68738A] leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- ========================================================
         FEATURED OPPORTUNITIES (PELUANG KARIER UNGGULAN)
         ======================================================== -->
    <section id="peluang" class="py-16 sm:py-24 bg-white border-y border-[#E5E8EF]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span class="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-xs font-bold uppercase tracking-wider mb-2">
              PELUANG TERVERIFIKASI
            </span>
            <h2 class="text-2xl sm:text-4xl font-black text-[#101B35] tracking-tight font-heading">
              Peluang Magang & Karier Terbaru
            </h2>
            <p class="text-xs sm:text-sm text-[#68738A] mt-1">
              Disediakan khusus untuk mahasiswa dan alumni beretika kerja mandiri Universitas Terbuka.
            </p>
          </div>
          <a href="/karier" class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#3157D5] hover:underline">
            <span>Lihat Semua Peluang</span>
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each featuredJobs as job}
            <div class="p-5 sm:p-6 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] hover:border-[#3157D5] hover:bg-white transition-all duration-200 flex flex-col justify-between space-y-4 shadow-2xs group">
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border {job.tagColor}">
                    {job.type}
                  </span>
                  <span class="text-[11px] text-[#68738A] font-medium flex items-center gap-1">
                    <MapPin class="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                  </span>
                </div>

                <h3 class="text-base font-extrabold text-[#101B35] group-hover:text-[#3157D5] transition-colors leading-snug">
                  {job.title}
                </h3>
                
                <p class="text-xs font-bold text-[#68738A]">{job.company}</p>

                <p class="text-xs text-[#68738A] leading-relaxed">
                  {job.desc}
                </p>
              </div>

              <div class="pt-3 border-t border-[#E5E8EF] flex items-center justify-between">
                <span class="text-[11px] text-[#68738A] font-medium">{job.deadline}</span>
                <a 
                  href="/karier" 
                  class="inline-flex items-center gap-1 text-xs font-bold text-[#3157D5] hover:underline"
                >
                  <span>Detail</span>
                  <ChevronRight class="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          {/each}
        </div>

      </div>
    </section>

    <!-- ========================================================
         MENTOR DISCOVERY SECTION (DIREKTORI MENTOR PILIHAN)
         ======================================================== -->
    <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <span class="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-xs font-bold uppercase tracking-wider mb-2">
            REKA MATCH™ MENTOR DIRECTORY
          </span>
          <h2 class="text-2xl sm:text-4xl font-black text-[#101B35] tracking-tight font-heading">
            Belajar Langsung dari Alumni Berpengalaman
          </h2>
          <p class="text-xs sm:text-sm text-[#68738A] mt-1">
            Dapatkan bimbingan 1-on-1 dari alumni yang telah berkarier di BUMN, startup unicorn, dan industri multinasional.
          </p>
        </div>
        <a href="/mentor" class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#3157D5] hover:underline">
          <span>Buka Direktori Mentor</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>

      <!-- Mentor Cards Grid (5 Mentors: Tasya, Azdzikri, Maulana, Keisha, Farrel) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {#each featuredMentors as mentor}
          <div class="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#1E40AF]/40 transition-all duration-200 flex flex-col justify-between space-y-4 text-center group">
            
            <div class="space-y-3">
              <div class="relative w-20 h-20 mx-auto">
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name} 
                  class="w-full h-full rounded-2xl object-cover ring-2 ring-[#EFF6FF] shadow-xs group-hover:scale-103 transition-transform" 
                />
                <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </div>

              <div>
                <h3 class="text-sm font-extrabold text-[#0F172A] leading-snug group-hover:text-[#1E40AF] transition-colors">{mentor.name}</h3>
                <p class="text-xs font-bold text-[#1E40AF] mt-0.5">{mentor.role}</p>
                <p class="text-[11px] text-[#64748B] font-medium">{mentor.company}</p>
              </div>

              <span class="inline-block px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-bold border border-[#BFDBFE]">
                {mentor.match}
              </span>

              <p class="text-[11px] text-[#64748B] leading-relaxed line-clamp-2">
                {mentor.topics}
              </p>
            </div>

            <a 
              href="/dashboard/connections" 
              class="w-full py-2.5 px-3 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 touch-manipulation active:scale-95"
            >
              <span>Hubungi Mentor</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>

          </div>
        {/each}
      </div>
    </section>

    <!-- ========================================================
         PROGRAM PATHS & SPECIALIZATIONS
         ======================================================== -->
    <section class="py-16 sm:py-24 bg-white border-y border-[#E5E8EF]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span class="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-xs font-bold uppercase tracking-wider">
            JALUR SPESIALISASI
          </span>
          <h2 class="text-2xl sm:text-4xl font-black text-[#101B35] tracking-tight font-heading">
            Pilihan Bidang & Program Karier
          </h2>
          <p class="text-xs sm:text-sm text-[#68738A] leading-relaxed">
            Eksplorasi jejaring dan bimbingan karier terarah sesuai dengan program studi akademik Anda di Universitas Terbuka.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {#each specializations as spec}
            <div class="p-5 sm:p-6 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] hover:border-[#3157D5] hover:bg-white transition-all duration-200 group flex flex-col justify-between space-y-3 shadow-2xs">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-2xl p-2 rounded-xl bg-white border border-[#E5E8EF] shadow-2xs group-hover:scale-105 transition-transform">
                    {spec.icon}
                  </span>
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157D5] uppercase">
                    {spec.category}
                  </span>
                </div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#101B35] group-hover:text-[#3157D5] transition-colors font-heading leading-snug">
                  {spec.title}
                </h3>
                <p class="text-xs text-[#68738A] leading-relaxed">
                  {spec.desc}
                </p>
              </div>

              <a href="/dashboard/connections" class="inline-flex items-center gap-1 text-xs font-bold text-[#3157D5] hover:underline pt-2 border-t border-[#E5E8EF]">
                <span>Temukan Mentor Bidang Ini</span>
                <ChevronRight class="w-3.5 h-3.5" />
              </a>
            </div>
          {/each}
        </div>

      </div>
    </section>

    <!-- ========================================================
         CAMPUS LIFE & COMMUNITY ECOSYSTEM
         ======================================================== -->
    <section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Left: Featured Illustrated Campus Card -->
        <div class="lg:col-span-7 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5E8EF] shadow-sm bg-white group">
          <div class="p-5 sm:p-7 space-y-2">
            <span class="inline-block px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-[10px] font-bold uppercase tracking-wider">
              EKOSISTEM KAMPUS
            </span>
            <h2 class="text-xl sm:text-2xl font-black text-[#101B35] tracking-tight font-heading">
              Kehidupan Komunitas & Bimbingan Mahasiswa
            </h2>
            <p class="text-xs sm:text-sm text-[#68738A] leading-relaxed">
              Meskipun belajar daring dan mandiri, Anda selalu terhubung dengan ribuan kawan seperjuangan dan kakak tingkat di industri.
            </p>
          </div>
          
          <div class="overflow-hidden">
            <img 
              src="/images/ut_campus_life.jpg" 
              alt="Mahasiswa UT Berdiskusi di Lingkungan Kampus" 
              class="w-full h-52 sm:h-68 md:h-76 object-cover group-hover:scale-103 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Right: Stacked Cards -->
        <div class="lg:col-span-5 space-y-5">
          
          <!-- Card 1 -->
          <div class="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center">
              <Users class="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 class="text-sm sm:text-base font-extrabold text-[#101B35] font-heading">
              Klub Diskusi & Networking Mahasiswa
            </h3>
            <p class="text-xs text-[#68738A] leading-relaxed">
              Bergabung dengan study-circle per wilayah UPBJJ, kelompok belajar persiapan ujian, coding jam, dan diskusi karier terstruktur.
            </p>
            <a href="/dashboard/connections" class="inline-flex items-center gap-1 text-xs font-bold text-[#3157D5] hover:underline pt-1">
              <span>Jelajahi Komunitas</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Card 2 -->
          <div class="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-[#FFF8E6] text-[#B38600] flex items-center justify-center">
              <MessageSquare class="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 class="text-sm sm:text-base font-extrabold text-[#101B35] font-heading">
              Bimbingan Karier & Mentoring 1-on-1
            </h3>
            <p class="text-xs text-[#68738A] leading-relaxed">
              Dapatkan saran langsung dari praktisi industri: bedah resume ATS, review portofolio, simulasi wawancara, dan tips berkarier.
            </p>
            <a href="/mentor" class="inline-flex items-center gap-1 text-xs font-bold text-[#3157D5] hover:underline pt-1">
              <span>Daftar Bimbingan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>

    <!-- ========================================================
         STUDENT & ALUMNI STORIES
         ======================================================== -->
    <section class="py-16 sm:py-24 bg-white border-t border-[#E5E8EF]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span class="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-xs font-bold uppercase tracking-wider mb-2">
              KISAH INSPIRATIF
            </span>
            <h2 class="text-2xl sm:text-4xl font-black text-[#101B35] tracking-tight font-heading">
              Cerita Alumni & Kabar Terkini
            </h2>
          </div>
          <a href="/dashboard/connections" class="text-xs sm:text-sm font-bold text-[#3157D5] hover:underline flex items-center gap-1">
            <span>Lihat Semua Kabar</span>
            <ChevronRight class="w-4 h-4" />
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Featured Story -->
          <div class="lg:col-span-7 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5E8EF] bg-white shadow-2xs hover:shadow-md transition">
            <img 
              src="/images/ut_city_career.jpg" 
              alt="Lanskap Karier Kota Modern dan Mahasiswa Menuju Masa Depan" 
              class="w-full h-44 sm:h-60 md:h-72 object-cover"
              loading="lazy"
            />
            <div class="p-5 sm:p-7 space-y-3">
              <span class="inline-block px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#3157D5] text-[10px] font-bold uppercase">
                KISAH SUKSES ALUMNI
              </span>
              <h3 class="text-base sm:text-lg font-extrabold text-[#101B35] leading-snug font-heading">
                Menembus Tech Unicorn Nasional dari Bangku Kuliah Mandiri Universitas Terbuka
              </h3>
              <p class="text-xs text-[#68738A] leading-relaxed font-normal">
                Bagaimana fleksibilitas kuliah daring di Universitas Terbuka dipadukan dengan bimbingan mentor alumni UT REKA mengantarkan lulusan meraih karier impian di industri teknologi terkemuka.
              </p>
              <div class="pt-2 flex items-center justify-between text-xs font-bold text-[#68738A]">
                <span>Budi S. & Kak Sarah</span>
                <a href="/dashboard/connections" class="text-[#3157D5] hover:underline flex items-center gap-1">
                  <span>Baca Kisah Lengkap</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <!-- Right: News Feed Items -->
          <div class="lg:col-span-5 space-y-3.5">
            {#each stories as story}
              <div class="p-4 sm:p-4.5 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] hover:border-[#3157D5] transition shadow-2xs space-y-2">
                <span class="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase {story.tagColor}">
                  {story.tag}
                </span>
                <h4 class="text-xs sm:text-sm font-bold text-[#101B35] leading-snug hover:text-[#3157D5] transition-colors cursor-pointer">
                  {story.title}
                </h4>
                <p class="text-[11px] text-[#68738A]">
                  Oleh {story.author}
                </p>
              </div>
            {/each}
          </div>

        </div>

      </div>
    </section>

    <!-- ========================================================
         EDITORIAL QUOTE STATEMENT
         ======================================================== -->
    <section class="py-16 sm:py-20 px-4 sm:px-6 text-center max-w-3xl mx-auto">
      <div class="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center mx-auto mb-4 shadow-xs">
        <Quote class="w-5 h-5 stroke-[2.3]" />
      </div>

      <blockquote class="text-base sm:text-xl md:text-2xl font-black text-[#101B35] leading-snug tracking-tight font-heading px-2">
        “<span class="text-[#3157D5]">Pendidikan tinggi berkualitas</span> dan kesempatan karier profesional terbuka bagi siapa saja, dari Sabang sampai Merauke hingga mancanegara tanpa batas ruang dan waktu.”
      </blockquote>

      <div class="mt-4 flex flex-col items-center">
        <span class="text-xs sm:text-sm font-extrabold text-[#101B35]">Prof. Ojat Darojat, M.Bus., Ph.D.</span>
        <span class="text-[11px] text-[#68738A] mt-0.5">Rektor Universitas Terbuka & Pembina UT REKA</span>
      </div>
    </section>

    <!-- ========================================================
         CALL TO ACTION BANNER (UT Royal Blue & Warm Gold Glow)
         ======================================================== -->
    <section class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="relative bg-gradient-to-br from-[#1E40AF] via-[#1D4ED8] to-[#1E3A8A] text-white rounded-3xl p-8 sm:p-14 text-center shadow-xl overflow-hidden border border-[#3B82F6]/30">
        
        <!-- Subtle Decorative Radial Gradients -->
        <div class="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#F59E0B]/20 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 max-w-2xl mx-auto space-y-4">
          <span class="inline-block px-3 py-1 rounded-full bg-white/15 text-[#FEF08A] text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/20">
            MULAI HARI INI
          </span>
          <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight font-heading">
            Wujudkan Potensi Kariermu Bersama UT REKA
          </h2>
          <p class="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
            Bergabunglah bersama ribuan rekan mahasiswa dan alumni berprestasi dari seluruh Indonesia. Bangun relasi pertamamu hari ini secara gratis.
          </p>
          <div class="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto w-full">
            <a 
              href="/register" 
              class="px-6 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-extrabold text-xs sm:text-sm transition shadow-lg shadow-[#F59E0B]/25 touch-manipulation min-h-[46px] flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Daftar Akun Mahasiswa / Alumni</span>
              <ArrowRight class="w-4 h-4" />
            </a>
            <a 
              href="/login" 
              class="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm transition touch-manipulation min-h-[46px] flex items-center justify-center active:scale-95"
            >
              Masuk ke Akun
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================
         FOOTER (Warm Academic UT Footer)
         ======================================================== -->
    <footer class="bg-[#F8FAFC] text-[#334155] pt-16 pb-12 border-t border-[#E2E8F0]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-[#E2E8F0]">
          
          <!-- Col 1: Brand Info -->
          <div class="col-span-2 md:col-span-1 lg:col-span-2 space-y-4">
            <a href="/" class="inline-block group" title="UT REKA">
              <div class="p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs inline-block">
                <img 
                  src="/images/ut-reka-logo-transparent.png" 
                  alt="UT REKA Relasi Karir" 
                  class="h-10 w-auto object-contain group-hover:scale-102 transition-transform" 
                />
              </div>
            </a>
            <p class="text-xs text-[#64748B] leading-relaxed max-w-sm">
              Platform jejaring karier dan mentoring resmi mahasiswa dan Ikatan Alumni Universitas Terbuka (IKA UT). Menghubungkan potensi seluruh nusantara menuju kesuksesan profesional.
            </p>
            <div class="text-[11px] text-[#D97706] font-bold">
              #DariKampusTerbukaMenujuKarierTanpaBatas
            </div>
          </div>

          <!-- Col 2: Mahasiswa -->
          <div class="space-y-3">
            <h3 class="text-xs font-black uppercase tracking-wider text-[#1E40AF]">Mahasiswa</h3>
            <ul class="space-y-2 text-xs text-[#64748B]">
              <li><a href="/login" class="hover:text-[#1E40AF] transition">Dashboard Mahasiswa</a></li>
              <li><a href="/mentor" class="hover:text-[#1E40AF] transition">Program Mentor</a></li>
              <li><a href="/karier" class="hover:text-[#1E40AF] transition">Lowongan Magang MSIB</a></li>
              <li><a href="/dashboard/messages" class="hover:text-[#1E40AF] transition">Pesan & Bimbingan</a></li>
            </ul>
          </div>

          <!-- Col 3: Alumni -->
          <div class="space-y-3">
            <h3 class="text-xs font-black uppercase tracking-wider text-[#1E40AF]">Alumni</h3>
            <ul class="space-y-2 text-xs text-[#64748B]">
              <li><a href="/mentor" class="hover:text-[#1E40AF] transition">Jadi Mentor REKA</a></li>
              <li><a href="/dashboard/alumni" class="hover:text-[#1E40AF] transition">Dashboard Alumni</a></li>
              <li><a href="/karier" class="hover:text-[#1E40AF] transition">Pasang Lowongan</a></li>
              <li><a href="/mentor" class="hover:text-[#1E40AF] transition">Direktori Mentor</a></li>
            </ul>
          </div>

          <!-- Col 4: Informasi & Legal -->
          <div class="col-span-2 sm:col-span-1 space-y-3">
            <h3 class="text-xs font-black uppercase tracking-wider text-[#1E40AF]">Bantuan & Legal</h3>
            <ul class="space-y-2 text-xs text-[#64748B]">
              <li><a href="/panduan" class="hover:text-[#1E40AF] transition">Panduan Lengkap</a></li>
              <li><a href="/forgot-password" class="hover:text-[#1E40AF] transition">Lupa Kata Sandi</a></li>
              <li><a href="/privasi-syarat" class="hover:text-[#1E40AF] transition">Kebijakan Privasi</a></li>
              <li><a href="/privasi-syarat" class="hover:text-[#1E40AF] transition">Syarat Layanan</a></li>
            </ul>
          </div>

        </div>

        <!-- Bottom Credits -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] text-center sm:text-left">
          <p>© 2026 UT REKA — Universitas Terbuka Karier. Hak cipta dilindungi.</p>
          <p class="flex items-center gap-1.5 text-[#64748B]">
            <ShieldCheck class="w-4 h-4 text-[#1E40AF]" />
            <span>Sistem Terverifikasi Akademik Universitas Terbuka</span>
          </p>
        </div>

      </div>
    </footer>

  </div>

  <!-- ========================================================
       FIXED BOTTOM MOBILE BAR (< 768px)
       ======================================================== -->
  <div class="block md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E8EF] shadow-[0_-4px_20px_rgba(16,27,53,0.08)]">
    <div class="max-w-md mx-auto flex items-center justify-around px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      <a 
        href="/"
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-[#3157D5] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg bg-[#EEF2FF] text-[#3157D5]">
          <Home class="w-4 h-4 stroke-[2.5]" />
        </div>
        <span class="text-[9px] mt-0.5 font-bold text-[#101B35]">Beranda</span>
      </a>

      <a 
        href="/mentor"
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 hover:text-[#101B35] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg hover:bg-slate-50">
          <Users class="w-4 h-4 stroke-2" />
        </div>
        <span class="text-[9px] mt-0.5 font-medium text-slate-600">Mentor</span>
      </a>

      <a 
        href="/karier"
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 hover:text-[#101B35] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg hover:bg-slate-50">
          <Briefcase class="w-4 h-4 stroke-2" />
        </div>
        <span class="text-[9px] mt-0.5 font-medium text-slate-600">Karier</span>
      </a>

      <a 
        href={authStore.isAuthenticated ? (authStore.role === 'alumni' ? '/dashboard/alumni' : '/dashboard/student') : '/login'}
        class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 hover:text-[#101B35] min-h-[46px] touch-manipulation"
      >
        <div class="p-1 rounded-lg hover:bg-slate-50">
          {#if authStore.isAuthenticated}
            <User class="w-4 h-4 stroke-2" />
          {:else}
            <LogIn class="w-4 h-4 stroke-2" />
          {/if}
        </div>
        <span class="text-[9px] mt-0.5 font-medium text-slate-600">
          {authStore.isAuthenticated ? 'Akun' : 'Masuk'}
        </span>
      </a>
    </div>
  </div>

</div>
