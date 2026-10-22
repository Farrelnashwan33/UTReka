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
  <!-- Top Header Section -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="space-y-1">
      <span class="text-xs font-bold text-[#3157D5] uppercase tracking-wider">
        Selangkah lebih dekat dengan kariermu
      </span>
      <h1 class="text-2xl sm:text-3xl font-black text-[#101B35] font-heading tracking-tight">
        Ruang Menuju Karier Gemilang.
      </h1>
      <p class="text-xs sm:text-sm text-[#68738A]">
        Pantau tugas dan penilaian berkala mentor dalam satu dasbor terpadu.
      </p>
    </div>

    <a 
      href="/dashboard/messages"
      class="px-4 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-xs font-bold text-[#101B35] hover:bg-[#F7F6F2] transition shadow-xs flex items-center gap-2 self-start sm:self-center touch-manipulation"
    >
      <MessageSquare class="w-4 h-4 text-[#3157D5]" />
      <span>Chat Alumni</span>
    </a>
  </div>

  <!-- Active Position Banner -->
  <div class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs flex items-center gap-3.5">
    <img 
      src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
      alt={authStore.profile?.full_name || 'Maulana Chrysant'} 
      class="w-12 h-12 rounded-full object-cover ring-2 ring-[#3157D5]/20 shrink-0"
    />
    <div class="min-w-0 flex-1">
      <h2 class="text-base sm:text-lg font-black text-[#101B35] font-heading leading-tight truncate">
        Junior Programmer
      </h2>
      <p class="text-xs text-[#68738A] truncate mt-0.5 font-medium">
        {authStore.profile?.full_name || 'Maulana Chrysant'} - {authStore.profile?.study_program || 'Sistem Informasi'} - UT Semester 3
      </p>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="flex items-center gap-6 border-b border-[#E5E8EF] text-xs font-bold text-[#68738A]">
    <button 
      type="button"
      onclick={() => activeTab = 'ringkasan'}
      class="pb-3 transition {activeTab === 'ringkasan' ? 'text-[#101B35] border-b-2 border-[#3157D5] font-black' : 'hover:text-[#101B35]'}"
    >
      Ringkasan
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'tahapan'}
      class="pb-3 transition {activeTab === 'tahapan' ? 'text-[#101B35] border-b-2 border-[#3157D5] font-black' : 'hover:text-[#101B35]'}"
    >
      Tahapan & Tugas
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'anggota'}
      class="pb-3 transition {activeTab === 'anggota' ? 'text-[#101B35] border-b-2 border-[#3157D5] font-black' : 'hover:text-[#101B35]'}"
    >
      Anggota Lain (3)
    </button>
  </div>

  <!-- 3 Progress & Timeline Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Card 1: Progres Seleksi Anda -->
    <div class="p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-[#68738A]">Progres Seleksi Anda</span>
        <span class="text-xs font-black text-[#101B35]">50%</span>
      </div>
      <div class="w-full bg-[#F7F6F2] h-2 rounded-full overflow-hidden">
        <div class="bg-[#3157D5] h-full rounded-full" style="width: 50%;"></div>
      </div>
      <p class="text-[10px] text-[#68738A] font-medium">
        2 dari 4 tahap selesai · Proses Pengerjaan
      </p>
    </div>

    <!-- Card 2: Progres penilaian alumni -->
    <div class="p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-[#68738A]">Progres Penilaian Alumni</span>
        <span class="text-xs font-black text-[#101B35]">50%</span>
      </div>
      <div class="w-full bg-[#F7F6F2] h-2 rounded-full overflow-hidden">
        <div class="bg-[#3157D5] h-full rounded-full" style="width: 50%;"></div>
      </div>
      <p class="text-[10px] text-[#68738A] font-medium">
        2 dari 4 tahap dinilai · Rata-Rata Nilai Sementara: 80/100
      </p>
    </div>

    <!-- Card 3: Waktu Seleksi -->
    <div class="p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-2">
      <span class="text-xs font-bold text-[#68738A]">Waktu Seleksi</span>
      <div class="text-lg font-black text-[#101B35] font-heading">
        2 Minggu · 4 Seleksi
      </div>
      <p class="text-[10px] text-[#68738A] font-medium">
        Sisa waktu pengerjaan tes: 14 hari
      </p>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- LEFT COLUMN: Tahapan Seleksi Table & Kiriman Hasil Kerja (8 cols) -->
    <div class="lg:col-span-8 space-y-5">
      <!-- Card: Tahapan Seleksi Table -->
      <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-[#101B35] font-heading">Tahapan Seleksi</h3>
          <span class="text-[11px] text-[#68738A]">5 Oktober 2026</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-[#E5E8EF] text-[10px] uppercase font-bold text-[#68738A]">
                <th class="py-2.5 pr-4">TAHAPAN</th>
                <th class="py-2.5 px-3">MAHASISWA</th>
                <th class="py-2.5 px-3">PENILAIAN ALUMNI</th>
                <th class="py-2.5 pl-3 text-right">TENGGAT</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5E8EF]">
              <!-- Row 1: 01 Test Psikolog -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#101B35]">01 · Test Psikologi</p>
                  <p class="text-[11px] text-[#68738A] mt-0.5">Psikologi dan penilaian kepribadian</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/20">
                    Selesai
                  </span>
                  <p class="text-[9px] text-[#68738A] mt-0.5">Dikirim 6 Okt - 16.20</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold text-[#20283B]">Sudah dinilai</span>
                  <p class="text-[10px] font-bold text-[#3157D5] mt-0.5">Nilai 80 / 100</p>
                </td>
                <td class="py-3.5 pl-3 text-right text-[#68738A] font-medium">
                  6 Okt
                </td>
              </tr>

              <!-- Row 2: 02 Test Bidang -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#101B35]">02 · Test Bidang</p>
                  <p class="text-[11px] text-[#68738A] mt-0.5">JavaScript & logika pemrograman - 45 menit</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Sedang dikerjakan
                  </span>
                  <p class="text-[9px] text-[#68738A] mt-0.5">Dikirim 8 Okt - 08.00</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] text-[#68738A] font-medium">Belum dinilai</span>
                  <p class="text-[9px] text-[#68738A] mt-0.5">Setelah tes dikirim</p>
                </td>
                <td class="py-3.5 pl-3 text-right text-[#68738A] font-medium">
                  9 Okt
                </td>
              </tr>

              <!-- Row 3: 03 Mini Project -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#101B35]">03 · Mini Project</p>
                  <p class="text-[11px] text-[#68738A] mt-0.5">Pembuatan aplikasi dasar ringan</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold text-[#68738A] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E8EF]">
                    Belum dibuka
                  </span>
                  <p class="text-[9px] text-[#68738A] mt-0.5">Tahap belum dibuka</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] text-[#68738A]">Belum dinilai</span>
                </td>
                <td class="py-3.5 pl-3 text-right text-[#68738A] font-medium">
                  12 Okt
                </td>
              </tr>

              <!-- Row 4: 04 Interview Online -->
              <tr>
                <td class="py-3.5 pr-4">
                  <p class="font-extrabold text-[#101B35]">04 · Interview Online</p>
                  <p class="text-[11px] text-[#68738A] mt-0.5">Tahap akhir tes wawancara</p>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] font-bold text-[#68738A] bg-[#F7F6F2] px-2 py-0.5 rounded border border-[#E5E8EF]">
                    Belum dibuka
                  </span>
                </td>
                <td class="py-3.5 px-3">
                  <span class="text-[10px] text-[#68738A]">Belum dinilai</span>
                </td>
                <td class="py-3.5 pl-3 text-right text-[#68738A] font-medium">
                  1 Nov
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card: Kiriman & hasil kerjamu -->
      <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black text-[#101B35] font-heading">Kiriman & Hasil Kerjamu</h3>
          <span class="text-[11px] text-[#68738A] font-semibold">2 dokumen</span>
        </div>

        <!-- File attachment item -->
        <div class="p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E8EF] flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <FileText class="w-5 h-5 text-[#3157D5] shrink-0" />
            <div class="min-w-0">
              <p class="text-xs font-extrabold text-[#101B35] truncate">MiniProject_Maulana.zip</p>
              <p class="text-[10px] text-[#68738A] truncate mt-0.5">ZIP · 2.8 MB · Dikirim 6 Okt 2026 · Versi 1</p>
            </div>
          </div>
          <button 
            type="button"
            class="p-2 text-[#68738A] hover:text-[#101B35] hover:bg-white rounded-lg transition"
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
          class="inline-flex items-center gap-1 text-xs font-bold text-[#3157D5] hover:underline"
        >
          <span>github.com/maulana/</span>
          <ArrowUpRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>

    <!-- RIGHT COLUMN: Tahap 4 Card & Umpan Balik Mentor (4 cols) -->
    <div class="lg:col-span-4 space-y-5">
      <!-- Card: TAHAP · 4 -->
      <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
        <span class="text-[10px] font-black uppercase tracking-wider text-[#3157D5]">
          TAHAP · 4
        </span>
        <h4 class="text-base font-black text-[#101B35] font-heading">
          Persiapkan untuk tahap ini
        </h4>
        <p class="text-xs text-[#68738A] leading-relaxed">
          Tahap akhir tes untuk menyeleksi mahasiswa secara langsung bersama mentor industri.
        </p>
        <button 
          type="button"
          class="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition flex items-center justify-center gap-2 shadow-xs touch-manipulation"
        >
          <span>1 November</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Card: Umpan balik mentor -->
      <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
        <h4 class="text-sm font-black text-[#101B35] font-heading">
          Umpan Balik Mentor
        </h4>
        <p class="text-xs text-[#20283B] leading-relaxed italic">
          "Pengerjaan mini project menunjukkan pemahaman dasar yang baik pada arsitektur web modern. Tetap pertahankan kerapian struktur kode dan siap untuk simulasi interview."
        </p>

        <!-- Mentor profile footer -->
        <div class="flex items-center gap-2.5 pt-2 border-t border-[#E5E8EF]">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
            alt="Maulana Chrysant" 
            class="w-8 h-8 rounded-full object-cover ring-1 ring-[#3157D5]/20"
          />
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold text-[#101B35] truncate">Maulana Chrysant</p>
            <p class="text-[10px] text-[#68738A] truncate">Senior Software Engineer · Google</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Footer -->
  <div class="pt-8 border-t border-[#E5E8EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#68738A]">
    <p>© 2026 UT REKA · Universitas Terbuka</p>
    <div class="flex items-center gap-4">
      <a href="/privasi-syarat" class="hover:text-[#101B35] transition">Kebijakan privasi</a>
      <span>·</span>
      <a href="/panduan" class="hover:text-[#101B35] transition">Panduan komunitas</a>
    </div>
  </div>
</div>
