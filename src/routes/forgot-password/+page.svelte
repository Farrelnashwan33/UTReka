<script lang="ts">
  import { GraduationCap, ArrowLeft, Mail, CheckCircle2 } from 'lucide-svelte';
  import { toastStore } from '$lib/stores/toast.svelte';

  let email = $state('');
  let isSubmitted = $state(false);
  let isLoading = $state(false);

  async function handleReset(e: SubmitEvent) {
    e.preventDefault();
    if (!email) return;

    isLoading = true;
    setTimeout(() => {
      isLoading = false;
      isSubmitted = true;
      toastStore.success('Instruksi pemulihan kata sandi telah dikirim ke email Anda');
    }, 800);
  }
</script>

<svelte:head>
  <title>Lupa Kata Sandi — UT REKA</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-6 bg-[#FAF9F6]">
  <div class="max-w-md w-full ut-card p-8 bg-white border-[#E7E5E0] space-y-6">
    <div class="flex items-center justify-between">
      <a href="/login" class="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black">
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke Login</span>
      </a>
      <a href="/" title="UT REKA">
        <img src="/images/ut-reka-logo-transparent.png" alt="UT REKA Relasi Karir" class="h-10 w-auto object-contain" />
      </a>
    </div>

    <div>
      <h1 class="text-2xl font-extrabold text-[#183153] font-heading">Pemulihan Kata Sandi</h1>
      <p class="text-xs text-gray-600 mt-1">
        Masukkan alamat email terdaftar untuk menerima tautan penggantian kata sandi.
      </p>
    </div>

    {#if isSubmitted}
      <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
        <div class="flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 class="w-5 h-5 text-[#18866B]" />
          <span>Email Terkirim!</span>
        </div>
        <p class="text-xs text-emerald-700 leading-relaxed">
          Kami telah mengirimkan instruksi ke <strong>{email}</strong>. Silakan periksa folder inbox atau spam Anda.
        </p>
      </div>

      <a 
        href="/login" 
        class="block w-full text-center py-3 rounded-xl bg-[#183153] text-white font-bold text-sm"
      >
        Kembali ke Halaman Masuk
      </a>
    {:else}
      <form onsubmit={handleReset} class="space-y-4">
        <div>
          <label for="reset-email" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Email Terdaftar
          </label>
          <div class="relative">
            <Mail class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="reset-email"
              type="email"
              required
              bind:value={email}
              placeholder="nama@mhs.ut.ac.id"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          class="w-full py-3.5 px-4 rounded-xl bg-[#FFD43B] text-[#183153] font-extrabold text-sm hover:bg-[#F2C41D] transition shadow-xs disabled:opacity-50"
        >
          {isLoading ? 'Mengirim tautan...' : 'Kirim Tautan Pemulihan'}
        </button>
      </form>
    {/if}
  </div>
</div>
