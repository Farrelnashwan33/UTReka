<script lang="ts">
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { 
    User, 
    Mail, 
    BookOpen, 
    Calendar, 
    Globe, 
    Code, 
    ExternalLink, 
    CheckCircle2, 
    ShieldCheck, 
    Sparkles, 
    Save, 
    Plus, 
    X, 
    Building2, 
    Briefcase,
    Award,
    Edit3,
    Camera,
    Upload,
    Check,
    RefreshCw
  } from 'lucide-svelte';

  let fullName = $state(authStore.profile?.full_name || '');
  let bio = $state(authStore.profile?.bio || '');
  let studyProgram = $state(authStore.profile?.study_program || 'Sistem Informasi');
  let nim = $state(authStore.profile?.nim || '');
  let entryYear = $state(authStore.profile?.entry_year || 2023);
  let gradYear = $state(authStore.profile?.graduation_year || 2024);
  let company = $state(authStore.profile?.company || '');
  let jobTitle = $state(authStore.profile?.job_title || '');
  let industry = $state(authStore.profile?.industry || '');
  let githubUrl = $state(authStore.profile?.github_url || '');
  let linkedinUrl = $state(authStore.profile?.linkedin_url || '');
  let portfolioUrl = $state(authStore.profile?.portfolio_url || '');
  let websiteUrl = $state(authStore.profile?.website_url || '');
  let skills = $state<string[]>(authStore.profile?.skills || ['TypeScript', 'SvelteKit']);
  let interests = $state<string[]>(authStore.profile?.interests || ['Web Development']);
  let newSkill = $state('');
  let isSaving = $state(false);

  // Avatar Management State
  let isAvatarModalOpen = $state(false);
  let isUploadingAvatar = $state(false);
  let customUrlInput = $state('');
  let fileInputEl = $state<HTMLInputElement | null>(null);

  const AVATAR_PRESETS = [
    { label: 'Mahasiswi (Default)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=360&auto=format&fit=crop&q=80' },
    { label: 'Mahasiswa Santai', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=360&auto=format&fit=crop&q=80' },
    { label: 'Mahasiswi Tech', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=360&auto=format&fit=crop&q=80' },
    { label: 'Alumni Profesional', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=360&auto=format&fit=crop&q=80' },
    { label: 'Alumni Senior Tech', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=360&auto=format&fit=crop&q=80' },
    { label: 'Karier Eksekutif', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=360&auto=format&fit=crop&q=80' },
    { label: 'Konsultan Karier', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=360&auto=format&fit=crop&q=80' },
    { label: 'Hijab Profesional', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=360&auto=format&fit=crop&q=80' }
  ];

  function processAndResizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File yang dipilih harus berupa gambar (JPG, PNG, WebP)'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 360;
          let width = img.width;
          let height = img.height;

          // Square center-crop calculation
          const minSide = Math.min(width, height);
          const startX = (width - minSide) / 2;
          const startY = (height - minSide) / 2;

          const canvas = document.createElement('canvas');
          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Gagal memproses gambar'));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, maxDim, maxDim);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Gagal memuat format gambar'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastStore.error('Harap pilih file gambar (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastStore.error('Ukuran file maksimal 5MB');
      return;
    }

    try {
      isUploadingAvatar = true;
      const resizedBase64 = await processAndResizeImage(file);
      
      const res = await authStore.updateAvatar(resizedBase64);
      if (res.success) {
        toastStore.success('Foto profil berhasil diunggah & diperbarui!');
        isAvatarModalOpen = false;
      } else {
        toastStore.error(res.error || 'Gagal menyimpan foto profil');
      }
    } catch (err: any) {
      toastStore.error(err.message || 'Gagal memproses gambar');
    } finally {
      isUploadingAvatar = false;
      if (fileInputEl) fileInputEl.value = '';
    }
  }

  async function selectPresetAvatar(url: string) {
    isUploadingAvatar = true;
    const res = await authStore.updateAvatar(url);
    isUploadingAvatar = false;
    if (res.success) {
      toastStore.success('Foto profil berhasil diganti!');
      isAvatarModalOpen = false;
    } else {
      toastStore.error(res.error || 'Gagal mengganti foto');
    }
  }

  async function handleApplyCustomUrl() {
    if (!customUrlInput.trim()) {
      toastStore.warning('Masukkan URL gambar terlebih dahulu');
      return;
    }
    const cleanUrl = customUrlInput.trim();
    isUploadingAvatar = true;
    const res = await authStore.updateAvatar(cleanUrl);
    isUploadingAvatar = false;
    if (res.success) {
      toastStore.success('Foto profil berhasil diperbarui!');
      customUrlInput = '';
      isAvatarModalOpen = false;
    } else {
      toastStore.error(res.error || 'Gagal memperbarui foto profil');
    }
  }

  async function handleResetDefaultAvatar() {
    const defaultUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=360&auto=format&fit=crop&q=80';
    isUploadingAvatar = true;
    const res = await authStore.updateAvatar(defaultUrl);
    isUploadingAvatar = false;
    if (res.success) {
      toastStore.success('Foto profil dikembalikan ke foto bawaan');
      isAvatarModalOpen = false;
    }
  }

  function addSkill() {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      skills.push(newSkill.trim());
    }
    newSkill = '';
  }

  function removeSkill(index: number) {
    skills.splice(index, 1);
  }

  async function handleSaveProfile(e: SubmitEvent) {
    e.preventDefault();
    if (!authStore.profile) return;

    isSaving = true;
    const res = await authStore.updateProfile({
      full_name: fullName,
      bio,
      study_program: studyProgram,
      nim,
      entry_year: entryYear,
      graduation_year: gradYear,
      company,
      job_title: jobTitle,
      industry,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      portfolio_url: portfolioUrl,
      website_url: websiteUrl,
      skills,
      interests
    });
    isSaving = false;

    if (res.success) {
      toastStore.success('Profil berhasil diperbarui!');
    } else {
      toastStore.error(res.error || 'Gagal menyimpan perubahan');
    }
  }

  async function handleRequestVerification() {
    if (!authStore.profile) return;
    toastStore.info('Permintaan verifikasi akun Anda telah dikirimkan ke administrator');
  }
</script>

<svelte:head>
  <title>UT REKA — Profil Profesional</title>
</svelte:head>

<!-- Mobile-First App Shell Content -->
<div class="space-y-4 max-w-md sm:max-w-2xl md:max-w-4xl mx-auto pb-4">
  <!-- Native Profile Header Card -->
  <div class="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-4 relative overflow-hidden">
    <!-- Top Accent Pattern -->
    <div class="absolute top-0 left-0 right-0 h-16 bg-linear-to-r from-[#1E40AF] via-[#2563EB] to-[#F59E0B]"></div>

    <div class="relative z-10 pt-5 flex items-start justify-between gap-3">
      <!-- Interactive Avatar with Camera Badge & Hover Edit -->
      <div class="relative group">
        <button 
          type="button" 
          onclick={() => isAvatarModalOpen = true}
          class="relative block rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1E40AF]/20 transition cursor-pointer"
          aria-label="Ganti foto profil"
          title="Klik untuk mengganti foto profil"
        >
          <img 
            src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
            alt={authStore.profile?.full_name} 
            class="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white transition group-hover:brightness-90"
          />
          <!-- Camera Overlay on Hover -->
          <div class="absolute inset-0 bg-black/45 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-0.5">
            <Camera class="w-5 h-5 drop-shadow" />
            <span class="text-[9px] font-bold tracking-tight">Ganti</span>
          </div>
          <!-- Persistent Corner Camera Badge -->
          <div class="absolute -bottom-1 -right-1 p-1.5 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white rounded-xl shadow-md border-2 border-white transition-transform group-hover:scale-110">
            <Camera class="w-3.5 h-3.5" />
          </div>
        </button>

        {#if authStore.profile?.verification_status === 'verified'}
          <span class="absolute -top-1.5 -right-1.5 p-0.5 bg-white rounded-full shadow-xs" title="Akun Terverifikasi">
            <CheckCircle2 class="w-4 h-4 text-[#3157D5] fill-white" />
          </span>
        {/if}
      </div>

      <!-- Action Buttons & Badges -->
      <div class="flex items-center gap-2">
        <button 
          type="button"
          onclick={() => isAvatarModalOpen = true}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-xs font-bold text-[#1E40AF] border border-[#CBD5E1] shadow-xs hover:border-[#1E40AF]/40 transition active:scale-95 touch-manipulation"
        >
          <Camera class="w-3.5 h-3.5" />
          <span>Ganti Foto</span>
        </button>

        <span class="text-[10px] font-black uppercase px-2.5 py-1 rounded-full
          {authStore.profile?.role === 'alumni' ? 'bg-[#EEF2FF] text-[#3157D5] border border-[#3157D5]/20' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
          {authStore.profile?.role}
        </span>
        {#if authStore.profile?.verification_status === 'verified'}
          <span class="text-[10px] font-bold text-[#3157D5] bg-[#EEF2FF] px-2.5 py-1 rounded-full border border-[#3157D5]/20">
            Terverifikasi
          </span>
        {:else}
          <button 
            type="button"
            onclick={handleRequestVerification}
            class="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 hover:bg-amber-100 touch-manipulation"
          >
            Verifikasi Akun
          </button>
        {/if}
      </div>
    </div>

    <!-- User Information Summary -->
    <div class="space-y-1">
      <h1 class="text-lg sm:text-xl font-black text-[#101B35] font-heading">{fullName || 'Pengguna UT'}</h1>
      <p class="text-xs text-[#20283B] font-semibold">
        {studyProgram} • <span class="text-[#68738A]">{authStore.profile?.role === 'alumni' ? 'NIM/IKA:' : 'NIM:'} {nim || '-'}</span>
      </p>
      {#if authStore.profile?.role === 'alumni' && company}
        <p class="text-xs text-[#3157D5] font-bold">
          {jobTitle} di {company}
        </p>
      {/if}
    </div>
  </div>

  <!-- Form Pengaturan Profil -->
  <form onsubmit={handleSaveProfile} class="space-y-4">
    <!-- 1. Data Pokok Akademis -->
    <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E5E8EF] pb-2.5">
        <BookOpen class="w-4 h-4 text-[#3157D5]" />
        <h2 class="text-xs font-black text-[#101B35] uppercase tracking-wider">Identitas & Akademis</h2>
      </div>

      <div class="space-y-3 text-xs">
        <!-- Quick Foto Profil Row in form -->
        <div class="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div class="flex items-center gap-3">
            <img 
              src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
              alt={fullName}
              class="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-xs bg-white"
            />
            <div>
              <div class="font-bold text-[#0F172A]">Foto Profil</div>
              <div class="text-[11px] text-[#64748B]">Tampil di kartu profil, jejaring, & mentor</div>
            </div>
          </div>
          <button 
            type="button"
            onclick={() => isAvatarModalOpen = true}
            class="px-3.5 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#1E40AF] text-[#1E40AF] font-bold text-xs hover:bg-[#EFF6FF] transition shadow-xs"
          >
            Ubah Foto
          </button>
        </div>

        <div>
          <label for="prof-fullname" class="block font-bold text-[#101B35] uppercase mb-1">Nama Lengkap</label>
          <input 
            id="prof-fullname"
            type="text"
            required
            bind:value={fullName}
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="prof-nim" class="block font-bold text-[#101B35] uppercase mb-1">
              {authStore.profile?.role === 'alumni' ? 'NIM / IKA' : 'NIM Mahasiswa'}
            </label>
            <input 
              id="prof-nim"
              type="text"
              bind:value={nim}
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
            />
          </div>

          <div>
            <label for="prof-entry-year" class="block font-bold text-[#101B35] uppercase mb-1">
              {authStore.profile?.role === 'student' ? 'Tahun Masuk' : 'Kelulusan'}
            </label>
            <input 
              id="prof-entry-year"
              type="number"
              bind:value={entryYear}
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
            />
          </div>
        </div>

        <div>
          <label for="prof-studyprog" class="block font-bold text-[#101B35] uppercase mb-1">Program Studi</label>
          <input 
            id="prof-studyprog"
            type="text"
            bind:value={studyProgram}
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
          />
        </div>

        <div>
          <label for="prof-bio" class="block font-bold text-[#101B35] uppercase mb-1">Bio / Ringkasan Diri</label>
          <textarea 
            id="prof-bio"
            rows="3"
            bind:value={bio}
            placeholder="Tuliskan latar belakang studi, fokus keahlian, dan tujuan profesional..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white leading-relaxed transition"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 2. Pengalaman Profesional -->
    <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E5E8EF] pb-2.5">
        <Building2 class="w-4 h-4 text-[#3157D5]" />
        <h2 class="text-xs font-black text-[#101B35] uppercase tracking-wider">Karier & Perusahaan</h2>
      </div>

      <div class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="prof-company" class="block font-bold text-[#101B35] uppercase mb-1">Perusahaan / Instansi</label>
            <input 
              id="prof-company"
              type="text"
              bind:value={company}
              placeholder="Contoh: GoTo, Bank Mandiri, Kominfo"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
            />
          </div>

          <div>
            <label for="prof-job" class="block font-bold text-[#101B35] uppercase mb-1">Posisi / Jabatan</label>
            <input 
              id="prof-job"
              type="text"
              bind:value={jobTitle}
              placeholder="Contoh: Frontend Engineer"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
            />
          </div>
        </div>

        <div>
          <label for="prof-ind" class="block font-bold text-[#101B35] uppercase mb-1">Bidang Industri</label>
          <input 
            id="prof-ind"
            type="text"
            bind:value={industry}
            placeholder="Contoh: Financial Technology, E-Commerce, BUMN"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
          />
        </div>
      </div>
    </div>

    <!-- 3. Keahlian & Topik -->
    <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E5E8EF] pb-2.5">
        <Sparkles class="w-4 h-4 text-[#3157D5]" />
        <h2 class="text-xs font-black text-[#101B35] uppercase tracking-wider">Keahlian & Tag</h2>
      </div>

      <div class="space-y-3 text-xs">
        <div class="flex gap-2">
          <input 
            type="text"
            bind:value={newSkill}
            placeholder="Tambah keahlian (contoh: Python, UI/UX, Akuntansi)..."
            class="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
          />
          <button 
            type="button"
            onclick={addSkill}
            class="px-4 py-2.5 rounded-xl bg-[#3157D5] text-white font-bold hover:bg-[#2646B8] transition touch-manipulation shadow-xs"
          >
            Tambah
          </button>
        </div>

        <div class="flex flex-wrap gap-1.5 pt-1">
          {#each skills as skill, idx}
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-[#EEF2FF] border border-[#3157D5]/15 text-[#3157D5]">
              <span>{skill}</span>
              <button 
                type="button" 
                onclick={() => removeSkill(idx)}
                class="text-[#68738A] hover:text-red-500 touch-manipulation"
                aria-label="Hapus skill"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </span>
          {/each}
        </div>
      </div>
    </div>

    <!-- 4. Tautan Sosial & Portofolio -->
    <div class="p-5 rounded-3xl bg-white border border-[#E5E8EF] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E5E8EF] pb-2.5">
        <Globe class="w-4 h-4 text-[#3157D5]" />
        <h2 class="text-xs font-black text-[#101B35] uppercase tracking-wider">Portofolio & Tautan</h2>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label for="prof-web" class="block font-bold text-[#101B35] uppercase mb-1">Website / Portofolio</label>
          <input 
            id="prof-web"
            type="url"
            bind:value={portfolioUrl}
            placeholder="https://portofolio-anda.com"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="prof-li" class="block font-bold text-[#101B35] uppercase mb-1">LinkedIn</label>
            <input 
              id="prof-li"
              type="url"
              bind:value={linkedinUrl}
              placeholder="https://linkedin.com/in/..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
            />
          </div>

          <div>
            <label for="prof-gh" class="block font-bold text-[#101B35] uppercase mb-1">GitHub</label>
            <input 
              id="prof-gh"
              type="url"
              bind:value={githubUrl}
              placeholder="https://github.com/..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E8EF] text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 bg-white transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Pinned Save Button -->
    <div class="pt-2">
      <button 
        type="submit"
        disabled={isSaving}
        class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#3157D5] text-white font-extrabold text-sm hover:bg-[#2646B8] transition shadow-md touch-manipulation min-h-[48px] disabled:opacity-50"
      >
        <Save class="w-4 h-4" />
        <span>{isSaving ? 'Menyimpan Profil...' : 'Simpan Perubahan'}</span>
      </button>
    </div>
  </form>

  <!-- Modal Ganti Foto Profil -->
  {#if isAvatarModalOpen}
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div 
        class="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4.5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/70">
          <div class="flex items-center gap-2.5">
            <div class="p-2 bg-[#EFF6FF] text-[#1E40AF] rounded-xl border border-[#BFDBFE]">
              <Camera class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-[#0F172A] font-heading">Ganti Foto Profil</h3>
              <p class="text-xs text-[#64748B]">Unggah foto baru atau pilih avatar resmi</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick={() => isAvatarModalOpen = false}
            class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            aria-label="Tutup modal"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 overflow-y-auto space-y-6">
          
          <!-- Current Preview Card -->
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div class="relative shrink-0">
              <img 
                src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
                alt="Pratinjau Foto" 
                class="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1E40AF]/20 shadow-sm bg-white"
              />
              {#if isUploadingAvatar}
                <div class="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                  <RefreshCw class="w-5 h-5 text-white animate-spin" />
                </div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Foto Profil Aktif</div>
              <div class="text-sm font-black text-[#0F172A] truncate">{fullName || 'Pengguna UT'}</div>
              <div class="text-xs text-[#1E40AF] font-semibold">{authStore.profile?.role === 'alumni' ? 'Alumni' : 'Mahasiswa'} • {studyProgram}</div>
            </div>
            <button
              type="button"
              onclick={handleResetDefaultAvatar}
              disabled={isUploadingAvatar}
              class="text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 border border-slate-200 hover:border-red-200 transition"
              title="Kembalikan ke foto bawaan"
            >
              Reset
            </button>
          </div>

          <!-- Opsi 1: Upload File dari Perangkat -->
          <div>
            <div class="text-xs font-black text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Upload class="w-4 h-4 text-[#1E40AF]" />
              <span>Unggah dari Komputer / HP</span>
            </div>
            
            <input 
              bind:this={fileInputEl}
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              onchange={handleFileUpload}
              class="hidden" 
              id="avatar-file-input"
            />

            <label 
              for="avatar-file-input"
              class="w-full flex flex-col items-center justify-center gap-2.5 p-5 border-2 border-dashed border-[#CBD5E1] hover:border-[#1E40AF] bg-[#F8FAFC] hover:bg-[#EFF6FF]/40 rounded-2xl cursor-pointer transition text-center group"
            >
              <div class="p-3 bg-white rounded-2xl shadow-xs border border-[#E2E8F0] group-hover:scale-105 transition-transform text-[#1E40AF]">
                <Upload class="w-6 h-6" />
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-[#0F172A]">
                  {isUploadingAvatar ? 'Sedang memproses & menyimpan foto...' : 'Klik untuk memilih foto'}
                </p>
                <p class="text-[11px] text-[#64748B] mt-0.5">
                  Format PNG, JPG, atau WebP (Maksimal 5MB, otomatis disesuaikan)
                </p>
              </div>
            </label>
          </div>

          <!-- Opsi 2: Pilihan Avatar Karakter Siap Pakai -->
          <div>
            <div class="text-xs font-black text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-[#F59E0B]" />
              <span>Pilihan Avatar Mahasiswa & Alumni</span>
            </div>
            <div class="grid grid-cols-4 gap-2.5">
              {#each AVATAR_PRESETS as preset}
                <button
                  type="button"
                  onclick={() => selectPresetAvatar(preset.url)}
                  disabled={isUploadingAvatar}
                  class="relative group rounded-2xl p-1 border-2 transition-all text-center
                    {(authStore.profile?.avatar_url === preset.url) 
                      ? 'border-[#1E40AF] bg-[#EFF6FF] ring-2 ring-[#1E40AF]/20' 
                      : 'border-[#E2E8F0] hover:border-[#93C5FD] bg-white'}"
                  title={preset.label}
                >
                  <img 
                    src={preset.url} 
                    alt={preset.label} 
                    class="w-full aspect-square rounded-xl object-cover" 
                  />
                  {#if authStore.profile?.avatar_url === preset.url}
                    <span class="absolute top-2 right-2 p-1 bg-[#1E40AF] text-white rounded-full shadow-xs">
                      <Check class="w-2.5 h-2.5" />
                    </span>
                  {/if}
                  <span class="block text-[10px] font-bold text-[#475569] truncate mt-1 px-0.5">
                    {preset.label.split(' ')[0]}
                  </span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Opsi 3: Masukkan Link / URL Foto -->
          <div>
            <div class="text-xs font-black text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Globe class="w-4 h-4 text-[#3157D5]" />
              <span>Gunakan Tautan URL Foto</span>
            </div>
            <div class="flex gap-2">
              <input 
                type="url" 
                bind:value={customUrlInput}
                placeholder="https://... URL gambar Anda"
                class="flex-1 px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]/20 bg-white"
              />
              <button 
                type="button"
                onclick={handleApplyCustomUrl}
                disabled={isUploadingAvatar || !customUrlInput.trim()}
                class="px-4 py-2.5 rounded-xl bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-xs font-bold disabled:opacity-50 transition shadow-xs"
              >
                Gunakan
              </button>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-slate-50 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
          <button 
            type="button" 
            onclick={() => isAvatarModalOpen = false}
            class="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
