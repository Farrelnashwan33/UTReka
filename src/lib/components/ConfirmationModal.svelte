<script lang="ts">
  import { AlertTriangle, X } from 'lucide-svelte';

  let {
    isOpen = $bindable(false),
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Lanjutkan',
    cancelText = 'Batal',
    isDanger = false,
    onConfirm
  } = $props<{
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Accessible backdrop -->
    <button 
      type="button"
      class="fixed inset-0 bg-black/50 backdrop-blur-xs w-full h-full border-none cursor-default"
      onclick={() => isOpen = false}
      aria-label="Tutup overlay dialog"
    ></button>

    <!-- Dialog Content Container -->
    <div 
      class="relative z-10 bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E7E5E0] animate-in fade-in zoom-in-95 duration-150"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 {isDanger ? 'bg-red-50 text-red-600' : 'bg-[#FFD43B]/20 text-[#183153]'}">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <button 
          onclick={() => isOpen = false}
          class="text-gray-400 hover:text-black p-1"
          aria-label="Tutup dialog"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="mt-4">
        <h3 id="modal-title" class="text-lg font-extrabold text-[#183153]">{title}</h3>
        <p class="text-sm text-gray-600 mt-2 leading-relaxed">{message}</p>
      </div>

      <div class="mt-6 flex items-center justify-end gap-3">
        <button 
          onclick={() => isOpen = false}
          class="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition"
        >
          {cancelText}
        </button>
        <button 
          onclick={() => { onConfirm(); isOpen = false; }}
          class="px-5 py-2.5 rounded-xl text-sm font-extrabold transition shadow-xs
            {isDanger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#183153] text-[#FAF9F6] hover:bg-[#102138]'}"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
