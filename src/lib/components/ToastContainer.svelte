<script lang="ts">
  import { toastStore } from '$lib/stores/toast.svelte';
  import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-svelte';
</script>

<div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4" aria-live="assertive">
  {#each toastStore.items as toast (toast.id)}
    <div 
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-0
        {toast.type === 'success' ? 'bg-[#FAF9F6] border-[#18866B] text-[#183153]' : ''}
        {toast.type === 'error' ? 'bg-[#FAF9F6] border-red-500 text-red-900' : ''}
        {toast.type === 'warning' ? 'bg-[#FAF9F6] border-amber-500 text-amber-900' : ''}
        {toast.type === 'info' ? 'bg-[#FAF9F6] border-[#183153] text-[#183153]' : ''}"
      role="alert"
    >
      <div class="shrink-0 mt-0.5">
        {#if toast.type === 'success'}
          <CheckCircle2 class="w-5 h-5 text-[#18866B]" />
        {:else if toast.type === 'error'}
          <AlertCircle class="w-5 h-5 text-red-600" />
        {:else if toast.type === 'warning'}
          <AlertTriangle class="w-5 h-5 text-amber-600" />
        {:else}
          <Info class="w-5 h-5 text-[#183153]" />
        {/if}
      </div>

      <div class="flex-1 font-medium leading-relaxed">
        {toast.message}
      </div>

      <button
        onclick={() => toastStore.remove(toast.id)}
        class="text-gray-400 hover:text-gray-700 transition p-1"
        aria-label="Tutup notifikasi"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>
