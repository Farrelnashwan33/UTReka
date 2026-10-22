<script lang="ts">
  import { page } from '$app/state';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { uiStore } from '$lib/stores/ui.svelte';
  import type { NotificationItem } from '$lib/types/database';
  import { 
    Bell, 
    Check, 
    ExternalLink, 
    X, 
    User, 
    LogOut, 
    Menu, 
    ChevronRight 
  } from 'lucide-svelte';

  let { onToggleSidebar } = $props<{ onToggleSidebar?: () => void }>();

  let isNotifOpen = $state(false);
  let isProfileMenuOpen = $state(false);
  let notifications = $state<NotificationItem[]>([]);

  let unreadCount = $derived(
    notifications.filter(n => !n.is_read).length
  );

  let breadcrumbSub = $derived.by(() => {
    const p = page.url.pathname;
    if (p.includes('/workspace')) return 'Ruang Kerja';
    if (p.includes('/connections')) return 'Ruang Koneksi';
    if (p.includes('/messages')) return 'Forum Chat';
    if (p.includes('/profile')) return 'Portfolio';
    if (p.includes('/alumni')) return 'Portal Alumni';
    return 'Lihat Semua';
  });

  async function handleMarkRead(notifId: string) {
    await platformService.markNotificationRead(notifId);
    const idx = notifications.findIndex(n => n.id === notifId);
    if (idx !== -1) notifications[idx].is_read = true;
  }
</script>

<!-- Clean Dashboard Top Bar Matching Reference Design -->
<header class="h-16 bg-white border-b border-[#E5E8EF] px-4 sm:px-6 sticky top-0 z-30 flex items-center justify-between shadow-[0_1px_2px_rgba(16,27,53,0.03)]">
  <!-- Left: Mobile Menu Toggle & Breadcrumbs -->
  <div class="flex items-center gap-3">
    {#if onToggleSidebar}
      <button 
        type="button"
        onclick={onToggleSidebar}
        class="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-[#101B35] hover:bg-[#F7F6F2] transition"
        aria-label="Buka menu navigasi"
      >
        <Menu class="w-5 h-5" />
      </button>
    {/if}

    <!-- Breadcrumbs matching Image 1, 2, 3, 4, 5 -->
    <nav class="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#68738A] font-sans overflow-hidden" aria-label="Breadcrumb">
      <a href="/dashboard/student" class="hover:text-[#3157D5] transition shrink-0">
        Dashboard
      </a>
      {#if uiStore.breadcrumbs.length > 0}
        {#each uiStore.breadcrumbs as item, idx}
          <span class="text-slate-300 shrink-0">/</span>
          {#if item.onclick}
            <button 
              type="button" 
              onclick={item.onclick}
              class="hover:text-[#3157D5] transition truncate max-w-[140px] sm:max-w-[220px]"
            >
              {item.label}
            </button>
          {:else if item.href && idx < uiStore.breadcrumbs.length - 1}
            <a href={item.href} class="hover:text-[#3157D5] transition truncate max-w-[140px] sm:max-w-[220px]">
              {item.label}
            </a>
          {:else}
            <span class="font-extrabold text-[#101B35] truncate max-w-[150px] sm:max-w-[260px]">
              {item.label}
            </span>
          {/if}
        {/each}
      {:else}
        <span class="text-slate-300 shrink-0">/</span>
        <span class="font-extrabold text-[#101B35] truncate">
          {breadcrumbSub}
        </span>
      {/if}
    </nav>
  </div>

  <!-- Right: Semester info, Notification Bell with yellow indicator, Avatar -->
  <div class="flex items-center gap-3 sm:gap-4">
    <!-- Semester Info -->
    <span class="hidden sm:inline-block text-xs font-semibold text-[#68738A] px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] border border-[#D5E0FF]">
      Semester 3 • 2025.2
    </span>

    <!-- Bell Icon with Yellow Indicator Dot -->
    <div class="relative">
      <button 
        type="button"
        onclick={() => isNotifOpen = !isNotifOpen}
        class="relative p-2 rounded-xl text-[#68738A] hover:bg-[#F7F6F2] hover:text-[#101B35] transition touch-manipulation"
        aria-label="Notifikasi"
      >
        <Bell class="w-4 h-4 stroke-[2.2]" />
        <!-- Yellow dot indicator matching the reference screenshot -->
        <span class="absolute top-2 right-2 w-2 h-2 bg-[#FFC83D] rounded-full ring-2 ring-white"></span>
      </button>

      <!-- Dropdown Notifikasi -->
      {#if isNotifOpen}
        <div class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E8EF] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div class="p-3.5 border-b border-[#E5E8EF] flex items-center justify-between bg-[#F7F6F2]">
            <div>
              <h4 class="text-xs font-black text-[#101B35] uppercase tracking-wider">Notifikasi</h4>
              <p class="text-[11px] text-[#68738A]">{unreadCount} notifikasi baru</p>
            </div>
            <button 
              type="button"
              onclick={() => isNotifOpen = false}
              class="text-gray-400 hover:text-black p-1"
              aria-label="Tutup"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="max-h-72 overflow-y-auto divide-y divide-[#E5E8EF] text-xs">
            {#if notifications.length === 0}
              <div class="p-6 text-center text-[#68738A]">
                Belum ada notifikasi baru saat ini.
              </div>
            {:else}
              {#each notifications as notif (notif.id)}
                <div class="p-3 hover:bg-[#F7F6F2] transition flex items-start gap-2.5">
                  <div class="flex-1">
                    <p class="font-bold text-[#101B35]">{notif.title}</p>
                    <p class="text-[#68738A] text-[11px] mt-0.5">{notif.message}</p>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- Profile Avatar Dropdown -->
    <div class="relative">
      <button 
        type="button"
        onclick={() => isProfileMenuOpen = !isProfileMenuOpen}
        class="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#3157D5] transition touch-manipulation cursor-pointer"
        aria-label="Menu akun"
      >
        <img 
          src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
          alt={authStore.profile?.full_name || 'Profil'} 
          class="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5E8EF]"
        />
      </button>

      {#if isProfileMenuOpen}
        <div class="absolute right-0 mt-2 w-56 bg-white border border-[#E5E8EF] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#E5E8EF] text-xs animate-in fade-in duration-150">
          <div class="p-3 bg-[#F7F6F2]">
            <p class="font-bold text-[#101B35] truncate">{authStore.profile?.full_name || 'Maulana Chrysant'}</p>
            <p class="text-[10px] text-[#68738A] truncate">{authStore.profile?.study_program || 'Sistem Informasi • 2025'}</p>
          </div>
          <div class="p-1.5 space-y-0.5">
            <a 
              href="/dashboard/profile"
              onclick={() => isProfileMenuOpen = false}
              class="flex items-center gap-2 px-3 py-2 text-slate-700 rounded-xl hover:bg-[#EEF2FF] hover:text-[#3157D5] transition font-medium"
            >
              <User class="w-4 h-4 text-slate-400" />
              <span>Lihat Profil / Portfolio</span>
            </a>
            <button 
              type="button"
              onclick={async () => {
                isProfileMenuOpen = false;
                await authStore.logout();
              }}
              class="w-full flex items-center gap-2 px-3 py-2 text-rose-600 rounded-xl hover:bg-rose-50 transition font-bold"
            >
              <LogOut class="w-4 h-4 text-rose-500" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>
