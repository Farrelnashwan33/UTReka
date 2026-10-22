<script lang="ts">
  import { GraduationCap, ArrowLeft, Mail, CheckCircle2, KeyRound } from 'lucide-svelte';
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
  <title>Lupa Kata Sandi — UT REKA | Universitas Terbuka Karier</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-6 bg-[#F7F6F2]">
  <div class="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5E8EF] shadow-lg space-y-6">
    <div class="flex items-center justify-between">
      <a href="/login" class="inline-flex items-center gap-2 text-xs font-bold text-[#68738A] hover:text-[#101B35] transition">
        <ArrowLeft class="w-4 h-4 text-[#3157D5]" />
        <span>Kembali ke Login</span>
      </a>
      <a href="/" title="UT REKA">
        <img src="/images/ut-reka-logo-transparent.png" alt="UT REKA Relasi Karir" class="h-9 w-auto object-contain" />
      </a>
    </div>

    <div class="space-y-2">
      <div class="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#3157D5] flex items-center justify-center">
        <KeyRound class="w-5 h-5 stroke-[2.2]" />
      </div>
      <h1 class="text-2xl font-extrabold text-[#101B35] font-heading tracking-tight">Pemulihan Kata Sandi</h1>
      <p class="text-xs text-[#68738A] leading-relaxed">
        Masukkan alamat email terdaftar untuk menerima tautan penggantian kata sandi akun UT REKA Anda.
      </p>
    </div>

    {#if isSubmitted}
      <div class="p-4 rounded-2xl bg-[#EEF2FF] border border-[#D5E0FF] text-[#101B35] space-y-2">
        <div class="flex items-center gap-2 font-bold text-sm text-[#3157D5]">
          <CheckCircle2 class="w-5 h-5 text-[#3157D5]" />
          <span>Email Terkirim!</span>
        </div>
        <p class="text-xs text-[#68738A] leading-relaxed">
          Kami telah mengirimkan instruksi ke <strong class="text-[#101B35]">{email}</strong>. Silakan periksa folder inbox atau spam Anda.
        </p>
      </div>

      <a 
        href="/login" 
        class="block w-full text-center py-3.5 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white font-bold text-sm transition shadow-sm shadow-[#3157D5]/25"
      >
        Kembali ke Halaman Masuk
      </a>
    {:else}
      <form onsubmit={handleReset} class="space-y-4">
        <div>
          <label for="reset-email" class="block text-xs font-bold text-[#101B35] uppercase tracking-wider mb-1.5">
            Email Terdaftar
          </label>
          <div class="relative">
            <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="reset-email"
              type="email"
              required
              bind:value={email}
              placeholder="nama@mhs.ut.ac.id"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E8EF] focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-sm text-[#101B35] outline-none transition"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          class="w-full py-3.5 px-4 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white font-bold text-sm transition shadow-sm shadow-[#3157D5]/25 disabled:opacity-50 touch-manipulation min-h-[46px]"
        >
          {isLoading ? 'Mengirim tautan...' : 'Kirim Tautan Pemulihan'}
        </button>
      </form>
    {/if}
  </div>
</div>
