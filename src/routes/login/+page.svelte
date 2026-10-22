<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { 
    GraduationCap, 
    ArrowRight, 
    ArrowLeft, 
    Lock, 
    Mail, 
    AlertCircle, 
    Sparkles,
    Eye,
    EyeOff,
    ShieldCheck
  } from 'lucide-svelte';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let isLoading = $state(false);
  let errorMessage = $state<string | null>(null);

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    if (!email || !password) {
      errorMessage = 'Email dan password wajib diisi';
      return;
    }

    isLoading = true;
    errorMessage = null;

    const res = await authStore.login(email, password);
    isLoading = false;

    if (res.success) {
      toastStore.success('Selamat datang kembali di UT REKA!');
      if (res.role === 'admin') {
        goto('/admin');
      } else if (res.role === 'alumni') {
        goto('/dashboard/alumni');
      } else {
        goto('/dashboard/student');
      }
    } else {
      errorMessage = res.error || 'Email atau password salah';
      toastStore.error(errorMessage);
    }
  }

  function handleQuickDemoLogin(demoEmail: string) {
    email = demoEmail;
    password = 'password123';
  }
</script>

<svelte:head>
  <title>Masuk — UT REKA | Universitas Terbuka Karier</title>
</svelte:head>

<div class="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F6F2]">
  <!-- Left Side: Form Container -->
  <div class="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
    <!-- Top Bar with Back Button -->
    <div class="flex items-center justify-between gap-3 mb-6">
      <a 
        href="/" 
        class="inline-flex items-center gap-2 text-xs font-bold text-[#68738A] hover:text-[#101B35] py-2 px-3.5 rounded-xl bg-white border border-[#E5E8EF] hover:bg-slate-50 shadow-2xs transition touch-manipulation group min-h-[40px]"
        aria-label="Kembali ke Beranda"
      >
        <ArrowLeft class="w-4 h-4 text-[#3157D5] group-hover:-translate-x-0.5 transition-transform" />
        <span>Kembali ke Beranda</span>
      </a>

      <a href="/" class="inline-flex items-center" title="UT REKA">
        <img src="/images/ut-reka-logo-transparent.png" alt="UT REKA Relasi Karir" class="h-10 w-auto object-contain" />
      </a>
    </div>

    <div class="max-w-md w-full mx-auto my-8 sm:my-12">
      <div class="space-y-2 mb-8">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157D5] text-xs font-bold uppercase tracking-wider">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Selamat Datang Kembali</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#101B35] font-heading tracking-tight">Masuk ke Akun Anda</h1>
        <p class="text-xs sm:text-sm text-[#68738A] leading-relaxed">
          Lanjutkan perjalanan networking dan akses peluang karier eksklusif mahasiswa & alumni Universitas Terbuka.
        </p>
      </div>

      {#if errorMessage}
        <div class="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      {/if}

      <form onsubmit={handleLogin} class="space-y-4">
        <div>
          <label for="login-email" class="block text-xs font-bold text-[#101B35] uppercase tracking-wider mb-1.5">
            Email Terdaftar
          </label>
          <div class="relative">
            <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="login-email"
              type="email"
              required
              bind:value={email}
              placeholder="nama@mhs.ut.ac.id atau nama@alumni.ut.ac.id"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E8EF] focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-sm text-[#101B35] outline-none transition"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="login-password" class="block text-xs font-bold text-[#101B35] uppercase tracking-wider">
              Kata Sandi
            </label>
            <a href="/forgot-password" class="text-xs font-bold text-[#3157D5] hover:underline">
              Lupa sandi?
            </a>
          </div>
          <div class="relative">
            <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              bind:value={password}
              placeholder="••••••••"
              class="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-[#E5E8EF] focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 text-sm text-[#101B35] outline-none transition"
            />
            <button
              type="button"
              onclick={() => showPassword = !showPassword}
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#101B35] transition p-1"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {#if showPassword}
                <EyeOff class="w-4 h-4" />
              {:else}
                <Eye class="w-4 h-4" />
              {/if}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          class="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#3157D5] hover:bg-[#2446BD] text-white font-bold text-sm transition shadow-sm shadow-[#3157D5]/25 flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation min-h-[46px]"
        >
          {#if isLoading}
            <span>Memproses...</span>
          {:else}
            <span>Masuk Sekarang</span>
            <ArrowRight class="w-4 h-4" />
          {/if}
        </button>
      </form>

      <!-- Quick Demo Account Credentials Buttons for Testing -->
      <div class="mt-8 p-4 rounded-2xl bg-white border border-[#E5E8EF] text-xs space-y-3 shadow-2xs">
        <div class="flex items-center gap-1.5 font-bold text-[#68738A] uppercase tracking-wider text-[10px]">
          <Sparkles class="w-3.5 h-3.5 text-[#3157D5]" />
          <span>Akun Demo Cepat (Klik untuk Mengisi)</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button 
            type="button"
            onclick={() => handleQuickDemoLogin('tasya.angelicia@mhs.ut.ac.id')}
            class="p-2.5 text-left rounded-xl bg-[#FAF9F5] hover:bg-[#EFF6FF] hover:border-[#1E40AF]/40 border border-[#E2E8F0] transition group touch-manipulation"
          >
            <div class="font-bold text-[#0F172A] group-hover:text-[#1E40AF] transition-colors">Mahasiswa</div>
            <div class="text-[11px] font-semibold text-[#1E40AF] truncate">Tasya Angelicia</div>
            <div class="text-[9px] text-[#64748B] truncate">tasya.angelicia@...</div>
          </button>
          <button 
            type="button"
            onclick={() => handleQuickDemoLogin('azdzikri.hisyam@alumni.ut.ac.id')}
            class="p-2.5 text-left rounded-xl bg-[#FAF9F5] hover:bg-[#EFF6FF] hover:border-[#1E40AF]/40 border border-[#E2E8F0] transition group touch-manipulation"
          >
            <div class="font-bold text-[#1E40AF]">Alumni</div>
            <div class="text-[11px] font-semibold text-[#0F172A] truncate">Azdzikri M. Hisyam</div>
            <div class="text-[9px] text-[#64748B] truncate">azdzikri.hisyam@...</div>
          </button>
          <button 
            type="button"
            onclick={() => handleQuickDemoLogin('farrel.nashwan@admin.ut.ac.id')}
            class="p-2.5 text-left rounded-xl bg-[#FAF9F5] hover:bg-[#FEF3C7] hover:border-amber-300 border border-[#E2E8F0] transition group touch-manipulation"
          >
            <div class="font-bold text-[#92400E]">Admin</div>
            <div class="text-[11px] font-semibold text-[#0F172A] truncate">Akhmad Farrel N.</div>
            <div class="text-[9px] text-[#64748B] truncate">farrel.nashwan@...</div>
          </button>
        </div>
      </div>

      <div class="mt-8 text-center text-xs text-[#68738A]">
        Belum memiliki akun?{' '}
        <a href="/register" class="font-bold text-[#3157D5] hover:underline">
          Daftar akun UT REKA baru
        </a>
      </div>
    </div>

    <div class="text-xs text-[#68738A] text-center sm:text-left">
      © 2026 UT REKA — Universitas Terbuka Karier.
    </div>
  </div>

  <!-- Right Side: Visual Split-Screen Brand Artwork -->
  <div class="hidden lg:block lg:col-span-6 relative bg-[#0F172A] overflow-hidden">
    <img 
      src="/images/utcc-building-login.jpg" 
      alt="Gedung Universitas Terbuka Convention Center (UTCC)" 
      class="w-full h-full object-cover object-center" 
    />
    <div class="absolute inset-0 bg-linear-to-t from-[#0A1120] via-[#0A1120]/60 to-transparent"></div>

    <div class="absolute bottom-16 left-16 right-16 text-white space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[#FEF08A] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>Ekosistem Karier Terpercaya</span>
      </div>
      <h2 class="text-3xl font-extrabold font-heading leading-tight drop-shadow-md">
        "Dari Kampus Terbuka, <br />Menuju Karier Tanpa Batas."
      </h2>
      <p class="text-sm text-slate-200 max-w-md leading-relaxed drop-shadow-sm">
        Terhubung dengan ribuan alumni yang sukses di industri teknologi, korporasi global, BUMN, dan pemerintahan di seluruh Indonesia.
      </p>
    </div>
  </div>
</div>
