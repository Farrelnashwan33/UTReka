<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte';
  import { 
    HelpCircle, 
    BookOpen, 
    ShieldCheck, 
    KeyRound, 
    FileText, 
    ArrowLeft, 
    ArrowRight, 
    CheckCircle2, 
    Users, 
    Briefcase, 
    Lock, 
    MessageSquare, 
    Mail, 
    AlertTriangle,
    ChevronDown,
    ExternalLink
  } from 'lucide-svelte';

  let selectedSection = $state<'semua' | 'mahasiswa' | 'alumni' | 'akun' | 'keamanan'>('semua');
  let openFaq = $state<number | null>(0);

  const guides = [
    {
      category: 'mahasiswa',
      title: 'Panduan Pendaftaran Mahasiswa Aktif',
      icon: Users,
      steps: [
        'Kunjungi halaman Registrasi dan pilih peran "Mahasiswa Aktif".',
        'Masukkan Nama Lengkap sesuai KTP/KTM, Nomor Induk Mahasiswa (NIM), dan Program Studi.',
        'Gunakan kata sandi minimal 8 karakter dengan kombinasi angka dan huruf.',
        'Setelah mendaftar, akun dapat langsung digunakan untuk mengeksplorasi mentor dan lowongan.'
      ]
    },
    {
      category: 'alumni',
      title: 'Panduan Bergabung sebagai Mentor Alumni',
      icon: BookOpen,
      steps: [
        'Pilih peran "Alumni / Mentor" pada halaman pendaftaran.',
        'Lengkapi nama perusahaan, jabatan saat ini, serta keahlian utama yang ingin Anda bagikan.',
        'Pilih topik konsultasi yang Anda minati (Review CV, Mock Interview, Bimbingan Portofolio).',
        'Setelah disetujui admin, atur sakelar "Ketersediaan Mentoring" di Dashboard Alumni menjadi aktif.'
      ]
    },
    {
      category: 'mahasiswa',
      title: 'Cara Mengajukan Bimbingan ke Mentor',
      icon: MessageSquare,
      steps: [
        'Masuk ke Beranda Mahasiswa atau Direktori Mentor REKA Match™.',
        'Pilih profil mentor yang sesuai dengan target karier atau industri impian Anda.',
        'Klik tombol "Hubungkan Bimbingan" dan tuliskan pesan singkat tentang tujuan konsultasi.',
        'Tunggu konfirmasi mentor. Begitu diterima, Anda dapat memulai percakapan di menu Pesan.'
      ]
    },
    {
      category: 'akun',
      title: 'Pemulihan Kata Sandi (Lupa Password)',
      icon: KeyRound,
      steps: [
        'Klik menu "Lupa Password" di halaman Masuk atau kunjungi langsung rute pemulihan.',
        'Masukkan alamat email terdaftar dan NIM Anda untuk validasi identitas akun.',
        'Sistem akan mengirimkan instruksi kode verifikasi dan tautan pengaturan ulang sandi.',
        'Buat kata sandi baru yang aman dan gunakan untuk masuk kembali ke UT REKA.'
      ]
    },
    {
      category: 'keamanan',
      title: 'Etika & Kode Etik Komunitas UT REKA',
      icon: ShieldCheck,
      steps: [
        'Gunakan bahasa yang santun, profesional, dan saling menghormati dalam percakapan bimbingan.',
        'Dilarang membagikan konten komersial berbayar yang tidak sah atau penipuan kerja.',
        'Jika menemukan perilaku mencurigakan atau pelanggaran, laporkan ke administrator melalui fitur Report.',
        'Akun yang terbukti melanggar kode etik akan dibekukan sementara atau dinonaktifkan permanen.'
      ]
    }
  ];

  let filteredGuides = $derived.by(() => {
    if (selectedSection === 'semua') return guides;
    return guides.filter(g => g.category === selectedSection);
  });
</script>

<svelte:head>
  <title>Pusat Panduan & Bantuan | UT REKA</title>
</svelte:head>

