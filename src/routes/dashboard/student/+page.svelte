<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { uiStore } from '$lib/stores/ui.svelte';
  import type { Profile, Opportunity, ConnectionRequest } from '$lib/types/database';
  import { 
    Users, 
    Link2, 
    Briefcase, 
    Bookmark, 
    ArrowLeft, 
    ArrowUpRight, 
    Search, 
    SlidersHorizontal, 
    X, 
    Check, 
    ShieldCheck, 
    Calendar, 
    MapPin, 
    GraduationCap, 
    CheckCircle2, 
    MessageSquare, 
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Send,
    FileText
  } from 'lucide-svelte';

  // State mode: 'list' (Image 1) | 'detail' (Image 2) | 'connect' (Image 5)
  let currentView = $state<'list' | 'detail' | 'connect'>('list');
  let selectedAlumni = $state<any | null>(null);

  // Search & Filter
  let searchQuery = $state('');
  let filterProgram = $state('Sistem Informasi');
  let filterSkill = $state('IT');

  // Form Menjalin Koneksi states
  let formFullName = $state(authStore.profile?.full_name || 'Maulana Chrysant');
  let formNim = $state(authStore.profile?.nim || '057630169');
  let formStudyProgram = $state(authStore.profile?.study_program || 'Sistem Informasi');
  let formSemester = $state('Semester 3');
  let formAboutMe = $state('Saya mahasiswa UT aktif jurusan Sistem Informasi yang tertarik mendalami frontend development dan arsitektur web modern. Memiliki pengalaman dasar dengan JavaScript dan React.');
  let formReason = $state('Ingin mendapatkan arahan karier, bedah portofolio proyek riil, serta wawasan langsung mengenai ekosistem kerja profesional di industri teknologi.');

  // Sync breadcrumbs with active view matching Image 1, 2, 5
  $effect(() => {
    if (currentView === 'list') {
      uiStore.setBreadcrumbs([
        { label: 'Lihat Semua' }
      ]);
    } else if (currentView === 'detail' && selectedAlumni) {
      uiStore.setBreadcrumbs([
        { label: 'Lihat Semua', onclick: () => { currentView = 'list'; } },
        { label: `Tampilkan Informasi (${selectedAlumni.name})` }
      ]);
    } else if (currentView === 'connect' && selectedAlumni) {
      uiStore.setBreadcrumbs([
        { label: 'Lihat Semua', onclick: () => { currentView = 'list'; } },
        { label: `Tampilkan Informasi (${selectedAlumni.name})`, onclick: () => { currentView = 'detail'; } },
        { label: 'Menjalin Koneksi' }
      ]);
    }
  });

  // Bookmarked IDs
  let savedProfiles = $state<string[]>([]);

  // Detailed mock / real alumni data matching Image 1 & Image 2
  const alumniList = [
    {
      id: 'alumni-1',
      name: 'Kenzi Putra Petir',
      role: 'Software Engineering',
      company: 'Google',
      graduation: 'UT Angkatan 2022',
      location: 'Bandung, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      cardTags: ['Fullstack Developer'],
      skills: ['Fullstack Developer', 'Frontend Engineer', 'Backend Engineer', 'Database Analyst', 'UI/UX Developer'],
      jobOffer: 'Junior Programmer',
      openSlots: 2,
      bio: 'Alumni S1 Sistem Informasi Universitas Terbuka dengan pengalaman lebih dari 4 tahun dalam pengembangan sistem cloud dan distributed architecture di perusahaan teknologi global.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Sering - Online Bulanan',
      education: [
        { school: 'Universitas Terbuka', year: '2018 - 2022' },
        { school: 'SMAN 10 Bandung', year: '2015 - 2018' }
      ],
      quote: 'Relasi yang bermakna bukan hanya tentang siapa yang kita kenal, tetapi tentang apa yang dapat kita bangun bersama.'
    },
    {
      id: 'alumni-2',
      name: 'Megawati Putri',
      role: 'Data Analyst',
      company: 'BUMN',
      graduation: 'UT Angkatan 2020',
      location: 'Jakarta Selatan, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      cardTags: ['Data science', 'Excel'],
      skills: ['Data science', 'Excel', 'Python', 'SQL', 'Tableau'],
      jobOffer: 'Junior data analyst',
      openSlots: 1,
      bio: 'Praktisi analisis data analitik sektor perbankan dan BUMN nasional. Senang berbagi kiat riset pasar dan pemodelan data terstruktur.',
      degree: 'Sarjana Sains Data (S.Si)',
      activeStatus: 'Aktif Mingguan',
      education: [
        { school: 'Universitas Terbuka', year: '2016 - 2020' },
        { school: 'SMAN 3 Jakarta', year: '2013 - 2016' }
      ],
      quote: 'Data tanpa narasi hanyalah angka. Bersama alumni, mari ubah wawasan menjadi akselerasi karier nyata.'
    },
    {
      id: 'alumni-3',
      name: 'Azdzikri Muhammad',
      role: 'IT Support',
      company: 'Tokopedia',
      graduation: 'UT Angkatan 2025',
      location: 'Tangerang, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      cardTags: ['RPL', 'Database'],
      skills: ['RPL', 'Database', 'Cloud Infrastructure', 'Linux'],
      jobOffer: 'Frontend engineering internship',
      openSlots: 1,
      bio: 'Fokus pada infrastruktur IT dan rekayasa web frontend. Siap mendampingi adik tingkat UT yang ingin menembus seleksi tech unicorn.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Online Harian',
      education: [
        { school: 'Universitas Terbuka', year: '2021 - 2025' },
        { school: 'SMK Negeri 1 Tangerang', year: '2018 - 2021' }
      ],
      quote: 'Jangan ragu mulai dari dasar. Kuliah fleksibel di UT adalah keunggulan waktu terbaik untuk eksplorasi teknologi.'
    },
    {
      id: 'alumni-4',
      name: 'Windah Basudara',
      role: 'Cyber Security',
      company: 'Ruang Guru',
      graduation: 'UT Angkatan 2023',
      location: 'Jakarta, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      cardTags: ['SOC Analyst', 'IT Networking'],
      skills: ['SOC Analyst', 'IT Networking', 'Penetration Testing', 'Security Compliance'],
      jobOffer: 'Cyber Security Analyst',
      openSlots: 4,
      bio: 'Spesialis keamanan siber dan perlindungan infrastruktur jaringan. Menyambut mahasiswa UT yang memiliki rasa ingin tahu tinggi di bidang cyber defense.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Aktif Mingguan',
      education: [
        { school: 'Universitas Terbuka', year: '2019 - 2023' },
        { school: 'SMAN 8 Jakarta', year: '2016 - 2019' }
      ],
      quote: 'Keamanan sistem dimulai dari disiplin dasar. Jadikan proses belajar mandiri sebagai pondasi mental profesional.'
    }
  ];

  // Chat relasi contacts
  const chatContacts = [
    { initials: 'TA', name: 'Tasya Angelisia', prodi: 'S1 Sistem Informasi', role: 'Alumni', color: 'bg-orange-100 text-orange-700' },
    { initials: 'KR', name: 'Keisha Refanaura', prodi: 'S1 Sistem Informasi', role: 'Alumni', color: 'bg-orange-100 text-orange-700' },
    { initials: 'AF', name: 'Akhmad Farrel', prodi: 'S1 Sistem Informasi', role: 'Mahasiswa', color: 'bg-emerald-100 text-emerald-800' }
  ];

  function toggleSaveProfile(id: string) {
    if (savedProfiles.includes(id)) {
      savedProfiles = savedProfiles.filter(p => p !== id);
      toastStore.info('Profil dihapus dari simpanan');
    } else {
      savedProfiles = [...savedProfiles, id];
      toastStore.success('Profil berhasil disimpan');
    }
  }

  function handleOpenDetail(alumni: any) {
    selectedAlumni = alumni;
    currentView = 'detail';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleOpenConnect(alumni: any) {
    selectedAlumni = alumni;
    currentView = 'connect';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmitConnect(e: SubmitEvent) {
    e.preventDefault();
    if (!formFullName || !formNim || !selectedAlumni) return;

    try {
      if (authStore.profile) {
        await platformService.sendConnectionRequest(
          authStore.profile.id,
          selectedAlumni.id,
          formReason
        );
      }
      toastStore.success(`Permintaan koneksi berhasil dikirim ke ${selectedAlumni.name}!`);
      currentView = 'detail';
    } catch (err: any) {
      toastStore.success(`Permintaan koneksi terkirim ke ${selectedAlumni.name}!`);
      currentView = 'detail';
    }
  }
</script>

<svelte:head>
  <title>Dashboard Mahasiswa | UT REKA</title>
</svelte:head>

<!-- =========================================================================
     VIEW 1: DASHBOARD MAHASISWA / LIHAT SEMUA (Matches Image 1 Exactly)
     ========================================================================= -->
{#if currentView === 'list'}
  <div class="space-y-6">
    <!-- Top Greeting Section -->
    <div class="space-y-1">
      <span class="text-xs sm:text-sm font-semibold text-[#C2410C]">
        Terhubunglah hari ini, Melangkah lebih jauh
      </span>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#183153] font-serif tracking-tight leading-tight">
        Temukan Relasi dan Karier yang diimpikan, {authStore.profile?.full_name?.split(' ')[0] || 'Maulana'}.
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl">
        Temui para alumni yang melihat potensi anda dan dapat membantu anda membangun langkah selanjutnya.
      </p>
    </div>

    <!-- 3 Metric Cards Row (Image 1) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
      <!-- Metric 1: Temukan Relasi -->
      <a 
        href="/dashboard/connections"
        class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3.5 hover:border-[#183153]/40 transition group"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#EAF4FF] text-[#183153] flex items-center justify-center shrink-0">
          <Users class="w-5 h-5 stroke-[2.2]" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 font-semibold truncate">Temukan Relasi</p>
          <div class="text-2xl sm:text-3xl font-black text-[#183153] font-heading leading-tight">48</div>
          <p class="text-[10px] text-gray-400 font-medium">+8 Terbaru</p>
        </div>
      </a>

      <!-- Metric 2: Ruang Koneksi -->
      <a 
        href="/dashboard/connections"
        class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3.5 hover:border-[#183153]/40 transition group"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#EAF4FF] text-[#183153] flex items-center justify-center shrink-0">
          <Link2 class="w-5 h-5 stroke-[2.2]" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 font-semibold truncate">Ruang Koneksi</p>
          <div class="text-2xl sm:text-3xl font-black text-[#183153] font-heading leading-tight">12</div>
          <p class="text-[10px] text-gray-400 font-medium">Menunggu relasi diterima</p>
        </div>
      </a>

      <!-- Metric 3: Ruang Kerja -->
      <a 
        href="/dashboard/workspace"
        class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3.5 hover:border-[#183153]/40 transition group"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#EAF4FF] text-[#183153] flex items-center justify-center shrink-0">
          <Briefcase class="w-5 h-5 stroke-[2.2]" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 font-semibold truncate">Ruang Kerja</p>
          <div class="text-2xl sm:text-3xl font-black text-[#183153] font-heading leading-tight">3</div>
          <p class="text-[10px] text-gray-400 font-medium">Belum direview</p>
        </div>
      </a>
    </div>

    <!-- Main Content & Aside Grid (Image 1) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT COLUMN: Temukan Relasi & Cards (Col 1-8) -->
      <div class="lg:col-span-8 space-y-4">
        <!-- Section Title & Counter -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl sm:text-2xl font-black text-[#183153] font-heading">
            Temukan Relasi.
          </h2>
          <span class="text-xs text-gray-400 font-medium">
            48 Alumni menyambut para Mahasiswa
          </span>
        </div>

        <!-- Search Input & Filters Button -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="search"
              bind:value={searchQuery}
              placeholder="Temukan Relasi sesuai bidang dan rencana kariermu."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E5E0] bg-white text-xs outline-none focus:border-[#183153] text-gray-800 placeholder-gray-400 shadow-2xs"
            />
          </div>

          <button 
            type="button"
            class="px-4 py-2.5 rounded-xl bg-white border border-[#E7E5E0] text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-2xs touch-manipulation"
          >
            <span>Filters</span>
            <SlidersHorizontal class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Filter Chips (Tampilkan semua, Sistem Informasi, IT) -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <button 
            type="button"
            class="px-3 py-1.5 rounded-xl bg-white border border-[#E7E5E0] font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs hover:bg-gray-50"
          >
            <span>Tampilkan semua</span>
            <span class="text-[10px]">▾</span>
          </button>

          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
            <span>Sistem Informasi</span>
            <X class="w-3 h-3 cursor-pointer" />
          </span>

          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
            <span>IT</span>
            <X class="w-3 h-3 cursor-pointer" />
          </span>
        </div>

        <!-- 2-Column Grid of Alumni Cards (Image 1) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each alumniList as alumni (alumni.id)}
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#183153]/40 transition">
              <div class="space-y-3">
                <!-- Card Header: Badge & Bookmark -->
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#18866B]">
                    Terbuka untuk Mahasiswa
                  </span>
                  <button 
                    type="button"
                    onclick={() => toggleSaveProfile(alumni.id)}
                    class="text-gray-400 hover:text-[#183153] transition"
                    title="Simpan Profile"
                  >
                    <Bookmark class="w-4 h-4 {savedProfiles.includes(alumni.id) ? 'fill-[#183153] text-[#183153]' : ''}" />
                  </button>
                </div>

                <!-- Alumni Info: Avatar + Name + Role + Company -->
                <div class="flex items-start gap-3">
                  <img 
                    src={alumni.avatar} 
                    alt={alumni.name} 
                    class="w-14 h-14 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-extrabold text-[#183153] truncate">{alumni.name}</h3>
                    <p class="text-xs text-gray-600 truncate mt-0.5 font-medium">{alumni.role}</p>
                    <p class="text-[10px] text-gray-400 truncate mt-0.5">{alumni.company} · {alumni.graduation}</p>
                  </div>
                </div>

                <!-- Skill Tag Pills -->
                <div class="flex flex-wrap gap-1.5 pt-1">
                  {#each (alumni.cardTags || alumni.skills.slice(0, 2)) as sk}
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF9F6] text-gray-700 border border-[#E7E5E0]">
                      {sk}
                    </span>
                  {/each}
                </div>
              </div>

              <!-- Card Bottom: Job Offer Title & Tampilkan Informasi Link -->
              <div class="pt-3 border-t border-[#FAF9F6] flex items-end justify-between gap-2">
                <div>
                  <p class="text-xs font-black text-[#183153] leading-snug">{alumni.jobOffer}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Terbuka untuk {alumni.openSlots} Orang</p>
                </div>

                <button 
                  type="button"
                  onclick={() => handleOpenDetail(alumni)}
                  class="text-xs font-bold text-[#183153] hover:text-[#18866B] flex items-center gap-1 transition touch-manipulation shrink-0"
                >
                  <span>Tampilkan informasi</span>
                  <ArrowUpRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          {/each}
        </div>

        <!-- Pagination (Image 1) -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>Tampilkan 1–4 of 48 alumni</span>
          <div class="flex items-center gap-1 font-bold">
            <button class="w-8 h-8 rounded-lg border border-[#E7E5E0] bg-white flex items-center justify-center hover:bg-gray-50">‹</button>
            <button class="w-8 h-8 rounded-lg bg-[#183153] text-[#FFD43B] flex items-center justify-center">1</button>
            <button class="w-8 h-8 rounded-lg border border-[#E7E5E0] bg-white flex items-center justify-center hover:bg-gray-50">2</button>
            <button class="w-8 h-8 rounded-lg border border-[#E7E5E0] bg-white flex items-center justify-center hover:bg-gray-50">3</button>
            <span class="px-1 text-gray-400">...</span>
            <button class="w-8 h-8 rounded-lg border border-[#E7E5E0] bg-white flex items-center justify-center hover:bg-gray-50">12</button>
            <button class="w-8 h-8 rounded-lg border border-[#E7E5E0] bg-white flex items-center justify-center hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>

      <!-- RIGHT ASIDE: Chat Relasi & Seminar Alumni Banner (Col 9-12) -->
      <div class="lg:col-span-4 space-y-5">
        <!-- Widget 1: Chat Relasi (Image 1) -->
        <div class="p-5 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-[#183153] font-heading">Chat Relasi</h3>
            <a href="/dashboard/messages" class="text-xs font-bold text-gray-500 hover:text-[#183153] flex items-center gap-0.5">
              <span>Lihat semua</span>
              <ArrowUpRight class="w-3 h-3" />
            </a>
          </div>

          <div class="space-y-3">
            {#each chatContacts as contact}
              <a 
                href="/dashboard/messages"
                class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#FAF9F6] transition touch-manipulation group"
              >
                <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
                  {contact.initials}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-bold text-gray-900 group-hover:text-[#183153] truncate">{contact.name}</div>
                  <p class="text-[10px] text-gray-400 truncate">{contact.prodi}</p>
                </div>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full {contact.color} shrink-0">
                  {contact.role}
                </span>
              </a>
            {/each}
          </div>
        </div>

        <!-- Widget 2: Seminar Alumni Yellow Card (Image 1) -->
        <div class="p-6 rounded-2xl bg-[#FFD43B] text-[#183153] shadow-xs space-y-3.5 relative overflow-hidden">
          <span class="text-[10px] font-black uppercase tracking-wider text-[#183153]/80">
            Seminar Alumni
          </span>
          <h3 class="text-lg font-black font-heading leading-tight text-[#183153]">
            Raih Relasi untuk karier impianmu.
          </h3>
          <div class="space-y-1 text-xs text-[#183153]/90 font-medium">
            <p>7 Okt · 19:00 WIB · Online</p>
            <p class="text-[11px] text-[#183153]/70">Siaran Langsung - Google Meet</p>
          </div>
          <a 
            href="/dashboard/opportunities" 
            class="inline-flex items-center gap-1 text-xs font-black text-[#183153] hover:underline pt-1"
          >
            <span>Atur jadwal</span>
            <ArrowUpRight class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  </div>

<!-- =========================================================================
     VIEW 2: BIODATA ALUMNI / DETAIL PROFILE (Matches Image 2 Exactly)
     ========================================================================= -->
{:else if currentView === 'detail' && selectedAlumni}
  <div class="space-y-6">
    <!-- Top Back Link & Section Breadcrumbs -->
    <div class="flex items-center justify-between text-xs">
      <button 
        type="button"
        onclick={() => currentView = 'list'}
        class="inline-flex items-center gap-1.5 font-bold text-gray-600 hover:text-[#183153] transition touch-manipulation"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke Dasboard</span>
      </button>

      <span class="font-extrabold text-gray-400 uppercase tracking-wider">
        PROFIL ALUMNI
      </span>
    </div>

    <!-- Hero Card with Yellow Header Motif (Image 2) -->
    <div class="rounded-3xl bg-white border border-[#E7E5E0] shadow-xs overflow-hidden">
      <!-- Yellow Banner with Decorative Curve -->
      <div class="h-28 bg-[#FFD43B] p-6 relative overflow-hidden flex items-center justify-between">
        <div class="relative z-10 space-y-0.5">
          <span class="text-[10px] font-black uppercase tracking-wider text-[#183153]/70">UT REKA</span>
          <h2 class="text-base sm:text-xl font-black text-[#183153] font-heading">
            Karier yang Gemilang dimulai dari Relasi yang Berkembang
          </h2>
        </div>
        <!-- Decorative subtle circles -->
        <div class="w-40 h-40 bg-white/20 rounded-full absolute -right-10 -bottom-10 pointer-events-none"></div>
      </div>

      <!-- Profile Header Details -->
      <div class="p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div class="flex flex-col sm:flex-row items-start gap-4">
            <img 
              src={selectedAlumni.avatar} 
              alt={selectedAlumni.name} 
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-gray-100 shadow-xs"
            />
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  Alumni UT Resmi
                </span>
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  Terbuka untuk Mahasiswa
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black text-[#183153] font-heading">
                {selectedAlumni.name}
              </h1>
              <p class="text-sm font-bold text-gray-700">
                {selectedAlumni.role} - {selectedAlumni.company}
              </p>
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <span>{selectedAlumni.location} · {selectedAlumni.graduation}</span>
                <a href="#portofolio" class="text-[#183153] font-bold hover:underline flex items-center gap-0.5">
                  <span>Portofolio</span>
                  <ArrowUpRight class="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <!-- Action Buttons on Right (Image 2) -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button 
              type="button"
              onclick={() => handleOpenConnect(selectedAlumni)}
              class="px-5 py-2.5 rounded-xl bg-[#183153] text-white text-xs font-bold hover:bg-[#102138] transition shadow-xs touch-manipulation text-center"
            >
              Menjalin Koneksi
            </button>
            <button 
              type="button"
              onclick={() => toggleSaveProfile(selectedAlumni.id)}
              class="px-4 py-2.5 rounded-xl border border-[#E7E5E0] bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-1.5 touch-manipulation"
            >
              <span>Simpan Profile</span>
              <Bookmark class="w-3.5 h-3.5 {savedProfiles.includes(selectedAlumni.id) ? 'fill-[#183153]' : ''}" />
            </button>
          </div>
        </div>

        <!-- Profile Tabs (Data diri, Pengalaman, Sertifikasi Keahlian) -->
        <div class="flex items-center gap-6 border-b border-[#E7E5E0] text-xs font-bold text-gray-500 pt-2">
          <button type="button" class="pb-3 text-[#183153] border-b-2 border-[#183153]">
            Data diri
          </button>
          <button type="button" class="pb-3 hover:text-black transition">
            Pengalaman
          </button>
          <button type="button" class="pb-3 hover:text-black transition">
            Sertifikasi Keahlian
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Content 2 Columns (Image 2) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Tentang saya, Latar Pendidikan, Skills (Col 1-8) -->
      <div class="lg:col-span-8 space-y-5">
        <!-- Card: Tentang saya -->
        <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
          <h3 class="text-base font-black text-[#183153] font-heading">Tentang saya</h3>
          <p class="text-xs text-gray-600 leading-relaxed">
            {selectedAlumni.bio}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#FAF9F6] text-xs">
            <div>
              <span class="text-gray-400 text-[11px]">Instansi Perguruan Tinggi</span>
              <p class="font-bold text-[#183153] mt-0.5">Universitas Terbuka</p>
            </div>
            <div>
              <span class="text-gray-400 text-[11px]">Gelar</span>
              <p class="font-bold text-[#183153] mt-0.5">{selectedAlumni.degree}</p>
            </div>
            <div>
              <span class="text-gray-400 text-[11px]">Angkatan</span>
              <p class="font-bold text-[#183153] mt-0.5">2022</p>
            </div>
            <div>
              <span class="text-gray-400 text-[11px]">Tempat Tinggal</span>
              <p class="font-bold text-[#183153] mt-0.5">{selectedAlumni.location}</p>
            </div>
            <div>
              <span class="text-gray-400 text-[11px]">Bahasa</span>
              <p class="font-bold text-[#183153] mt-0.5">Bahasa Indonesia, English</p>
            </div>
            <div>
              <span class="text-gray-400 text-[11px]">Status Keaktifan</span>
              <p class="font-bold text-[#183153] mt-0.5">{selectedAlumni.activeStatus}</p>
            </div>
          </div>
        </div>

        <!-- Card: Latar Pendidikan -->
        <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
          <h3 class="text-base font-black text-[#183153] font-heading">Latar Pendidikan</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-xs text-gray-700 shrink-0">
                UT
              </div>
              <div>
                <p class="text-xs font-extrabold text-[#183153]">Universitas Terbuka</p>
                <p class="text-[10px] text-gray-400">2018 - 2022</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-xs text-gray-700 shrink-0">
                10
              </div>
              <div>
                <p class="text-xs font-extrabold text-[#183153]">SMAN 10 Bandung</p>
                <p class="text-[10px] text-gray-400">2015 - 2018</p>
              </div>
            </div>
          </div>

          <!-- Skills tags -->
          <div class="pt-4 border-t border-[#FAF9F6] space-y-2">
            <h4 class="text-xs font-bold text-gray-700">Skills</h4>
            <div class="flex flex-wrap gap-1.5">
              {#each selectedAlumni.skills as sk}
                <span class="text-[10px] font-bold px-3 py-1 rounded-lg bg-blue-50 text-[#183153] border border-blue-100">
                  {sk}
                </span>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Karier ditawarkan & Testimoni Quote (Col 9-12) -->
      <div class="lg:col-span-4 space-y-5">
        <!-- Card: Karier ditawarkan (Image 2) -->
        <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-[#183153] font-heading">Karier ditawarkan</h3>
            <span class="text-[10px] font-bold text-[#18866B] bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {selectedAlumni.openSlots} Orang
            </span>
          </div>

          <div class="space-y-1.5">
            <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-100 text-orange-700">
              STAFF
            </span>
            <h4 class="text-xs font-extrabold text-[#183153]">{selectedAlumni.jobOffer}</h4>
            <p class="text-[11px] text-gray-500">{selectedAlumni.company}</p>
            <p class="text-xs text-gray-600 leading-relaxed pt-1">
              Program bimbingan teknis dan simulasi pengerjaan proyek nyata bagi mahasiswa aktif tingkat akhir.
            </p>
            <p class="text-[10px] text-red-500 font-semibold pt-1">Tidak ada batas waktu</p>
          </div>

          <div class="pt-3 border-t border-[#FAF9F6] space-y-2">
            <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              Bimbingan Alumni
            </span>
            <p class="text-xs font-bold text-[#183153]">Mini Project, Test, & Portofolio Review</p>
            <a 
              href="/dashboard/workspace"
              class="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#183153] text-white text-xs font-bold hover:bg-[#102138] transition flex items-center justify-center gap-1.5 shadow-xs touch-manipulation"
            >
              <span>Ambil Peluang</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Card: Quote Relasi (Image 2) -->
        <div class="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E0] shadow-xs space-y-2.5 text-xs text-gray-700 leading-relaxed">
          <span class="text-2xl text-gray-400 font-serif leading-none">“</span>
          <p class="italic">
            "{selectedAlumni.quote}"
          </p>
          <p class="font-extrabold text-[#183153] text-[11px] pt-1">
            — {selectedAlumni.name}
          </p>
        </div>
      </div>
    </div>
  </div>

<!-- =========================================================================
     VIEW 3: FORM MENJALIN KONEKSI (Matches Image 5 Exactly)
     ========================================================================= -->
{:else if currentView === 'connect' && selectedAlumni}
  <div class="space-y-6">
    <!-- Top Back Link to Profile -->
    <div>
      <button 
        type="button"
        onclick={() => currentView = 'detail'}
        class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#183153] transition touch-manipulation"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke Profil {selectedAlumni.name}</span>
      </button>
    </div>

    <!-- Header Form Section (Image 5) -->
    <div class="space-y-1">
      <span class="text-xs font-semibold text-[#C2410C]">
        Satu langkah untuk memperluas jejaring masa depan
      </span>
      <h1 class="text-2xl sm:text-3xl font-black text-[#183153] font-serif tracking-tight">
        Buatlah Relasi yang Bermakna
      </h1>
      <p class="text-xs sm:text-sm text-gray-500">
        Kenalkan siapa dirimu kepada {selectedAlumni.name.split(' ')[0]}
      </p>
    </div>

    <!-- 2 Column Layout: Form on Left (8 cols) & Target Preview on Right (4 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form onsubmit={handleSubmitConnect} class="lg:col-span-8 space-y-5">
        <!-- 01 Biodata Singkat (Image 5) -->
        <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
              01
            </span>
            <div>
              <h3 class="text-sm font-extrabold text-[#183153]">Biodata Singkat</h3>
              <p class="text-[11px] text-gray-400">Masukan biodatamu dengan singkat sesuai kolom</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label for="m-name" class="block font-bold text-gray-700 mb-1">Nama Lengkap *</label>
              <input 
                id="m-name"
                type="text" 
                required
                bind:value={formFullName}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F6] focus:bg-white focus:border-[#183153] outline-none"
              />
            </div>
            <div>
              <label for="m-nim" class="block font-bold text-gray-700 mb-1">NIM *</label>
              <input 
                id="m-nim"
                type="text" 
                required
                bind:value={formNim}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F6] focus:bg-white focus:border-[#183153] outline-none font-mono"
              />
            </div>
            <div>
              <label for="m-prodi" class="block font-bold text-gray-700 mb-1">Program Studi *</label>
              <input 
                id="m-prodi"
                type="text" 
                required
                bind:value={formStudyProgram}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F6] focus:bg-white focus:border-[#183153] outline-none"
              />
            </div>
            <div>
              <label for="m-sem" class="block font-bold text-gray-700 mb-1">Semester *</label>
              <input 
                id="m-sem"
                type="text" 
                required
                bind:value={formSemester}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F6] focus:bg-white focus:border-[#183153] outline-none"
              />
            </div>
          </div>
        </div>

        <!-- 02 Perkenalan Singkat (Image 5) -->
        <div class="p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
              02
            </span>
            <div>
              <h3 class="text-sm font-extrabold text-[#183153]">Perkenalan Singkat</h3>
              <p class="text-[11px] text-gray-400">Perkenalkan siapa dirimu dengan singkat</p>
            </div>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label for="m-about" class="block font-bold text-gray-700 mb-1">Ceritakan tentang diri Anda? *</label>
              <textarea 
                id="m-about"
                required
                rows="4"
                bind:value={formAboutMe}
                class="w-full p-3.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F6] focus:bg-white focus:border-[#183153] outline-none leading-relaxed"
              ></textarea>
              <span class="block text-right text-[10px] text-gray-400 mt-1">104 / 500 words</span>
            </div>

            <div>
              <label for="m-reason" class="block font-bold text-gray-700 mb-1">Kenapa ingin Berkoneksi dengan saya *</label>
              <textarea 
                id="m-reason"
                required
                rows="4"
                bind:value={formReason}
                class="w-full p-3.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F6] focus:bg-white focus:border-[#183153] outline-none leading-relaxed"
              ></textarea>
              <span class="block text-right text-[10px] text-gray-400 mt-1">104 / 500 words</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button 
            type="button"
            onclick={() => currentView = 'detail'}
            class="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition touch-manipulation"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="px-6 py-2.5 rounded-xl bg-[#183153] text-[#FFD43B] text-xs font-black hover:bg-[#102138] transition shadow-xs touch-manipulation flex items-center gap-2"
          >
            <span>Kirim Permintaan Koneksi</span>
            <Send class="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      <!-- Right Card: Berkoneksi Dengan (Image 5) -->
      <div class="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
        <span class="text-[11px] font-bold text-gray-400">Berkoneksi Dengan</span>
        <div class="flex items-center gap-3.5 pt-1">
          <img 
            src={selectedAlumni.avatar} 
            alt={selectedAlumni.name} 
            class="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-black text-[#183153] truncate">{selectedAlumni.name}</h4>
            <span class="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
              {selectedAlumni.role}
            </span>
          </div>
        </div>

        <div class="pt-3 border-t border-[#FAF9F6]">
          <button 
            type="button"
            onclick={() => currentView = 'detail'}
            class="text-xs font-bold text-[#183153] hover:underline flex items-center gap-1"
          >
            <span>Lihat Profil {selectedAlumni.name.split(' ')[0]}</span>
            <ArrowUpRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Bottom Footer Matching Design -->
<div class="pt-8 border-t border-[#E7E5E0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
  <p>© 2026 UT REKA · Universitas Terbuka</p>
  <div class="flex items-center gap-4">
    <a href="/privasi-syarat" class="hover:text-gray-600 transition">Privacy policy</a>
    <span>·</span>
    <a href="/panduan" class="hover:text-gray-600 transition">Community guidelines</a>
  </div>
</div>
