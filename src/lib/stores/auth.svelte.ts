import type { Profile, UserRole } from '$lib/types/database';
import { getSupabaseClient, isSupabaseConfigured } from '$lib/supabase/client';
import { mockProfiles } from '$lib/supabase/mock-data';
import { 
  platformService, 
  getStoredCustomProfiles, 
  getStoredRegisteredAccounts, 
  saveStoredCustomProfile, 
  saveStoredRegisteredAccount 
} from '$lib/supabase/service';
import { toastStore } from './toast.svelte';

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
}

let authState = $state<AuthState>({
  profile: null,
  isLoading: true,
  isInitialized: false
});

export const authStore = {
  get profile() {
    return authState.profile;
  },
  get role(): UserRole {
    return authState.profile?.role ?? 'student';
  },
  get isAuthenticated() {
    return Boolean(authState.profile);
  },
  get isLoading() {
    return authState.isLoading;
  },

  async init() {
    if (authState.isInitialized) return;
    authState.isLoading = true;

    // Load any persisted profiles into memory
    platformService.syncStoredProfiles();

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          let profile = await platformService.getProfile(session.user.id);
          if (!profile) {
            const customProfiles = getStoredCustomProfiles();
            profile = customProfiles.find(p => p.id === session.user.id || p.email.toLowerCase() === session.user.email?.toLowerCase()) || null;
          }
          authState.profile = profile;
        } else {
          // Check if previous session was stored locally
          const storedId = typeof window !== 'undefined' ? localStorage.getItem('ut_reka_active_user') : null;
          if (storedId) {
            authState.profile = await platformService.getProfile(storedId);
          }
        }
      } catch (err) {
        console.warn('Auth initialization notice:', err);
      }
    } else {
      const isLoggedOut = typeof window !== 'undefined' ? localStorage.getItem('ut_reka_logged_out') === 'true' : false;
      const storedId = typeof window !== 'undefined' ? localStorage.getItem('ut_reka_active_user') : null;
      if (storedId) {
        const customProfiles = getStoredCustomProfiles();
        authState.profile = customProfiles.find(p => p.id === storedId) || 
                            mockProfiles.find(p => p.id === storedId) || 
                            mockProfiles[0];
      } else if (!isLoggedOut) {
        authState.profile = mockProfiles[0]; // default student demo on fresh first visit
      } else {
        authState.profile = null;
      }
    }

    authState.isLoading = false;
    authState.isInitialized = true;
  },

  async login(email: string, pass: string): Promise<{ success: boolean; error?: string; role?: UserRole }> {
    authState.isLoading = true;
    const lowerEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: lowerEmail,
          password: pass
        });

        if (!error && data?.user) {
          let profile = await platformService.getProfile(data.user.id);
          if (!profile) {
            // Restore from custom profiles vault or user metadata
            const customProfiles = getStoredCustomProfiles();
            const stored = customProfiles.find(p => p.id === data.user.id || p.email.toLowerCase() === lowerEmail);
            if (stored) {
              profile = stored;
              await supabase.from('profiles').upsert(stored);
            }
          }

          if (profile) {
            authState.profile = profile;
            saveStoredCustomProfile(profile);
            if (typeof window !== 'undefined') {
              localStorage.setItem('ut_reka_active_user', profile.id);
              localStorage.removeItem('ut_reka_logged_out');
            }
            authState.isLoading = false;
            return { success: true, role: profile.role };
          }
        } else if (error) {
          console.warn('Supabase signIn notice:', error.message);
        }
      } catch (err: unknown) {
        console.warn('Supabase login exception:', err);
      }
    }

    // 2. Check locally registered accounts vault (never loses any user registered locally)
    const registeredAccounts = getStoredRegisteredAccounts();
    const matchingAccount = registeredAccounts.find(a => a.email.toLowerCase() === lowerEmail);
    if (matchingAccount) {
      if (matchingAccount.passwordHash === pass) {
        const customProfiles = getStoredCustomProfiles();
        const profile = customProfiles.find(p => p.id === matchingAccount.userId || p.email.toLowerCase() === lowerEmail);
        if (profile) {
          authState.profile = profile;
          platformService.registerLocalProfile(profile);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ut_reka_active_user', profile.id);
            localStorage.removeItem('ut_reka_logged_out');
          }
          authState.isLoading = false;
          return { success: true, role: profile.role };
        }
      } else {
        authState.isLoading = false;
        return { success: false, error: 'Kata sandi tidak sesuai. Silakan periksa kembali.' };
      }
    }

    // 3. Fallback demo login: find matching mock profile by email (password123 for any demo account)
    const emailAliases: Record<string, string> = {
      'budi.santoso@mhs.ut.ac.id': 'tasya.angelicia@mhs.ut.ac.id',
      'sarah.wijaya@alumni.ut.ac.id': 'azdzikri.hisyam@alumni.ut.ac.id',
      'admin.reka@ut.ac.id': 'farrel.nashwan@admin.ut.ac.id'
    };
    const resolvedEmail = emailAliases[lowerEmail] || lowerEmail;
    const found = mockProfiles.find(p => p.email.toLowerCase() === resolvedEmail);
    if (found) {
      authState.profile = found;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ut_reka_active_user', found.id);
        localStorage.removeItem('ut_reka_logged_out');
      }
      authState.isLoading = false;
      return { success: true, role: found.role };
    }

    authState.isLoading = false;
    return { 
      success: false, 
      error: 'Akun belum terdaftar di UT REKA. Silakan klik tab Daftar untuk membuat akun baru.' 
    };
  },

  async register(data: {
    fullName: string;
    email: string;
    password: string;
    nim?: string;
    role: 'student' | 'alumni'; // STRICT: Admin cannot be chosen during register
    studyProgram: string;
    entryYear?: number;
    graduationYear?: number;
  }): Promise<{ success: boolean; error?: string; role?: UserRole }> {
    authState.isLoading = true;
    const lowerEmail = data.email.trim().toLowerCase();
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    const newProfile: Profile = {
      id: userId,
      email: lowerEmail,
      full_name: data.fullName.trim(),
      role: data.role,
      nim: data.nim?.trim() || null,
      study_program: data.studyProgram,
      entry_year: data.entryYear || null,
      graduation_year: data.graduationYear || null,
      avatar_url: `https://images.unsplash.com/photo-${data.role === 'student' ? '1534528741775-53994a69daeb' : '1580489944761-15a19d654956'}?w=200&auto=format&fit=crop&q=80`,
      bio: `Halo, saya ${data.fullName.trim()}, ${data.role === 'student' ? 'mahasiswa' : 'alumni'} program studi ${data.studyProgram} di Universitas Terbuka.`,
      skills: data.role === 'student' ? ['Komunikasi Mandiri', 'Teknologi Informasi'] : ['Keahlian Industri', 'Mentoring'],
      interests: ['Pengembangan Karier', 'Relasi Kampus'],
      portfolio_url: null,
      github_url: null,
      linkedin_url: null,
      website_url: null,
      company: data.role === 'alumni' ? 'Alumni Universitas Terbuka' : null,
      job_title: data.role === 'alumni' ? 'Praktisi Profesional' : null,
      industry: 'Pendidikan & Teknologi',
      is_mentor: data.role === 'alumni',
      mentor_topics: data.role === 'alumni' ? ['Review CV', 'Bimbingan Karier'] : [],
      verification_status: 'unverified',
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp
    };

    // 1. Supabase Persistence if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: lowerEmail,
          password: data.password,
          options: {
            data: {
              full_name: newProfile.full_name,
              role: newProfile.role,
              nim: newProfile.nim,
              study_program: newProfile.study_program,
              entry_year: newProfile.entry_year,
              graduation_year: newProfile.graduation_year
            }
          }
        });

        if (authError) {
          console.warn('Supabase signUp error notice:', authError.message);
          if (authError.message.toLowerCase().includes('already registered')) {
            authState.isLoading = false;
            return { success: false, error: 'Email sudah terdaftar. Silakan login dengan akun Anda.' };
          }
        }

        if (authData?.user) {
          newProfile.id = authData.user.id;
        }

        // Direct upsert to Supabase profiles table to guarantee database persistence
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(newProfile);

        if (upsertError) {
          console.warn('Supabase profiles upsert notice:', upsertError.message);
        }

        // Establish Supabase auth session if not automatically established
        if (!authData?.session) {
          try {
            await supabase.auth.signInWithPassword({
              email: lowerEmail,
              password: data.password
            });
          } catch (e) {
            console.warn('Auto signIn notice:', e);
          }
        }
      } catch (err: unknown) {
        console.warn('Supabase register exception:', err);
      }
    }

    // 2. GUARANTEED PERSISTENCE: Save to persistent local vault
    saveStoredCustomProfile(newProfile);
    saveStoredRegisteredAccount({
      email: lowerEmail,
      passwordHash: data.password,
      userId: newProfile.id,
      role: newProfile.role,
      createdAt: timestamp
    });

    // 3. Create initial verification request so it automatically enters Admin verification queue
    await platformService.createVerificationRequest({
      id: `vreq-${newProfile.id}`,
      user_id: newProfile.id,
      role: newProfile.role,
      nim_or_alumni_id: newProfile.nim || `NIM-${newProfile.id.slice(-6)}`,
      document_url: null,
      notes: `Pendaftaran baru ${newProfile.role === 'student' ? 'Mahasiswa' : 'Alumni'} Prodi ${newProfile.study_program}`,
      status: 'pending',
      created_at: timestamp,
      user: newProfile
    });

    // 4. Register in memory store
    platformService.registerLocalProfile(newProfile);

    // 5. Activate user session immediately
    authState.profile = newProfile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ut_reka_active_user', newProfile.id);
      localStorage.removeItem('ut_reka_logged_out');
    }

    authState.isLoading = false;
    return { success: true, role: newProfile.role };
  },

  async logout() {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('SignOut error:', err);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ut_reka_active_user');
      localStorage.setItem('ut_reka_logged_out', 'true');
    }
    authState.profile = null;
    toastStore.info('Anda telah keluar dari UT REKA');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  // Helper for developers / demo reviewers to quickly switch role
  switchDemoRole(role: UserRole) {
    const target = mockProfiles.find(p => p.role === role);
    if (target) {
      authState.profile = target;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ut_reka_active_user', target.id);
        localStorage.removeItem('ut_reka_logged_out');
      }
      toastStore.success(`Beralih ke akun demo: ${target.full_name} (${target.role})`);
    }
  },

  async updateProfile(updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
    if (!authState.profile) return { success: false, error: 'User tidak ditemukan' };
    const updated: Profile = {
      ...authState.profile,
      ...updates,
      updated_at: new Date().toISOString()
    };
    authState.profile = updated;
    const res = await platformService.updateProfile(updated.id, updates);
    return res;
  },

  async updateAvatar(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
    return this.updateProfile({ avatar_url: avatarUrl });
  }
};
