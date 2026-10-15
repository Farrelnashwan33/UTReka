import type { Profile, UserRole } from '$lib/types/database';
import { getSupabaseClient, isSupabaseConfigured } from '$lib/supabase/client';
import { mockProfiles } from '$lib/supabase/mock-data';
import { platformService } from '$lib/supabase/service';
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

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await platformService.getProfile(session.user.id);
          authState.profile = profile;
        } else {
          // Check if previous demo session was stored locally
          const storedId = typeof window !== 'undefined' ? localStorage.getItem('ut_reka_active_user') : null;
          if (storedId) {
            authState.profile = await platformService.getProfile(storedId);
          }
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      }
    } else {
      // Default to student demo user if not logged in, unless user explicitly logged out
      const isLoggedOut = typeof window !== 'undefined' ? localStorage.getItem('ut_reka_logged_out') === 'true' : false;
      const storedId = typeof window !== 'undefined' ? localStorage.getItem('ut_reka_active_user') : null;
      if (storedId) {
        authState.profile = mockProfiles.find(p => p.id === storedId) || mockProfiles[0];
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

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });

        if (error) {
          authState.isLoading = false;
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile = await platformService.getProfile(data.user.id);
          authState.profile = profile;
          if (typeof window !== 'undefined') {
            localStorage.setItem('ut_reka_active_user', data.user.id);
            localStorage.removeItem('ut_reka_logged_out');
          }
          authState.isLoading = false;
          return { success: true, role: profile?.role || 'student' };
        }
      } catch (err: unknown) {
        authState.isLoading = false;
        const msg = err instanceof Error ? err.message : 'Terjadi kesalahan login';
        return { success: false, error: msg };
      }
    }

    // Fallback demo login: find matching mock profile by email
    const found = mockProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (found) {
      authState.profile = found;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ut_reka_active_user', found.id);
        localStorage.removeItem('ut_reka_logged_out');
      }
      authState.isLoading = false;
      return { success: true, role: found.role };
    }

    // Default to student if not found in mock list
    authState.profile = mockProfiles[0];
    if (typeof window !== 'undefined') {
      localStorage.setItem('ut_reka_active_user', mockProfiles[0].id);
      localStorage.removeItem('ut_reka_logged_out');
    }
    authState.isLoading = false;
    return { success: true, role: mockProfiles[0].role };
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

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: data.role,
              nim: data.nim || null,
              study_program: data.studyProgram,
              entry_year: data.entryYear || null,
              graduation_year: data.graduationYear || null
            }
          }
        });

        if (error) {
          authState.isLoading = false;
          return { success: false, error: error.message };
        }

        if (authData.user) {
          const profile = await platformService.getProfile(authData.user.id);
          authState.profile = profile;
          if (typeof window !== 'undefined') {
            localStorage.setItem('ut_reka_active_user', authData.user.id);
          }
          authState.isLoading = false;
          return { success: true, role: data.role };
        }
      } catch (err: unknown) {
        authState.isLoading = false;
        const msg = err instanceof Error ? err.message : 'Pendaftaran gagal';
        return { success: false, error: msg };
      }
    }

    // Demo fallback register
    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      email: data.email,
      full_name: data.fullName,
      role: data.role,
      nim: data.nim || null,
      study_program: data.studyProgram,
      entry_year: data.entryYear || null,
      graduation_year: data.graduationYear || null,
      skills: [],
      interests: [],
      is_mentor: false,
      mentor_topics: [],
      verification_status: 'unverified',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockProfiles.push(newProfile);
    authState.profile = newProfile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ut_reka_active_user', newProfile.id);
    }
    authState.isLoading = false;
    return { success: true, role: data.role };
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
  }
};
