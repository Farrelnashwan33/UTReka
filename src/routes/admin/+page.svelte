<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import DashboardBottomNav from '$lib/components/DashboardBottomNav.svelte';
  import type { 
    Profile, 
    VerificationRequestItem, 
    ReportItem, 
    Opportunity, 
    AuditLogItem 
  } from '$lib/types/database';
  import { 
    ShieldAlert, 
    Users, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    Search, 
    Filter, 
    Briefcase, 
    Clock, 
    Lock, 
    FileText, 
    Activity,
    ExternalLink,
    X,
    Check,
    ArrowLeft,
    BarChart3,
    Shield,
    Sparkles,
    CheckSquare,
    AlertCircle,
    UserCheck,
    Building2,
    Eye,
    ShieldCheck,
    RefreshCw
  } from 'lucide-svelte';

  let activeTab = $state<'stats' | 'users' | 'verifications' | 'reports' | 'opportunities' | 'audit'>('stats');
  let stats = $state({
    totalStudents: 0,
    totalAlumni: 0,
    totalOpportunities: 0,
    pendingVerifications: 0
  });

  let users = $state<Profile[]>([]);
  let verifications = $state<VerificationRequestItem[]>([]);
  let reports = $state<ReportItem[]>([]);
  let opportunities = $state<Opportunity[]>([]);
  let auditLogs = $state<AuditLogItem[]>([]);
  let isLoading = $state(true);

  // Search & Filter
  let userSearch = $state('');
  let userRoleFilter = $state('all');

  // Verification Review Modal
  let selectedVerification = $state<VerificationRequestItem | null>(null);
  let adminFeedback = $state('');
  let isReviewModalOpen = $state(false);

  // Report Review Modal
  let selectedReport = $state<ReportItem | null>(null);
  let adminReportNotes = $state('');
  let isReportReviewModalOpen = $state(false);

  async function loadAdminData() {
    isLoading = true;
    try {
      const [st, u, v, r, opp, logs] = await Promise.all([
        platformService.getAdminStats(),
        platformService.getAllUsers(),
        platformService.getVerificationRequests(),
        platformService.getReports(),
        platformService.getOpportunities(),
        platformService.getAuditLogs()
      ]);
      stats = st;
      users = u;
      verifications = v;
      reports = r;
      opportunities = opp;
      auditLogs = logs;
    } catch (e) {
      console.warn('Failed to load admin data:', e);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadAdminData();
  });

  // Verification action
  async function handleReviewVerification(status: 'verified' | 'rejected') {
    if (!selectedVerification) return;
    const res = await platformService.reviewVerification(selectedVerification.id, status, adminFeedback);
    if (res.success) {
      toastStore.success(`Permintaan verifikasi ${status === 'verified' ? 'disetujui' : 'ditolak'}`);
      isReviewModalOpen = false;
      selectedVerification = null;
      adminFeedback = '';
      loadAdminData();
    } else {
      toastStore.error(res.error || 'Gagal memproses verifikasi');
    }
  }

  // Report action
  async function handleReviewReport(status: 'resolved' | 'dismissed') {
    if (!selectedReport) return;
    const res = await platformService.reviewReport(selectedReport.id, status, adminReportNotes);
    if (res.success) {
      toastStore.success(`Laporan telah ditandai sebagai: ${status}`);
      isReportReviewModalOpen = false;
      selectedReport = null;
      adminReportNotes = '';
      loadAdminData();
    } else {
      toastStore.error(res.error || 'Gagal memproses laporan');
    }
  }

  // Toggle user activation
  async function handleToggleUserStatus(user: Profile) {
    const nextStatus = !user.is_active;
    await platformService.updateProfile(user.id, { is_active: nextStatus });
    toastStore.info(`Akun ${user.full_name} telah ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
    loadAdminData();
  }

  // Quick verify user directly
  async function handleQuickVerifyUser(user: Profile) {
    const res = await platformService.setVerificationStatus(user.id, 'verified');
    if (res.success) {
      toastStore.success(`Akun ${user.full_name} (${user.nim || 'NIM'}) berhasil diverifikasi!`);
      loadAdminData();
    } else {
      toastStore.error(res.error || 'Gagal memverifikasi pengguna');
    }
  }

  let filteredUsers = $derived(
    users.filter(u => {
      if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
      if (userSearch) {
        const q = userSearch.toLowerCase();
        return (
          u.full_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.nim || '').toLowerCase().includes(q)
        );
      }
      return true;
    })
  );

  let pendingVerifCount = $derived(verifications.filter(v => v.status === 'pending').length);
  let pendingReportCount = $derived(reports.filter(r => r.status === 'pending').length);
</script>

<svelte:head>
  <title>Admin Control Center — UT REKA</title>
</svelte:head>

<div class="min-h-screen bg-[#FBFBFA] p-3 sm:p-5 lg:p-8 antialiased selection:bg-[#1E40AF] selection:text-white">
  <div class="max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-28 md:pb-12">
    <!-- Top Nav Header: Responsive for Mobile & Desktop -->
    <div class="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#1E40AF] via-[#1D4ED8] to-[#1E3A8A] p-5 sm:p-6 lg:p-7 text-white shadow-md border border-[#3B82F6]/30">
      <div class="absolute -right-8 -bottom-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start sm:items-center gap-3.5">
          <a href="/" title="UT REKA" class="shrink-0 group">
            <div class="p-1.5 rounded-xl bg-white shadow-xs">
              <img 
                src="/images/ut-reka-logo-transparent.png" 
                alt="UT REKA Relasi Karir" 
                class="h-10 w-auto object-contain group-hover:scale-102 transition-transform" 
              />
            </div>
          </a>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg sm:text-2xl font-black font-heading tracking-tight text-white">
                Admin Control Center
              </h1>
              <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500 text-white shadow-xs">
                Privileged
              </span>
            </div>
            <p class="text-xs sm:text-sm text-blue-100 mt-0.5">
              Pusat Pengawasan, Tata Kelola & Integritas Komunitas UT REKA
            </p>
          </div>
        </div>

        <!-- Mode Switchers & Exit Button -->
        <div class="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
          <a 
            href="/dashboard/student"
            class="text-xs font-bold bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 rounded-xl border border-white/20 transition touch-manipulation flex items-center gap-1.5"
          >
            <Eye class="w-3.5 h-3.5 text-blue-200" />
            <span>Mode Mahasiswa</span>
          </a>
          <a 
            href="/dashboard/alumni"
            class="text-xs font-bold bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] px-3.5 py-2 rounded-xl transition shadow-xs touch-manipulation flex items-center gap-1.5"
          >
            <UserCheck class="w-3.5 h-3.5 text-[#0F172A]" />
            <span>Mode Alumni</span>
          </a>
          <a 
            href="/"
            class="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl border border-white/15 transition touch-manipulation flex items-center gap-1"
            title="Keluar ke Landing Page"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Landing</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Alert Banner (Jika ada verifikasi / laporan tertunda) -->
    {#if pendingVerifCount > 0 || pendingReportCount > 0}
      <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
        <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div class="space-y-0.5 flex-1">
          <p class="font-extrabold text-amber-950">Perhatian Administrator Sistem:</p>
          <p class="text-amber-800">
            Terdapat <strong>{pendingVerifCount}</strong> permohonan verifikasi NIM dan <strong>{pendingReportCount}</strong> laporan komunitas yang membutuhkan peninjauan administratif.
          </p>
        </div>
      </div>
    {/if}

    <!-- Navigation Tabs (Touch-friendly & Horizontal Scroll on Mobile) -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-[#E2E8F0]">
      <button 
        type="button"
        onclick={() => activeTab = 'stats'}
        class="px-4 py-2.5 rounded-2xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 touch-manipulation
          {activeTab === 'stats' ? 'bg-[#1E40AF] text-white shadow-xs' : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'}"
      >
        <BarChart3 class="w-3.5 h-3.5" />
        <span>Statistik Platform</span>
      </button>

      <button 
        type="button"
        onclick={() => activeTab = 'users'}
        class="px-4 py-2.5 rounded-2xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 touch-manipulation
          {activeTab === 'users' ? 'bg-[#1E40AF] text-white shadow-xs' : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'}"
      >
        <Users class="w-3.5 h-3.5" />
        <span>Pengguna ({users.length})</span>
      </button>

      <button 
        type="button"
        onclick={() => activeTab = 'verifications'}
        class="px-4 py-2.5 rounded-2xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 touch-manipulation
          {activeTab === 'verifications' ? 'bg-[#1E40AF] text-white shadow-xs' : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'}"
      >
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>Verifikasi NIM</span>
        {#if pendingVerifCount > 0}
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        {/if}
      </button>

      <button 
        type="button"
        onclick={() => activeTab = 'reports'}
        class="px-4 py-2.5 rounded-2xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 touch-manipulation
          {activeTab === 'reports' ? 'bg-[#1E40AF] text-white shadow-xs' : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'}"
      >
        <AlertTriangle class="w-3.5 h-3.5" />
        <span>Laporan Komunitas</span>
        {#if pendingReportCount > 0}
          <span class="w-2 h-2 rounded-full bg-red-500"></span>
        {/if}
      </button>

      <button 
        type="button"
        onclick={() => activeTab = 'opportunities'}
        class="px-4 py-2.5 rounded-2xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 touch-manipulation
          {activeTab === 'opportunities' ? 'bg-[#1E40AF] text-white shadow-xs' : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'}"
      >
        <Briefcase class="w-3.5 h-3.5" />
        <span>Moderasi Peluang ({opportunities.length})</span>
      </button>

      <button 
        type="button"
        onclick={() => activeTab = 'audit'}
        class="px-4 py-2.5 rounded-2xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 touch-manipulation
          {activeTab === 'audit' ? 'bg-[#1E40AF] text-white shadow-xs' : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'}"
      >
        <FileText class="w-3.5 h-3.5" />
        <span>Log Audit</span>
      </button>
    </div>

    <!-- TAB 1: OVERVIEW STATS -->
    {#if activeTab === 'stats'}
      <div class="space-y-6">
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          <StatCard 
            title="Total Mahasiswa" 
            value={stats.totalStudents} 
            subtitle="Terdaftar aktif di sistem" 
            icon={Users} 
            color="navy" 
          />
          <StatCard 
            title="Mentor Alumni" 
            value={stats.totalAlumni} 
            subtitle="Siap mendampingi karier" 
            icon={CheckCircle2} 
            color="blue" 
          />
          <StatCard 
            title="Peluang Diterbitkan" 
            value={stats.totalOpportunities} 
            subtitle="Mentoring, magang & proyek" 
            icon={Briefcase} 
            color="navy" 
          />
          <StatCard 
            title="Menunggu Verifikasi" 
            value={stats.pendingVerifications} 
            subtitle="Permintaan peninjauan berkas" 
            icon={Clock} 
            color="yellow" 
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div class="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-4">
            <h3 class="text-sm sm:text-base font-extrabold text-[#101B35] font-heading">
              Distribusi Jurusan Populer
            </h3>
            <div class="space-y-3.5 text-xs">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#20283B]">Sistem Informasi & Sains Data</span>
                  <span class="font-bold text-[#3157D5]">42%</span>
                </div>
                <div class="w-full bg-[#F7F6F2] h-2.5 rounded-full overflow-hidden">
                  <div class="bg-[#3157D5] h-full rounded-full" style="width: 42%;"></div>
                </div>
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#20283B]">Manajemen & Akuntansi</span>
                  <span class="font-bold text-[#101B35]">31%</span>
                </div>
                <div class="w-full bg-[#F7F6F2] h-2.5 rounded-full overflow-hidden">
                  <div class="bg-[#101B35] h-full rounded-full" style="width: 31%;"></div>
                </div>
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#20283B]">Ilmu Komunikasi & Hukum</span>
                  <span class="font-bold text-[#5478FF]">27%</span>
                </div>
                <div class="w-full bg-[#F7F6F2] h-2.5 rounded-full overflow-hidden">
                  <div class="bg-[#5478FF] h-full rounded-full" style="width: 27%;"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-4">
            <h3 class="text-sm sm:text-base font-extrabold text-[#101B35] font-heading">
              Aktivitas Jaringan Komunitas
            </h3>
            <div class="space-y-2.5 text-xs text-[#68738A] leading-relaxed">
              <div class="p-3 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF]">
                • <strong class="text-[#101B35]">185 Percakapan privat</strong> berlangsung bulan ini tanpa insiden keamanan.
              </div>
              <div class="p-3 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF]">
                • <strong class="text-[#101B35]">92% Permintaan bimbingan</strong> direspon mentor dalam waktu kurang dari 48 jam.
              </div>
              <div class="p-3 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF]">
                • <strong class="text-[#101B35]">39 UPBJJ</strong> tercakup secara merata, termasuk mahasiswa UT di luar negeri.
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- TAB 2: USER MANAGEMENT (ADAPTIVE CARD & TABLE) -->
    {:else if activeTab === 'users'}
      <div class="space-y-4">
        <!-- Search & Filter Controls -->
        <div class="p-4 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div class="relative w-full sm:max-w-md">
            <Search class="w-4 h-4 text-[#68738A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="search"
              bind:value={userSearch}
              placeholder="Cari nama, email, atau NIM pengguna..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E8EF] text-xs text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-[#F7F6F2]"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <select 
              bind:value={userRoleFilter}
              class="px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-xs font-bold text-[#101B35] outline-none w-full sm:w-auto bg-[#F7F6F2]"
            >
              <option value="all">Semua Role Pengguna</option>
              <option value="student">Mahasiswa</option>
              <option value="alumni">Alumni</option>
              <option value="admin">Administrator</option>
            </select>

            <button 
              type="button"
              onclick={loadAdminData}
              class="px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-xs font-bold text-[#3157D5] hover:bg-[#EEF2FF] bg-[#F7F6F2] transition flex items-center gap-1.5 touch-manipulation shrink-0"
              title="Muat ulang seluruh data pengguna dan statistik"
            >
              <RefreshCw class="w-3.5 h-3.5 {isLoading ? 'animate-spin' : ''}" />
              <span>Segarkan</span>
            </button>
          </div>
        </div>

        <!-- 1. MOBILE VIEW: Responsive User Cards (< md) -->
        <div class="block md:hidden space-y-3">
          {#if filteredUsers.length === 0}
            <div class="p-8 text-center text-xs text-[#68738A] rounded-2xl bg-white border border-[#E5E8EF]">
              Tidak ditemukan pengguna dengan kriteria pencarian tersebut.
            </div>
          {:else}
            {#each filteredUsers as u (u.id)}
              <div class="p-4 rounded-2xl bg-white border border-[#E5E8EF] shadow-xs space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'} 
                      alt={u.full_name} 
                      class="w-10 h-10 rounded-xl object-cover ring-1 ring-[#3157D5]/20 shrink-0"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="font-extrabold text-xs text-[#101B35] truncate">{u.full_name}</div>
                      <div class="text-[10px] text-[#68738A] truncate">{u.email}</div>
                    </div>
                  </div>

                  <span class="font-extrabold uppercase text-[10px] px-2 py-0.5 rounded-md shrink-0
                    {u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                     u.role === 'alumni' ? 'bg-[#EEF2FF] text-[#3157D5]' : 
                     'bg-amber-100 text-amber-800'}">
                    {u.role}
                  </span>
                </div>

                <div class="flex items-center justify-between text-[11px] pt-1 border-t border-[#F7F6F2] text-[#68738A]">
                  <span>Prodi: <strong class="text-[#101B35]">{u.study_program || '-'}</strong></span>
                  <span class="font-mono">NIM: {u.nim || '-'}</span>
                </div>

                <div class="flex items-center justify-between pt-1 border-t border-[#E5E8EF]/60 gap-2">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full {u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    {#if u.verification_status === 'verified'}
                      <span class="text-[10px] font-bold text-[#3157D5] flex items-center gap-0.5 px-2 py-0.5 bg-[#EEF2FF] rounded-full">
                        <CheckCircle2 class="w-3 h-3" /> Terverifikasi
                      </span>
                    {:else}
                      <span class="text-[10px] font-bold text-amber-700 flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full">
                        <Clock class="w-3 h-3 text-amber-600" /> Belum Verifikasi
                      </span>
                    {/if}
                  </div>

                  <div class="flex items-center gap-1.5">
                    {#if u.verification_status !== 'verified'}
                      <button 
                        type="button"
                        onclick={() => handleQuickVerifyUser(u)}
                        class="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#3157D5] hover:bg-[#2646B8] text-white transition touch-manipulation"
                      >
                        Verifikasi
                      </button>
                    {/if}
                    <button 
                      type="button"
                      onclick={() => handleToggleUserStatus(u)}
                      class="px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition touch-manipulation
                        {u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#EEF2FF] text-[#3157D5] hover:bg-[#EEF2FF]/80'}"
                    >
                      {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>

        <!-- 2. DESKTOP VIEW: Clean Structured Table (>= md) -->
        <div class="hidden md:block rounded-2xl bg-white border border-[#E5E8EF] shadow-xs overflow-hidden">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F7F6F2] border-b border-[#E5E8EF] font-bold text-[#68738A]">
                <th class="p-4">Pengguna</th>
                <th class="p-4">Role</th>
                <th class="p-4">Program Studi</th>
                <th class="p-4">NIM</th>
                <th class="p-4">Status Verifikasi</th>
                <th class="p-4">Status Akun</th>
                <th class="p-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5E8EF]">
              {#each filteredUsers as u (u.id)}
                <tr class="hover:bg-[#F7F6F2]/60 transition">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <img 
                        src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'} 
                        alt={u.full_name} 
                        class="w-9 h-9 rounded-xl object-cover ring-1 ring-[#3157D5]/20"
                      />
                      <div>
                        <div class="font-bold text-[#101B35]">{u.full_name}</div>
                        <div class="text-[11px] text-[#68738A]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td class="p-4">
                    <span class="font-extrabold uppercase text-[10px] px-2.5 py-0.5 rounded-full
                      {u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                       u.role === 'alumni' ? 'bg-[#EEF2FF] text-[#3157D5]' : 
                       'bg-amber-100 text-amber-800'}">
                      {u.role}
                    </span>
                  </td>
                  <td class="p-4 text-[#20283B]">{u.study_program}</td>
                  <td class="p-4 font-mono text-[#68738A]">{u.nim || '-'}</td>
                  <td class="p-4">
                    {#if u.verification_status === 'verified'}
                      <span class="inline-flex items-center gap-1 text-[11px] font-bold text-[#3157D5] bg-[#EEF2FF] px-2.5 py-1 rounded-full">
                        <CheckCircle2 class="w-3.5 h-3.5 text-[#3157D5]" />
                        <span>Terverifikasi</span>
                      </span>
                    {:else}
                      <span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <Clock class="w-3.5 h-3.5 text-amber-600" />
                        <span>Menunggu Verifikasi</span>
                      </span>
                    {/if}
                  </td>
                  <td class="p-4">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full {u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      {#if u.verification_status !== 'verified'}
                        <button 
                          type="button"
                          onclick={() => handleQuickVerifyUser(u)}
                          class="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#3157D5] hover:bg-[#2646B8] text-white transition shadow-2xs"
                          title="Verifikasi status mahasiswa/alumni"
                        >
                          Verifikasi
                        </button>
                      {/if}
                      <button 
                        type="button"
                        onclick={() => handleToggleUserStatus(u)}
                        class="px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition
                          {u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#EEF2FF] text-[#3157D5] hover:bg-[#EEF2FF]/80'}"
                      >
                        {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

    <!-- TAB 3: VERIFICATIONS REVIEW -->
    {:else if activeTab === 'verifications'}
      <div class="space-y-4">
        {#if verifications.length === 0}
          <div class="p-12 rounded-3xl bg-white border border-[#E5E8EF] text-center text-xs text-[#68738A]">
            Tidak ada permohonan verifikasi saat ini.
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each verifications as req (req.id)}
              <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#101B35] text-white">
                    Permohonan {req.role}
                  </span>
                  <span class="text-xs font-bold {req.status === 'verified' ? 'text-[#3157D5]' : req.status === 'pending' ? 'text-amber-600' : 'text-red-600'}">
                    Status: {req.status}
                  </span>
                </div>

                <div class="space-y-1">
                  <h4 class="text-sm font-extrabold text-[#101B35]">{req.user?.full_name || 'Pengguna UT'}</h4>
                  <p class="text-xs text-[#68738A]">NIM / Identitas: <strong class="text-[#101B35]">{req.nim_or_alumni_id}</strong></p>
                  {#if req.notes}
                    <p class="text-xs text-[#20283B] mt-1 italic p-2.5 bg-[#F7F6F2] rounded-xl border border-[#E5E8EF]">
                      Catatan: "{req.notes}"
                    </p>
                  {/if}
                </div>

                {#if req.status === 'pending'}
                  <div class="pt-3 border-t border-[#E5E8EF] flex items-center justify-end gap-2">
                    <button 
                      type="button"
                      onclick={() => { selectedVerification = req; handleReviewVerification('rejected'); }}
                      class="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition touch-manipulation min-h-[38px]"
                    >
                      Tolak
                    </button>
                    <button 
                      type="button"
                      onclick={() => { selectedVerification = req; handleReviewVerification('verified'); }}
                      class="px-4 py-2 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] flex items-center gap-1.5 transition touch-manipulation shadow-xs min-h-[38px]"
                    >
                      <Check class="w-3.5 h-3.5" />
                      <span>Setujui Verifikasi</span>
                    </button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

    <!-- TAB 4: REPORTS REVIEW -->
    {:else if activeTab === 'reports'}
      <div class="space-y-4">
        {#if reports.length === 0}
          <div class="p-12 rounded-3xl bg-white border border-[#E5E8EF] text-center text-xs text-[#68738A]">
            Tidak ada laporan pelanggaran aktif. Komunitas berjalan aman dan tertib!
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each reports as rep (rep.id)}
              <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-red-200">
                    <AlertTriangle class="w-3.5 h-3.5" />
                    <span>{rep.reason}</span>
                  </span>
                  <span class="text-xs font-bold text-[#68738A] uppercase">
                    Status: {rep.status}
                  </span>
                </div>

                <div class="space-y-1">
                  <p class="text-xs text-[#68738A]">Dilaporkan oleh: {rep.reporter?.full_name || 'Anonim'}</p>
                  <p class="text-xs text-[#20283B] leading-relaxed font-medium p-2.5 bg-[#F7F6F2] rounded-xl border border-[#E5E8EF]">
                    "{rep.details}"
                  </p>
                </div>

                {#if rep.status === 'pending'}
                  <div class="pt-3 border-t border-[#E5E8EF] flex items-center justify-end gap-2">
                    <button 
                      type="button"
                      onclick={() => { selectedReport = rep; handleReviewReport('dismissed'); }}
                      class="px-4 py-2 rounded-xl border border-[#E5E8EF] text-xs font-bold text-[#68738A] hover:bg-[#F7F6F2] hover:text-[#101B35] transition touch-manipulation"
                    >
                      Abaikan (Dismiss)
                    </button>
                    <button 
                      type="button"
                      onclick={() => { selectedReport = rep; handleReviewReport('resolved'); }}
                      class="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition touch-manipulation shadow-xs"
                    >
                      Tindak Lanjuti (Resolve)
                    </button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

    <!-- TAB 5: OPPORTUNITIES MODERATION -->
    {:else if activeTab === 'opportunities'}
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each opportunities as opp (opp.id)}
            <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-2.5 hover:border-[#3157D5]/40 transition">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/15 px-2 py-0.5 rounded-md">
                  {opp.type}
                </span>
                <span class="text-xs text-[#3157D5] font-bold bg-[#EEF2FF] px-2 py-0.5 rounded-md">
                  Disetujui
                </span>
              </div>
              <h4 class="text-sm font-extrabold text-[#101B35] leading-snug">{opp.title}</h4>
              <p class="text-xs text-[#68738A]">Oleh: {opp.author?.full_name} • Lokasi: {opp.location}</p>
              <p class="text-xs text-[#68738A] line-clamp-2 leading-relaxed">{opp.description}</p>
            </div>
          {/each}
        </div>
      </div>

    <!-- TAB 6: AUDIT LOG -->
    {:else if activeTab === 'audit'}
      <div class="p-6 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-4">
        <h3 class="text-sm font-extrabold text-[#101B35] uppercase tracking-wider font-heading">
          Riwayat Audit Tindakan Administratif
        </h3>
        <div class="divide-y divide-[#E5E8EF] text-xs">
          {#each auditLogs as log (log.id)}
            <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <span class="font-mono font-bold text-[#101B35] bg-[#F7F6F2] px-2.5 py-0.5 rounded-md border border-[#E5E8EF]">
                  {log.action}
                </span>
                <span class="text-[#68738A] ml-2 font-medium">Target: {log.target_type} ({log.target_id})</span>
              </div>
              <span class="text-[#68738A] font-mono text-[11px]">
                {new Date(log.created_at).toLocaleString('id-ID')}
              </span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Mobile Bottom Nav for Admin to easily navigate -->
  <DashboardBottomNav />
</div>
