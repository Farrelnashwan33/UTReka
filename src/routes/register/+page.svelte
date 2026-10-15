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
    User, 
    BookOpen, 
    Calendar, 
    CheckSquare, 
    AlertCircle,
    CheckCircle2
  } from 'lucide-svelte';
  import { z } from 'zod';

  const registerSchema = z.object({
    fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi kata sandi minimal 6 karakter'),
    role: z.enum(['student', 'alumni'], { message: 'Pilih status mahasiswa atau alumni' }),
    nim: z.string().min(5, 'NIM atau nomor IKA minimal 5 karakter'),
    studyProgram: z.string().min(2, 'Program studi wajib diisi'),
    year: z.number().min(1980).max(2030, 'Tahun tidak valid'),
    agreePrivacy: z.boolean().refine(val => val === true, 'Persetujuan kebijakan privasi wajib dicentang')
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmPassword']
  });

  let fullName = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let role = $state<'student' | 'alumni'>('student');
  let nim = $state('');
  let studyProgram = $state('');
  let year = $state(2023);
  let agreePrivacy = $state(false);

  let isLoading = $state(false);
  let errors = $state<Record<string, string>>({});
  let globalError = $state<string | null>(null);

  const programs = [
    'Sistem Informasi',
    'Teknik Informatika',
    'Sains Data',
    'Statistika',
    'Matematika',
    'Biologi',
    'Agribisnis',
    'Teknologi Pangan',
    'Perencanaan Wilayah dan Kota',
    'Manajemen',
    'Akuntansi',
    'Akuntansi Keuangan Publik',
    'Ekonomi Pembangunan',
    'Ekonomi Syariah',
    'Pariwisata',
    'Ilmu Komunikasi',
    'Ilmu Hukum',
    'Ilmu Administrasi Negara',
    'Ilmu Administrasi Bisnis',
    'Sosiologi',
    'Sastra Inggris',
    'Ilmu Perpustakaan',
    'Pendidikan Guru Sekolah Dasar (PGSD)',
    'Pendidikan Guru PAUD (PGPAUD)',
    'Pendidikan Bahasa Inggris',
    'Pendidikan Bahasa dan Sastra Indonesia',
    'Pendidikan Matematika',
    'Pendidikan Fisika',
    'Pendidikan Kimia',
    'Pendidikan Biologi',
    'Pendidikan Ekonomi'
  ];

  async function handleRegister(e: SubmitEvent) {
    e.preventDefault();
    errors = {};
    globalError = null;

    const validation = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      role,
      nim,
      studyProgram,
      year: Number(year),
      agreePrivacy
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      }
      errors = fieldErrors;
      toastStore.error('Harap periksa kembali input formulir pendaftaran');
      return;
    }

    isLoading = true;

    const res = await authStore.register({
      fullName,
      email,
      password,
      nim,
      role,
      studyProgram,
      entryYear: role === 'student' ? Number(year) : undefined,
      graduationYear: role === 'alumni' ? Number(year) : undefined
    });

    isLoading = false;

    if (res.success) {
      toastStore.success('Pendaftaran berhasil! Selamat datang di UT REKA.');
      if (res.role === 'alumni') {
        goto('/dashboard/alumni');
      } else {
        goto('/dashboard/student');
      }
    } else {
      globalError = res.error || 'Terjadi kesalahan saat pendaftaran';
      toastStore.error(globalError);
    }
  }
</script>

<svelte:head>
  <title>Daftar Akun — UT REKA | Universitas Terbuka Karier</title>
</svelte:head>