<div class="min-h-screen bg-[#FAF9F6] text-[#202124] antialiased selection:bg-[#FFD43B] selection:text-[#183153] pb-24 md:pb-16">
  <!-- Top App Header -->
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E7E5E0] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
    <a 
      href="/" 
      class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#183153] hover:text-[#18866B] transition touch-manipulation"
    >
      <ArrowLeft class="w-4 h-4" />
      <span class="hidden sm:inline">Kembali ke Beranda</span>
    </a>

    <a href="/" title="UT REKA">
      <img src="/images/ut-reka-logo-transparent.png" alt="UT REKA Relasi Karir" class="h-10 sm:h-12 w-auto object-contain" />
    </a>

    <div class="flex items-center gap-2">
      <a 
        href="/forgot-password" 
        class="text-xs font-bold text-gray-600 hover:text-[#183153] px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition"
      >
        Lupa Password?
      </a>
      <a 
        href="/login" 
        class="px-3.5 py-1.5 rounded-xl bg-[#183153] text-[#FFD43B] text-xs font-bold hover:bg-[#102138] transition touch-manipulation shadow-xs"
      >
        Masuk
      </a>
    </div>
  </header>

  <!-- Hero Header -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-6 space-y-4">
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] text-[#183153] text-xs font-bold uppercase tracking-wider">
        <HelpCircle class="w-3.5 h-3.5 text-[#18866B]" />
        <span>Pusat Informasi & Bantuan</span>
      </div>
      <h1 class="text-2xl sm:text-4xl font-black font-heading text-[#183153] tracking-tight">
        Panduan Lengkap Penggunaan UT REKA
      </h1>
      <p class="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
        Temukan petunjuk langkah demi langkah mengenai fitur bimbingan mentor, peluang karier, pendaftaran mahasiswa & alumni, serta pemulihan akun.
      </p>
    </div>

    <!-- Filter Kategori Panduan -->
    <div class="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs">
      <button 
        type="button"
        onclick={() => selectedSection = 'semua'}
        class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition touch-manipulation
          {selectedSection === 'semua' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'bg-white border border-[#E7E5E0] text-gray-700 hover:bg-gray-100'}"
      >
        Semua Panduan
      </button>
      <button 
        type="button"
        onclick={() => selectedSection = 'mahasiswa'}
        class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition touch-manipulation
          {selectedSection === 'mahasiswa' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'bg-white border border-[#E7E5E0] text-gray-700 hover:bg-gray-100'}"
      >
        Mahasiswa
      </button>
      <button 
        type="button"
        onclick={() => selectedSection = 'alumni'}
        class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition touch-manipulation
          {selectedSection === 'alumni' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'bg-white border border-[#E7E5E0] text-gray-700 hover:bg-gray-100'}"
      >
        Mentor Alumni
      </button>
      <button 
        type="button"
        onclick={() => selectedSection = 'akun'}
        class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition touch-manipulation
          {selectedSection === 'akun' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'bg-white border border-[#E7E5E0] text-gray-700 hover:bg-gray-100'}"
      >
        Akun & Sandi
      </button>
      <button 
        type="button"
        onclick={() => selectedSection = 'keamanan'}
        class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition touch-manipulation
          {selectedSection === 'keamanan' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'bg-white border border-[#E7E5E0] text-gray-700 hover:bg-gray-100'}"
      >
        Etika & Keamanan
      </button>
    </div>
  </section>

  <!-- Daftar Kartu Panduan Terstruktur -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {#each filteredGuides as guide}
        <div class="p-5 sm:p-6 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#EAF4FF] text-[#183153] flex items-center justify-center font-bold shrink-0">
              <guide.icon class="w-5 h-5 text-[#18866B]" />
            </div>
            <h3 class="text-sm sm:text-base font-extrabold text-[#183153] leading-snug">
              {guide.title}
            </h3>
          </div>

          <ol class="space-y-2.5 text-xs text-gray-600 pl-4 list-decimal marker:font-bold marker:text-[#183153]">
            {#each guide.steps as step}
              <li class="leading-relaxed pl-1">{step}</li>
            {/each}
          </ol>
        </div>
      {/each}
    </div>
  </section>

  <!-- Shortcut Cepat: Lupa Password & Privasi Syarat -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
    <h2 class="text-base sm:text-lg font-black font-heading text-[#183153]">
      Tautan Bantuan Langsung
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
      <a 
        href="/forgot-password"
        class="p-4 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs hover:border-[#183153] transition space-y-2 group touch-manipulation"
      >
        <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
          <KeyRound class="w-4 h-4 text-[#FFD43B]" />
        </div>
        <div class="font-extrabold text-[#183153] group-hover:text-[#18866B] flex items-center justify-between">
          <span>Lupa Password?</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </div>
        <p class="text-gray-500 text-[11px] leading-relaxed">
          Atur ulang kata sandi akun Anda menggunakan verifikasi email & NIM resmi.
        </p>
      </a>

      <a 
        href="/privasi-syarat"
        class="p-4 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs hover:border-[#183153] transition space-y-2 group touch-manipulation"
      >
        <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#18866B] flex items-center justify-center">
          <ShieldCheck class="w-4 h-4" />
        </div>
        <div class="font-extrabold text-[#183153] group-hover:text-[#18866B] flex items-center justify-between">
          <span>Privasi & Syarat</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </div>
        <p class="text-gray-500 text-[11px] leading-relaxed">
          Pelajari komitmen perlindungan data pribadi dan ketentuan layanan UT REKA.
        </p>
      </a>

      <a 
        href="/mentor"
        class="p-4 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs hover:border-[#183153] transition space-y-2 group touch-manipulation"
      >
        <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
          <Users class="w-4 h-4" />
        </div>
        <div class="font-extrabold text-[#183153] group-hover:text-[#18866B] flex items-center justify-between">
          <span>Tentang Mentoring</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </div>
        <p class="text-gray-500 text-[11px] leading-relaxed">
          Kenali sistem pencocokan REKA Match™ dan cara bimbingan bersama alumni.
        </p>
      </a>
    </div>
  </section>

  <!-- Helpdesk & Kontak -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 py-6">
    <div class="p-6 rounded-3xl bg-[#183153] text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="space-y-1 text-center sm:text-left">
        <h3 class="text-base font-extrabold font-heading text-white">Butuh Bantuan Lebih Lanjut?</h3>
        <p class="text-xs text-gray-300">Tim pengelola layanan UT REKA siap membantu kendala teknis Anda.</p>
      </div>

      <a 
        href="mailto:reka@ut.ac.id"
        class="px-4 py-2.5 rounded-xl bg-[#FFD43B] text-[#183153] text-xs font-black hover:bg-[#F2C41D] transition shadow-xs flex items-center gap-1.5 touch-manipulation"
      >
        <Mail class="w-4 h-4" />
        <span>Hubungi Helpdesk</span>
      </a>
    </div>
  </section>
</div>
