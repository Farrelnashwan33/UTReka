<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte';
  import { 
    MessageSquare, 
    ArrowUpRight, 
    ArrowRight, 
    Check, 
    Clock, 
    FileText, 
    Download, 
    ChevronRight,
    Sparkles,
    Briefcase
  } from 'lucide-svelte';

  let activeTab = $state<'ringkasan' | 'tahapan' | 'anggota'>('ringkasan');
</script>

<svelte:head>
  <title>Ruang Kerja Mahasiswa | UT REKA</title>
</svelte:head>

<div class="space-y-6">
  <!-- Top Header Section (Image 4) -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="space-y-1">
      <span class="text-xs font-semibold text-[#C2410C]">
        Selangkah lebih dekat dengan kariermu
      </span>
      <h1 class="text-2xl sm:text-3xl font-black text-[#183153] font-serif tracking-tight">
        Ruang Menuju karier yang gemilang.
      </h1>
      <p class="text-xs sm:text-sm text-gray-500">
        Pantau tugasmu dan penilaian mentor dalam satu tempat.
      </p>
    </div>

    <a 
      href="/dashboard/messages"
      class="px-4 py-2.5 rounded-xl border border-[#E7E5E0] bg-white text-xs font-bold text-[#183153] hover:bg-gray-50 transition shadow-2xs flex items-center gap-2 self-start sm:self-center touch-manipulation"
    >
      <MessageSquare class="w-4 h-4 text-gray-500" />
      <span>Chat Alumni</span>
    </a>
  </div>

  <!-- Active Position Banner (Image 4) -->
  <div class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3.5">
    <img 
      src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
      alt={authStore.profile?.full_name || 'Maulana Chrysant'} 
      class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
    />
    <div class="min-w-0 flex-1">
      <h2 class="text-base sm:text-lg font-black text-[#183153] font-heading leading-tight truncate">
        Junior Programmer
      </h2>
      <p class="text-xs text-gray-500 truncate mt-0.5 font-medium">
        {authStore.profile?.full_name || 'Maulana Chrysant'} - {authStore.profile?.study_program || 'Sistem Informasi'} - UT Semester 3
      </p>
    </div>
  </div>

  <!-- Navigation Tabs (Image 4: Ringkasan, Tahapan & tugas, Anggota lain) -->
  <div class="flex items-center gap-6 border-b border-[#E7E5E0] text-xs font-bold text-gray-500">
    <button 
      type="button"
      onclick={() => activeTab = 'ringkasan'}
      class="pb-3 transition {activeTab === 'ringkasan' ? 'text-[#183153] border-b-2 border-[#183153] font-black' : 'hover:text-black'}"
    >
      Ringkasan
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'tahapan'}
      class="pb-3 transition {activeTab === 'tahapan' ? 'text-[#183153] border-b-2 border-[#183153] font-black' : 'hover:text-black'}"
    >
      Tahapan & tugas
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'anggota'}
      class="pb-3 transition {activeTab === 'anggota' ? 'text-[#183153] border-b-2 border-[#183153] font-black' : 'hover:text-black'}"
    >
      Anggota lain (3)
    </button>
  </div>

  <!-- 3 Progress & Timeline Cards (Image 4) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Card 1: Progres Seleksi Anda -->
    <div class="p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-600">Progres Seleksi Anda</span>
        <span class="text-xs font-black text-[#183153]">50%</span>
      </div>
      <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div class="bg-[#18866B] h-full rounded-full" style="width: 50%;"></div>
      </div>
      <p class="text-[10px] text-gray-400 font-medium">
        2 dari 4 tahap selesai · Proses Pengerjaan
      </p>
    </div>

    <!-- Card 2: Progres penilaian alumni -->
    <div class="p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-600">Progres penilaian alumni</span>
        <span class="text-xs font-black text-[#183153]">50%</span>
      </div>
      <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div class="bg-[#18866B] h-full rounded-full" style="width: 50%;"></div>
      </div>
      <p class="text-[10px] text-gray-400 font-medium">
        2 dari 4 tahap dinilai · Rata-Rata Nilai Sementara: 80/100
      </p>
    </div>

    <!-- Card 3: Waktu Seleksi -->
    <div class="p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-2">
      <span class="text-xs font-bold text-gray-600">Waktu Seleksi</span>
      <div class="text-lg font-black text-[#183153] font-heading">
        2 Minggu · 4 Seleksi
      </div>
      <p class="text-[10px] text-gray-400 font-medium">
        Sisa waktu pengerjaan tes: 14 hari
      </p>
    </div>
  </div>

  <!-- Main Content Grid (Image 4: Left 8 cols, Right 4 cols) -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- LEFT COLUMN: Tahapan Seleksi Table & Kiriman Hasil Kerja (8 cols) -->
    <div class="lg:col-span-8 space-y-5">
      <!-- Card: Tahapan Seleksi Table -->
      <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-[#183153] font-heading">Tahapan Seleksi</h3>
          <span class="text-[11px] text-gray-400">5 Oktober 2026</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-[#E7E5E0] text-[10px] uppercase font-bold text-gray-400">
                <th class="py-2.5 pr-4">TAHAPAN</th>
                <th class="py-2.5 px-3">MAHASISWA</th>
                <th class="py-2.5 px-3">PENILAIAN ALUMNI</th>
                <th class="py-2.5 pl-3 text-right">TENGGAT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#FAF9F6]">
              <!-- Row 1: 01 Test Psikolog -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#183153]">01 · Test Psikolog</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">Psikologi dan penilaian diri</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    Selesai
                  </span>
                  <p class="text-[9px] text-gray-400 mt-0.5">Dikirim 6 Okt - 16.20</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold text-gray-700">Sudah dinilai</span>
                  <p class="text-[10px] font-bold text-emerald-700 mt-0.5">Nilai 80 / 100</p>
                </td>
                <td class="py-3.5 pl-3 text-right text-gray-400 font-medium">
                  6 Okt
                </td>
              </tr>

              <!-- Row 2: 02 Test Bidang -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#183153]">02 · Test Bidang</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">JavaScript & logika - 45 menit</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Sedang dikerjakan
                  </span>
                  <p class="text-[9px] text-gray-400 mt-0.5">Dikirim 8 Okt - 08.00</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] text-gray-400 font-medium">Belum dinilai</span>
                  <p class="text-[9px] text-gray-400 mt-0.5">Setelah tes dikirim</p>
                </td>
                <td class="py-3.5 pl-3 text-right text-gray-400 font-medium">
                  9 Okt
                </td>
              </tr>

              <!-- Row 3: 03 Mini Project -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#183153]">03 · Mini Project</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">Pembuatan aplikasi dasar ringan</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    Belum dibuka
                  </span>
                  <p class="text-[9px] text-gray-400 mt-0.5">Tahap belum dibuka</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] text-gray-400">Belum dinilai</span>
                </td>
                <td class="py-3.5 pl-3 text-right text-gray-400 font-medium">
                  12 Okt
                </td>
              </tr>

              <!-- Row 4: 03 Interview Online -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#183153]">03 · Interview Online</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">Tahap akhir tes</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    Belum dibuka
                  </span>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] text-gray-400">Belum dinilai</span>
                </td>
                <td class="py-3.5 pl-3 text-right text-gray-400 font-medium">
                  1 Nov
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card: Kiriman & hasil kerjamu (Image 4) -->
      <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-[#183153] font-heading">Kiriman & hasil kerjamu</h3>
          <span class="text-[11px] text-gray-400 font-semibold">2 dokumen</span>
        </div>

        <!-- File attachment item -->
        <div class="p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E5E0] flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <FileText class="w-5 h-5 text-gray-500 shrink-0" />
            <div class="min-w-0">
              <p class="text-xs font-extrabold text-[#183153] truncate">MiniProject_Maulana.zip</p>
              <p class="text-[10px] text-gray-400 truncate mt-0.5">ZIP · 2.8 MB · Dikirim 6 Okt 2026 · Versi 1</p>
            </div>
          </div>
          <button 
            type="button"
            class="p-2 text-gray-500 hover:text-[#183153] hover:bg-white rounded-lg transition"
            title="Download file"
          >
            <Download class="w-4 h-4" />
          </button>
        </div>

        <!-- Github repository link -->
        <a 
          href="https://github.com/maulana" 
          target="_blank" 
          rel="noreferrer"
          class="inline-flex items-center gap-1 text-xs font-bold text-[#183153] hover:underline"
        >
          <span>github.com/maulana/</span>
          <ArrowUpRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>

    <!-- RIGHT COLUMN: Tahap 4 Card & Umpan Balik Mentor (4 cols) -->
    <div class="lg:col-span-4 space-y-5">
      <!-- Card: TAHAP · 4 (Image 4) -->
      <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
        <span class="text-[10px] font-black uppercase tracking-wider text-gray-400">
          TAHAP · 4
        </span>
        <h4 class="text-base font-black text-[#183153] font-heading">
          Persiapkan untuk tahap ini
        </h4>
        <p class="text-xs text-gray-500 leading-relaxed">
          Tahap akhir tes untuk menyeleksi mahasiswa secara langsung bersama mentor industri.
        </p>
        <button 
          type="button"
          class="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#183153] text-white text-xs font-bold hover:bg-[#102138] transition flex items-center justify-center gap-2 shadow-xs touch-manipulation"
        >
          <span>1 November</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Card: Umpan balik mentor (Image 4) -->
      <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
        <h4 class="text-sm font-black text-[#183153] font-heading">
          Umpan balik mentor
        </h4>
        <p class="text-xs text-gray-600 leading-relaxed italic">
          "Pengerjaan mini project menunjukkan pemahaman dasar yang baik pada arsitektur web modern. Tetap pertahankan kerapian struktur kode dan siap untuk simulasi interview."
        </p>

        <!-- Mentor profile footer -->
        <div class="flex items-center gap-2.5 pt-2 border-t border-[#FAF9F6]">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
            alt="Kenzi Putra Petir" 
            class="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
          />
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold text-[#183153] truncate">Kenzi Putra Petir</p>
            <p class="text-[10px] text-gray-400 truncate">Software Engineer · Google</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Footer -->
  <div class="pt-8 border-t border-[#E7E5E0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
    <p>© 2026 UT REKA · Universitas Terbuka</p>
    <div class="flex items-center gap-4">
      <a href="/privasi-syarat" class="hover:text-gray-600 transition">Kebijakan privasi</a>
      <span>·</span>
      <a href="/panduan" class="hover:text-gray-600 transition">Panduan komunitas</a>
    </div>
  </div>
</div>
