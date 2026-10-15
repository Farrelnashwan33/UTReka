<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth.svelte';
  import { GraduationCap, ArrowRight, Menu, X, Shield, Sparkles } from 'lucide-svelte';

  let isMobileMenuOpen = $state(false);

  onMount(async () => {
    await authStore.init();
  });
</script>

<header class="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E7E5E0]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
    <!-- Brand Logo -->
    <a href="/" class="flex items-center gap-2 group py-1" title="UT REKA Beranda">
      <img 
        src="/images/ut-reka-logo-transparent.png" 
        alt="UT REKA Relasi Karir" 
        class="h-14 sm:h-15 w-auto object-contain group-hover:scale-102 transition-transform" 
      />
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
      <a href="/#beranda" class="hover:text-[#183153] transition">Beranda</a>
      <a href="/#tentang" class="hover:text-[#183153] transition">Tentang</a>
      <a href="/#fitur" class="hover:text-[#183153] transition">Fitur</a>
      <a href="/#cara-kerja" class="hover:text-[#183153] transition">Cara Kerja</a>
      <a href="/#alumni" class="hover:text-[#183153] transition">Alumni</a>
      <a href="/#faq" class="hover:text-[#183153] transition">FAQ</a>
    </nav>

    <!-- Auth Actions -->
    <div class="hidden md:flex items-center gap-4">
      {#if authStore.isAuthenticated && authStore.profile}
        <a 
          href={authStore.profile.role === 'admin' ? '/admin' : `/dashboard/${authStore.profile.role}`}
          class="flex items-center gap-2 bg-[#183153] text-[#FAF9F6] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#102138] transition shadow-sm"
        >
          <span>Dashboard ({authStore.profile.role})</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      {:else}
        <a 
          href="/login" 
          class="text-sm font-bold text-[#183153] px-4 py-2.5 rounded-xl hover:bg-black/5 transition"
        >
          Masuk
        </a>
        <a 
          href="/register" 
          class="flex items-center gap-2 bg-[#FFD43B] text-[#183153] px-5 py-2.5 rounded-xl font-extrabold text-sm hover:bg-[#F2C41D] transition shadow-sm hover:shadow"
        >
          <span>Daftar</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      {/if}
    </div>

    <!-- Mobile Menu Button -->
    <button 
      onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
      class="md:hidden p-2 text-gray-700 hover:text-black focus:outline-none"
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
    <div class="md:hidden bg-[#FAF9F6] border-b border-[#E7E5E0] px-4 pt-3 pb-6 space-y-4">
      <nav class="flex flex-col space-y-3 font-semibold text-gray-700">
        <a href="/#beranda" onclick={() => isMobileMenuOpen = false} class="py-1">Beranda</a>
        <a href="/#tentang" onclick={() => isMobileMenuOpen = false} class="py-1">Tentang</a>
        <a href="/#fitur" onclick={() => isMobileMenuOpen = false} class="py-1">Fitur</a>
        <a href="/#cara-kerja" onclick={() => isMobileMenuOpen = false} class="py-1">Cara Kerja</a>
        <a href="/#alumni" onclick={() => isMobileMenuOpen = false} class="py-1">Alumni</a>
        <a href="/#faq" onclick={() => isMobileMenuOpen = false} class="py-1">FAQ</a>
      </nav>

      <div class="pt-4 border-t border-[#E7E5E0] flex flex-col gap-2">
        {#if authStore.isAuthenticated && authStore.profile}
          <a 
            href={authStore.profile.role === 'admin' ? '/admin' : `/dashboard/${authStore.profile.role}`}
            class="text-center bg-[#183153] text-[#FAF9F6] py-3 rounded-xl font-bold text-sm"
          >
            Buka Dashboard ({authStore.profile.role})
          </a>
        {:else}
          <a href="/login" class="text-center py-2.5 font-bold text-[#183153] border border-[#183153]/20 rounded-xl">Masuk</a>
          <a href="/register" class="text-center py-2.5 font-extrabold bg-[#FFD43B] text-[#183153] rounded-xl">Daftar Akun Baru</a>
        {/if}
      </div>
    </div>
  {/if}
</header>
