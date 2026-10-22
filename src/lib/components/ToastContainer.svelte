<script lang="ts">
  import { toastStore } from '$lib/stores/toast.svelte';
  import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-svelte';
</script>

<div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4" aria-live="assertive">
  {#each toastStore.items as toast (toast.id)}
    <div 
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border text-sm transition-all duration-300 transform translate-y-0
        {toast.type === 'success' ? 'bg-white border-emerald-500/30 text-[#101B35]' : ''}
        {toast.type === 'error' ? 'bg-white border-red-500/30 text-red-900' : ''}
        {toast.type === 'warning' ? 'bg-white border-amber-500/30 text-amber-900' : ''}
        {toast.type === 'info' ? 'bg-white border-[#3157D5]/30 text-[#101B35]' : ''}"
      role="alert"
    >
      <div class="shrink-0 mt-0.5">
        {#if toast.type === 'success'}
          <CheckCircle2 class="w-5 h-5 text-emerald-600" />
        {:else if toast.type === 'error'}
          <AlertCircle class="w-5 h-5 text-red-600" />
        {:else if toast.type === 'warning'}
          <AlertTriangle class="w-5 h-5 text-amber-600" />
        {:else}
          <Info class="w-5 h-5 text-[#3157D5]" />
        {/if}
      </div>

      <div class="flex-1 font-medium leading-relaxed">
        {toast.message}
      </div>

      <button
        onclick={() => toastStore.remove(toast.id)}
        class="text-[#68738A] hover:text-[#101B35] transition p-1"
        aria-label="Tutup notifikasi"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>
