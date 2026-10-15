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
    Edit3
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
    const res = await platformService.updateProfile(authStore.profile.id, {
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
  <div class="p-5 sm:p-6 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-4 relative overflow-hidden">
    <!-- Top Accent Pattern -->
    <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#183153] via-[#102138] to-[#18866B]"></div>

    <div class="relative z-10 pt-5 flex items-start justify-between gap-3">
      <div class="relative">
        <img 
          src={authStore.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
          alt={authStore.profile?.full_name} 
          class="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
        />
        {#if authStore.profile?.verification_status === 'verified'}
          <span class="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full">
            <CheckCircle2 class="w-4 h-4 text-[#18866B] fill-white" />
          </span>
        {/if}
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] font-black uppercase px-2.5 py-1 rounded-full
          {authStore.profile?.role === 'alumni' ? 'bg-[#18866B]/15 text-[#18866B]' : 'bg-[#FFD43B]/30 text-[#183153]'}">
          {authStore.profile?.role}
        </span>
        {#if authStore.profile?.verification_status === 'verified'}
          <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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
      <h1 class="text-lg sm:text-xl font-black text-[#183153] font-heading">{fullName || 'Pengguna UT'}</h1>
      <p class="text-xs text-gray-700 font-semibold">
        {studyProgram} • <span class="text-gray-500">{authStore.profile?.role === 'alumni' ? 'NIM/IKA:' : 'NIM:'} {nim || '-'}</span>
      </p>
      {#if authStore.profile?.role === 'alumni' && company}
        <p class="text-xs text-[#18866B] font-bold">
          {jobTitle} di {company}
        </p>
      {/if}
    </div>
  </div>

  <!-- Form Pengaturan Profil -->
  <form onsubmit={handleSaveProfile} class="space-y-4">
    <!-- 1. Data Pokok Akademis -->
    <div class="p-5 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E7E5E0] pb-2.5">
        <BookOpen class="w-4 h-4 text-[#183153]" />
        <h2 class="text-xs font-black text-[#183153] uppercase tracking-wider">Identitas & Akademis</h2>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label for="prof-fullname" class="block font-bold text-gray-700 uppercase mb-1">Nama Lengkap</label>
          <input 
            id="prof-fullname"
            type="text"
            required
            bind:value={fullName}
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="prof-nim" class="block font-bold text-gray-700 uppercase mb-1">
              {authStore.profile?.role === 'alumni' ? 'NIM / IKA' : 'NIM Mahasiswa'}
            </label>
            <input 
              id="prof-nim"
              type="text"
              bind:value={nim}
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
            />
          </div>

          <div>
            <label for="prof-entry-year" class="block font-bold text-gray-700 uppercase mb-1">
              {authStore.profile?.role === 'student' ? 'Tahun Masuk' : 'Kelulusan'}
            </label>
            <input 
              id="prof-entry-year"
              type="number"
              bind:value={entryYear}
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
            />
          </div>
        </div>

        <div>
          <label for="prof-studyprog" class="block font-bold text-gray-700 uppercase mb-1">Program Studi</label>
          <input 
            id="prof-studyprog"
            type="text"
            bind:value={studyProgram}
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
        </div>

        <div>
          <label for="prof-bio" class="block font-bold text-gray-700 uppercase mb-1">Bio / Ringkasan Diri</label>
          <textarea 
            id="prof-bio"
            rows="3"
            bind:value={bio}
            placeholder="Tuliskan latar belakang studi, fokus keahlian, dan tujuan profesional..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153] leading-relaxed"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 2. Pengalaman Profesional (Khusus Alumni atau Mahasiswa Magang) -->
    <div class="p-5 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E7E5E0] pb-2.5">
        <Building2 class="w-4 h-4 text-[#183153]" />
        <h2 class="text-xs font-black text-[#183153] uppercase tracking-wider">Karier & Perusahaan</h2>
      </div>

      <div class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="prof-company" class="block font-bold text-gray-700 uppercase mb-1">Perusahaan / Instansi</label>
            <input 
              id="prof-company"
              type="text"
              bind:value={company}
              placeholder="Contoh: GoTo, Bank Mandiri, Kominfo"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
            />
          </div>

          <div>
            <label for="prof-job" class="block font-bold text-gray-700 uppercase mb-1">Posisi / Jabatan</label>
            <input 
              id="prof-job"
              type="text"
              bind:value={jobTitle}
              placeholder="Contoh: Frontend Engineer"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
            />
          </div>
        </div>

        <div>
          <label for="prof-ind" class="block font-bold text-gray-700 uppercase mb-1">Bidang Industri</label>
          <input 
            id="prof-ind"
            type="text"
            bind:value={industry}
            placeholder="Contoh: Financial Technology, E-Commerce, BUMN"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
        </div>
      </div>
    </div>

    <!-- 3. Keahlian & Topik -->
    <div class="p-5 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E7E5E0] pb-2.5">
        <Sparkles class="w-4 h-4 text-[#183153]" />
        <h2 class="text-xs font-black text-[#183153] uppercase tracking-wider">Keahlian & Tag</h2>
      </div>

      <div class="space-y-3 text-xs">
        <div class="flex gap-2">
          <input 
            type="text"
            bind:value={newSkill}
            placeholder="Tambah keahlian (contoh: Python, UI/UX, Akuntansi)..."
            class="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
          <button 
            type="button"
            onclick={addSkill}
            class="px-4 py-2.5 rounded-xl bg-[#183153] text-[#FFD43B] font-bold touch-manipulation"
          >
            Tambah
          </button>
        </div>

        <div class="flex flex-wrap gap-1.5 pt-1">
          {#each skills as skill, idx}
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-[#FAF9F6] border border-[#E7E5E0] text-[#183153]">
              <span>{skill}</span>
              <button 
                type="button" 
                onclick={() => removeSkill(idx)}
                class="text-gray-400 hover:text-red-500 touch-manipulation"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </span>
          {/each}
        </div>
      </div>
    </div>

    <!-- 4. Tautan Sosial & Portofolio -->
    <div class="p-5 rounded-3xl bg-white border border-[#E7E5E0] shadow-xs space-y-3.5">
      <div class="flex items-center gap-2 border-b border-[#E7E5E0] pb-2.5">
        <Globe class="w-4 h-4 text-[#183153]" />
        <h2 class="text-xs font-black text-[#183153] uppercase tracking-wider">Portofolio & Tautan</h2>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label for="prof-web" class="block font-bold text-gray-700 uppercase mb-1">Website / Portofolio</label>
          <input 
            id="prof-web"
            type="url"
            bind:value={portfolioUrl}
            placeholder="https://portofolio-anda.com"
            class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="prof-li" class="block font-bold text-gray-700 uppercase mb-1">LinkedIn</label>
            <input 
              id="prof-li"
              type="url"
              bind:value={linkedinUrl}
              placeholder="https://linkedin.com/in/..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
            />
          </div>

          <div>
            <label for="prof-gh" class="block font-bold text-gray-700 uppercase mb-1">GitHub</label>
            <input 
              id="prof-gh"
              type="url"
              bind:value={githubUrl}
              placeholder="https://github.com/..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E5E0] text-gray-900 outline-none focus:border-[#183153]"
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
        class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#183153] text-[#FFD43B] font-extrabold text-sm hover:bg-[#102138] transition shadow-md touch-manipulation min-h-[48px] disabled:opacity-50"
      >
        <Save class="w-4 h-4" />
        <span>{isSaving ? 'Menyimpan Profil...' : 'Simpan Perubahan'}</span>
      </button>
    </div>
  </form>
</div>
