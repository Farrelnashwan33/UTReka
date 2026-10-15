<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { GraduationCap, ArrowRight, ArrowLeft, Lock, Mail, AlertCircle, Sparkles } from 'lucide-svelte';

  let email = $state('');
  let password = $state('');
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

<div class="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F6]">
  <!-- Left Side: Form -->
  <div class="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
    <!-- Top Bar with Back Button -->
    <div class="flex items-center justify-between gap-3 mb-6">
      <a 
        href="/" 
        class="inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-[#183153] py-2 px-3.5 rounded-xl bg-white border border-[#E7E5E0] hover:bg-gray-50 shadow-2xs transition touch-manipulation group min-h-[40px]"
        aria-label="Kembali ke Beranda"
      >
        <ArrowLeft class="w-4 h-4 text-[#183153] group-hover:-translate-x-0.5 transition-transform" />
        <span>Kembali ke Beranda</span>
      </a>

      <a href="/" class="inline-flex items-center" title="UT REKA">
        <img src="/images/ut-reka-logo-transparent.png" alt="UT REKA Relasi Karir" class="h-12 w-auto object-contain" />
      </a>
    </div>

    <div class="max-w-md w-full mx-auto my-12">
      <div class="space-y-2 mb-8">
        <h1 class="text-3xl font-extrabold text-[#183153] font-heading tracking-tight">Masuk ke Akun Anda</h1>
        <p class="text-sm text-gray-600">
          Lanjutkan perjalanan networking dan akses peluang karier eksklusif mahasiswa & alumni UT.
        </p>
      </div>

      {#if errorMessage}
        <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      {/if}

      <form onsubmit={handleLogin} class="space-y-4">
        <div>
          <label for="login-email" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Email Terdaftar
          </label>
          <div class="relative">
            <Mail class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="login-email"
              type="email"
              required
              bind:value={email}
              placeholder="nama@mhs.ut.ac.id atau nama@alumni.ut.ac.id"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] focus:ring-1 focus:ring-[#183153] text-sm text-gray-900 outline-none transition"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="login-password" class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Kata Sandi
            </label>
            <a href="/forgot-password" class="text-xs font-bold text-[#18866B] hover:underline">
              Lupa sandi?
            </a>
          </div>
          <div class="relative">
            <Lock class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="login-password"
              type="password"
              required
              bind:value={password}
              placeholder="••••••••"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] focus:ring-1 focus:ring-[#183153] text-sm text-gray-900 outline-none transition"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          class="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#183153] hover:bg-[#102138] text-white font-extrabold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {#if isLoading}
            <span>Memproses...</span>
          {:else}
            <span>Masuk Sekarang</span>
            <ArrowRight class="w-4 h-4" />
          {/if}
        </button>
      </form>

      <!-- Quick Demo Account Credentials Buttons for Testing / Judging -->
      <div class="mt-8 p-4 rounded-2xl bg-white border border-[#E7E5E0] text-xs space-y-3">
        <div class="flex items-center gap-1.5 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
          <Sparkles class="w-3.5 h-3.5 text-[#FFD43B]" />
          <span>Akun Demo Cepat (Klik untuk Mengisi)</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button 
            type="button"
            onclick={() => handleQuickDemoLogin('budi.santoso@mhs.ut.ac.id')}
            class="p-2 text-left rounded-lg bg-[#FAF9F6] hover:bg-[#FFD43B]/20 border border-gray-200 transition"
          >
            <div class="font-bold text-[#183153]">Mahasiswa</div>
            <div class="text-[10px] text-gray-500 truncate">budi.santoso@...</div>
          </button>
          <button 
            type="button"
            onclick={() => handleQuickDemoLogin('sarah.wijaya@alumni.ut.ac.id')}
            class="p-2 text-left rounded-lg bg-[#FAF9F6] hover:bg-[#18866B]/20 border border-gray-200 transition"
          >
            <div class="font-bold text-[#18866B]">Alumni</div>
            <div class="text-[10px] text-gray-500 truncate">sarah.wijaya@...</div>
          </button>
          <button 
            type="button"
            onclick={() => handleQuickDemoLogin('admin.reka@ut.ac.id')}
            class="p-2 text-left rounded-lg bg-[#FAF9F6] hover:bg-purple-100 border border-gray-200 transition"
          >
            <div class="font-bold text-purple-700">Admin</div>
            <div class="text-[10px] text-gray-500 truncate">admin.reka@...</div>
          </button>
        </div>
      </div>

      <div class="mt-8 text-center text-xs text-gray-600">
        Belum memiliki akun?{' '}
        <a href="/register" class="font-bold text-[#183153] hover:underline">
          Daftar akun UT REKA baru
        </a>
      </div>
    </div>

    <div class="text-xs text-gray-400 text-center sm:text-left">
      © 2026 UT REKA. Universitas Terbuka Karier.
    </div>
  </div>

  <!-- Right Side: Visual Split-Screen Campus Artwork -->
  <div class="hidden lg:block lg:col-span-6 relative bg-[#183153] overflow-hidden">
    <img 
      src="/images/gerbang-ut-landmark.jpg" 
      alt="Gerbang Ikonik Universitas Terbuka" 
      class="w-full h-full object-cover object-center opacity-85"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-[#183153] via-[#183153]/40 to-transparent"></div>

    <div class="absolute bottom-16 left-16 right-16 text-white space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD43B] text-[#183153] text-xs font-black uppercase tracking-wider">
        <span>Karier Tanpa Batas</span>
      </div>
      <h2 class="text-3xl font-extrabold font-heading leading-tight">
        "Dari Kampus Terbuka, <br />Menuju Karier Tanpa Batas."
      </h2>
      <p class="text-sm text-gray-300 max-w-md leading-relaxed">
        Terhubung dengan ribuan alumni yang sukses di industri tech, korporasi global, BUMN, dan pemerintahan di seluruh Indonesia.
      </p>
    </div>
  </div>
</div>
