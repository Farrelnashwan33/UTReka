<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import type { Conversation } from '$lib/types/database';
  import { MessageSquare, Search, ArrowRight, Clock, User, CheckCircle2, ChevronRight, Sparkles } from 'lucide-svelte';

  let conversations = $state<Conversation[]>([]);
  let searchQuery = $state('');
  let isLoading = $state(true);

  onMount(async () => {
    isLoading = true;
    try {
      if (authStore.profile) {
        conversations = await platformService.getConversations(authStore.profile.id);
      }
    } catch (e) {
      console.warn('Failed to load conversations:', e);
    } finally {
      isLoading = false;
    }
  });

  let filteredConversations = $derived(
    conversations.filter(c => {
      if (!searchQuery) return true;
      return (c.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    })
  );
</script>

<svelte:head>
  <title>UT REKA — Pesan & Bimbingan</title>
</svelte:head>

<!-- Mobile-First Messages List -->
<div class="space-y-4 max-w-md sm:max-w-2xl md:max-w-4xl mx-auto">
  <!-- Header -->
  <div class="px-1 space-y-1">
    <div class="flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-black text-[#101B35] font-heading">
        Pesan & Bimbingan
      </h1>
      <span class="text-xs font-bold text-[#3157D5] bg-[#EEF2FF] px-2.5 py-1 rounded-full border border-[#3157D5]/20">
        Privat & Aman
      </span>
    </div>
    <p class="text-xs text-[#68738A]">
      Komunikasi langsung antara mahasiswa dan mentor alumni Universitas Terbuka
    </p>
  </div>

  <!-- Search Bar -->
  <div class="relative">
    <Search class="w-4 h-4 text-[#68738A] absolute left-3.5 top-1/2 -translate-y-1/2" />
    <input 
      type="search"
      bind:value={searchQuery}
      placeholder="Cari percakapan atau nama rekan..."
      class="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#E5E8EF] text-xs sm:text-sm text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 shadow-xs transition"
    />
  </div>

  {#if isLoading}
    <div class="space-y-2.5">
      {#each [1, 2, 3] as _}
        <div class="p-4 rounded-2xl bg-white border border-[#E5E8EF] animate-pulse flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-[#E5E8EF] shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="w-36 h-4 bg-[#E5E8EF] rounded"></div>
            <div class="w-48 h-3 bg-[#E5E8EF] rounded"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if filteredConversations.length === 0}
    <div class="p-8 rounded-3xl bg-white border border-[#E5E8EF] text-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center mx-auto">
        <MessageSquare class="w-6 h-6 stroke-[2.5]" />
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-extrabold text-[#101B35]">Belum ada percakapan aktif</h3>
        <p class="text-xs text-[#68738A] max-w-xs mx-auto">
          Hubungkan relasi dengan alumni mentor di direktori untuk membuka kanal diskusi privat.
        </p>
      </div>
      <a 
        href="/dashboard/connections"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3157D5] text-white font-bold text-xs hover:bg-[#2646B8] transition touch-manipulation min-h-[44px] shadow-xs"
      >
        <span>Jelajahi Mentor Alumni</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  {:else}
    <!-- Modern Native Messenger Item List -->
    <div class="space-y-2 divide-y divide-[#E5E8EF] bg-white rounded-3xl border border-[#E5E8EF] overflow-hidden shadow-xs">
      {#each filteredConversations as conv (conv.id)}
        <a 
          href="/dashboard/messages/{conv.id}"
          class="p-4 flex items-center justify-between gap-3.5 hover:bg-[#F7F6F2] active:bg-gray-100 transition block touch-manipulation min-h-[72px]"
        >
          <div class="flex items-center gap-3.5 min-w-0 flex-1">
            <div class="relative shrink-0">
              <div class="w-12 h-12 rounded-2xl bg-[#101B35] text-white flex items-center justify-center font-black text-sm shadow-xs">
                <User class="w-6 h-6" />
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>

            <div class="min-w-0 flex-1 space-y-0.5">
              <div class="flex items-center justify-between gap-1">
                <h3 class="text-xs sm:text-sm font-extrabold text-[#101B35] truncate">
                  {conv.title || 'Diskusi Bimbingan Karier'}
                </h3>
                <span class="text-[10px] text-[#68738A] font-medium shrink-0">
                  {new Date(conv.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p class="text-xs text-[#68738A] truncate">
                Klik untuk membaca riwayat pesan dan berdiskusi langsung...
              </p>
            </div>
          </div>

          <ChevronRight class="w-4 h-4 text-[#68738A] shrink-0" />
        </a>
      {/each}
    </div>
  {/if}
</div>
