<script lang="ts">
  import { 
    ShieldCheck, 
    Lock, 
    FileText, 
    ArrowLeft, 
    CheckCircle2, 
    AlertCircle, 
    Scale, 
    Eye, 
    UserCheck,
    Mail
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Kebijakan Privasi & Syarat Layanan | UT REKA</title>
</svelte:head>

<div class="min-h-screen bg-[#F7F6F2] text-[#20283B] antialiased selection:bg-[#3157D5] selection:text-white pb-24 md:pb-16">
  <!-- Top App Header -->
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

    <span class="text-xs font-bold text-[#68738A]">
      Terakhir Diperbarui: Oktober 2026
    </span>
  </header>

  <!-- Hero Header -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-6 space-y-4">
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-xs font-bold uppercase tracking-wider border border-[#3157D5]/20">
        <Scale class="w-3.5 h-3.5 text-[#3157D5]" />
        <span>Dokumen Hukum & Kepatuhan Resmi</span>
      </div>
      <h1 class="text-2xl sm:text-4xl font-black font-heading text-[#101B35] tracking-tight">
        Kebijakan Privasi & Ketentuan Layanan
      </h1>
      <p class="text-xs sm:text-sm text-[#68738A] max-w-xl mx-auto leading-relaxed">
        Komitmen perlindungan data pribadi dan pedoman tata tertib komunitas ekosistem karier Universitas Terbuka (UT REKA).
      </p>
    </div>
  </section>

  <!-- Legal Articles Content Container -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
    <!-- Bagian 1: Kebijakan Privasi -->
    <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-5">
      <div class="flex items-center gap-2.5 border-b border-[#E5E8EF] pb-3">
        <ShieldCheck class="w-6 h-6 text-[#3157D5]" />
        <h2 class="text-lg sm:text-xl font-black font-heading text-[#101B35]">
          1. Kebijakan Pelindungan Data Pribadi
        </h2>
      </div>

      <div class="space-y-4 text-xs sm:text-sm text-[#20283B] leading-relaxed">
        <p>
          Universitas Terbuka berkomitmen menjamin kerahasiaan dan keamanan data seluruh civitas akademika sesuai dengan amanat <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong>.
        </p>

        <div class="space-y-2">
          <h3 class="font-bold text-[#101B35]">A. Data yang Dikumpulkan:</h3>
          <ul class="list-disc pl-5 space-y-1 text-[#68738A]">
            <li><strong>Data Identitas Akademik:</strong> Nama Lengkap, Nomor Induk Mahasiswa (NIM), Program Studi, dan UPBJJ tempat terdaftar.</li>
            <li><strong>Data Kontak & Autentikasi:</strong> Alamat surel (email) dan kata sandi terenkripsi (hash).</li>
            <li><strong>Data Profil Profesional:</strong> Riwayat pekerjaan, tautan portofolio/LinkedIn, keahlian teknis, dan topik bimbingan mentor.</li>
            <li><strong>Data Interaksi Komunitas:</strong> Riwayat permintaan bimbingan, catatan pesan dalam sistem, dan pelaporan moderasi.</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#101B35]">B. Tujuan Pemrosesan Data:</h3>
          <p class="text-[#68738A]">
            Data pribadi digunakan secara eksklusif untuk memverifikasi keabsahan mahasiswa/alumni, menjalankan algoritma pencocokan mentor <em>REKA Match™</em>, menyampaikan notifikasi sistem, dan memfasilitasi proses lamaran magang/kerja. Kami <strong>tidak pernah menjual atau membagikan data pribadi Anda ke pihak komersial pihak ketiga</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Bagian 2: Syarat & Ketentuan Layanan -->
    <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-5">
      <div class="flex items-center gap-2.5 border-b border-[#E5E8EF] pb-3">
        <FileText class="w-6 h-6 text-[#3157D5]" />
        <h2 class="text-lg sm:text-xl font-black font-heading text-[#101B35]">
          2. Syarat & Ketentuan Penggunaan Layanan
        </h2>
      </div>

      <div class="space-y-4 text-xs sm:text-sm text-[#20283B] leading-relaxed">
        <p>
          Dengan mendaftar dan menggunakan aplikasi UT REKA, Anda menyetujui syarat-syarat tata tertib sebagai berikut:
        </p>

        <div class="space-y-2">
          <h3 class="font-bold text-[#101B35]">A. Keabsahan Akun:</h3>
          <p class="text-[#68738A]">
            Setiap pengguna wajib memberikan informasi yang akurat dan dapat dipertanggungjawabkan. Mahasiswa wajib menggunakan NIM yang aktif, dan alumni wajib menggunakan data kelulusan yang valid.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#101B35]">B. Tata Krama Percakapan & Bimbingan:</h3>
          <p class="text-[#68738A]">
            Interaksi dalam fitur Pesan dan Mentoring wajib menjunjung tinggi norma kesopanan, etika akademik, dan saling menghormati. Dilarang melakukan pelecehan, intimidasi, diskriminasi SARA, atau mengirimkan konten yang melanggar hukum.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#101B35]">C. Larangan Komersialisasi & Penipuan:</h3>
          <p class="text-[#68738A]">
            Seluruh layanan mentoring pada platform ini bersifat cuma-cuma (gratis). Pengguna dilarang memungut biaya bimbingan, menawarkan jasa joki tugas akademik, atau mempublikasikan lowongan kerja fiktif dengan pungutan biaya administrasi.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#101B35]">D. Kewenangan Administrator:</h3>
          <p class="text-[#68738A]">
            Tim Administrator berhak meninjau laporan pelanggaran, memoderasi konten yang tidak pantas, serta menonaktifkan akun yang melanggar ketentuan tanpa pemberitahuan sebelumnya demi menjaga integritas almamater.
          </p>
        </div>
      </div>
    </div>

    <!-- Kontak Hukum & Pejabat Data -->
    <div class="p-6 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3 text-xs text-[#68738A]">
      <h3 class="font-bold text-[#101B35]">Pertanyaan & Permintaan Hak Akses Data:</h3>
      <p>
        Untuk pertanyaan seputar kebijakan privasi, permohonan penghapusan akun, atau aduan pelanggaran etika, hubungi pengelola resmi di:
      </p>
      <p class="font-mono text-[#20283B]">
        Email: <a href="mailto:privasi-reka@ut.ac.id" class="text-[#3157D5] font-bold underline">privasi-reka@ut.ac.id</a> / <a href="mailto:reka@ut.ac.id" class="text-[#3157D5] font-bold underline">reka@ut.ac.id</a>
      </p>
    </div>
  </main>
</div>
