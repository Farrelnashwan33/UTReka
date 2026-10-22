<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { 
    Search, 
    ArrowUpRight, 
    Check, 
    X, 
    Clock, 
    Link2, 
    Briefcase, 
    MessageSquare, 
    User,
    ArrowLeft
  } from 'lucide-svelte';

  let activeTab = $state<'tawaran' | 'pengajuan' | 'riwayat' | 'forum'>('tawaran');
  let searchQuery = $state('');

  // Mock list matching Image 3
  let connectionOffers = $state([
    {
      id: 'req-1',
      name: 'Tasya Angelicia Tenggara',
      initials: 'TAT',
      graduation: 'Alumni UT · Angkatan 2026',
      tag: 'Relasi',
      date: '2 Okt · 09.20',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      ika: '123456781',
      angkatan: '2026',
      pekerjaan: 'Associate Product Manager - GoTo',
      latarBelakang: 'Fokus pada manajemen produk digital, user research, dan akselerasi fitur platform di ekosistem GoTo.',
      skills: ['Product Management', 'Data Analysis', 'Scrum', 'UI/UX'],
      alasan: 'Ingin berbagi wawasan dan studi kasus nyata seputar manajemen produk digital serta membuka peluang networking bagi mahasiswa UT.',
      status: 'pending'
    },
    {
      id: 'req-2',
      name: 'Azdzikri Muhammad Hisyam Soleh',
      initials: 'AMH',
      graduation: 'Alumni UT · Angkatan 2025',
      tag: 'Relasi',
      date: '2 Okt · 08.45',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      ika: '123456782',
      angkatan: '2025',
      pekerjaan: 'Cloud & DevOps Specialist - Telkom',
      latarBelakang: 'Praktisi IT infrastruktur dan cloud automation dengan fokus pada pipeline CI/CD serta high-availability architecture.',
      skills: ['Cloud Computing', 'Docker', 'Kubernetes', 'Linux'],
      alasan: 'Membuka bimbingan mengenai persiapan sertifikasi IT global dan kesiapan masuk dunia profesional.',
      status: 'pending'
    },
    {
      id: 'req-3',
      name: 'Maulana Chrysant',
      initials: 'MC',
      graduation: 'Alumni UT · Angkatan 2024',
      tag: 'Relasi',
      date: '1 Okt · 16.30',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      ika: '123456783',
      angkatan: '2024',
      pekerjaan: 'Senior Software Engineer - Google',
      latarBelakang: 'Alumni Sistem Informasi UT yang aktif dalam perancangan distributed systems dan skalabilitas web modern di Google.',
      skills: ['TypeScript', 'Distributed Systems', 'Cloud Architecture'],
      alasan: 'Ingin membuka kesempatan mentoring teknis dan berbagi kiat menembus tech giant bagi mahasiswa berpotensi.',
      status: 'pending'
    },
    {
      id: 'req-4',
      name: 'Keisha Refanaura Hakim',
      initials: 'KRH',
      graduation: 'Alumni UT · Angkatan 2025',
      tag: 'Relasi',
      date: '30 Sep',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      ika: '123456784',
      angkatan: '2025',
      pekerjaan: 'Data Analyst & BI Lead - Bank Mandiri',
      latarBelakang: 'Spesialis data analytics, business intelligence dashboard, dan predictive modeling untuk perbankan nasional.',
      skills: ['SQL', 'Python', 'Power BI', 'Financial Analytics'],
      alasan: 'Membuka bimbingan pemodelan data industri finansial dan studi kasus analitik terapan.',
      status: 'pending'
    },
    {
      id: 'req-5',
      name: 'Akhmad Farrel Nashwan',
      initials: 'AFN',
      graduation: 'Alumni UT · Angkatan 2025',
      tag: 'Relasi',
      date: '29 Sep',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      ika: '123456785',
      angkatan: '2025',
      pekerjaan: 'Fullstack & AI Solutions Engineer - BCA',
      latarBelakang: 'Mengembangkan arsitektur digital banking modern dan integrasi solusi AI cerdas untuk layanan nasabah terpadu.',
      skills: ['Fullstack Web', 'AI Systems', 'System Design', 'Cyber Security'],
      alasan: 'Membuka peluang kolaborasi proyek riil serta berbagi insight persiapan karier engineering kelas enterprise.',
      status: 'pending'
    }
  ]);

  let selectedOfferId = $state<string>('req-1');
  let selectedOffer = $derived(
    connectionOffers.find(o => o.id === selectedOfferId) || connectionOffers[0]
  );

  let filteredOffers = $derived(
    connectionOffers.filter(o => {
      if (!searchQuery) return true;
      return o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             o.pekerjaan.toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  // Mobile detail view toggle
  let showMobileDetail = $state(false);

  function handleAcceptOffer(id: string) {
    const item = connectionOffers.find(o => o.id === id);
    if (item) {
      item.status = 'accepted';
      toastStore.success(`Koneksi dengan ${item.name} berhasil diterima!`);
    }
  }

  function handleRejectOffer(id: string) {
    const item = connectionOffers.find(o => o.id === id);
    if (item) {
      item.status = 'rejected';
      toastStore.info(`Permintaan koneksi dari ${item.name} ditolak.`);
    }
  }
</script>

<svelte:head>
  <title>Ruang Koneksi | UT REKA</title>
</svelte:head>

<div class="space-y-6">
  <!-- Top Heading Section -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="space-y-1">
      <span class="text-xs font-bold text-[#3157D5] uppercase tracking-wider">
        Relasi baru, potensi baru
      </span>
      <h1 class="text-2xl sm:text-3xl font-black text-[#101B35] font-heading tracking-tight">
        Satu Komunikasi, Satu Relasi.
      </h1>
      <p class="text-xs sm:text-sm text-[#68738A]">
        Kenali Alumni dan bangun relasi karier profesional bersama Anda
      </p>
    </div>

    <span class="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/20 self-start sm:self-center">
      4 permintaan baru
    </span>
  </div>

  <!-- Navigation Tabs -->
  <div class="flex items-center gap-6 border-b border-[#E5E8EF] text-xs font-bold text-[#68738A] overflow-x-auto no-scrollbar">
    <button 
      type="button"
      onclick={() => activeTab = 'tawaran'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'tawaran' ? 'text-[#101B35] border-b-2 border-[#3157D5] font-black' : 'hover:text-[#101B35]'}"
    >
      Tawaran Relasi (10)
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'pengajuan'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'pengajuan' ? 'text-[#101B35] border-b-2 border-[#3157D5] font-black' : 'hover:text-[#101B35]'}"
    >
      Pengajuan Peluang (3)
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'riwayat'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'riwayat' ? 'text-[#101B35] border-b-2 border-[#3157D5] font-black' : 'hover:text-[#101B35]'}"
    >
      Riwayat Permintaan
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'forum'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'forum' ? 'text-[#101B35] border-b-2 border-[#3157D5] font-black' : 'hover:text-[#101B35]'}"
    >
      Forum Chat
    </button>
  </div>

  <!-- Main 2-Column Split Master-Detail Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- LEFT COLUMN: Search & Connection Request Items List -->
    <div class="lg:col-span-5 space-y-4 {showMobileDetail ? 'hidden lg:block' : 'block'}">
      <!-- Search Input -->
      <div class="relative">
        <Search class="w-4 h-4 text-[#68738A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="search"
          bind:value={searchQuery}
          placeholder="Cari nama alumni atau profesi..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-xs text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 placeholder-[#68738A]/60 transition"
        />
      </div>

      <!-- List of Connection Offer Cards -->
      <div class="space-y-2.5">
        {#each filteredOffers as offer}
          <button 
            type="button"
            onclick={() => {
              selectedOfferId = offer.id;
              showMobileDetail = true;
            }}
            class="w-full p-4 rounded-2xl border text-left transition flex items-start gap-3 touch-manipulation
              {selectedOfferId === offer.id 
                ? 'bg-[#EEF2FF]/80 border-[#3157D5] shadow-xs' 
                : 'bg-white border-[#E5E8EF] hover:bg-[#F7F6F2]'}"
          >
            {#if offer.avatar}
              <img 
                src={offer.avatar} 
                alt={offer.name} 
                class="w-10 h-10 rounded-full object-cover ring-1 ring-[#3157D5]/20 shrink-0"
              />
            {:else}
              <div class="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-xs text-[#3157D5] shrink-0 border border-[#3157D5]/15">
                {offer.initials || offer.name.slice(0, 2).toUpperCase()}
              </div>
            {/if}

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <h4 class="text-xs font-black text-[#101B35] truncate">{offer.name}</h4>
                <span class="text-[10px] text-[#68738A] shrink-0">{offer.date}</span>
              </div>
              <p class="text-[11px] text-[#68738A] truncate mt-0.5">{offer.graduation}</p>
              <div class="mt-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/15">
                  {offer.tag}
                </span>
              </div>
            </div>
          </button>
        {/each}
      </div>

      <p class="text-xs text-[#68738A] pt-2">
        Menampilkan {filteredOffers.length} permintaan · 4 belum ditanggapi
      </p>
    </div>

    <!-- RIGHT COLUMN: Detail Pane for Selected Request -->
    <div class="lg:col-span-7 {showMobileDetail ? 'block' : 'hidden lg:block'}">
      <!-- Mobile back button to list -->
      <div class="lg:hidden mb-3">
        <button 
          type="button"
          onclick={() => showMobileDetail = false}
          class="inline-flex items-center gap-1.5 text-xs font-bold text-[#68738A] hover:text-[#101B35] py-1"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Kembali ke Daftar Permintaan</span>
        </button>
      </div>

      {#if selectedOffer}
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-6">
          <!-- Card Header -->
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#68738A]">
              PERMINTAAN RELASI · 2 OKT 2026
            </span>
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/15">
              Menunggu tanggapan Anda
            </span>
          </div>

          <!-- Alumni Target Info -->
          <div class="flex items-start gap-4">
            {#if selectedOffer.avatar}
              <img 
                src={selectedOffer.avatar} 
                alt={selectedOffer.name} 
                class="w-16 h-16 rounded-full object-cover ring-2 ring-[#3157D5]/20 shrink-0"
              />
            {:else}
              <div class="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center font-bold text-base text-[#3157D5] shrink-0 border border-[#3157D5]/20">
                {selectedOffer.initials || selectedOffer.name.slice(0, 2).toUpperCase()}
              </div>
            {/if}

            <div class="min-w-0 flex-1 space-y-1">
              <h3 class="text-lg sm:text-xl font-black text-[#101B35] font-heading">{selectedOffer.name}</h3>
              <p class="text-xs text-[#68738A]">{selectedOffer.graduation}</p>
              <a 
                href="/dashboard/student"
                class="inline-flex items-center gap-0.5 text-xs font-bold text-[#3157D5] hover:underline pt-0.5"
              >
                <span>Lihat profil Alumni</span>
                <ArrowUpRight class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- 3 Columns Metadata: IKA, Angkatan, Pekerjaan -->
          <div class="grid grid-cols-3 gap-4 py-4 border-y border-[#E5E8EF] text-xs">
            <div>
              <span class="text-[#68738A] text-[11px]">IKA</span>
              <p class="font-bold text-[#101B35] mt-0.5">{selectedOffer.ika}</p>
            </div>
            <div>
              <span class="text-[#68738A] text-[11px]">Angkatan</span>
              <p class="font-bold text-[#101B35] mt-0.5">{selectedOffer.angkatan}</p>
            </div>
            <div>
              <span class="text-[#68738A] text-[11px]">Pekerjaan</span>
              <p class="font-bold text-[#101B35] mt-0.5">{selectedOffer.pekerjaan}</p>
            </div>
          </div>

          <!-- Latar Belakang & Skills -->
          <div class="space-y-2 text-xs">
            <h4 class="font-extrabold text-[#101B35]">Latar Belakang</h4>
            <p class="text-[#20283B] leading-relaxed">
              {selectedOffer.latarBelakang}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              {#each selectedOffer.skills as sk}
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/15">
                  {sk}
                </span>
              {/each}
            </div>
          </div>

          <!-- Alasan ingin berelasi? Box -->
          <div class="p-4 sm:p-5 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] space-y-1.5 text-xs">
            <h4 class="font-extrabold text-[#101B35]">Alasan ingin berelasi?</h4>
            <p class="text-[#20283B] leading-relaxed">
              {selectedOffer.alasan}
            </p>
          </div>

          <!-- Actions at bottom right -->
          <div class="pt-2 flex items-center justify-end gap-3">
            {#if selectedOffer.status === 'accepted'}
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#3157D5] bg-[#EEF2FF] border border-[#3157D5]/20 px-4 py-2 rounded-xl">
                <Check class="w-4 h-4" />
                <span>Koneksi Diterima</span>
              </span>
            {:else if selectedOffer.status === 'rejected'}
              <span class="text-xs font-bold text-[#68738A] px-4 py-2">
                Permintaan Ditolak
              </span>
            {:else}
              <button 
                type="button"
                onclick={() => handleRejectOffer(selectedOffer.id)}
                class="px-5 py-2.5 rounded-xl border border-[#E5E8EF] text-xs font-bold text-[#68738A] hover:bg-[#F7F6F2] hover:text-[#101B35] transition touch-manipulation"
              >
                Tolak
              </button>
              <button 
                type="button"
                onclick={() => handleAcceptOffer(selectedOffer.id)}
                class="px-6 py-2.5 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition flex items-center gap-1.5 shadow-xs touch-manipulation"
              >
                <span>Terima koneksi</span>
                <Check class="w-3.5 h-3.5" />
              </button>
            {/if}
          </div>
        </div>
      {/if}
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
