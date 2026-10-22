<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte';
  import { 
    Users, 
    Sparkles, 
    CheckCircle2, 
    ArrowLeft, 
    ArrowRight, 
    Video, 
    MessageSquare, 
    FileText, 
    Target, 
    ShieldCheck, 
    GraduationCap, 
    Clock, 
    Award,
    HelpCircle,
    ChevronDown,
    Building2,
    Briefcase
  } from 'lucide-svelte';

  let openFaq = $state<number | null>(0);

  const mentorSteps = [
    {
      num: '01',
      title: 'Pendaftaran & Verifikasi',
      desc: 'Mahasiswa dan alumni mendaftar dengan identitas UT. Tim sistem memverifikasi keabsahan data untuk menjaga keamanan komunitas.'
    },
    {
      num: '02',
      title: 'Pencocokan REKA Match™',
      desc: 'Algoritma mencocokkan minat karier mahasiswa dengan latar belakang industri, keahlian, dan prodi alumni.'
    },
    {
      num: '03',
      title: 'Kirim Permintaan Bimbingan',
      desc: 'Mahasiswa mengajukan permintaan bimbingan dengan menyertakan topik yang ingin dikonsultasikan (misal: review CV).'
    },
    {
      num: '04',
      title: 'Sesi Mentoring Berjalan',
      desc: 'Komunikasi berlangsung melalui chat terintegrasi atau video meeting virtual (Zoom/Meet) sesuai kesepakatan waktu.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah program mentoring di UT REKA berbayar?',
      a: 'Tidak. Seluruh program bimbingan karier di UT REKA 100% gratis dan merupakan inisiatif kolaborasi civitas akademika dan Ikatan Alumni UT (IKA UT).'
    },
    {
      q: 'Apakah mahasiswa UT luar negeri atau UPBJJ pelosok bisa ikut?',
      a: 'Bisa! UT REKA dirancang inklusif untuk seluruh mahasiswa UT di 39 UPBJJ dan Layanan Luar Negeri. Seluruh proses mentoring diselenggarakan secara daring (remote/online).'
    },
    {
      q: 'Siapa saja alumni yang menjadi mentor di UT REKA?',
      a: 'Mentor adalah alumni terverifikasi Universitas Terbuka yang telah berkarier profesional di berbagai sektor, termasuk BUMN, instansi pemerintahan, perusahaan teknologi, perbankan, dan multinasional.'
    },
    {
      q: 'Bagaimana cara alumni mendaftar sebagai mentor?',
      a: 'Alumni dapat mendaftar dengan memilih peran "Alumni" saat registrasi, melengkapi data profil karier & topik bimbingan, lalu menunggu verifikasi cepat dari sistem.'
    }
  ];
</script>

<svelte:head>
  <title>Program Mentoring Alumni | UT REKA</title>
</svelte:head>

