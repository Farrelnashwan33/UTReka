<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import type { Opportunity } from '$lib/types/database';
  import { 
    Briefcase, 
    Search, 
    Filter, 
    Calendar, 
    MapPin, 
    Building2, 
    CheckCircle2, 
    Send, 
    X,
    ExternalLink,
    Plus,
    Clock,
    Sparkles
  } from 'lucide-svelte';

  let opportunities = $state<Opportunity[]>([]);
  let selectedType = $state('all');
  let searchQuery = $state('');
  let isLoading = $state(true);

  // Apply Modal state
  let selectedOpp = $state<Opportunity | null>(null);
  let applicantPitch = $state('');
  let portfolioLink = $state(authStore.profile?.portfolio_url || '');
  let isApplyModalOpen = $state(false);

  async function loadOpportunities() {
    isLoading = true;
    try {
      opportunities = await platformService.getOpportunities({
        type: selectedType,
        query: searchQuery
      });
    } catch (e) {
      console.warn('Load opportunities error:', e);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadOpportunities();
  });

  function openApplyModal(opp: Opportunity) {
    selectedOpp = opp;
    applicantPitch = '';
    isApplyModalOpen = true;
  }

  async function handleApply() {
    if (!selectedOpp || !applicantPitch.trim()) {
      toastStore.warning('Harap isi motivasi atau perkenalan diri Anda');
      return;
    }
    toastStore.success(`Aplikasi lamaran untuk "${selectedOpp.title}" berhasil diajukan ke mentor alumni!`);
    isApplyModalOpen = false;
  }
</script>

<svelte:head>
  <title>UT REKA — Peluang Karier & Magang</title>
</svelte:head>

