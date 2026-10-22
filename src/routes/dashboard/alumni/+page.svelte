<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import type { ConnectionRequest, Opportunity, CommunityGroup, GroupCategory } from '$lib/types/database';
  import { 
    Users, 
    MessageSquare, 
    Briefcase, 
    Plus, 
    Check, 
    X, 
    Sparkles, 
    CheckCircle2, 
    Calendar, 
    Clock, 
    ShieldCheck, 
    ExternalLink,
    Bell,
    ChevronRight,
    TrendingUp,
    HeartHandshake,
    MapPin,
    AlertCircle,
    UserCheck,
    GraduationCap,
    Lightbulb
  } from 'lucide-svelte';

  let requests = $state<ConnectionRequest[]>([]);
  let myOpportunities = $state<Opportunity[]>([]);
  let isLoading = $state(true);
  let requestFilter = $state<'all' | 'pending' | 'accepted'>('all');

  // Mentor availability toggle states
  let isMentorAvailable = $state(true);
  let mentorTopics = $state<string[]>([
    'Mentoring 1-on-1',
    'Review CV & Portofolio',
    'Simulasi Interview Teknis',
    'Kiat Belajar Mandiri di UT'
  ]);

  // Modal create opportunity
  let isCreateModalOpen = $state(false);
  let newTitle = $state('');
  let newDesc = $state('');
  let newType = $state<'project' | 'internship' | 'job' | 'mentoring'>('mentoring');
  let newLocation = $state('Remote (Online)');
  let newCompany = $state(authStore.profile?.company || 'Alumni Network');
  let newReqs = $state('Mahasiswa aktif UT, Komitmen belajar mandiri');

  let filteredRequests = $derived.by(() => {
    if (requestFilter === 'pending') return requests.filter(r => r.status === 'pending');
    if (requestFilter === 'accepted') return requests.filter(r => r.status === 'accepted');
    return requests;
  });

  // Community Groups states for Alumni
  let groups = $state<CommunityGroup[]>([]);
  let groupFilter = $state<'all' | 'joined' | 'mentoring' | 'alumni' | 'karier'>('all');
  let isCreateGroupModalOpen = $state(false);
  let isCreatingGroup = $state(false);
  let newGroupName = $state('');
  let newGroupDesc = $state('');
  let newGroupCategory = $state<GroupCategory>('mentoring');
  let newGroupMaxMembers = $state(50);
  let newGroupProdi = $state(authStore.profile?.study_program || 'Sistem Informasi');

  let filteredGroups = $derived.by(() => {
    if (groupFilter === 'joined' && authStore.profile) {
      return groups.filter(g => g.member_ids.includes(authStore.profile!.id));
    }
    if (groupFilter === 'mentoring') return groups.filter(g => g.category === 'mentoring');
    if (groupFilter === 'alumni') return groups.filter(g => g.category === 'alumni');
    if (groupFilter === 'karier') return groups.filter(g => g.category === 'karier' || g.category === 'proyek');
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

  onMount(async () => {
    isLoading = true;
    try {
      if (authStore.profile) {
        isMentorAvailable = authStore.profile.is_mentor;
        if (authStore.profile.mentor_topics?.length > 0) {
          mentorTopics = authStore.profile.mentor_topics;
        }

        const [reqs, opps, grps] = await Promise.all([
          platformService.getConnectionRequests(authStore.profile.id),
          platformService.getOpportunities(),
          platformService.getGroups()
        ]);
        requests = reqs.filter(r => r.receiver_id === authStore.profile?.id);
        myOpportunities = opps.filter(o => o.author_id === authStore.profile?.id);
        groups = grps;
      }
    } catch (e) {
      console.warn('Alumni dashboard load error:', e);
    } finally {
      isLoading = false;
    }
  });

  async function handleAccept(reqId: string) {
    const res = await platformService.updateConnectionRequestStatus(reqId, 'accepted');
    if (res.success) {
      toastStore.success('Permintaan koneksi berhasil diterima!');
      const idx = requests.findIndex(r => r.id === reqId);
      if (idx !== -1) requests[idx].status = 'accepted';
    } else {
      toastStore.error(res.error || 'Gagal menerima permintaan');
    }
  }

  async function handleReject(reqId: string) {
    const res = await platformService.updateConnectionRequestStatus(reqId, 'rejected');
    if (res.success) {
      toastStore.info('Permintaan koneksi ditolak.');
      const idx = requests.findIndex(r => r.id === reqId);
      if (idx !== -1) requests[idx].status = 'rejected';
    } else {
      toastStore.error(res.error || 'Gagal memperbarui status');
    }
  }

  async function handleToggleMentor() {
    isMentorAvailable = !isMentorAvailable;
    if (authStore.profile) {
      await platformService.updateProfile(authStore.profile.id, {
        is_mentor: isMentorAvailable,
        mentor_topics: mentorTopics
      });
      toastStore.success(`Status mentor diperbarui: ${isMentorAvailable ? 'Tersedia' : 'Sedang Istirahat'}`);
    }
  }

  async function handleCreateOpportunity(e: SubmitEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !authStore.profile) return;

    const res = await platformService.createOpportunity({
      author_id: authStore.profile.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      type: newType,
      company_or_org: newCompany,
      location: newLocation,
      requirements: newReqs.split(',').map(s => s.trim()).filter(Boolean),
      status: 'published',
      is_approved: true
    });

    if (res.success) {
      toastStore.success('Peluang baru berhasil dipublikasikan untuk mahasiswa!');
      isCreateModalOpen = false;
      newTitle = '';
      newDesc = '';
      const opps = await platformService.getOpportunities();
      myOpportunities = opps.filter(o => o.author_id === authStore.profile?.id);
    } else {
      toastStore.error(res.error || 'Gagal mempublikasikan peluang');
    }
  }
</script>

<svelte:head>
  <title>Portal Alumni & Mentor | UT REKA</title>
</svelte:head>

<div class="space-y-6 w-full">
  <!-- 1. Header Banner Portal Alumni -->
  <div class="relative overflow-hidden rounded-3xl bg-[#101B35] p-6 sm:p-7 text-white shadow-sm border border-[#101B35]/30">
    <div class="absolute -right-8 -bottom-8 w-64 h-64 bg-[#3157D5]/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-0 right-1/4 w-40 h-40 bg-[#FFC83D]/10 rounded-full blur-2xl pointer-events-none"></div>

    <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div class="space-y-2.5">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white uppercase tracking-wider">
          <HeartHandshake class="w-3.5 h-3.5 text-[#FFC83D]" />
          <span>Jaringan Alumni & Mentor UT</span>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight font-heading text-white">
            Selamat Datang, {authStore.profile?.full_name || 'Alumni UT'} 👋
          </h1>
          <p class="text-xs sm:text-sm text-gray-300 mt-1">
            {authStore.profile?.job_title || 'Profesional'} {authStore.profile?.company ? `@ ${authStore.profile?.company}` : ''} • Alumni {authStore.profile?.study_program || 'Universitas Terbuka'}
          </p>
        </div>

        <!-- Quick Info Badges -->
        <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 text-white border border-white/15 font-medium">
            <ShieldCheck class="w-3.5 h-3.5 text-[#FFC83D]" />
            Mentor Terverifikasi
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 text-white border border-white/15 font-medium">
            <span class="w-2 h-2 rounded-full {isMentorAvailable ? 'bg-emerald-400' : 'bg-gray-400'}"></span>
            {isMentorAvailable ? 'Status: Tersedia Membimbing Mahasiswa' : 'Status: Sedang Istirahat'}
          </span>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2.5 sm:self-center">
        <button 
          type="button"
          onclick={() => isCreateModalOpen = true}
          class="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-bold transition shadow-sm touch-manipulation active:scale-95"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Buat Peluang Baru</span>
        </button>
        <a 
          href="/dashboard/messages" 
          class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition relative min-h-[42px] min-w-[42px] flex items-center justify-center touch-manipulation border border-white/10"
          title="Pesan Masuk"
        >
          <Bell class="w-4 h-4 text-[#FFC83D]" />
          {#if requests.filter(r => r.status === 'pending').length > 0}
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFC83D] rounded-full"></span>
          {/if}
        </a>
      </div>
    </div>
  </div>

  <!-- 2. Quick Stat Cards (Responsive 4-column Grid) -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
    <div class="p-4 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
        <Clock class="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#101B35] font-heading leading-none">
          {requests.filter(r => r.status === 'pending').length}
        </div>
        <div class="text-[11px] text-[#68738A] font-semibold mt-1">Permintaan Baru</div>
      </div>
    </div>

    <div class="p-4 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center shrink-0">
        <Users class="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#101B35] font-heading leading-none">
          {requests.filter(r => r.status === 'accepted').length + 8}
        </div>
        <div class="text-[11px] text-[#68738A] font-semibold mt-1">Mahasiswa Dibimbing</div>
      </div>
    </div>

    <div class="p-4 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center shrink-0">
        <Briefcase class="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#101B35] font-heading leading-none">
          {myOpportunities.length}
        </div>
        <div class="text-[11px] text-[#68738A] font-semibold mt-1">Peluang Aktif</div>
      </div>
    </div>

    <div class="p-4 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-amber-50 text-[#101B35] flex items-center justify-center shrink-0">
        <MessageSquare class="w-5 h-5 stroke-[2.5] text-[#3157D5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#101B35] font-heading leading-none">5</div>
        <div class="text-[11px] text-[#68738A] font-semibold mt-1">Sesi Diskusi</div>
      </div>
    </div>
  </div>

  <!-- 3. Two-Column Layout on Desktop (7 cols requests, 5 cols settings & opportunities) -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- LEFT COLUMN: Permintaan Mentoring Masuk (7 cols) -->
    <div class="lg:col-span-7 space-y-4">
      <div class="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E8EF] pb-3.5">
          <div>
            <h2 class="text-sm sm:text-base font-black text-[#101B35] uppercase tracking-wider font-heading">
              Permintaan Mentoring Masuk
            </h2>
            <p class="text-[11px] text-[#68738A]">Mahasiswa yang mengajukan bimbingan karier kepada Anda</p>
          </div>

          <!-- Filter Tabs -->
          <div class="flex items-center gap-1 bg-[#F7F6F2] p-1 rounded-xl border border-[#E5E8EF] text-xs">
            <button 
              type="button"
              onclick={() => requestFilter = 'all'}
              class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition touch-manipulation
                {requestFilter === 'all' ? 'bg-[#101B35] text-white shadow-xs' : 'text-[#68738A] hover:text-[#101B35]'}"
            >
              Semua ({requests.length})
            </button>
            <button 
              type="button"
              onclick={() => requestFilter = 'pending'}
              class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition touch-manipulation
                {requestFilter === 'pending' ? 'bg-[#101B35] text-white shadow-xs' : 'text-[#68738A] hover:text-[#101B35]'}"
            >
              Menunggu ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button 
              type="button"
              onclick={() => requestFilter = 'accepted'}
              class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition touch-manipulation
                {requestFilter === 'accepted' ? 'bg-[#101B35] text-white shadow-xs' : 'text-[#68738A] hover:text-[#101B35]'}"
            >
              Diterima ({requests.filter(r => r.status === 'accepted').length})
            </button>
          </div>
        </div>

        {#if isLoading}
          <div class="p-8 text-center text-xs text-[#68738A]">
            <div class="inline-block animate-spin mb-2">⏳</div>
            <p>Memuat permintaan bimbingan mahasiswa...</p>
          </div>
        {:else if filteredRequests.length === 0}
          <div class="p-8 text-center space-y-2 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF]">
            <HeartHandshake class="w-8 h-8 text-[#68738A]/50 mx-auto" />
            <p class="text-xs font-bold text-[#101B35]">Tidak ada permintaan pada kategori ini</p>
            <p class="text-[11px] text-[#68738A]">Permintaan baru dari mahasiswa UT akan langsung muncul di sini.</p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each filteredRequests as req (req.id)}
              <div class="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] space-y-3 hover:border-[#3157D5]/40 transition">
                <div class="flex items-start gap-3">
                  <img 
                    src={req.sender?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                    alt={req.sender?.full_name} 
                    class="w-11 h-11 rounded-xl object-cover ring-2 ring-[#3157D5]/20 shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <h3 class="text-xs sm:text-sm font-extrabold text-[#101B35] truncate">{req.sender?.full_name || 'Mahasiswa UT'}</h3>
                      <span class="text-[10px] font-bold text-[#3157D5] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#3157D5]/15">MHS</span>
                    </div>
                    <p class="text-[11px] text-[#68738A] truncate mt-0.5 font-medium">
                      Prodi: {req.sender?.study_program || 'Sistem Informasi'} • NIM: {req.sender?.nim || '-'}
                    </p>
                  </div>
                </div>

                <!-- Pesan Pengajuan Mahasiswa -->
                <div class="p-3 rounded-xl bg-white border border-[#E5E8EF] text-xs text-[#20283B] leading-relaxed italic">
                  "{req.note || 'Halo Kak, saya mahasiswa UT ingin berkonsultasi mengenai jalur karier dan bimbingan portofolio.'}"
                </div>

                <!-- Actions -->
                <div class="pt-1 flex items-center justify-between gap-2">
                  {#if req.status === 'pending'}
                    <div class="flex items-center gap-2 w-full">
                      <button 
                        type="button"
                        onclick={() => handleReject(req.id)}
                        class="flex-1 py-2 px-3 rounded-xl border border-[#E5E8EF] bg-white text-[#68738A] text-xs font-bold hover:bg-[#F7F6F2] hover:text-[#101B35] transition touch-manipulation min-h-[40px]"
                      >
                        Tolak
                      </button>
                      <button 
                        type="button"
                        onclick={() => handleAccept(req.id)}
                        class="flex-1 py-2 px-3 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition touch-manipulation min-h-[40px] flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check class="w-3.5 h-3.5" />
                        <span>Terima Bimbingan</span>
                      </button>
                    </div>
                  {:else if req.status === 'accepted'}
                    <div class="flex items-center justify-between w-full">
                      <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#3157D5]">
                        <CheckCircle2 class="w-4 h-4 text-[#3157D5]" />
                        <span>Bimbingan Aktif</span>
                      </span>
                      <a 
                        href="/dashboard/messages" 
                        class="text-xs font-bold text-[#101B35] bg-white border border-[#E5E8EF] hover:bg-[#101B35] hover:text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 touch-manipulation"
                      >
                        <span>Buka Chat</span>
                        <ChevronRight class="w-3.5 h-3.5" />
                      </a>
                    </div>
                  {:else}
                    <span class="text-xs font-bold text-[#68738A]">Permintaan Ditolak</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- RIGHT COLUMN: Mentor Availability, Published Opportunities & Tips (5 cols) -->
    <div class="lg:col-span-5 space-y-4">
      <!-- Card: Ketersediaan Mentor -->
      <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-0.5 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <HeartHandshake class="w-4 h-4 text-[#3157D5]" />
              <h3 class="text-xs sm:text-sm font-black text-[#101B35] uppercase tracking-wider font-heading">
                Status Ketersediaan
              </h3>
            </div>
            <p class="text-[11px] text-[#68738A]">
              {isMentorAvailable ? 'Profil aktif di rekomendasi bimbingan' : 'Sedang tidak menerima permohonan baru'}
            </p>
          </div>

          <button 
            type="button"
            onclick={handleToggleMentor}
            aria-label="Ubah status ketersediaan mentoring"
            class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none touch-manipulation
              {isMentorAvailable ? 'bg-[#3157D5]' : 'bg-gray-300'}"
            role="switch"
            aria-checked={isMentorAvailable}
          >
            <span 
              class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                {isMentorAvailable ? 'translate-x-5' : 'translate-x-0'}"
            ></span>
          </button>
        </div>

        <!-- Mentoring Topics Tag Pills -->
        <div class="pt-2 border-t border-[#E5E8EF] space-y-2">
          <p class="text-[11px] font-bold text-[#68738A]">Topik Bimbingan yang Anda Buka:</p>
          <div class="flex flex-wrap gap-1.5">
            {#each mentorTopics as topic}
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/15">
                {topic}
              </span>
            {/each}
          </div>
        </div>
      </div>

      <!-- Card: Peluang & Lowongan dari Anda -->
      <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
        <div class="flex items-center justify-between border-b border-[#E5E8EF] pb-2.5">
          <div>
            <h3 class="text-xs sm:text-sm font-black text-[#101B35] uppercase tracking-wider font-heading">
              Peluang dari Anda
            </h3>
            <p class="text-[11px] text-[#68738A]">Lowongan magang & proyek yang Anda buka</p>
          </div>
          <button 
            type="button"
            onclick={() => isCreateModalOpen = true}
            class="text-[11px] font-bold text-[#3157D5] hover:underline flex items-center gap-0.5"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>

        {#if myOpportunities.length === 0}
          <div class="p-6 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] text-center space-y-2">
            <Briefcase class="w-7 h-7 text-[#68738A]/50 mx-auto" />
            <p class="text-xs font-bold text-[#101B35]">Belum ada peluang yang Anda publikasikan</p>
            <p class="text-[11px] text-[#68738A]">Bagikan info magang atau sesi bimbingan portofolio bagi mahasiswa UT.</p>
            <button 
              type="button"
              onclick={() => isCreateModalOpen = true}
              class="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition touch-manipulation mt-1 shadow-xs"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Publikasikan Sekarang</span>
            </button>
          </div>
        {:else}
          <div class="space-y-2.5">
            {#each myOpportunities as opp (opp.id)}
              <div class="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] space-y-1.5 hover:border-[#3157D5]/40 transition">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/15">
                    {opp.type}
                  </span>
                  <span class="text-[10px] text-[#68738A] flex items-center gap-1">
                    <MapPin class="w-2.5 h-2.5" />
                    <span>{opp.location}</span>
                  </span>
                </div>
                <h4 class="text-xs font-extrabold text-[#101B35] leading-snug">{opp.title}</h4>
                <p class="text-[11px] text-[#68738A] line-clamp-2">{opp.description}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Card: Tips Bimbingan Alumni -->
      <div class="p-5 rounded-3xl bg-[#F7F6F2] border border-[#E5E8EF] shadow-xs space-y-2.5 text-xs">
        <div class="flex items-center gap-2 text-[#101B35] font-bold">
          <Lightbulb class="w-4 h-4 text-[#FFC83D]" />
          <span>Panduan Singkat Mentor UT REKA</span>
        </div>
        <p class="text-[11px] text-[#68738A] leading-relaxed">
          • Mahasiswa UT belajar mandiri. Berikan masukan langsung pada portofolio atau CV agar bimbingan efisien.
        </p>
        <p class="text-[11px] text-[#68738A] leading-relaxed">
          • Gunakan fitur Pesan untuk menyepakati jadwal Zoom atau Google Meet yang fleksibel.
        </p>
      </div>
    </div>
  </div>

  <!-- ========================================================
       SECTION: GRUP MENTORING & KOMUNITAS ALUMNI
       ======================================================== -->
  <div class="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E8EF] shadow-2xs space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E8EF] pb-5">
      <div>
        <div class="inline-flex items-center gap-1.5 text-xs font-bold text-[#3157D5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full mb-1">
          <Users class="w-3.5 h-3.5" />
          <span>Jejaring Kolaborasi</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-[#101B35] font-heading">
          Grup Mentoring & Komunitas Alumni
        </h2>
        <p class="text-xs text-[#68738A] mt-0.5 max-w-xl">
          Buka kelompok bimbingan karier tematik, ruang sharing alumni, atau forum diskusi prodi.
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
        onclick={() => groupFilter = 'mentoring'}
        class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'mentoring' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
      >
        Grup Mentoring
      </button>
      <button 
        type="button" 
        onclick={() => groupFilter = 'alumni'}
        class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'alumni' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
      >
        Komunitas Alumni
      </button>
      <button 
        type="button" 
        onclick={() => groupFilter = 'karier'}
        class="px-3.5 py-1.5 rounded-xl transition {groupFilter === 'karier' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-[#F7F6F2] hover:bg-slate-200 text-[#101B35]'}"
      >
        Karier & Industri
      </button>
    </div>

    <!-- Groups Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each filteredGroups as group (group.id)}
        <div class="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5E8EF] hover:border-[#3157D5]/40 hover:bg-white transition-all space-y-3.5 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full
                {group.category === 'mentoring' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                 group.category === 'alumni' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                 group.category === 'karier' || group.category === 'proyek' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
                {group.category === 'mentoring' ? 'Mentoring' :
                 group.category === 'alumni' ? 'Komunitas Alumni' :
                 group.category === 'karier' ? 'Karier & Industri' :
                 group.category === 'proyek' ? 'Proyek Kolaboratif' :
                 group.category === 'prodi' ? 'Prodi UT' : 'Grup Terbuka'}
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

          <!-- Footer: Creator info + Action Button -->
          <div class="pt-3 border-t border-[#E5E8EF] flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
              <img 
                src={group.creator?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80'} 
                alt={group.creator?.full_name || 'Inisiator'} 
                class="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 bg-white"
              />
              <div class="text-[11px] truncate">
                <span class="text-[#68738A]">Oleh: </span>
                <span class="font-bold text-[#101B35]">{group.creator?.full_name || 'Alumni IKA UT'}</span>
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

<!-- Modal: Buat Peluang Baru -->
{#if isCreateModalOpen}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-5 border border-[#E5E8EF]">
      <div class="flex items-center justify-between border-b border-[#E5E8EF] pb-3">
        <div>
          <h3 class="text-base font-extrabold text-[#101B35]">Publikasikan Peluang Baru</h3>
          <p class="text-xs text-[#68738A]">Buka akses magang, proyek, atau bimbingan bagi mahasiswa UT</p>
        </div>
        <button 
          type="button"
          onclick={() => isCreateModalOpen = false}
          class="p-1 rounded-lg text-[#68738A] hover:text-[#101B35] touch-manipulation"
          aria-label="Tutup modal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form onsubmit={handleCreateOpportunity} class="space-y-4 text-xs">
        <div>
          <label for="opp-title" class="block font-bold text-[#101B35] uppercase mb-1">Judul Peluang / Posisi</label>
          <input 
            id="opp-title"
            type="text"
            required
            bind:value={newTitle}
            placeholder="Contoh: Magang Frontend Developer (Sistem Informasi)"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="opp-type" class="block font-bold text-[#101B35] uppercase mb-1">Tipe Peluang</label>
            <select 
              id="opp-type"
              bind:value={newType}
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
            >
              <option value="mentoring">Sesi Mentoring</option>
              <option value="internship">Magang (Internship)</option>
              <option value="project">Proyek Freelance</option>
              <option value="job">Lowongan Kerja</option>
            </select>
          </div>

          <div>
            <label for="opp-location" class="block font-bold text-[#101B35] uppercase mb-1">Lokasi Kerja</label>
            <input 
              id="opp-location"
              type="text"
              required
              bind:value={newLocation}
              placeholder="Contoh: Remote / Jakarta"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
            />
          </div>
        </div>

        <div>
          <label for="opp-company" class="block font-bold text-[#101B35] uppercase mb-1">Nama Perusahaan / Organisasi</label>
          <input 
            id="opp-company"
            type="text"
            required
            bind:value={newCompany}
            placeholder="Contoh: PT Teknologi Bangsa / Alumni Network"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
          />
        </div>

        <div>
          <label for="opp-desc" class="block font-bold text-[#101B35] uppercase mb-1">Deskripsi Lengkap</label>
          <textarea 
            id="opp-desc"
            required
            rows="3"
            bind:value={newDesc}
            placeholder="Jelaskan peran, tanggung jawab, dan kriteria kualifikasi..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
          ></textarea>
        </div>

        <div>
          <label for="opp-reqs" class="block font-bold text-[#101B35] uppercase mb-1">Persyaratan (Pisahkan dengan koma)</label>
          <input 
            id="opp-reqs"
            type="text"
            bind:value={newReqs}
            placeholder="Mahasiswa aktif UT, Dasar JavaScript, Portofolio GitHub"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
          />
        </div>

        <div class="pt-3 border-t border-[#E5E8EF] flex items-center justify-end gap-2">
          <button 
            type="button"
            onclick={() => isCreateModalOpen = false}
            class="px-4 py-2.5 rounded-xl border border-[#E5E8EF] text-[#68738A] font-bold hover:bg-[#F7F6F2] hover:text-[#101B35] touch-manipulation transition"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="px-5 py-2.5 rounded-xl bg-[#3157D5] text-white font-bold hover:bg-[#2646B8] transition touch-manipulation shadow-xs"
          >
            Publikasikan Peluang
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Modal: Bikin Grup Mentoring / Komunitas Baru -->
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
            <h3 class="text-base font-black text-[#101B35] font-heading">Bikin Grup Mentoring / Komunitas</h3>
            <p class="text-xs text-[#68738A]">Buka ruang bimbingan atau jaringan sesama alumni UT</p>
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
          <label for="alumni-grp-name" class="block font-bold text-[#101B35] uppercase mb-1">Nama Grup</label>
          <input 
            id="alumni-grp-name"
            type="text"
            required
            bind:value={newGroupName}
            placeholder="Contoh: Mentoring Karier IT & Persiapan BUMN 2026"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="alumni-grp-cat" class="block font-bold text-[#101B35] uppercase mb-1">Kategori</label>
            <select 
              id="alumni-grp-cat"
              bind:value={newGroupCategory}
              class="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] bg-white font-medium"
            >
              <option value="mentoring">Grup Mentoring Tematik</option>
              <option value="alumni">Komunitas Alumni IKA UT</option>
              <option value="karier">Karier & Lowongan Kerja</option>
              <option value="prodi">Fakultas / Prodi Khusus</option>
              <option value="upbjj">Jejaring Daerah / UPBJJ</option>
            </select>
          </div>

          <div>
            <label for="alumni-grp-prodi" class="block font-bold text-[#101B35] uppercase mb-1">Fokus Bidang / Prodi</label>
            <input 
              id="alumni-grp-prodi"
              type="text"
              bind:value={newGroupProdi}
              placeholder="Contoh: Sistem Informasi / Semua"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] bg-white"
            />
          </div>
        </div>

        <div>
          <label for="alumni-grp-desc" class="block font-bold text-[#101B35] uppercase mb-1">Deskripsi & Target Bimbingan</label>
          <textarea 
            id="alumni-grp-desc"
            rows="3"
            required
            bind:value={newGroupDesc}
            placeholder="Jelaskan topik yang akan dipelajari, silabus diskusi, atau kriteria peserta..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#101B35] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white leading-relaxed"
          ></textarea>
        </div>

        <div>
          <label for="alumni-grp-max" class="block font-bold text-[#101B35] uppercase mb-1">Kapasitas Maksimal Anggota</label>
          <input 
            id="alumni-grp-max"
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
            {isCreatingGroup ? 'Menerbitkan Grup...' : 'Terbitkan Grup'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
