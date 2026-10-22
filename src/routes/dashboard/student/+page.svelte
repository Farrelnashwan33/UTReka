<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { uiStore } from '$lib/stores/ui.svelte';
  import type { Profile, Opportunity, ConnectionRequest, CommunityGroup, GroupCategory } from '$lib/types/database';
  import { 
    Users, 
    Link2, 
    Briefcase, 
    Bookmark, 
    ArrowLeft, 
    ArrowRight,
    ArrowUpRight, 
    Plus,
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
      name: 'Tasya Angelicia Tenggara',
      role: 'Associate Product Manager',
      company: 'GoTo Ecosystem',
      graduation: 'UT Angkatan 2026',
      location: 'Jakarta, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      cardTags: ['Product Strategy', 'UI/UX'],
      skills: ['Product Strategy', 'UI/UX', 'Scrum', 'Data Analysis', 'User Research'],
      jobOffer: 'Associate Product Manager',
      openSlots: 2,
      bio: 'Alumni S1 Sistem Informasi Universitas Terbuka yang mendalami product discovery, riset kebutuhan pengguna, dan eksekusi roadmap platform digital di ekosistem GoTo.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Online Harian',
      education: [
        { school: 'Universitas Terbuka', year: '2022 - 2026' },
        { school: 'SMA Labschool Jakarta', year: '2019 - 2022' }
      ],
      quote: 'Produk digital yang sukses berakar dari empati tulus pada kebutuhan pengguna dan iterasi tanpa henti.'
    },
    {
      id: 'alumni-2',
      name: 'Azdzikri Muhammad Hisyam Soleh',
      role: 'Cloud & DevOps Specialist',
      company: 'Telkom Indonesia',
      graduation: 'UT Angkatan 2025',
      location: 'Tangerang, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      cardTags: ['Cloud', 'DevOps'],
      skills: ['Cloud Computing', 'Docker', 'Kubernetes', 'Linux Infrastructure', 'CI/CD'],
      jobOffer: 'Cloud Engineering Internship',
      openSlots: 3,
      bio: 'Praktisi infrastruktur cloud dan automasi deployment. Siap mendampingi rekan mahasiswa UT yang ingin memperdalam sertifikasi cloud global dan kesiapan kerja tech telekomunikasi.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Aktif Mingguan',
      education: [
        { school: 'Universitas Terbuka', year: '2021 - 2025' },
        { school: 'SMK Negeri 1 Tangerang', year: '2018 - 2021' }
      ],
      quote: 'Jangan ragu mulai dari dasar. Kuliah fleksibel di UT adalah keunggulan waktu terbaik untuk eksplorasi teknologi nyata.'
    },
    {
      id: 'alumni-3',
      name: 'Maulana Chrysant',
      role: 'Senior Software Engineer',
      company: 'Google',
      graduation: 'UT Angkatan 2024',
      location: 'Bandung, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      cardTags: ['Fullstack Developer', 'Distributed Systems'],
      skills: ['Fullstack Developer', 'Distributed Systems', 'Cloud Architecture', 'TypeScript', 'Go'],
      jobOffer: 'Software Engineer Mentorship',
      openSlots: 2,
      bio: 'Alumni S1 Sistem Informasi Universitas Terbuka dengan pengalaman merancang sistem cloud terdistribusi dan skalabilitas web modern di perusahaan teknologi global.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Sering - Online Bulanan',
      education: [
        { school: 'Universitas Terbuka', year: '2020 - 2024' },
        { school: 'SMAN 10 Bandung', year: '2017 - 2020' }
      ],
      quote: 'Relasi yang bermakna bukan hanya tentang siapa yang kita kenal, tetapi tentang karya apa yang dapat kita bangun bersama.'
    },
    {
      id: 'alumni-4',
      name: 'Keisha Refanaura Hakim',
      role: 'Data Analyst & BI Lead',
      company: 'Bank Mandiri (BUMN)',
      graduation: 'UT Angkatan 2025',
      location: 'Jakarta Selatan, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      cardTags: ['Data Science', 'Power BI'],
      skills: ['Data Science', 'Power BI', 'SQL', 'Python', 'Financial Modeling'],
      jobOffer: 'Junior Data Analyst Mentorship',
      openSlots: 2,
      bio: 'Praktisi analitik data sektor perbankan dan BUMN nasional. Senang membimbing penyusunan portofolio analitik, visualisasi dashboard, dan pemodelan prediktif.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Aktif Mingguan',
      education: [
        { school: 'Universitas Terbuka', year: '2021 - 2025' },
        { school: 'SMAN 3 Jakarta', year: '2018 - 2021' }
      ],
      quote: 'Data tanpa narasi hanyalah angka. Bersama alumni, mari ubah wawasan analitik menjadi lompatan karier nyata.'
    },
    {
      id: 'alumni-5',
      name: 'Akhmad Farrel Nashwan',
      role: 'Fullstack & AI Solutions Engineer',
      company: 'Bank Central Asia (BCA)',
      graduation: 'UT Angkatan 2025',
      location: 'Jakarta, Indonesia',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      cardTags: ['AI Systems', 'Fintech'],
      skills: ['Fullstack Web', 'AI Systems', 'System Design', 'Cyber Security', 'Next.js/Svelte'],
      jobOffer: 'Fullstack & AI Engineering Apprenticeship',
      openSlots: 3,
      bio: 'Mengembangkan arsitektur digital banking modern dan integrasi solusi AI cerdas untuk layanan nasabah enterprise berskala jutaan pengguna.',
      degree: 'Sarjana Komputer (S.Kom)',
      activeStatus: 'Online Harian',
      education: [
        { school: 'Universitas Terbuka', year: '2021 - 2025' },
        { school: 'SMA Labschool Jakarta', year: '2018 - 2021' }
      ],
      quote: 'Kemandirian belajar di UT adalah modal kepemimpinan terbaik untuk terus relevan di era disrupsi kecerdasan buatan.'
    }
  ];

  // Chat relasi contacts
  const chatContacts = [
    { initials: 'TAT', name: 'Tasya Angelicia Tenggara', prodi: 'S1 Sistem Informasi', role: 'Alumni', color: 'bg-blue-100 text-blue-700' },
    { initials: 'AMH', name: 'Azdzikri Muhammad Hisyam Soleh', prodi: 'S1 Sistem Informasi', role: 'Alumni', color: 'bg-emerald-100 text-emerald-800' },
    { initials: 'MC', name: 'Maulana Chrysant', prodi: 'S1 Sistem Informasi', role: 'Alumni', color: 'bg-indigo-100 text-indigo-700' },
    { initials: 'KRH', name: 'Keisha Refanaura Hakim', prodi: 'S1 Sistem Informasi', role: 'Mahasiswa', color: 'bg-amber-100 text-amber-800' },
    { initials: 'AFN', name: 'Akhmad Farrel Nashwan', prodi: 'S1 Sistem Informasi', role: 'Admin', color: 'bg-violet-100 text-violet-800' }
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

  // Community Groups states
  let groups = $state<CommunityGroup[]>([]);
  let groupFilter = $state<'all' | 'joined' | 'belajar' | 'karier' | 'prodi'>('all');
  let isCreateGroupModalOpen = $state(false);
  let isCreatingGroup = $state(false);
  let newGroupName = $state('');
  let newGroupDesc = $state('');
  let newGroupCategory = $state<GroupCategory>('belajar');
  let newGroupMaxMembers = $state(50);
  let newGroupProdi = $state(authStore.profile?.study_program || 'Sistem Informasi');

  onMount(async () => {
    groups = await platformService.getGroups();
  });

  let filteredGroups = $derived.by(() => {
    if (groupFilter === 'joined' && authStore.profile) {
      return groups.filter(g => g.member_ids.includes(authStore.profile!.id));
    }
    if (groupFilter === 'belajar') return groups.filter(g => g.category === 'belajar');
    if (groupFilter === 'karier') return groups.filter(g => g.category === 'karier' || g.category === 'proyek');
    if (groupFilter === 'prodi') return groups.filter(g => g.category === 'prodi');
    return groups;
  });

  async function handleCreateGroup(e: SubmitEvent) {
    e.preventDefault();
    if (!authStore.profile) {
      toastStore.error('Silakan login terlebih dahulu');
      return;
    }
    if (!newGroupName.trim()) {
      toastStore.warning('Nama grup tidak boleh kosong');
      return;
    }

    isCreatingGroup = true;
    const res = await platformService.createGroup({
      name: newGroupName,
      description: newGroupDesc,
      category: newGroupCategory,
      creator_id: authStore.profile.id,
      creator_role: authStore.profile.role,
      study_program: newGroupProdi,
      max_members: newGroupMaxMembers,
      creator: authStore.profile
    });
    isCreatingGroup = false;

    if (res.success && res.group) {
      toastStore.success(`Grup "${res.group.name}" berhasil dibuat!`);
      groups = [res.group, ...groups];
      newGroupName = '';
      newGroupDesc = '';
      isCreateGroupModalOpen = false;
    } else {
      toastStore.error(res.error || 'Gagal membuat grup');
    }
  }

  async function handleToggleJoinGroup(groupId: string) {
    if (!authStore.profile) return;
    const res = await platformService.toggleJoinGroup(groupId, authStore.profile.id);
    if (res.success) {
      groups = await platformService.getGroups();
      if (res.isMember) {
        toastStore.success('Berhasil bergabung ke grup!');
      } else {
        toastStore.info('Anda telah keluar dari grup');
      }
    }
  }
</script>

<svelte:head>
  <title>Dashboard Mahasiswa | UT REKA</title>
</svelte:head>

<!-- =========================================================================
     VIEW 1: DASHBOARD MAHASISWA / LIHAT SEMUA (Career Command Center)
     ========================================================================= -->
{#if currentView === 'list'}
  <div class="space-y-6">
    <!-- Top Greeting Section -->
    <div class="space-y-1">
      <span class="text-xs sm:text-sm font-bold text-[#3157D5] uppercase tracking-wider">
        Terhubunglah Hari Ini • Melangkah Lebih Jauh
      </span>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#101B35] font-heading tracking-tight leading-tight">
        Temukan Relasi dan Karier Impianmu, {authStore.profile?.full_name?.split(' ')[0] || 'Mahasiswa'}.
      </h1>
      <p class="text-xs sm:text-sm text-[#68738A] leading-relaxed max-w-2xl font-normal">
        Temui para alumni yang melihat potensimu dan siap membantumu membangun langkah karier selanjutnya.
      </p>
    </div>

    <!-- 3 Metric Cards Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
      <!-- Metric 1: Temukan Relasi -->
      <a 
        href="/dashboard/connections"
        class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs flex items-center gap-3.5 hover:border-[#3157D5]/40 hover:shadow-xs transition group"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Users class="w-5 h-5 stroke-[2.2]" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-[#68738A] font-semibold truncate">Temukan Relasi</p>
          <div class="text-2xl sm:text-3xl font-black text-[#101B35] font-heading leading-tight">48</div>
          <p class="text-[10px] text-[#3157D5] font-bold mt-0.5">+8 Mentor Baru</p>
        </div>
      </a>

      <!-- Metric 2: Ruang Koneksi -->
      <a 
        href="/dashboard/connections"
        class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs flex items-center gap-3.5 hover:border-[#3157D5]/40 hover:shadow-xs transition group"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Link2 class="w-5 h-5 stroke-[2.2]" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-[#68738A] font-semibold truncate">Ruang Koneksi</p>
          <div class="text-2xl sm:text-3xl font-black text-[#101B35] font-heading leading-tight">12</div>
          <p class="text-[10px] text-[#68738A] font-medium mt-0.5">Menunggu konfirmasi</p>
        </div>
      </a>

      <!-- Metric 3: Ruang Kerja -->
      <a 
        href="/dashboard/workspace"
        class="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs flex items-center gap-3.5 hover:border-[#3157D5]/40 hover:shadow-xs transition group"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Briefcase class="w-5 h-5 stroke-[2.2]" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-[#68738A] font-semibold truncate">Ruang Kerja</p>
          <div class="text-2xl sm:text-3xl font-black text-[#101B35] font-heading leading-tight">3</div>
          <p class="text-[10px] text-[#68738A] font-medium mt-0.5">Sesi aktif minggu ini</p>
        </div>
      </a>
    </div>

    <!-- Main Content & Aside Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT COLUMN: Temukan Relasi & Cards (Col 1-8) -->
      <div class="lg:col-span-8 space-y-4">
        <!-- Section Title & Counter -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-[#101B35] font-heading">
              Direktori Mentor & Relasi
            </h2>
            <p class="text-xs text-[#68738A] mt-0.5">
              48 Alumni terverifikasi siap memberikan bimbingan 1-on-1
            </p>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF]">
            Rekomendasi Terbaik
          </span>
        </div>

        <!-- Search Input & Filters Button -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="search"
              bind:value={searchQuery}
              placeholder="Cari nama alumni, peran, atau keahlian..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-xs outline-none focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-[#101B35] placeholder-slate-400 shadow-2xs transition"
            />
          </div>

          <button 
            type="button"
            class="px-4 py-2.5 rounded-xl bg-white border border-[#E5E8EF] text-xs font-bold text-[#101B35] hover:bg-slate-50 flex items-center justify-center gap-2 shadow-2xs touch-manipulation transition"
          >
            <span>Filter</span>
            <SlidersHorizontal class="w-3.5 h-3.5 text-[#68738A]" />
          </button>
        </div>

        <!-- Filter Chips -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <button 
            type="button"
            class="px-3 py-1.5 rounded-xl bg-white border border-[#E5E8EF] font-bold text-[#101B35] flex items-center gap-1.5 shadow-2xs hover:bg-slate-50"
          >
            <span>Semua Program Studi</span>
            <span class="text-[10px] text-slate-400">▾</span>
          </button>

          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF] font-bold text-[11px]">
            <span>Sistem Informasi</span>
            <X class="w-3 h-3 cursor-pointer" />
          </span>

          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF] font-bold text-[11px]">
            <span>Cloud & Tech</span>
            <X class="w-3 h-3 cursor-pointer" />
          </span>
        </div>

        <!-- 2-Column Grid of Alumni Cards (NUS Style) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each alumniList as alumni (alumni.id)}
            <div class="p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] hover:shadow-xs transition">
              <div class="space-y-3">
                <!-- Card Header: Badge & Bookmark -->
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF]">
                    Terbuka Bimbingan
                  </span>
                  <button 
                    type="button"
                    onclick={() => toggleSaveProfile(alumni.id)}
                    class="text-slate-400 hover:text-[#3157D5] transition"
                    title="Simpan Profile"
                  >
                    <Bookmark class="w-4 h-4 {savedProfiles.includes(alumni.id) ? 'fill-[#3157D5] text-[#3157D5]' : ''}" />
                  </button>
                </div>

                <!-- Alumni Info: Avatar + Name + Role + Company -->
                <div class="flex items-start gap-3">
                  <img 
                    src={alumni.avatar} 
                    alt={alumni.name} 
                    class="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#EEF2FF] shadow-xs shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-extrabold text-[#101B35] truncate">{alumni.name}</h3>
                    <p class="text-xs text-[#3157D5] truncate mt-0.5 font-bold">{alumni.role}</p>
                    <p class="text-[10px] text-[#68738A] truncate mt-0.5">{alumni.company} • {alumni.graduation}</p>
                  </div>
                </div>

                <!-- Skill Tag Pills -->
                <div class="flex flex-wrap gap-1.5 pt-1">
                  {#each (alumni.cardTags || alumni.skills.slice(0, 2)) as sk}
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6F2] text-[#20283B] border border-[#E5E8EF]">
                      {sk}
                    </span>
                  {/each}
                </div>
              </div>

              <!-- Card Bottom: Job Offer Title & Action Buttons -->
              <div class="pt-3 border-t border-[#E5E8EF] flex items-center justify-between gap-2">
                <div>
                  <p class="text-xs font-bold text-[#101B35] leading-snug">{alumni.jobOffer}</p>
                  <p class="text-[10px] text-[#68738A] mt-0.5">Tersedia {alumni.openSlots} kuota</p>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button 
                    type="button"
                    onclick={() => handleOpenDetail(alumni)}
                    class="px-3 py-1.5 rounded-xl border border-[#E5E8EF] bg-white hover:bg-slate-50 text-xs font-bold text-[#101B35] transition shadow-2xs"
                  >
                    Profil
                  </button>
                  <button 
                    type="button"
                    onclick={() => handleOpenConnect(alumni)}
                    class="px-3.5 py-1.5 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-xs font-bold text-white transition shadow-xs flex items-center gap-1"
                  >
                    <span>Koneksi</span>
                    <ArrowRight class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Pagination -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#68738A]">
          <span>Menampilkan 1–4 dari 48 alumni terdaftar</span>
          <div class="flex items-center gap-1 font-bold">
            <button class="w-8 h-8 rounded-lg border border-[#E5E8EF] bg-white flex items-center justify-center hover:bg-slate-50">‹</button>
            <button class="w-8 h-8 rounded-lg bg-[#3157D5] text-white flex items-center justify-center shadow-xs">1</button>
            <button class="w-8 h-8 rounded-lg border border-[#E5E8EF] bg-white flex items-center justify-center hover:bg-slate-50">2</button>
            <button class="w-8 h-8 rounded-lg border border-[#E5E8EF] bg-white flex items-center justify-center hover:bg-slate-50">3</button>
            <span class="px-1 text-slate-400">...</span>
            <button class="w-8 h-8 rounded-lg border border-[#E5E8EF] bg-white flex items-center justify-center hover:bg-slate-50">12</button>
            <button class="w-8 h-8 rounded-lg border border-[#E5E8EF] bg-white flex items-center justify-center hover:bg-slate-50">›</button>
          </div>
        </div>
      </div>

      <!-- RIGHT ASIDE: Chat Relasi & Seminar Alumni Banner (Col 9-12) -->
      <div class="lg:col-span-4 space-y-5">
        <!-- Widget 1: Chat Relasi -->
        <div class="p-5 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-extrabold text-[#101B35] font-heading">Percakapan Aktif</h3>
            <a href="/dashboard/messages" class="text-xs font-bold text-[#3157D5] hover:underline flex items-center gap-0.5">
              <span>Lihat semua</span>
              <ArrowUpRight class="w-3 h-3" />
            </a>
          </div>

          <div class="space-y-2.5">
            {#each chatContacts as contact}
              <a 
                href="/dashboard/messages"
                class="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F6F2] transition touch-manipulation group"
              >
                <div class="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center text-xs font-bold shrink-0">
                  {contact.initials}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-bold text-[#101B35] group-hover:text-[#3157D5] truncate">{contact.name}</div>
                  <p class="text-[10px] text-[#68738A] truncate">{contact.prodi}</p>
                </div>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF] shrink-0">
                  {contact.role}
                </span>
              </a>
            {/each}
          </div>
        </div>

        <!-- Widget 2: Seminar & Mentoring Banner (Midnight Navy Card) -->
        <div class="p-6 rounded-2xl bg-[#101B35] text-white shadow-md space-y-3.5 relative overflow-hidden border border-[#1D2A4D]">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-[#3157D5]/30 rounded-full blur-xl pointer-events-none"></div>

          <span class="text-[10px] font-bold uppercase tracking-wider text-[#FFC83D]">
            SEMINAR MENTORING ALUMNI
          </span>
          <h3 class="text-base font-extrabold font-heading leading-snug text-white">
            Rancang Portofolio & Karier Impian di Era Digital
          </h3>
          <div class="space-y-1 text-xs text-slate-300 font-medium">
            <p>Sabtu, 24 Oktober • 19:30 WIB • Online</p>
            <p class="text-[11px] text-slate-400">Eksklusif Mahasiswa Universitas Terbuka</p>
          </div>
          <a 
            href="/dashboard/opportunities" 
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white text-xs font-bold transition shadow-xs pt-1.5"
          >
            <span>Daftar Sesi</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>

    <!-- ========================================================
         SECTION: GRUP DISKUSI & KOMUNITAS MAHASISWA
         ======================================================== -->
    <div class="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E8EF] shadow-2xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E8EF] pb-5">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-[#3157D5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full mb-1">
            <Users class="w-3.5 h-3.5" />
            <span>Kolaborasi & Jejaring</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-black text-[#101B35] font-heading">
            Grup Belajar & Komunitas Mahasiswa
          </h2>
          <p class="text-xs text-[#68738A] mt-0.5 max-w-xl">
            Bangun grup belajar bersama teman se-prodi, kelompok tugas akhir, atau persiapan karier profesional.
          </p>
        </div>

        <button 
          type="button"
          onclick={() => isCreateGroupModalOpen = true}
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3157D5]/20 transition touch-manipulation self-start sm:self-center"
        >
          <Plus class="w-4 h-4" />
          <span>+ Bikin Grup Baru</span>
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold text-[#68738A]">
        <button 
          type="button" 
          onclick={() => groupFilter = 'all'}
          class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'all' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
        >
          Semua Grup ({groups.length})
        </button>
        <button 
          type="button" 
          onclick={() => groupFilter = 'joined'}
          class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'joined' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
        >
          Grup Saya ({groups.filter(g => authStore.profile && g.member_ids.includes(authStore.profile.id)).length})
        </button>
        <button 
          type="button" 
          onclick={() => groupFilter = 'belajar'}
          class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'belajar' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
        >
          Belajar Bersama
        </button>
        <button 
          type="button" 
          onclick={() => groupFilter = 'karier'}
          class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'karier' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
        >
          Karier & Proyek
        </button>
        <button 
          type="button" 
          onclick={() => groupFilter = 'prodi'}
          class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'prodi' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
        >
          Komunitas Prodi
        </button>
      </div>

      <!-- Groups Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each filteredGroups as group (group.id)}
          <div class="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5E8EF] hover:border-[#3157D5]/40 hover:bg-white transition-all space-y-3.5 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full
                  {group.category === 'belajar' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                   group.category === 'karier' || group.category === 'proyek' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                   group.category === 'mentoring' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                   'bg-purple-50 text-purple-700 border border-purple-200'}">
                  {group.category === 'belajar' ? 'Belajar Bersama' :
                   group.category === 'karier' ? 'Persiapan Karier' :
                   group.category === 'proyek' ? 'Proyek & Portofolio' :
                   group.category === 'mentoring' ? 'Mentoring' :
                   group.category === 'prodi' ? 'Komunitas Prodi' : 'Grup Komunitas'}
                </span>
                
                <span class="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                  <Users class="w-3.5 h-3.5 text-[#3157D5]" />
                  <span>{group.members_count} / {group.max_members || 100} anggota</span>
                </span>
              </div>

              <h3 class="text-base font-extrabold text-[#101B35] font-heading leading-snug">
                {group.name}
              </h3>
              <p class="text-xs text-[#68738A] line-clamp-2 leading-relaxed">
                {group.description}
              </p>
            </div>

            <!-- Footer: Creator info + Join / Chat Button -->
            <div class="pt-3 border-t border-[#E5E8EF] flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 min-w-0">
                <img 
                  src={group.creator?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'} 
                  alt={group.creator?.full_name || 'Inisiator'} 
                  class="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 bg-white"
                />
                <div class="text-[11px] truncate">
                  <span class="text-[#64748B]">Oleh: </span>
                  <span class="font-bold text-[#101B35]">{group.creator?.full_name || 'Mahasiswa UT'}</span>
                </div>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                {#if authStore.profile && group.member_ids.includes(authStore.profile.id)}
                  <a 
                    href="/dashboard/messages"
                    class="px-3 py-1.5 rounded-xl bg-[#EEF2FF] hover:bg-[#DBEAFE] text-[#3157D5] font-bold text-xs flex items-center gap-1 transition"
                  >
                    <MessageSquare class="w-3.5 h-3.5" />
                    <span>Buka Obrolan</span>
                  </a>
                  <button 
                    type="button"
                    onclick={() => handleToggleJoinGroup(group.id)}
                    class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                    title="Keluar dari grup"
                  >
                    <X class="w-3.5 h-3.5" />
                  </button>
                {:else}
                  <button 
                    type="button"
                    onclick={() => handleToggleJoinGroup(group.id)}
                    class="px-3.5 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#3157D5] text-[#101B35] hover:text-[#3157D5] font-bold text-xs flex items-center gap-1 transition shadow-xs touch-manipulation"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    <span>Gabung Grup</span>
                  </button>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- MODAL: BIKIN GRUP BARU -->
  {#if isCreateGroupModalOpen}
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/70">
          <div class="flex items-center gap-2.5">
            <div class="p-2 bg-[#EEF2FF] text-[#3157D5] rounded-xl border border-[#D5E0FF]">
              <Users class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-[#101B35] font-heading">Bikin Grup Baru</h3>
              <p class="text-xs text-[#68738A]">Buat wadah belajar dan diskusi mahasiswa UT</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick={() => isCreateGroupModalOpen = false}
            class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form onsubmit={handleCreateGroup} class="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label for="grp-name" class="block font-bold text-[#101B35] uppercase mb-1">Nama Grup</label>
            <input 
              id="grp-name"
              type="text"
              required
              bind:value={newGroupName}
              placeholder="Contoh: Study Group Sistem Informasi Semester 3"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="grp-cat" class="block font-bold text-[#101B35] uppercase mb-1">Kategori Grup</label>
              <select 
                id="grp-cat"
                bind:value={newGroupCategory}
                class="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] bg-white font-medium"
              >
                <option value="belajar">Belajar Bersama</option>
                <option value="karier">Persiapan Karier</option>
                <option value="prodi">Komunitas Prodi</option>
                <option value="proyek">Proyek & Portofolio</option>
                <option value="upbjj">Wilayah / UPBJJ</option>
              </select>
            </div>

            <div>
              <label for="grp-prodi" class="block font-bold text-[#101B35] uppercase mb-1">Program Studi</label>
              <input 
                id="grp-prodi"
                type="text"
                bind:value={newGroupProdi}
                placeholder="Contoh: Sistem Informasi"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] bg-white"
              />
            </div>
          </div>

          <div>
            <label for="grp-desc" class="block font-bold text-[#101B35] uppercase mb-1">Deskripsi & Tujuan Grup</label>
            <textarea 
              id="grp-desc"
              rows="3"
              required
              bind:value={newGroupDesc}
              placeholder="Jelaskan fokus diskusi grup, jadwal belajar, atau topik yang dibahas..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label for="grp-max" class="block font-bold text-[#101B35] uppercase mb-1">Batas Maksimal Anggota</label>
            <input 
              id="grp-max"
              type="number"
              min="5"
              max="500"
              bind:value={newGroupMaxMembers}
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] bg-white"
            />
          </div>

          <div class="pt-2 flex items-center justify-end gap-3 border-t border-[#E5E8EF]">
            <button 
              type="button" 
              onclick={() => isCreateGroupModalOpen = false}
              class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isCreatingGroup}
              class="px-5 py-2.5 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white font-bold transition shadow-xs disabled:opacity-50"
            >
              {isCreatingGroup ? 'Membuat Grup...' : 'Buat Grup Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

<!-- =========================================================================
     VIEW 2: BIODATA ALUMNI / DETAIL PROFILE
     ========================================================================= -->
{:else if currentView === 'detail' && selectedAlumni}
  <div class="space-y-6">
    <!-- Top Back Link & Section Breadcrumbs -->
    <div class="flex items-center justify-between text-xs">
      <button 
        type="button"
        onclick={() => currentView = 'list'}
        class="inline-flex items-center gap-1.5 font-bold text-[#68738A] hover:text-[#101B35] transition touch-manipulation"
      >
        <ArrowLeft class="w-4 h-4 text-[#3157D5]" />
        <span>Kembali ke Direktori</span>
      </button>

      <span class="font-extrabold text-[#3157D5] uppercase tracking-wider">
        PROFIL MENTOR TERVERIFIKASI
      </span>
    </div>

    <!-- Hero Card with Navy Header Motif -->
    <div class="rounded-3xl bg-white border border-[#E5E8EF] shadow-2xs overflow-hidden">
      <!-- Midnight Navy Banner -->
      <div class="h-28 bg-[#101B35] p-6 relative overflow-hidden flex items-center justify-between text-white border-b border-[#1D2A4D]">
        <div class="relative z-10 space-y-0.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#FFC83D]">UT REKA MENTORSHIP</span>
          <h2 class="text-base sm:text-xl font-black font-heading text-white">
            Karier yang Gemilang Dimulai dari Relasi yang Tepat
          </h2>
        </div>
        <div class="w-40 h-40 bg-[#3157D5]/20 rounded-full absolute -right-10 -bottom-10 blur-xl pointer-events-none"></div>
      </div>

      <!-- Profile Header Details -->
      <div class="p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div class="flex flex-col sm:flex-row items-start gap-4">
            <img 
              src={selectedAlumni.avatar} 
              alt={selectedAlumni.name} 
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-[#EEF2FF] shadow-xs"
            />
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF]">
                  Alumni UT Resmi
                </span>
                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Terbuka untuk Mentoring
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black text-[#101B35] font-heading">
                {selectedAlumni.name}
              </h1>
              <p class="text-sm font-bold text-[#3157D5]">
                {selectedAlumni.role} • {selectedAlumni.company}
              </p>
              <div class="flex items-center gap-3 text-xs text-[#68738A]">
                <span>{selectedAlumni.location} • {selectedAlumni.graduation}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons on Right -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button 
              type="button"
              onclick={() => handleOpenConnect(selectedAlumni)}
              class="px-5 py-2.5 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white text-xs font-bold transition shadow-xs touch-manipulation text-center flex items-center justify-center gap-1.5"
            >
              <span>Ajukan Bimbingan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
            <button 
              type="button"
              onclick={() => toggleSaveProfile(selectedAlumni.id)}
              class="px-4 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-xs font-bold text-[#101B35] hover:bg-slate-50 transition flex items-center justify-center gap-1.5 touch-manipulation"
            >
              <span>Simpan Profil</span>
              <Bookmark class="w-3.5 h-3.5 {savedProfiles.includes(selectedAlumni.id) ? 'fill-[#3157D5] text-[#3157D5]' : ''}" />
            </button>
          </div>
        </div>

        <!-- Profile Tabs -->
        <div class="flex items-center gap-6 border-b border-[#E5E8EF] text-xs font-bold text-[#68738A] pt-2">
          <button type="button" class="pb-3 text-[#3157D5] border-b-2 border-[#3157D5]">
            Data Diri
          </button>
          <button type="button" class="pb-3 hover:text-[#101B35] transition">
            Pengalaman Kerja
          </button>
          <button type="button" class="pb-3 hover:text-[#101B35] transition">
            Sertifikasi & Keahlian
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Content 2 Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Tentang saya, Latar Pendidikan, Skills -->
      <div class="lg:col-span-8 space-y-5">
        <!-- Card: Tentang saya -->
        <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-4">
          <h3 class="text-base font-black text-[#101B35] font-heading">Tentang Mentor</h3>
          <p class="text-xs text-[#68738A] leading-relaxed">
            {selectedAlumni.bio}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E8EF] text-xs">
            <div>
              <span class="text-[#68738A] text-[11px]">Almamater</span>
              <p class="font-bold text-[#101B35] mt-0.5">Universitas Terbuka</p>
            </div>
            <div>
              <span class="text-[#68738A] text-[11px]">Gelar Akademik</span>
              <p class="font-bold text-[#101B35] mt-0.5">{selectedAlumni.degree}</p>
            </div>
            <div>
              <span class="text-[#68738A] text-[11px]">Angkatan</span>
              <p class="font-bold text-[#101B35] mt-0.5">2022</p>
            </div>
            <div>
              <span class="text-[#68738A] text-[11px]">Domisili</span>
              <p class="font-bold text-[#101B35] mt-0.5">{selectedAlumni.location}</p>
            </div>
            <div>
              <span class="text-[#68738A] text-[11px]">Bahasa</span>
              <p class="font-bold text-[#101B35] mt-0.5">Indonesia, English</p>
            </div>
            <div>
              <span class="text-[#68738A] text-[11px]">Status Ketersediaan</span>
              <p class="font-bold text-[#3157D5] mt-0.5">{selectedAlumni.activeStatus}</p>
            </div>
          </div>
        </div>

        <!-- Card: Latar Pendidikan & Keahlian -->
        <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-4">
          <h3 class="text-base font-black text-[#101B35] font-heading">Latar Belakang Pendidikan</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center font-black text-xs shrink-0">
                UT
              </div>
              <div>
                <p class="text-xs font-bold text-[#101B35]">Universitas Terbuka</p>
                <p class="text-[10px] text-[#68738A]">2018 - 2022</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0">
                10
              </div>
              <div>
                <p class="text-xs font-bold text-[#101B35]">SMAN 10 Bandung</p>
                <p class="text-[10px] text-[#68738A]">2015 - 2018</p>
              </div>
            </div>
          </div>

          <!-- Skills tags -->
          <div class="pt-4 border-t border-[#E5E8EF] space-y-2">
            <h4 class="text-xs font-bold text-[#101B35]">Bidang Keahlian</h4>
            <div class="flex flex-wrap gap-1.5">
              {#each selectedAlumni.skills as sk}
                <span class="text-[10px] font-bold px-3 py-1 rounded-lg bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF]">
                  {sk}
                </span>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Peluang Ditawarkan & Quote -->
      <div class="lg:col-span-4 space-y-5">
        <!-- Card: Karier Ditawarkan -->
        <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-[#101B35] font-heading">Peluang Bimbingan</h3>
            <span class="text-[10px] font-bold text-[#3157D5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#D5E0FF]">
              Kuota: {selectedAlumni.openSlots} Mahasiswa
            </span>
          </div>

          <div class="space-y-1.5">
            <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEF2FF] text-[#3157D5]">
              PROYEK & MENTORING
            </span>
            <h4 class="text-xs font-extrabold text-[#101B35]">{selectedAlumni.jobOffer}</h4>
            <p class="text-[11px] text-[#68738A]">{selectedAlumni.company}</p>
            <p class="text-xs text-[#68738A] leading-relaxed pt-1">
              Program bimbingan teknis dan simulasi pengerjaan proyek nyata bagi mahasiswa aktif tingkat akhir.
            </p>
          </div>

          <div class="pt-3 border-t border-[#E5E8EF] space-y-2">
            <p class="text-xs font-bold text-[#101B35]">Topik: Mini Project, Code Review, & Portofolio</p>
            <button 
              type="button"
              onclick={() => handleOpenConnect(selectedAlumni)}
              class="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs touch-manipulation"
            >
              <span>Ajukan Bimbingan Sekarang</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Card: Quote Relasi -->
        <div class="p-6 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] shadow-2xs space-y-2.5 text-xs text-[#20283B] leading-relaxed">
          <span class="text-2xl text-[#3157D5] font-serif leading-none">“</span>
          <p class="italic text-[#68738A]">
            "{selectedAlumni.quote}"
          </p>
          <p class="font-bold text-[#101B35] text-[11px] pt-1">
            — {selectedAlumni.name}
          </p>
        </div>
      </div>
    </div>
  </div>

<!-- =========================================================================
     VIEW 3: FORM MENJALIN KONEKSI
     ========================================================================= -->
{:else if currentView === 'connect' && selectedAlumni}
  <div class="space-y-6">
    <!-- Top Back Link to Profile -->
    <div>
      <button 
        type="button"
        onclick={() => currentView = 'detail'}
        class="inline-flex items-center gap-1.5 text-xs font-bold text-[#68738A] hover:text-[#101B35] transition touch-manipulation"
      >
        <ArrowLeft class="w-4 h-4 text-[#3157D5]" />
        <span>Kembali ke Profil {selectedAlumni.name}</span>
      </button>
    </div>

    <!-- Header Form Section -->
    <div class="space-y-1">
      <span class="text-xs font-bold text-[#3157D5] uppercase tracking-wider">
        Satu Langkah Memperluas Peluang Masa Depan
      </span>
      <h1 class="text-2xl sm:text-3xl font-black text-[#101B35] font-heading tracking-tight">
        Ajukan Bimbingan Relasi
      </h1>
      <p class="text-xs sm:text-sm text-[#68738A]">
        Kenalkan dirimu secara profesional kepada {selectedAlumni.name}
      </p>
    </div>

    <!-- 2 Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <form onsubmit={handleSubmitConnect} class="lg:col-span-8 space-y-5">
        <!-- 01 Biodata Singkat -->
        <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-4">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center text-xs font-bold shrink-0">
              01
            </span>
            <div>
              <h3 class="text-sm font-extrabold text-[#101B35]">Biodata Akademis Mahasiswa</h3>
              <p class="text-[11px] text-[#68738A]">Data terverifikasi sesuai profil akun Anda</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label for="m-name" class="block font-bold text-[#101B35] mb-1">Nama Lengkap *</label>
              <input 
                id="m-name"
                type="text" 
                required
                bind:value={formFullName}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-[#101B35] outline-none transition"
              />
            </div>
            <div>
              <label for="m-nim" class="block font-bold text-[#101B35] mb-1">NIM *</label>
              <input 
                id="m-nim"
                type="text" 
                required
                bind:value={formNim}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-[#101B35] outline-none font-mono transition"
              />
            </div>
            <div>
              <label for="m-prodi" class="block font-bold text-[#101B35] mb-1">Program Studi *</label>
              <input 
                id="m-prodi"
                type="text" 
                required
                bind:value={formStudyProgram}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-[#101B35] outline-none transition"
              />
            </div>
            <div>
              <label for="m-sem" class="block font-bold text-[#101B35] mb-1">Semester *</label>
              <input 
                id="m-sem"
                type="text" 
                required
                bind:value={formSemester}
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-[#101B35] outline-none transition"
              />
            </div>
          </div>
        </div>

        <!-- 02 Perkenalan Singkat -->
        <div class="p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-4">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center text-xs font-bold shrink-0">
              02
            </span>
            <div>
              <h3 class="text-sm font-extrabold text-[#101B35]">Maksud & Tujuan Bimbingan</h3>
              <p class="text-[11px] text-[#68738A]">Tuliskan pesan pembuka yang jelas dan sopan</p>
            </div>
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label for="m-about" class="block font-bold text-[#101B35] mb-1">Ceritakan latar belakang & minat Anda: *</label>
              <textarea 
                id="m-about"
                required
                rows="4"
                bind:value={formAboutMe}
                class="w-full p-3.5 rounded-xl border border-[#E5E8EF] bg-white focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-[#101B35] outline-none leading-relaxed transition"
              ></textarea>
            </div>

            <div>
              <label for="m-reason" class="block font-bold text-[#101B35] mb-1">Topik yang ingin dikonsultasikan: *</label>
              <textarea 
                id="m-reason"
                required
                rows="4"
                bind:value={formReason}
                placeholder="Contoh: Bimbingan review resume ATS, persiapan portofolio proyek tech, atau simulasi interview..."
                class="w-full p-3.5 rounded-xl border border-[#E5E8EF] bg-white focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-[#101B35] outline-none leading-relaxed transition"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button 
            type="button"
            onclick={() => currentView = 'detail'}
            class="px-5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-xs font-bold text-[#68738A] hover:bg-slate-50 transition touch-manipulation"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="px-6 py-2.5 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white text-xs font-bold transition shadow-xs touch-manipulation flex items-center gap-2"
          >
            <span>Kirim Permintaan Bimbingan</span>
            <Send class="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      <!-- Right Card: Berkoneksi Dengan -->
      <div class="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E5E8EF] shadow-2xs space-y-4">
        <span class="text-[11px] font-bold text-[#68738A] uppercase tracking-wider">Menghubungi Mentor</span>
        <div class="flex items-center gap-3.5 pt-1">
          <img 
            src={selectedAlumni.avatar} 
            alt={selectedAlumni.name} 
            class="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#EEF2FF]"
          />
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-extrabold text-[#101B35] truncate">{selectedAlumni.name}</h4>
            <span class="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157D5]">
              {selectedAlumni.role}
            </span>
          </div>
        </div>

        <div class="pt-3 border-t border-[#E5E8EF]">
          <button 
            type="button"
            onclick={() => currentView = 'detail'}
            class="text-xs font-bold text-[#3157D5] hover:underline flex items-center gap-1"
          >
            <span>Lihat Profil Lengkap {selectedAlumni.name.split(' ')[0]}</span>
            <ArrowUpRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Bottom Footer -->
<div class="pt-8 border-t border-[#E5E8EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#68738A]">
  <p>© 2026 UT REKA • Universitas Terbuka Karier</p>
  <div class="flex items-center gap-4">
    <a href="/privasi-syarat" class="hover:text-[#101B35] transition">Kebijakan Privasi</a>
    <span>•</span>
    <a href="/panduan" class="hover:text-[#101B35] transition">Panduan Bimbingan</a>
  </div>
</div>