<div class="min-h-screen bg-[#F7F6F2] text-[#20283B] antialiased selection:bg-[#3157D5] selection:text-white pb-24 md:pb-16">
  <!-- Top App Bar / Header -->
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
          href="/dashboard/connections" 
          class="px-4 py-2 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition touch-manipulation shadow-xs"
        >
          Buka Direktori Mentor
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
          <Sparkles class="w-3.5 h-3.5 text-[#FFC83D]" />
          <span>Program Unggulan UT REKA</span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black font-heading tracking-tight leading-tight text-white">
          Bimbingan Karier Personal Langsung dari Alumni UT
        </h1>

        <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Menghubungkan mahasiswa aktif Universitas Terbuka dari Sabang sampai Merauke dan perwakilan luar negeri dengan alumni profesional di BUMN, teknologi terkemuka, perbankan, dan multinasional.
        </p>

        <!-- Trust Badges -->
        <div class="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white font-medium border border-white/15">
            <ShieldCheck class="w-3.5 h-3.5 text-[#FFC83D]" />
            100% Alumni Terverifikasi
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white font-medium border border-white/15">
            <CheckCircle2 class="w-3.5 h-3.5 text-[#3157D5]" />
            Gratis Civitas Akademika
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-white font-medium border border-white/15">
            <Video class="w-3.5 h-3.5 text-blue-300" />
            100% Daring Fleksibel
          </span>
        </div>

        <!-- Hero Actions -->
        <div class="pt-4 flex flex-wrap items-center gap-3">
          <a 
            href={authStore.isAuthenticated ? '/dashboard/connections' : '/register?role=student'}
            class="px-5 py-3 rounded-2xl bg-[#3157D5] text-white text-xs sm:text-sm font-bold hover:bg-[#2646B8] transition shadow-md touch-manipulation flex items-center gap-2"
          >
            <span>Cari Mentor Mahasiswa</span>
            <ArrowRight class="w-4 h-4" />
          </a>
          <a 
            href="#daftar-mentor"
            class="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition touch-manipulation"
          >
            Pelajari Cara Jadi Mentor
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Fitur Utama Program Mentoring -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    <div class="text-center space-y-1">
      <h2 class="text-xl sm:text-2xl font-black font-heading text-[#101B35]">
        Apa Saja yang Didapatkan Mahasiswa?
      </h2>
      <p class="text-xs sm:text-sm text-[#68738A]">
        Bimbingan terstruktur yang menjawab kebutuhan dunia kerja modern
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3 hover:border-[#3157D5]/30 transition">
        <div class="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center font-bold">
          <Sparkles class="w-5 h-5 text-[#3157D5]" />
        </div>
        <h3 class="text-sm font-extrabold text-[#101B35]">REKA Match™ Algoritma Kecerdasan</h3>
        <p class="text-xs text-[#68738A] leading-relaxed">
          Sistem mencocokkan profil minat, program studi, dan tujuan karier mahasiswa dengan rekam jejak alumni yang paling relevan untuk memaksimalkan hasil bimbingan.
        </p>
      </div>

      <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3 hover:border-[#3157D5]/30 transition">
        <div class="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center font-bold">
          <FileText class="w-5 h-5" />
        </div>
        <h3 class="text-sm font-extrabold text-[#101B35]">Bedah CV & Portofolio Nyata</h3>
        <p class="text-xs text-[#68738A] leading-relaxed">
          Dapatkan ulasan konstruktif langsung dari praktisi yang aktif menyaring pelamar kerja di industri. Optimalkan portofolio agar lolos screening ATS dan HRD.
        </p>
      </div>

      <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3 hover:border-[#3157D5]/30 transition">
        <div class="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center font-bold">
          <MessageSquare class="w-5 h-5" />
        </div>
        <h3 class="text-sm font-extrabold text-[#101B35]">Simulasi Interview Teknis & HR</h3>
        <p class="text-xs text-[#68738A] leading-relaxed">
          Latihan tanya-jawab wawancara kerja BUMN, tech startup, dan korporat ternama dengan umpan balik langsung untuk melatih kepercayaan diri Anda.
        </p>
      </div>

      <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3 hover:border-[#3157D5]/30 transition">
        <div class="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center font-bold">
          <GraduationCap class="w-5 h-5" />
        </div>
        <h3 class="text-sm font-extrabold text-[#101B35]">Kiat Sukses Mahasiswa Mandiri</h3>
        <p class="text-xs text-[#68738A] leading-relaxed">
          Alumni UT berbagi pengalaman nyata bagaimana membagi waktu antara kuliah jarak jauh, pekerjaan sehari-hari, dan persiapan karier masa depan.
        </p>
      </div>
    </div>
  </section>

  <!-- Cara Kerja / Step-by-Step -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
    <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-6">
      <div class="text-center space-y-1">
        <span class="text-[11px] font-bold uppercase tracking-wider text-[#3157D5]">Alur Langkah Mudah</span>
        <h2 class="text-xl sm:text-2xl font-black font-heading text-[#101B35]">
          Bagaimana Cara Memulai Mentoring?
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each mentorSteps as step}
          <div class="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] space-y-2">
            <span class="text-xl font-black text-[#3157D5] font-mono leading-none">{step.num}</span>
            <h3 class="text-xs font-extrabold text-[#101B35]">{step.title}</h3>
            <p class="text-[11px] text-[#68738A] leading-relaxed">{step.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Call to Action bagi Alumni (Ingin Jadi Mentor) -->
  <section id="daftar-mentor" class="max-w-4xl mx-auto px-4 sm:px-6 py-6">
    <div class="p-6 sm:p-8 rounded-3xl bg-[#101B35] text-white shadow-lg space-y-4 border border-[#101B35]/40">
      <div class="flex items-center gap-2">
        <Award class="w-5 h-5 text-[#FFC83D]" />
        <span class="text-xs font-bold uppercase tracking-wider text-gray-300">Bagi Rekan Alumni UT</span>
      </div>

      <h2 class="text-xl sm:text-2xl font-black font-heading text-white">
        Bantu Generasi Muda UT Meraih Potensi Karier Terbaik
      </h2>

      <p class="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
        Anda alumni UT yang telah meniti karier profesional? Dedikasikan sedikit waktu luang Anda untuk berbagi pandangan, memberikan review portofolio, dan membimbing adik-adik tingkat di almamater.
      </p>

      <div class="pt-2 flex flex-wrap items-center gap-3">
        <a 
          href="/register?role=alumni"
          class="px-5 py-3 rounded-2xl bg-[#3157D5] text-white text-xs sm:text-sm font-bold hover:bg-[#2646B8] transition shadow-md touch-manipulation"
        >
          Daftar Menjadi Mentor Alumni
        </a>
        <a 
          href="/panduan"
          class="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition touch-manipulation"
        >
          Baca Panduan Mentor
        </a>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
    <div class="text-center space-y-1">
      <h2 class="text-xl font-black font-heading text-[#101B35]">
        Pertanyaan Seputar Mentoring
      </h2>
      <p class="text-xs text-[#68738A]">Hal yang sering ditanyakan oleh mahasiswa dan alumni</p>
    </div>

    <div class="space-y-3">
      {#each faqs as item, i}
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
