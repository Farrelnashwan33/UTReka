<script lang="ts">
  import { page } from '$app/state';
  import { authStore } from '$lib/stores/auth.svelte';
  import { 
    LayoutGrid, 
    Users, 
    Link2, 
    Briefcase, 
    Folder, 
    LogOut, 
    X,
    ShieldAlert,
    GraduationCap,
    Sparkles
  } from 'lucide-svelte';

  let { isOpen = $bindable(false) } = $props<{ isOpen?: boolean }>();

  function isActive(path: string) {
    if (path === '/dashboard/student') {
      return page.url.pathname === '/dashboard/student' || page.url.pathname === '/dashboard';
    }
    return page.url.pathname === path || (path !== '/' && page.url.pathname.startsWith(path));
  }
</script>

<!-- Mobile Overlay Backdrop -->
{#if isOpen}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
    onclick={() => isOpen = false}
    aria-hidden="true"
  ></div>
{/if}

<!-- Sidebar Container: Yellow #FFD43B as in the design reference -->
<aside 
  class="fixed top-0 bottom-0 left-0 z-50 w-64 lg:w-68 bg-[#FFD43B] text-[#183153] flex flex-col justify-between transition-transform duration-300 shadow-sm md:translate-x-0
    {isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
>
  <div>
    <!-- Top Brand Header with Official UT REKA Logo -->
    <div class="h-24 px-5 flex items-center justify-between border-b border-black/10">
      <a href="/" class="flex items-center group py-2" title="UT REKA Beranda">
        <img 
          src="/images/ut-reka-logo.png" 
          alt="UT REKA Relasi Karir" 
          class="h-16 w-auto object-contain group-hover:scale-102 transition-transform" 
        />
      </a>

      <button 
        onclick={() => isOpen = false}
        class="md:hidden p-1.5 text-[#183153] hover:bg-black/10 rounded-lg transition"
        aria-label="Tutup sidebar"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu (Matches Image 1, 2, 3, 4, 5) -->
    <nav class="px-4 py-4 space-y-1.5 text-xs font-bold">
      <!-- 1. Lihat Semua -->
      <a 
        href="/dashboard/student" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-3 rounded-xl transition touch-manipulation
          {isActive('/dashboard/student') ? 'bg-black/10 text-[#183153] font-black shadow-xs' : 'text-[#183153]/80 hover:bg-black/5 hover:text-[#183153]'}"
      >
        <LayoutGrid class="w-4 h-4 shrink-0 stroke-[2.3]" />
        <span>Lihat Semua</span>
      </a>

      <!-- 2. Temukan Relasi -->
      <a 
        href="/dashboard/connections" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-3 rounded-xl transition touch-manipulation
          {page.url.pathname === '/dashboard/connections' ? 'bg-black/10 text-[#183153] font-black shadow-xs' : 'text-[#183153]/80 hover:bg-black/5 hover:text-[#183153]'}"
      >
        <Users class="w-4 h-4 shrink-0 stroke-[2.3]" />
        <span>Temukan Relasi</span>
      </a>

      <!-- 3. Ruang Koneksi -->
      <a 
        href="/dashboard/connections" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-3 rounded-xl transition touch-manipulation
          {page.url.pathname.includes('/connections') ? 'bg-black/10 text-[#183153] font-black shadow-xs' : 'text-[#183153]/80 hover:bg-black/5 hover:text-[#183153]'}"
      >
        <Link2 class="w-4 h-4 shrink-0 stroke-[2.3]" />
        <span>Ruang Koneksi</span>
      </a>

      <!-- 4. Ruang Kerja -->
      <a 
        href="/dashboard/workspace" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-3 rounded-xl transition touch-manipulation
          {isActive('/dashboard/workspace') ? 'bg-black/10 text-[#183153] font-black shadow-xs' : 'text-[#183153]/80 hover:bg-black/5 hover:text-[#183153]'}"
      >
        <Briefcase class="w-4 h-4 shrink-0 stroke-[2.3]" />
        <span>Ruang Kerja</span>
      </a>

      <!-- 5. Portfolio -->
      <a 
        href="/dashboard/profile" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-3 rounded-xl transition touch-manipulation
          {isActive('/dashboard/profile') ? 'bg-black/10 text-[#183153] font-black shadow-xs' : 'text-[#183153]/80 hover:bg-black/5 hover:text-[#183153]'}"
      >
        <Folder class="w-4 h-4 shrink-0 stroke-[2.3]" />
        <span>Portfolio</span>
      </a>

      {#if authStore.profile?.role === 'admin'}
        <div class="pt-2 border-t border-black/10">
          <a 
            href="/admin" 
            onclick={() => isOpen = false}
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#183153] hover:bg-black/10 transition"
          >
            <ShieldAlert class="w-4 h-4 shrink-0" />
            <span>Admin Center</span>
          </a>
        </div>
      {/if}
    </nav>
  </div>

  <!-- Bottom User Profile Pill (Matches Screenshots: Maulana Chrysant / Sistem Informasi - 2025) -->
  <div class="p-4 border-t border-black/10">
    <a 
      href="/dashboard/profile"
      class="flex items-center gap-3 p-2 rounded-2xl hover:bg-black/10 transition touch-manipulation"
      title="Buka Profil"
    >
      <img 
        src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
        alt={authStore.profile?.full_name || 'Maulana Chrysant'} 
        class="w-10 h-10 rounded-full object-cover ring-2 ring-white/60 shadow-xs"
      />
      <div class="min-w-0 flex-1">
        <div class="text-xs font-black text-[#183153] truncate">
          {authStore.profile?.full_name || 'Maulana Chrysant'}
        </div>
        <p class="text-[10px] text-[#183153]/80 truncate font-semibold mt-0.5">
          {authStore.profile?.study_program || 'Sistem Informasi'} • 2025
        </p>
      </div>
    </a>
  </div>
</aside>
