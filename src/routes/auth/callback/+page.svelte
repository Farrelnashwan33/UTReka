<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getSupabaseClient, isSupabaseConfigured } from '$lib/supabase/client';
  import { authStore } from '$lib/stores/auth.svelte';

  onMount(async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase.auth.getSession();
        await authStore.init();
      } catch (err) {
        console.error('Auth callback error:', err);
      }
    }
    
    // Redirect based on current active role
    if (authStore.profile?.role === 'admin') {
      goto('/admin');
    } else if (authStore.profile?.role === 'alumni') {
      goto('/dashboard/alumni');
    } else {
      goto('/dashboard/student');
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center p-6 bg-[#F7F6F2]">
  <div class="text-center space-y-3">
    <div class="w-12 h-12 border-4 border-[#EEF2FF] border-t-[#3157D5] rounded-full animate-spin mx-auto"></div>
    <h2 class="text-lg font-bold text-[#101B35]">Memverifikasi Sesi Masuk...</h2>
    <p class="text-xs text-[#68738A]">Mohon tunggu sebentar, kami sedang mengarahkan Anda ke dashboard.</p>
  </div>
</div>
