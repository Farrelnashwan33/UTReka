<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import type { ConnectionRequest, Opportunity } from '$lib/types/database';
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

  onMount(async () => {
    isLoading = true;
    try {
      if (authStore.profile) {
        isMentorAvailable = authStore.profile.is_mentor;
        if (authStore.profile.mentor_topics?.length > 0) {
          mentorTopics = authStore.profile.mentor_topics;
        }

        const [reqs, opps] = await Promise.all([
          platformService.getConnectionRequests(authStore.profile.id),
          platformService.getOpportunities()
        ]);
        requests = reqs.filter(r => r.receiver_id === authStore.profile?.id);
        myOpportunities = opps.filter(o => o.author_id === authStore.profile?.id);
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
      // Refresh opportunities list
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
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18866B] via-[#10624e] to-[#183153] p-5 sm:p-6 lg:p-7 text-white shadow-md border border-[#18866B]/30">
    <div class="absolute -right-8 -bottom-8 w-56 h-56 bg-[#FFD43B]/15 rounded-full blur-2xl pointer-events-none"></div>

    <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider">
          <HeartHandshake class="w-3.5 h-3.5 text-[#FFD43B]" />
          <span>Jaringan Alumni & Mentor UT</span>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-black tracking-tight font-heading text-white">
            Selamat Datang, {authStore.profile?.full_name || 'Alumni UT'} 👋
          </h1>
          <p class="text-xs sm:text-sm text-emerald-100 mt-1">
            {authStore.profile?.job_title || 'Profesional'} {authStore.profile?.company ? `@ ${authStore.profile?.company}` : ''} • Alumni {authStore.profile?.study_program || 'Universitas Terbuka'}
          </p>
        </div>

        <!-- Quick Info Badges -->
        <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 text-emerald-200 border border-white/15 font-medium">
            <ShieldCheck class="w-3.5 h-3.5 text-[#FFD43B]" />
            Mentor Terverifikasi
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 text-white border border-white/15 font-medium">
            <span class="w-2 h-2 rounded-full {isMentorAvailable ? 'bg-emerald-400' : 'bg-gray-400'}"></span>
            {isMentorAvailable ? 'Status: Tersedia Menerima Mahasiswa' : 'Status: Istirahat'}
          </span>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2.5 sm:self-center">
        <button 
          type="button"
          onclick={() => isCreateModalOpen = true}
          class="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FFD43B] text-[#183153] text-xs font-black hover:bg-[#F2C41D] transition shadow-xs touch-manipulation active:scale-95"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>Buat Peluang Baru</span>
        </button>
        <a 
          href="/dashboard/messages" 
          class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition relative min-h-[42px] min-w-[42px] flex items-center justify-center touch-manipulation"
          title="Pesan Masuk"
        >
          <Bell class="w-4 h-4 text-[#FFD43B]" />
          {#if requests.filter(r => r.status === 'pending').length > 0}
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          {/if}
        </a>
      </div>
    </div>
  </div>

  <!-- 2. Quick Stat Cards (Responsive 4-column Grid) -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
    <div class="p-4 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
        <Clock class="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#183153] font-heading leading-none">
          {requests.filter(r => r.status === 'pending').length}
        </div>
        <div class="text-[11px] text-gray-500 font-semibold mt-1">Permintaan Baru</div>
      </div>
    </div>

    <div class="p-4 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-50 text-[#18866B] flex items-center justify-center shrink-0">
        <Users class="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#183153] font-heading leading-none">
          {requests.filter(r => r.status === 'accepted').length + 8}
        </div>
        <div class="text-[11px] text-gray-500 font-semibold mt-1">Mahasiswa Dibimbing</div>
      </div>
    </div>

    <div class="p-4 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
        <Briefcase class="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#183153] font-heading leading-none">
          {myOpportunities.length}
        </div>
        <div class="text-[11px] text-gray-500 font-semibold mt-1">Peluang Aktif</div>
      </div>
    </div>

    <div class="p-4 rounded-2xl bg-white border border-[#E7E5E0] shadow-xs flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-[#FFD43B]/25 text-[#183153] flex items-center justify-center shrink-0">
        <MessageSquare class="w-5 h-5 stroke-[2.5]" />
      </div>
      <div>
        <div class="text-xl font-black text-[#183153] font-heading leading-none">5</div>
        <div class="text-[11px] text-gray-500 font-semibold mt-1">Sesi Diskusi</div>
      </div>
    </div>
  </div>

  <!-- 3. Two-Column Layout on Desktop (7 cols requests, 5 cols settings & opportunities) -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- LEFT COLUMN: Permintaan Mentoring Masuk (7 cols) -->
    <div class="lg:col-span-7 space-y-4">
      <div class="p-4 sm:p-5 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E5E0] pb-3">
          <div>
            <h2 class="text-sm sm:text-base font-black text-[#183153] uppercase tracking-wider font-heading">
              Permintaan Mentoring Masuk
            </h2>
            <p class="text-[11px] text-gray-500">Mahasiswa yang mengajukan bimbingan karier kepada Anda</p>
          </div>

          <!-- Filter Tabs -->
          <div class="flex items-center gap-1.5 bg-[#FAF9F6] p-1 rounded-xl border border-[#E7E5E0] text-xs">
            <button 
              type="button"
              onclick={() => requestFilter = 'all'}
              class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition touch-manipulation
                {requestFilter === 'all' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'text-gray-600 hover:text-black'}"
            >
              Semua ({requests.length})
            </button>
            <button 
              type="button"
              onclick={() => requestFilter = 'pending'}
              class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition touch-manipulation
                {requestFilter === 'pending' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'text-gray-600 hover:text-black'}"
            >
              Menunggu ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button 
              type="button"
              onclick={() => requestFilter = 'accepted'}
              class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition touch-manipulation
                {requestFilter === 'accepted' ? 'bg-[#183153] text-[#FFD43B] shadow-xs' : 'text-gray-600 hover:text-black'}"
            >
              Diterima ({requests.filter(r => r.status === 'accepted').length})
            </button>
          </div>
        </div>

        {#if isLoading}
          <div class="p-8 text-center text-xs text-gray-500">
            <div class="inline-block animate-spin mb-2">⏳</div>
            <p>Memuat permintaan bimbingan mahasiswa...</p>
          </div>
        {:else if filteredRequests.length === 0}
          <div class="p-8 text-center space-y-2 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E0]">
            <HeartHandshake class="w-8 h-8 text-gray-400 mx-auto" />
            <p class="text-xs font-bold text-gray-700">Tidak ada permintaan pada kategori ini</p>
            <p class="text-[11px] text-gray-500">Permintaan baru dari mahasiswa UT akan langsung muncul di sini.</p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each filteredRequests as req (req.id)}
              <div class="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E0] space-y-3 hover:border-[#183153]/30 transition">
                <div class="flex items-start gap-3">
                  <img 
                    src={req.sender?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                    alt={req.sender?.full_name} 
                    class="w-11 h-11 rounded-xl object-cover ring-2 ring-[#FFD43B] shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <h3 class="text-xs sm:text-sm font-extrabold text-[#183153] truncate">{req.sender?.full_name || 'Mahasiswa UT'}</h3>
                      <span class="text-[10px] font-bold text-[#183153] bg-[#FFD43B]/40 px-2 py-0.5 rounded">MHS</span>
                    </div>
                    <p class="text-[11px] text-gray-600 truncate mt-0.5 font-medium">
                      Prodi: {req.sender?.study_program || 'Sistem Informasi'} • NIM: {req.sender?.nim || '-'}
                    </p>
                  </div>
                </div>

                <!-- Pesan Pengajuan Mahasiswa -->
                <div class="p-3 rounded-xl bg-white border border-[#E7E5E0] text-xs text-gray-700 leading-relaxed italic">
                  "{req.note || 'Halo Kak, saya mahasiswa UT ingin berkonsultasi mengenai jalur karier dan bimbingan portofolio.'}"
                </div>

                <!-- Actions -->
                <div class="pt-1 flex items-center justify-between gap-2">
                  {#if req.status === 'pending'}
                    <div class="flex items-center gap-2 w-full">
                      <button 
                        type="button"
                        onclick={() => handleReject(req.id)}
                        class="flex-1 py-2 px-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-100 transition touch-manipulation min-h-[40px]"
                      >
                        Tolak
                      </button>
                      <button 
                        type="button"
                        onclick={() => handleAccept(req.id)}
                        class="flex-1 py-2 px-3 rounded-xl bg-[#18866B] text-white text-xs font-bold hover:bg-[#0F5A47] transition touch-manipulation min-h-[40px] flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check class="w-3.5 h-3.5" />
                        <span>Terima Bimbingan</span>
                      </button>
                    </div>
                  {:else if req.status === 'accepted'}
                    <div class="flex items-center justify-between w-full">
                      <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#18866B]">
                        <CheckCircle2 class="w-4 h-4 text-[#18866B]" />
                        <span>Bimbingan Aktif</span>
                      </span>
                      <a 
                        href="/dashboard/messages" 
                        class="text-xs font-bold text-[#183153] bg-white border border-[#E7E5E0] hover:bg-[#183153] hover:text-[#FFD43B] px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 touch-manipulation"
                      >
                        <span>Buka Chat</span>
                        <ChevronRight class="w-3.5 h-3.5" />
                      </a>
                    </div>
                  {:else}
                    <span class="text-xs font-bold text-gray-400">Permintaan Ditolak</span>
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
      <div class="p-4 sm:p-5 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-0.5 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <HeartHandshake class="w-4 h-4 text-[#18866B]" />
              <h3 class="text-xs sm:text-sm font-black text-[#183153] uppercase tracking-wider font-heading">
                Status Ketersediaan
              </h3>
            </div>
            <p class="text-[11px] text-gray-500">
              {isMentorAvailable ? 'Profil aktif di rekomendasi bimbingan' : 'Sedang tidak menerima permohonan baru'}
            </p>
          </div>

          <button 
            type="button"
            onclick={handleToggleMentor}
            aria-label="Ubah status ketersediaan mentoring"
            class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none touch-manipulation
              {isMentorAvailable ? 'bg-[#18866B]' : 'bg-gray-300'}"
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
        <div class="pt-2 border-t border-[#E7E5E0] space-y-2">
          <p class="text-[11px] font-bold text-gray-600">Topik Bimbingan yang Anda Buka:</p>
          <div class="flex flex-wrap gap-1.5">
            {#each mentorTopics as topic}
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#FAF9F6] text-[#183153] border border-[#E7E5E0]">
                {topic}
              </span>
            {/each}
          </div>
        </div>
      </div>

      <!-- Card: Peluang & Lowongan dari Anda -->
      <div class="p-4 sm:p-5 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
        <div class="flex items-center justify-between border-b border-[#E7E5E0] pb-2.5">
          <div>
            <h3 class="text-xs sm:text-sm font-black text-[#183153] uppercase tracking-wider font-heading">
              Peluang dari Anda
            </h3>
            <p class="text-[11px] text-gray-500">Lowongan magang & proyek yang Anda buka</p>
          </div>
          <button 
            type="button"
            onclick={() => isCreateModalOpen = true}
            class="text-[11px] font-bold text-[#18866B] hover:underline flex items-center gap-0.5"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>

        {#if myOpportunities.length === 0}
          <div class="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E0] text-center space-y-2">
            <Briefcase class="w-7 h-7 text-gray-400 mx-auto" />
            <p class="text-xs font-bold text-gray-700">Belum ada peluang yang Anda publikasikan</p>
            <p class="text-[11px] text-gray-500">Bagikan info magang atau sesi bimbingan portofolio bagi adik tingkat UT.</p>
            <button 
              type="button"
              onclick={() => isCreateModalOpen = true}
              class="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#183153] text-[#FFD43B] text-xs font-bold hover:bg-[#102138] transition touch-manipulation mt-1"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Publikasikan Sekarang</span>
            </button>
          </div>
        {:else}
          <div class="space-y-2.5">
            {#each myOpportunities as opp (opp.id)}
              <div class="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E7E5E0] space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-[#18866B]">
                    {opp.type}
                  </span>
                  <span class="text-[10px] text-gray-500 flex items-center gap-1">
                    <MapPin class="w-2.5 h-2.5" />
                    <span>{opp.location}</span>
                  </span>
                </div>
                <h4 class="text-xs font-extrabold text-[#183153] leading-snug">{opp.title}</h4>
                <p class="text-[11px] text-gray-600 line-clamp-2">{opp.description}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Card: Tips Bimbingan Alumni -->
      <div class="p-4 sm:p-5 rounded-3xl bg-[#FAF9F6] border border-[#E7E5E0] shadow-xs space-y-2.5 text-xs">
        <div class="flex items-center gap-2 text-[#183153] font-bold">
          <Lightbulb class="w-4 h-4 text-[#FFD43B]" />
          <span>Panduan Singkat Mentor UT REKA</span>
        </div>
        <p class="text-[11px] text-gray-600 leading-relaxed">
          • Mahasiswa UT belajar mandiri. Berikan masukan langsung pada portofolio atau CV agar bimbingan efisien.
        </p>
        <p class="text-[11px] text-gray-600 leading-relaxed">
          • Gunakan fitur Pesan untuk menyepakati jadwal Zoom atau Google Meet yang fleksibel.
        </p>
      </div>
    </div>
  </div>
</div>

<!-- Modal: Buat Peluang Baru -->
{#if isCreateModalOpen}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-5">
      <div class="flex items-center justify-between border-b border-[#E7E5E0] pb-3">
        <div>
          <h3 class="text-base font-extrabold text-[#183153]">Publikasikan Peluang Baru</h3>
          <p class="text-xs text-gray-500">Buka akses magang, proyek, atau bimbingan bagi mahasiswa UT</p>
        </div>
        <button 
          type="button"
          onclick={() => isCreateModalOpen = false}
          class="p-1 rounded-lg text-gray-400 hover:text-black touch-manipulation"
          aria-label="Tutup modal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form onsubmit={handleCreateOpportunity} class="space-y-4 text-xs">
        <div>
          <label for="opp-title" class="block font-bold text-gray-700 uppercase mb-1">Judul Peluang / Posisi</label>
          <input 
            id="opp-title"
            type="text"
            required
            bind:value={newTitle}
            placeholder="Contoh: Magang Frontend Developer (Sistem Informasi)"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="opp-type" class="block font-bold text-gray-700 uppercase mb-1">Tipe Peluang</label>
            <select 
              id="opp-type"
              bind:value={newType}
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
            >
              <option value="mentoring">Sesi Mentoring</option>
              <option value="internship">Magang (Internship)</option>
              <option value="project">Proyek Freelance</option>
              <option value="job">Lowongan Kerja</option>
            </select>
          </div>

          <div>
            <label for="opp-location" class="block font-bold text-gray-700 uppercase mb-1">Lokasi Kerja</label>
            <input 
              id="opp-location"
              type="text"
              required
              bind:value={newLocation}
              placeholder="Contoh: Remote / Jakarta"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
            />
          </div>
        </div>

        <div>
          <label for="opp-company" class="block font-bold text-gray-700 uppercase mb-1">Nama Perusahaan / Organisasi</label>
          <input 
            id="opp-company"
            type="text"
            required
            bind:value={newCompany}
            placeholder="Contoh: PT Teknologi Bangsa / Alumni Network"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
        </div>

        <div>
          <label for="opp-desc" class="block font-bold text-gray-700 uppercase mb-1">Deskripsi Lengkap</label>
          <textarea 
            id="opp-desc"
            required
            rows="3"
            bind:value={newDesc}
            placeholder="Jelaskan peran, tanggung jawab, dan kriteria kualifikasi..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          ></textarea>
        </div>

        <div>
          <label for="opp-reqs" class="block font-bold text-gray-700 uppercase mb-1">Persyaratan (Pisahkan dengan koma)</label>
          <input 
            id="opp-reqs"
            type="text"
            bind:value={newReqs}
            placeholder="Mahasiswa aktif UT, Dasar JavaScript, Portofolio GitHub"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
        </div>

        <div class="pt-3 border-t border-[#E7E5E0] flex items-center justify-end gap-2">
          <button 
            type="button"
            onclick={() => isCreateModalOpen = false}
            class="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 touch-manipulation"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="px-5 py-2.5 rounded-xl bg-[#183153] text-[#FFD43B] font-black hover:bg-[#102138] transition touch-manipulation shadow-xs"
          >
            Publikasikan Peluang
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
