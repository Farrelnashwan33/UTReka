<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { GraduationCap, ArrowRight, Menu, X, Shield, Sparkles } from 'lucide-svelte';

  let isMobileMenuOpen = $state(false);

  onMount(async () => {
    await authStore.init();
  });
</script>

<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
    <!-- Brand Logo -->
    <a href="/" class="flex items-center gap-2 group py-1" title="UT REKA Beranda">
      <img 
        src="/images/ut-reka-logo-transparent.png" 
        alt="UT REKA Relasi Karir" 
        class="h-11 sm:h-12 w-auto object-contain group-hover:scale-102 transition-transform" 
      />
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-2 text-xs sm:text-sm font-bold text-[#64748B]">
      <a href="/mentor" class="px-3.5 py-2 rounded-lg hover:text-[#1E40AF] hover:bg-[#EFF6FF] transition">Program Mentor</a>
      <a href="/karier" class="px-3.5 py-2 rounded-lg hover:text-[#1E40AF] hover:bg-[#EFF6FF] transition">Peluang Karier</a>
      <a href="/panduan" class="px-3.5 py-2 rounded-lg hover:text-[#1E40AF] hover:bg-[#EFF6FF] transition">Panduan & Bantuan</a>
    </nav>

    <!-- Auth Actions -->
    <div class="hidden md:flex items-center gap-3">
      {#if authStore.isAuthenticated && authStore.profile}
        <a 
          href={authStore.profile.role === 'admin' ? '/admin' : `/dashboard/${authStore.profile.role}`}
          class="flex items-center gap-2 bg-[#1E40AF] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition shadow-xs"
        >
          <span>Dashboard ({authStore.profile.role})</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      {:else}
        <a 
          href="/login" 
          class="text-sm font-bold text-[#1E293B] px-4 py-2.5 rounded-xl hover:bg-[#EFF6FF] hover:text-[#1E40AF] transition"
        >
          Masuk
        </a>
        <a 
          href="/register" 
          class="flex items-center gap-2 bg-[#1E40AF] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition shadow-xs hover:shadow-md"
        >
          <span>Daftar</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      {/if}
    </div>

    <!-- Mobile Menu Button -->
    <button 
      onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
      class="md:hidden p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl focus:outline-none"
      aria-label="Toggle Menu"
    >
      {#if isMobileMenuOpen}
        <X class="w-6 h-6" />
      {:else}
        <Menu class="w-6 h-6" />
      {/if}
    </button>
  </div>

  <!-- Mobile Drawer -->
  {#if isMobileMenuOpen}
    <div class="md:hidden bg-white border-b border-[#E2E8F0] px-5 pt-3 pb-6 space-y-4 shadow-lg">
      <nav class="flex flex-col space-y-3 font-semibold text-[#64748B]">
        <a href="/mentor" onclick={() => isMobileMenuOpen = false} class="py-1 hover:text-[#1E40AF]">Program Mentor</a>
        <a href="/karier" onclick={() => isMobileMenuOpen = false} class="py-1 hover:text-[#1E40AF]">Peluang Karier</a>
        <a href="/panduan" onclick={() => isMobileMenuOpen = false} class="py-1 hover:text-[#1E40AF]">Panduan & Bantuan</a>
      </nav>

      <div class="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2">
        {#if authStore.isAuthenticated && authStore.profile}
          <a 
            href={authStore.profile.role === 'admin' ? '/admin' : `/dashboard/${authStore.profile.role}`}
            class="text-center bg-[#1E40AF] text-white py-3 rounded-xl font-bold text-sm shadow-sm"
          >
            Buka Dashboard ({authStore.profile.role})
          </a>
        {:else}
          <a href="/login" class="text-center py-2.5 font-bold text-[#1E40AF] border border-[#BFDBFE] bg-[#EFF6FF] rounded-xl hover:bg-[#DBEAFE]">Masuk</a>
          <a href="/register" class="text-center py-2.5 font-bold bg-[#1E40AF] text-white rounded-xl hover:bg-[#1D4ED8] shadow-sm">Daftar Akun Baru</a>
        {/if}
      </div>
    </div>
  {/if}
</header>
