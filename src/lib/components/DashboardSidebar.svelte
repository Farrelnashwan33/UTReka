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
    class="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
    onclick={() => isOpen = false}
    aria-hidden="true"
  ></div>
{/if}

<!-- Sidebar Container: Warm Academic UT -->
<aside 
  class="fixed top-0 bottom-0 left-0 z-50 w-64 lg:w-70 bg-white text-[#1E293B] flex flex-col justify-between transition-transform duration-300 shadow-md border-r border-[#E2E8F0] md:translate-x-0
    {isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
>
  <div>
    <!-- Top Brand Header with Official UT REKA Logo -->
    <div class="h-20 px-5 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
      <a href="/" class="flex items-center gap-2 group py-1" title="UT REKA Beranda">
        <div class="p-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] group-hover:border-[#93C5FD] transition">
          <img 
            src="/images/ut-reka-logo-transparent.png" 
            alt="UT REKA Relasi Karir" 
            class="h-9 w-auto object-contain group-hover:scale-102 transition-transform" 
          />
        </div>
        <div class="leading-none">
          <div class="text-sm font-black font-heading tracking-wide text-[#0F172A]">UT REKA</div>
          <div class="text-[10px] text-[#64748B] font-semibold tracking-tight mt-0.5">Karier & Mentoring</div>
        </div>
      </a>

      <button 
        onclick={() => isOpen = false}
        class="md:hidden p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition"
        aria-label="Tutup sidebar"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Section Label -->
    <div class="px-5 pt-5 pb-2">
      <span class="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Navigasi Utama</span>
    </div>

    <!-- Navigation Menu -->
    <nav class="px-3.5 space-y-1 text-xs font-semibold">
      <!-- 1. Dashboard Utama / Lihat Semua -->
      <a 
        href="/dashboard/student" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition touch-manipulation
          {isActive('/dashboard/student') ? 'bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-xs' : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'}"
      >
        <LayoutGrid class="w-4 h-4 shrink-0 stroke-[2.2]" />
        <span>Lihat Semua</span>
      </a>

      <!-- 2. Temukan Relasi -->
      <a 
        href="/dashboard/connections" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition touch-manipulation
          {page.url.pathname === '/dashboard/connections' ? 'bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-xs' : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'}"
      >
        <Users class="w-4 h-4 shrink-0 stroke-[2.2]" />
        <span>Temukan Relasi</span>
      </a>

      <!-- 3. Peluang Karier -->
      <a 
        href="/dashboard/opportunities" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition touch-manipulation
          {isActive('/dashboard/opportunities') ? 'bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-xs' : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'}"
      >
        <Briefcase class="w-4 h-4 shrink-0 stroke-[2.2]" />
        <span>Peluang Karier</span>
      </a>

      <!-- 4. Ruang Kerja & Bimbingan -->
      <a 
        href="/dashboard/workspace" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition touch-manipulation
          {isActive('/dashboard/workspace') ? 'bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-xs' : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'}"
      >
        <Link2 class="w-4 h-4 shrink-0 stroke-[2.2]" />
        <span>Ruang Kerja</span>
      </a>

      <!-- 5. Portfolio & Profil -->
      <a 
        href="/dashboard/profile" 
        onclick={() => isOpen = false}
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition touch-manipulation
          {isActive('/dashboard/profile') ? 'bg-[#EFF6FF] text-[#1E40AF] font-bold border border-[#BFDBFE] shadow-xs' : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'}"
      >
        <Folder class="w-4 h-4 shrink-0 stroke-[2.2]" />
        <span>Portfolio & Profil</span>
      </a>

      {#if authStore.profile?.role === 'admin'}
        <div class="pt-3 mt-2 border-t border-[#E2E8F0]">
          <a 
            href="/admin" 
            onclick={() => isOpen = false}
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] hover:bg-[#FDE68A] transition font-bold"
          >
            <ShieldAlert class="w-4 h-4 shrink-0" />
            <span>Admin Center</span>
          </a>
        </div>
      {/if}
    </nav>
  </div>

  <!-- Bottom User Profile Pill -->
  <div class="p-3.5 border-t border-[#E2E8F0] bg-[#FAF9F5]">
    <a 
      href="/dashboard/profile"
      class="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition touch-manipulation group border border-transparent hover:border-[#E2E8F0]"
      title="Buka Profil"
    >
      <div class="relative shrink-0">
        <img 
          src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
          alt={authStore.profile?.full_name || 'Maulana Chrysant'} 
          class="w-9 h-9 rounded-full object-cover ring-2 ring-[#1E40AF]/30 shadow-xs"
        />
        <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#1E40AF] transition-colors">
          {authStore.profile?.full_name || 'Maulana Chrysant'}
        </div>
        <p class="text-[10px] text-[#64748B] truncate font-medium mt-0.5">
          {authStore.profile?.study_program || 'Sistem Informasi'} • {authStore.profile?.role === 'alumni' ? 'Alumni' : 'Mahasiswa'}
        </p>
      </div>
    </a>
  </div>
</aside>
