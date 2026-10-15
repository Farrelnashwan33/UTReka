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

    <span class="text-xs font-bold text-gray-500">
      Terakhir Diperbarui: Oktober 2026
    </span>
  </header>

  <!-- Hero Header -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-6 space-y-4">
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] text-[#183153] text-xs font-bold uppercase tracking-wider">
        <Scale class="w-3.5 h-3.5 text-[#18866B]" />
        <span>Dokumen Hukum & Kepatuhan Resmi</span>
      </div>
      <h1 class="text-2xl sm:text-4xl font-black font-heading text-[#183153] tracking-tight">
        Kebijakan Privasi & Ketentuan Layanan
      </h1>
      <p class="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
        Komitmen perlindungan data pribadi dan pedoman tata tertib komunitas ekosistem karier Universitas Terbuka (UT REKA).
      </p>
    </div>
  </section>

  <!-- Legal Articles Content Container -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
    <!-- Bagian 1: Kebijakan Privasi -->
    <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-5">
      <div class="flex items-center gap-2.5 border-b border-[#E7E5E0] pb-3">
        <ShieldCheck class="w-6 h-6 text-[#18866B]" />
        <h2 class="text-lg sm:text-xl font-black font-heading text-[#183153]">
          1. Kebijakan Pelindungan Data Pribadi
        </h2>
      </div>

      <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <p>
          Universitas Terbuka berkomitmen menjamin kerahasiaan dan keamanan data seluruh civitas akademika sesuai dengan amanat <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong>.
        </p>

        <div class="space-y-2">
          <h3 class="font-bold text-[#183153]">A. Data yang Dikumpulkan:</h3>
          <ul class="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Data Identitas Akademik:</strong> Nama Lengkap, Nomor Induk Mahasiswa (NIM), Program Studi, dan UPBJJ tempat terdaftar.</li>
            <li><strong>Data Kontak & Autentikasi:</strong> Alamat surel (email) dan kata sandi terenkripsi (hash).</li>
            <li><strong>Data Profil Profesional:</strong> Riwayat pekerjaan, tautan portofolio/LinkedIn, keahlian teknis, dan topik bimbingan mentor.</li>
            <li><strong>Data Interaksi Komunitas:</strong> Riwayat permintaan bimbingan, catatan pesan dalam sistem, dan pelaporan moderasi.</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#183153]">B. Tujuan Pemrosesan Data:</h3>
          <p class="text-gray-600">
            Data pribadi digunakan secara eksklusif untuk memverifikasi keabsahan mahasiswa/alumni, menjalankan algoritma pencocokan mentor <em>REKA Match™</em>, menyampaikan notifikasi sistem, dan memfasilitasi proses lamaran magang/kerja. Kami <strong>tidak pernah menjual atau membagikan data pribadi Anda ke pihak komersial pihak ketiga</strong>.
          </p>
        </div>
      </div>
    </div>

    <!-- Bagian 2: Syarat & Ketentuan Layanan -->
    <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-5">
      <div class="flex items-center gap-2.5 border-b border-[#E7E5E0] pb-3">
        <FileText class="w-6 h-6 text-[#183153]" />
        <h2 class="text-lg sm:text-xl font-black font-heading text-[#183153]">
          2. Syarat & Ketentuan Penggunaan Layanan
        </h2>
      </div>

      <div class="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <p>
          Dengan mendaftar dan menggunakan aplikasi UT REKA, Anda menyetujui syarat-syarat tata tertib sebagai berikut:
        </p>

        <div class="space-y-2">
          <h3 class="font-bold text-[#183153]">A. Keabsahan Akun:</h3>
          <p class="text-gray-600">
            Setiap pengguna wajib memberikan informasi yang akurat dan dapat dipertanggungjawabkan. Mahasiswa wajib menggunakan NIM yang aktif, dan alumni wajib menggunakan data kelulusan yang valid.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#183153]">B. Tata Krama Percakapan & Bimbingan:</h3>
          <p class="text-gray-600">
            Interaksi dalam fitur Pesan dan Mentoring wajib menjunjung tinggi norma kesopanan, etika akademik, dan saling menghormati. Dilarang melakukan pelecehan, intimidasi, diskriminasi SARA, atau mengirimkan konten yang melanggar hukum.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#183153]">C. Larangan Komersialisasi & Penipuan:</h3>
          <p class="text-gray-600">
            Seluruh layanan mentoring pada platform ini bersifat cuma-cuma (gratis). Pengguna dilarang memungut biaya bimbingan, menawarkan jasa joki tugas akademik, atau mempublikasikan lowongan kerja fiktif dengan pungutan biaya administrasi.
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="font-bold text-[#183153]">D. Kewenangan Administrator:</h3>
          <p class="text-gray-600">
            Tim Administrator berhak meninjau laporan pelanggaran, memoderasi konten yang tidak pantas, serta menonaktifkan akun yang melanggar ketentuan tanpa pemberitahuan sebelumnya demi menjaga integritas almamater.
          </p>
        </div>
      </div>
    </div>

    <!-- Kontak Hukum & Pejabat Data -->
    <div class="p-6 rounded-3xl bg-[#FAF9F6] border border-[#E7E5E0] space-y-3 text-xs text-gray-600">
      <h3 class="font-bold text-[#183153]">Pertanyaan & Permintaan Hak Akses Data:</h3>
      <p>
        Untuk pertanyaan seputar kebijakan privasi, permohonan penghapusan akun, atau aduan pelanggaran etika, hubungi pengelola resmi di:
      </p>
      <p class="font-mono text-gray-800">
        Email: <a href="mailto:privasi-reka@ut.ac.id" class="text-[#18866B] font-bold underline">privasi-reka@ut.ac.id</a> / <a href="mailto:reka@ut.ac.id" class="text-[#18866B] font-bold underline">reka@ut.ac.id</a>
      </p>
    </div>
  </main>
</div>
