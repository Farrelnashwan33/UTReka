<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte';
  import type { LayoutProps } from './$types';
  import DashboardSidebar from '$lib/components/DashboardSidebar.svelte';
  import DashboardTopbar from '$lib/components/DashboardTopbar.svelte';
  import DashboardBottomNav from '$lib/components/DashboardBottomNav.svelte';

  let { children }: LayoutProps = $props();
  let isSidebarOpen = $state(false);

  onMount(async () => {
    await authStore.init();
    if (!authStore.isAuthenticated) {
      goto('/login');
    }
  });
</script>

<div class="min-h-screen bg-[#F7F6F2] flex flex-col md:flex-row antialiased selection:bg-[#3157D5] selection:text-white">
  <!-- Desktop Sidebar: Midnight Navy -->
  <DashboardSidebar bind:isOpen={isSidebarOpen} />

  <!-- Main App Shell -->
  <div class="flex-1 md:pl-64 lg:pl-70 flex flex-col min-w-0 min-h-screen">
    <!-- Top Bar with breadcrumbs and user controls -->
    <DashboardTopbar onToggleSidebar={() => isSidebarOpen = !isSidebarOpen} />

    <!-- Centered Responsive Container -->
    <main class="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
      {@render children()}
    </main>

    <!-- Mobile Bottom Navigation Bar (strictly hidden on desktop/laptop) -->
    <div class="block md:hidden">
      <DashboardBottomNav />
    </div>
  </div>
</div>