<div class="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F6]">
  <!-- Left Side: Registration Form -->
  <div class="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto">
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

    <div class="max-w-xl w-full mx-auto my-8">
      <div class="space-y-2 mb-8">
        <h1 class="text-3xl font-extrabold text-[#183153] font-heading tracking-tight">Daftar Akun Baru</h1>
        <p class="text-sm text-gray-600">
          Bergabunglah dengan jejaring profesional terbesar mahasiswa dan alumni Universitas Terbuka.
        </p>
      </div>

      {#if globalError}
        <div class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <span>{globalError}</span>
        </div>
      {/if}

      <form onsubmit={handleRegister} class="space-y-5">
        <!-- Role Selection Segment: STRICTLY STUDENT OR ALUMNI (NO ADMIN CHOICE) -->
        <div>
          <span class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Status Keanggotaan
          </span>
          <div class="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onclick={() => role = 'student'}
              class="p-4 rounded-2xl border text-left transition flex items-center justify-between
                {role === 'student' ? 'border-[#FFD43B] bg-[#FFD43B]/15 text-[#183153] font-extrabold ring-2 ring-[#FFD43B]' : 'border-[#E7E5E0] bg-white text-gray-600'}"
            >
              <div>
                <div class="text-sm">Mahasiswa Aktif</div>
                <div class="text-[11px] font-normal text-gray-500">Sedang menempuh studi di UT</div>
              </div>
              {#if role === 'student'}
                <CheckCircle2 class="w-5 h-5 text-[#183153] shrink-0" />
              {/if}
            </button>

            <button 
              type="button"
              onclick={() => role = 'alumni'}
              class="p-4 rounded-2xl border text-left transition flex items-center justify-between
                {role === 'alumni' ? 'border-[#18866B] bg-[#18866B]/15 text-[#183153] font-extrabold ring-2 ring-[#18866B]' : 'border-[#E7E5E0] bg-white text-gray-600'}"
            >
              <div>
                <div class="text-sm">Alumni UT</div>
                <div class="text-[11px] font-normal text-gray-500">Telah lulus & siap berbagi ilmu</div>
              </div>
              {#if role === 'alumni'}
                <CheckCircle2 class="w-5 h-5 text-[#18866B] shrink-0" />
              {/if}
            </button>
          </div>
          {#if errors.role}
            <p class="text-xs text-red-600 mt-1">{errors.role}</p>
          {/if}
        </div>

        <!-- Full Name -->
        <div>
          <label for="reg-name" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Nama Lengkap (sesuai data akademis)
          </label>
          <div class="relative">
            <User class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="reg-name"
              type="text"
              required
              bind:value={fullName}
              placeholder="Contoh: Budi Santoso"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none transition"
            />
          </div>
          {#if errors.fullName}
            <p class="text-xs text-red-600 mt-1">{errors.fullName}</p>
          {/if}
        </div>

        <!-- Email -->
        <div>
          <label for="reg-email" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Alamat Email
          </label>
          <div class="relative">
            <Mail class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="reg-email"
              type="email"
              required
              bind:value={email}
              placeholder="nama@mhs.ut.ac.id atau email aktif Anda"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none transition"
            />
          </div>
          {#if errors.email}
            <p class="text-xs text-red-600 mt-1">{errors.email}</p>
          {/if}
        </div>

        <!-- NIM & Study Program Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="reg-nim" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              {role === 'alumni' ? 'NIM / IKA' : 'NIM Mahasiswa'}
            </label>
            <input 
              id="reg-nim"
              type="text"
              required
              bind:value={nim}
              placeholder={role === 'alumni' ? 'Contoh: 042918274 atau No. IKA UT' : 'Contoh: 042918274'}
              class="w-full px-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none transition"
            />
            {#if errors.nim}
              <p class="text-xs text-red-600 mt-1">{errors.nim}</p>
            {/if}
          </div>

          <div>
            <label for="reg-study-program" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Program Studi
            </label>
            <input 
              id="reg-study-program"
              type="text"
              required
              bind:value={studyProgram}
              list="program-studi-list"
              placeholder="Ketik program studi Anda..."
              class="w-full px-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none transition"
            />
            <datalist id="program-studi-list">
              {#each programs as prog}
                <option value={prog}></option>
              {/each}
            </datalist>
            {#if errors.studyProgram}
              <p class="text-xs text-red-600 mt-1">{errors.studyProgram}</p>
            {/if}
          </div>
        </div>

        <!-- Year (Entry year or Grad year) -->
        <div>
          <label for="reg-year" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            {role === 'student' ? 'Tahun Masuk Kuliah' : 'Tahun Kelulusan'}
          </label>
          <div class="relative">
            <Calendar class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              id="reg-year"
              type="number"
              bind:value={year}
              min="1980"
              max="2030"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none transition"
            />
          </div>
        </div>

        <!-- Password & Confirm Password -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="reg-password" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                id="reg-password"
                type="password"
                required
                bind:value={password}
                placeholder="Minimal 6 karakter"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none transition"
              />
            </div>
            {#if errors.password}
              <p class="text-xs text-red-600 mt-1">{errors.password}</p>
            {/if}
          </div>

          <div>
            <label for="reg-confirm-password" class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Konfirmasi Sandi
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                id="reg-confirm-password"
                type="password"
                required
                bind:value={confirmPassword}
                placeholder="Ulangi sandi"
                class="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E7E5E0] focus:border-[#183153] text-sm text-gray-900 outline-none transition"
              />
            </div>
            {#if errors.confirmPassword}
              <p class="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
            {/if}
          </div>
        </div>

        <!-- Privacy Policy Agreement -->
        <div class="pt-2">
          <label class="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox"
              bind:checked={agreePrivacy}
              class="w-4 h-4 rounded mt-0.5 text-[#183153] focus:ring-[#183153] border-gray-300"
            />
            <span class="text-xs text-gray-600 leading-relaxed">
              Saya menyetujui kebijakan privasi serta syarat ketentuan komunitas UT REKA dan menjamin keaslian identitas akademis yang saya daftarkan.
            </span>
          </label>
          {#if errors.agreePrivacy}
            <p class="text-xs text-red-600 mt-1">{errors.agreePrivacy}</p>
          {/if}
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          disabled={isLoading}
          class="w-full py-4 px-6 rounded-xl bg-[#FFD43B] hover:bg-[#F2C41D] text-[#183153] font-black text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {#if isLoading}
            <span>Mendaftarkan akun...</span>
          {:else}
            <span>Daftar Sekarang</span>
            <ArrowRight class="w-4 h-4 stroke-[2.5]" />
          {/if}
        </button>
      </form>

      <div class="mt-8 text-center text-xs text-gray-600">
        Sudah memiliki akun?{' '}
        <a href="/login" class="font-bold text-[#183153] hover:underline">
          Masuk ke akun Anda
        </a>
      </div>
    </div>

    <div class="text-xs text-gray-400 text-center sm:text-left">
      © 2026 UT REKA. Universitas Terbuka Karier.
    </div>
  </div>

  <!-- Right Side: Campus Split Screen -->
  <div class="hidden lg:block lg:col-span-5 relative bg-[#183153] overflow-hidden">
    <img 
      src="/images/gerbang-ut-landmark.jpg" 
      alt="Gerbang Ikonik Universitas Terbuka" 
      class="w-full h-full object-cover object-center opacity-85"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-[#183153] via-[#183153]/40 to-transparent"></div>

    <div class="absolute bottom-16 left-12 right-12 text-white space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD43B] text-[#183153] text-xs font-black uppercase tracking-wider">
        <span>Jejaring Tanpa Batas</span>
      </div>
      <h2 class="text-3xl font-black font-heading leading-tight">
        Langkah Awal Menuju Masa Depan Gemilang
      </h2>
      <p class="text-xs text-gray-300 leading-relaxed">
        Ribuan alumni siap memberikan arahan nyata untuk portofolio, persiapan wawancara kerja, dan membuka jalan kolaborasi proyek.
      </p>
    </div>
  </div>
</div>
