<script lang="ts">
  import { page } from '$app/state';
  import { authStore } from '$lib/stores/auth.svelte';
  import { 
    Home, 
    Users, 
    GraduationCap,
    MessageSquare, 
    User
  } from 'lucide-svelte';

  let homePath = $derived.by(() => {
    if (!authStore.profile) return '/';
    if (authStore.profile.role === 'admin') return '/admin';
    if (authStore.profile.role === 'alumni') return '/dashboard/alumni';
    return '/dashboard/student';
  });

  function isHomeActive(pathname: string): boolean {
    return (
      pathname === '/' ||
      pathname === '/dashboard/student' ||
      pathname === '/dashboard/alumni' ||
      pathname === '/admin'
    );
  }

  function isTabActive(tab: 'beranda' | 'komunitas' | 'mentoring' | 'pesan' | 'profil'): boolean {
    const p = page.url.pathname;
    switch (tab) {
      case 'beranda':
        return isHomeActive(p);
      case 'komunitas':
        return p.startsWith('/dashboard/connections');
      case 'mentoring':
        return p.startsWith('/dashboard/opportunities');
      case 'pesan':
        return p.startsWith('/dashboard/messages');
      case 'profil':
        return p.startsWith('/dashboard/profile') || p === '/login' || p === '/register';
      default:
        return false;
    }
  }
</script>

<nav 
  aria-label="Navigasi Utama Aplikasi Mobile"
  class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-[0_-4px_24px_rgba(15,23,42,0.06)] transition-all md:hidden"
>
  <div class="max-w-md md:max-w-xl mx-auto flex items-center justify-around px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
    <!-- Tab 1: Beranda -->
    <a 
      href={homePath}
      class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-150 min-h-[48px] touch-manipulation group
        {isTabActive('beranda') ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}"
      aria-current={isTabActive('beranda') ? 'page' : undefined}
    >
      <div class="relative p-1.5 rounded-xl transition-transform duration-150 {isTabActive('beranda') ? 'bg-[#EFF6FF] text-[#1E40AF] scale-105' : 'group-hover:bg-slate-50'}">
        <Home class="w-5 h-5 {isTabActive('beranda') ? 'stroke-[2.5]' : 'stroke-2'}" />
      </div>
      <span class="text-[10px] mt-0.5 tracking-tight font-sans {isTabActive('beranda') ? 'font-black text-[#0F172A]' : 'font-medium text-slate-500'}">
        Beranda
      </span>
    </a>

    <!-- Tab 2: Komunitas -->
    <a 
      href="/dashboard/connections"
      class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-150 min-h-[48px] touch-manipulation group
        {isTabActive('komunitas') ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}"
      aria-current={isTabActive('komunitas') ? 'page' : undefined}
    >
      <div class="relative p-1.5 rounded-xl transition-transform duration-150 {isTabActive('komunitas') ? 'bg-[#EFF6FF] text-[#1E40AF] scale-105' : 'group-hover:bg-slate-50'}">
        <Users class="w-5 h-5 {isTabActive('komunitas') ? 'stroke-[2.5]' : 'stroke-2'}" />
      </div>
      <span class="text-[10px] mt-0.5 tracking-tight font-sans {isTabActive('komunitas') ? 'font-black text-[#0F172A]' : 'font-medium text-slate-500'}">
        Komunitas
      </span>
    </a>

    <!-- Tab 3: Mentoring -->
    <a 
      href="/dashboard/opportunities"
      class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-150 min-h-[48px] touch-manipulation group
        {isTabActive('mentoring') ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}"
      aria-current={isTabActive('mentoring') ? 'page' : undefined}
    >
      <div class="relative p-1.5 rounded-xl transition-transform duration-150 {isTabActive('mentoring') ? 'bg-[#EFF6FF] text-[#1E40AF] scale-105' : 'group-hover:bg-slate-50'}">
        <GraduationCap class="w-5 h-5 {isTabActive('mentoring') ? 'stroke-[2.5]' : 'stroke-2'}" />
      </div>
      <span class="text-[10px] mt-0.5 tracking-tight font-sans {isTabActive('mentoring') ? 'font-black text-[#0F172A]' : 'font-medium text-slate-500'}">
        Karier
      </span>
    </a>

    <!-- Tab 4: Pesan -->
    <a 
      href="/dashboard/messages"
      class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-150 min-h-[48px] touch-manipulation group
        {isTabActive('pesan') ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}"
      aria-current={isTabActive('pesan') ? 'page' : undefined}
    >
      <div class="relative p-1.5 rounded-xl transition-transform duration-150 {isTabActive('pesan') ? 'bg-[#EFF6FF] text-[#1E40AF] scale-105' : 'group-hover:bg-slate-50'}">
        <MessageSquare class="w-5 h-5 {isTabActive('pesan') ? 'stroke-[2.5]' : 'stroke-2'}" />
        <!-- Unread indicator badge -->
        <span class="absolute 0.5 top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
      </div>
      <span class="text-[10px] mt-0.5 tracking-tight font-sans {isTabActive('pesan') ? 'font-black text-[#0F172A]' : 'font-medium text-slate-500'}">
        Pesan
      </span>
    </a>

    <!-- Tab 5: Profil -->
    <a 
      href={authStore.isAuthenticated ? "/dashboard/profile" : "/login"}
      class="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-150 min-h-[48px] touch-manipulation group
        {isTabActive('profil') ? 'text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}"
      aria-current={isTabActive('profil') ? 'page' : undefined}
    >
      <div class="relative p-1.5 rounded-xl transition-transform duration-150 {isTabActive('profil') ? 'bg-[#EFF6FF] text-[#1E40AF] scale-105' : 'group-hover:bg-slate-50'}">
        <User class="w-5 h-5 {isTabActive('profil') ? 'stroke-[2.5]' : 'stroke-2'}" />
      </div>
      <span class="text-[10px] mt-0.5 tracking-tight font-sans {isTabActive('profil') ? 'font-black text-[#0F172A]' : 'font-medium text-slate-500'}">
        Profil
      </span>
    </a>
  </div>
</nav>
