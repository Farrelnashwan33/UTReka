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
      name: 'Kenzi Putra Petir',
      graduation: 'Alumni UT · Angkatan 2022',
      tag: 'Relasi',
      date: '2 Okt · 09.20',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      ika: '123456789',
      angkatan: '2022',
      pekerjaan: 'Software Engineer - Google',
      latarBelakang: 'Alumni S1 Sistem Informasi yang aktif berkontribusi dalam arsitektur distributed systems dan pengembangan software modern di perusahaan teknologi.',
      skills: ['Graphic Design', 'Video Editor', 'UI/UX'],
      alasan: 'Ingin membuka kesempatan mentoring dan berbagi peluang kerja sama proyek nyata bagi adik tingkat UT yang memiliki komitmen dan semangat berkembang.',
      status: 'pending'
    },
    {
      id: 'req-2',
      name: 'Tasya Angelicia',
      initials: 'TA',
      graduation: 'Alumni UT · Angkatan 2026',
      tag: 'Relasi',
      date: '2 Okt · 08.45',
      avatar: '',
      ika: '123456788',
      angkatan: '2026',
      pekerjaan: 'Associate Product Manager',
      latarBelakang: 'Fokus pada manajemen produk digital, riset pengguna, dan kolaborasi tim lintas disiplin ilmu di industri startup.',
      skills: ['Product Management', 'Data Analysis', 'Scrum'],
      alasan: 'Tertarik mendiskusikan studi kasus manajemen produk dan berbagi pengalaman magang bagi rekan mahasiswa.',
      status: 'pending'
    },
    {
      id: 'req-3',
      name: 'Azdzikri Muhammad',
      initials: 'AM',
      graduation: 'Alumni UT · Angkatan 2026',
      tag: 'Relasi',
      date: '1 Okt · 16.30',
      avatar: '',
      ika: '123456787',
      angkatan: '2026',
      pekerjaan: 'IT Support & DevOps Specialist',
      latarBelakang: 'Praktisi IT infrastruktur dengan keahlian otomatisasi pipeline deployment dan sistem jaringan.',
      skills: ['Linux', 'Docker', 'Networking'],
      alasan: 'Ingin terhubung untuk bertukar pandangan seputar sertifikasi IT global dan persiapan karier industri.',
      status: 'pending'
    },
    {
      id: 'req-4',
      name: 'Uchiha Sasuke',
      initials: 'US',
      graduation: 'Alumni UT · Angkatan 2024',
      tag: 'Relasi',
      date: '30 Sep',
      avatar: '',
      ika: '123456786',
      angkatan: '2024',
      pekerjaan: 'Security Analyst',
      latarBelakang: 'Spesialis vulnerability assessment dan audit keamanan aplikasi web.',
      skills: ['Cyber Security', 'Pen Testing'],
      alasan: 'Membuka bimbingan mengenai etika keamanan siber dan simulasi pengerjaan studi kasus.',
      status: 'pending'
    },
    {
      id: 'req-5',
      name: 'Monkey D Luffy',
      initials: 'MDL',
      graduation: 'Alumni UT · Angkatan 2021',
      tag: 'Relasi',
      date: '29 Sep',
      avatar: '',
      ika: '123456785',
      angkatan: '2021',
      pekerjaan: 'Operations Lead - E-Commerce',
      latarBelakang: 'Mengelola operasional rantai pasok dan logistik skala nasional.',
      skills: ['Supply Chain', 'Operations'],
      alasan: 'Berbagi wawasan mengenai ekosistem logistik modern dan peluang magang operasional.',
      status: 'pending'
    },
    {
      id: 'req-6',
      name: 'Kisuke Urahara',
      initials: 'KU',
      graduation: 'Alumni UT · Angkatan 2020',
      tag: 'Relasi',
      date: '10 Sep',
      avatar: '',
      ika: '123456784',
      angkatan: '2020',
      pekerjaan: 'Senior Tech Consultant',
      latarBelakang: 'Konsultan transformasi digital untuk institusi perbankan dan korporasi multinasional.',
      skills: ['Consulting', 'Architecture'],
      alasan: 'Memberikan arahan persiapan interview teknis tingkat lanjut.',
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
  <!-- Top Heading Section (Image 3) -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="space-y-1">
      <span class="text-xs font-semibold text-[#C2410C]">
        Relasi baru, potensi baru
      </span>
      <h1 class="text-2xl sm:text-3xl font-black text-[#183153] font-serif tracking-tight">
        Satu Komunikasi, Satu Relasi.
      </h1>
      <p class="text-xs sm:text-sm text-gray-500">
        Kenali Alumni dan buat Relasi dengan Anda
      </p>
    </div>

    <span class="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 self-start sm:self-center">
      4 permintaan baru
    </span>
  </div>

  <!-- Navigation Tabs (Image 3: Tawaran Relasi, Pengajuan Peluang, Riwayat Permintaan, Forum Chat) -->
  <div class="flex items-center gap-6 border-b border-[#E7E5E0] text-xs font-bold text-gray-500 overflow-x-auto no-scrollbar">
    <button 
      type="button"
      onclick={() => activeTab = 'tawaran'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'tawaran' ? 'text-[#183153] border-b-2 border-[#183153] font-black' : 'hover:text-black'}"
    >
      Tawaran Relasi (10)
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'pengajuan'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'pengajuan' ? 'text-[#183153] border-b-2 border-[#183153] font-black' : 'hover:text-black'}"
    >
      Pengajuan Peluang (3)
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'riwayat'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'riwayat' ? 'text-[#183153] border-b-2 border-[#183153] font-black' : 'hover:text-black'}"
    >
      Riwayat Permintaan
    </button>
    <button 
      type="button"
      onclick={() => activeTab = 'forum'}
      class="pb-3 whitespace-nowrap transition {activeTab === 'forum' ? 'text-[#183153] border-b-2 border-[#183153] font-black' : 'hover:text-black'}"
    >
      Forum Chat
    </button>
  </div>

  <!-- Main 2-Column Split Master-Detail Layout (Image 3) -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- LEFT COLUMN: Search & Connection Request Items List (4 or 5 cols) -->
    <div class="lg:col-span-5 space-y-4 {showMobileDetail ? 'hidden lg:block' : 'block'}">
      <!-- Search Input (Image 3) -->
      <div class="relative">
        <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="search"
          bind:value={searchQuery}
          placeholder="Cari nama"
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E5E0] bg-white text-xs outline-none focus:border-[#183153] placeholder-gray-400"
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
                ? 'bg-[#FFD43B]/20 border-[#FFD43B] shadow-xs' 
                : 'bg-white border-[#E7E5E0] hover:bg-[#FAF9F6]'}"
          >
            {#if offer.avatar}
              <img 
                src={offer.avatar} 
                alt={offer.name} 
                class="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
              />
            {:else}
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-700 shrink-0">
                {offer.initials || offer.name.slice(0, 2).toUpperCase()}
              </div>
            {/if}

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <h4 class="text-xs font-black text-[#183153] truncate">{offer.name}</h4>
                <span class="text-[10px] text-gray-400 shrink-0">{offer.date}</span>
              </div>
              <p class="text-[11px] text-gray-500 truncate mt-0.5">{offer.graduation}</p>
              <div class="mt-2">
                <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {offer.tag}
                </span>
              </div>
            </div>
          </button>
        {/each}
      </div>

      <p class="text-xs text-gray-400 pt-2">
        Menampilkan 13 permintaan · 4 belum ditanggapi
      </p>
    </div>

    <!-- RIGHT COLUMN: Detail Pane for Selected Request (7 cols) -->
    <div class="lg:col-span-7 {showMobileDetail ? 'block' : 'hidden lg:block'}">
      <!-- Mobile back button to list -->
      <div class="lg:hidden mb-3">
        <button 
          type="button"
          onclick={() => showMobileDetail = false}
          class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black py-1"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Kembali ke Daftar Permintaan</span>
        </button>
      </div>

      {#if selectedOffer}
        <div class="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-6">
          <!-- Card Header (Image 3) -->
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              PERMINTAAN RELASI · 2 OKT 2026
            </span>
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Menunggu tanggapan Anda
            </span>
          </div>

          <!-- Alumni Target Info -->
          <div class="flex items-start gap-4">
            {#if selectedOffer.avatar}
              <img 
                src={selectedOffer.avatar} 
                alt={selectedOffer.name} 
                class="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
              />
            {:else}
              <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center font-bold text-base text-gray-700 shrink-0">
                {selectedOffer.initials || selectedOffer.name.slice(0, 2).toUpperCase()}
              </div>
            {/if}

            <div class="min-w-0 flex-1 space-y-1">
              <h3 class="text-lg sm:text-xl font-black text-[#183153] font-heading">{selectedOffer.name}</h3>
              <p class="text-xs text-gray-500">{selectedOffer.graduation}</p>
              <a 
                href="/dashboard/student"
                class="inline-flex items-center gap-0.5 text-xs font-bold text-[#183153] hover:underline pt-0.5"
              >
                <span>Lihat profil Alumni</span>
                <ArrowUpRight class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- 3 Columns Metadata: IKA, Angkatan, Pekerjaan (Image 3) -->
          <div class="grid grid-cols-3 gap-4 py-4 border-y border-[#FAF9F6] text-xs">
            <div>
              <span class="text-gray-400 text-[11px]">IKA</span>
              <p class="font-bold text-[#183153] mt-0.5">{selectedOffer.ika}</p>
            </div>
            <div>
              <span class="text-gray-400 text-[11px]">Angkatan</span>
              <p class="font-bold text-[#183153] mt-0.5">{selectedOffer.angkatan}</p>
            </div>
            <div>
              <span class="text-gray-400 text-[11px]">Pekerjaan</span>
              <p class="font-bold text-[#183153] mt-0.5">{selectedOffer.pekerjaan}</p>
            </div>
          </div>

          <!-- Latar Belakang & Skills (Image 3) -->
          <div class="space-y-2 text-xs">
            <h4 class="font-extrabold text-[#183153]">Latar Belakang</h4>
            <p class="text-gray-600 leading-relaxed">
              {selectedOffer.latarBelakang}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              {#each selectedOffer.skills as sk}
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#FAF9F6] text-gray-700 border border-[#E7E5E0]">
                  {sk}
                </span>
              {/each}
            </div>
          </div>

          <!-- Alasan ingin berelasi? Box (Image 3) -->
          <div class="p-4 sm:p-5 rounded-2xl bg-[#EAF4FF]/70 border border-[#D0E6FF] space-y-1.5 text-xs">
            <h4 class="font-extrabold text-[#183153]">Alasan ingin berelasi?</h4>
            <p class="text-gray-700 leading-relaxed">
              {selectedOffer.alasan}
            </p>
          </div>

          <!-- Actions at bottom right (Image 3) -->
          <div class="pt-2 flex items-center justify-end gap-3">
            {#if selectedOffer.status === 'accepted'}
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">
                <Check class="w-4 h-4" />
                <span>Koneksi Diterima</span>
              </span>
            {:else if selectedOffer.status === 'rejected'}
              <span class="text-xs font-bold text-gray-400 px-4 py-2">
                Permintaan Ditolak
              </span>
            {:else}
              <button 
                type="button"
                onclick={() => handleRejectOffer(selectedOffer.id)}
                class="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition touch-manipulation"
              >
                Tolak
              </button>
              <button 
                type="button"
                onclick={() => handleAcceptOffer(selectedOffer.id)}
                class="px-6 py-2.5 rounded-xl bg-[#183153] text-white text-xs font-bold hover:bg-[#102138] transition flex items-center gap-1.5 shadow-xs touch-manipulation"
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
  <div class="pt-8 border-t border-[#E7E5E0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
    <p>© 2026 UT REKA · Universitas Terbuka</p>
    <div class="flex items-center gap-4">
      <a href="/privasi-syarat" class="hover:text-gray-600 transition">Kebijakan privasi</a>
      <span>·</span>
      <a href="/panduan" class="hover:text-gray-600 transition">Panduan komunitas</a>
    </div>
  </div>
</div>