<!-- Mobile-First App Shell Content -->
<div class="space-y-4 max-w-md sm:max-w-2xl md:max-w-4xl mx-auto">
  <!-- Header -->
  <div class="px-1 space-y-1">
    <div class="flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-black text-[#101B35] font-heading">
        Ruang Karier & Magang
      </h1>
      <span class="text-xs font-bold text-[#3157D5] bg-[#EEF2FF] px-2.5 py-1 rounded-full border border-[#3157D5]/20">
        Eksklusif UT
      </span>
    </div>
    <p class="text-xs text-[#68738A]">
      Lowongan magang, proyek kolaboratif, dan mentoring dari jejaring alumni UT
    </p>
  </div>

  <!-- Search Bar -->
  <div class="relative">
    <Search class="w-4 h-4 text-[#68738A] absolute left-3.5 top-1/2 -translate-y-1/2" />
    <input 
      type="search"
      bind:value={searchQuery}
      oninput={() => loadOpportunities()}
      placeholder="Cari posisi, keahlian (Frontend, Data, Manajemen)..."
      class="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#E5E8EF] text-xs sm:text-sm text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 shadow-xs transition"
    />
  </div>

  <!-- Horizontal Filter Chips (Swipeable) -->
  <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs -mx-1 px-1">
    <button 
      type="button"
      onclick={() => { selectedType = 'all'; loadOpportunities(); }}
      class="px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition touch-manipulation
        {selectedType === 'all' ? 'bg-[#101B35] text-white shadow-xs' : 'bg-white border border-[#E5E8EF] text-[#68738A] hover:text-[#101B35]'}"
    >
      Semua ({opportunities.length})
    </button>
    <button 
      type="button"
      onclick={() => { selectedType = 'internship'; loadOpportunities(); }}
      class="px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition touch-manipulation
        {selectedType === 'internship' ? 'bg-[#3157D5] text-white shadow-xs' : 'bg-white border border-[#E5E8EF] text-[#68738A] hover:text-[#101B35]'}"
    >
      Magang
    </button>
    <button 
      type="button"
      onclick={() => { selectedType = 'mentoring'; loadOpportunities(); }}
      class="px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition touch-manipulation
        {selectedType === 'mentoring' ? 'bg-[#3157D5] text-white shadow-xs' : 'bg-white border border-[#E5E8EF] text-[#68738A] hover:text-[#101B35]'}"
    >
      Mentoring 1-on-1
    </button>
    <button 
      type="button"
      onclick={() => { selectedType = 'project'; loadOpportunities(); }}
      class="px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition touch-manipulation
        {selectedType === 'project' ? 'bg-[#3157D5] text-white shadow-xs' : 'bg-white border border-[#E5E8EF] text-[#68738A] hover:text-[#101B35]'}"
    >
      Proyek Kolaborasi
    </button>
    <button 
      type="button"
      onclick={() => { selectedType = 'job'; loadOpportunities(); }}
      class="px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition touch-manipulation
        {selectedType === 'job' ? 'bg-[#3157D5] text-white shadow-xs' : 'bg-white border border-[#E5E8EF] text-[#68738A] hover:text-[#101B35]'}"
    >
      Pekerjaan
    </button>
  </div>

  <!-- Opportunities List -->
  {#if isLoading}
    <div class="space-y-3">
      {#each [1, 2, 3] as _}
        <div class="p-4 rounded-3xl bg-white border border-[#E5E8EF] animate-pulse space-y-3">
          <div class="h-4 bg-[#E5E8EF] rounded w-1/4"></div>
          <div class="h-5 bg-[#E5E8EF] rounded w-3/4"></div>
          <div class="h-3 bg-[#E5E8EF] rounded w-full"></div>
        </div>
      {/each}
    </div>
  {:else if opportunities.length === 0}
    <div class="p-8 rounded-3xl bg-white border border-[#E5E8EF] text-center space-y-2">
      <Briefcase class="w-8 h-8 text-[#68738A]/50 mx-auto" />
      <h3 class="text-sm font-bold text-[#101B35]">Belum ada peluang yang sesuai</h3>
      <p class="text-xs text-[#68738A]">Coba pilih tipe lain untuk melihat peluang yang tersedia.</p>
    </div>
  {:else}
    <!-- Vertical Cards Stream -->
    <div class="space-y-3.5">
      {#each opportunities as opp (opp.id)}
        <div class="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3 hover:border-[#3157D5]/40 transition">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full
              {opp.type === 'mentoring' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 
               opp.type === 'project' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 
               'bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/20'}">
              {opp.type}
            </span>

            <span class="text-[11px] text-[#68738A] flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5" />
              <span>{opp.location}</span>
            </span>
          </div>

          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-[#101B35] leading-snug">
              {opp.title}
            </h3>
            <p class="text-xs text-[#68738A] mt-0.5">
              {opp.company_or_org || 'Alumni Network'} • Oleh <strong class="text-[#101B35]">{opp.author?.full_name || 'Alumni UT'}</strong>
            </p>
          </div>

          <p class="text-xs text-[#20283B] leading-relaxed line-clamp-3">
            {opp.description}
          </p>

          {#if opp.requirements?.length > 0}
            <div class="p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E5E8EF] text-xs">
              <span class="font-bold text-[#101B35] block mb-1 text-[11px] uppercase tracking-wider">Syarat:</span>
              <ul class="space-y-0.5 text-[#68738A] text-[11px]">
                {#each opp.requirements as req}
                  <li class="flex items-start gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#3157D5] mt-1 shrink-0"></span>
                    <span>{req}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <!-- Action Bar -->
          <div class="pt-2 border-t border-[#E5E8EF] flex items-center justify-between gap-2">
            <span class="text-[11px] text-[#68738A] flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              <span>{opp.deadline || 'Terbuka'}</span>
            </span>

            <button 
              type="button"
              onclick={() => openApplyModal(opp)}
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition touch-manipulation min-h-[40px] shadow-xs"
            >
              <span>Ajukan Minat</span>
              <Send class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal Mobile: Ajukan Minat -->
{#if isApplyModalOpen && selectedOpp}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 border border-[#E5E8EF]">
      <div class="flex items-center justify-between border-b border-[#E5E8EF] pb-2">
        <h3 class="text-sm font-extrabold text-[#101B35]">Formulir Pengajuan Minat</h3>
        <button 
          type="button" 
          onclick={() => isApplyModalOpen = false} 
          class="p-1 text-[#68738A] hover:text-[#101B35] touch-manipulation"
          aria-label="Tutup modal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div>
        <p class="text-xs text-[#68738A]">Posisi / Peluang:</p>
        <p class="text-sm font-black text-[#101B35] leading-snug">{selectedOpp.title}</p>
        <p class="text-[11px] text-[#68738A]">{selectedOpp.company_or_org || 'Alumni Network'}</p>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label for="app-pitch" class="block font-bold text-[#101B35] uppercase mb-1">
            Motivasi & Pengenalan Singkat
          </label>
          <textarea 
            id="app-pitch" 
            rows="3" 
            required
            bind:value={applicantPitch}
            placeholder="Jelaskan ketertarikan Anda dan kesiapan belajar mandiri..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
          ></textarea>
        </div>

        <div>
          <label for="app-port" class="block font-bold text-[#101B35] uppercase mb-1">
            Tautan CV / Portofolio / GitHub
          </label>
          <input 
            id="app-port"
            type="url"
            bind:value={portfolioLink}
            placeholder="https://linkedin.com/in/... atau google drive"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] bg-white text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
          />
        </div>
      </div>

      <div class="pt-2 flex items-center justify-end gap-2">
        <button 
          type="button" 
          onclick={() => isApplyModalOpen = false} 
          class="px-4 py-2.5 rounded-xl border border-[#E5E8EF] text-xs font-bold text-[#68738A] hover:bg-[#F7F6F2] hover:text-[#101B35] touch-manipulation transition"
        >
          Batal
        </button>
        <button 
          type="button" 
          onclick={handleApply} 
          class="px-5 py-2.5 rounded-xl bg-[#3157D5] text-white text-xs font-bold hover:bg-[#2646B8] transition touch-manipulation shadow-xs"
        >
          Kirim Lamaran
        </button>
      </div>
    </div>
  </div>
{/if}
