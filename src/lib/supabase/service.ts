import { getSupabaseClient, isSupabaseConfigured } from './client';
import { 
  mockProfiles, 
  mockOpportunities, 
  mockConnectionRequests, 
  mockConversations, 
  mockMessages, 
  mockNotifications,
  mockReports,
  mockVerificationRequests,
  mockAuditLogs 
} from './mock-data';
import type { 
  Profile, 
  UserRole,
  Opportunity, 
  ConnectionRequest, 
  Conversation, 
  Message, 
  NotificationItem, 
  ReportItem, 
  VerificationRequestItem, 
  AuditLogItem, 
  ConnectionRequestStatus, 
  VerificationStatus, 
  ReportStatus 
} from '$lib/types/database';

const PROFILES_STORAGE_KEY = 'ut_reka_custom_profiles';
const ACCOUNTS_STORAGE_KEY = 'ut_reka_registered_accounts';
const VERIF_STORAGE_KEY = 'ut_reka_custom_verifications';

export interface RegisteredAccount {
  email: string;
  passwordHash: string;
  userId: string;
  role: UserRole;
  createdAt: string;
}

export function getStoredCustomProfiles(): Profile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Profile[];
  } catch (e) {
    return [];
  }
}

export function saveStoredCustomProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredCustomProfiles();
    const idx = list.findIndex(p => p.id === profile.id || p.email.toLowerCase() === profile.email.toLowerCase());
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...profile, updated_at: new Date().toISOString() };
    } else {
      list.unshift(profile);
    }
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('saveStoredCustomProfile error:', e);
  }
}

export function getStoredRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RegisteredAccount[];
  } catch (e) {
    return [];
  }
}

export function saveStoredRegisteredAccount(account: RegisteredAccount): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredRegisteredAccounts();
    const idx = list.findIndex(a => a.email.toLowerCase() === account.email.toLowerCase());
    if (idx >= 0) {
      list[idx] = account;
    } else {
      list.unshift(account);
    }
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('saveStoredRegisteredAccount error:', e);
  }
}

export function getStoredVerificationRequests(): VerificationRequestItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VERIF_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VerificationRequestItem[];
  } catch (e) {
    return [];
  }
}

export function saveStoredVerificationRequest(request: VerificationRequestItem): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredVerificationRequests();
    const idx = list.findIndex(r => r.id === request.id || r.user_id === request.user_id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...request };
    } else {
      list.unshift(request);
    }
    localStorage.setItem(VERIF_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('saveStoredVerificationRequest error:', e);
  }
}

// Mutable in-memory store ONLY used when Supabase is explicitly unconfigured in local preview
let inMemoryProfiles = [...mockProfiles];
let inMemoryOpportunities = [...mockOpportunities];
let inMemoryRequests = [...mockConnectionRequests];
let inMemoryConversations = [...mockConversations];
let inMemoryMessages = [...mockMessages];
let inMemoryNotifications = [...mockNotifications];
let inMemoryReports = [...mockReports];
let inMemoryVerifications = [...mockVerificationRequests];
let inMemoryAuditLogs = [...mockAuditLogs];

export const platformService = {
  // Sync in-memory store with any stored custom profiles on initialization
  syncStoredProfiles() {
    const customProfiles = getStoredCustomProfiles();
    for (const cp of customProfiles) {
      const idx = inMemoryProfiles.findIndex(p => p.id === cp.id || p.email.toLowerCase() === cp.email.toLowerCase());
      if (idx >= 0) {
        inMemoryProfiles[idx] = cp;
      } else {
        inMemoryProfiles.unshift(cp);
      }
    }
  },

  registerLocalProfile(profile: Profile) {
    saveStoredCustomProfile(profile);
    const idx = inMemoryProfiles.findIndex(p => p.id === profile.id || p.email.toLowerCase() === profile.email.toLowerCase());
    if (idx >= 0) {
      inMemoryProfiles[idx] = profile;
    } else {
      inMemoryProfiles.unshift(profile);
    }

    const mockIdx = mockProfiles.findIndex(p => p.id === profile.id || p.email.toLowerCase() === profile.email.toLowerCase());
    if (mockIdx >= 0) {
      mockProfiles[mockIdx] = profile;
    } else {
      mockProfiles.unshift(profile);
    }
  },

  async createVerificationRequest(req: VerificationRequestItem): Promise<{ success: boolean }> {
    saveStoredVerificationRequest(req);
    const idx = inMemoryVerifications.findIndex(v => v.id === req.id || v.user_id === req.user_id);
    if (idx >= 0) {
      inMemoryVerifications[idx] = req;
    } else {
      inMemoryVerifications.unshift(req);
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase.from('verification_requests').upsert(req);
      } catch (e) {
        console.warn('Supabase createVerificationRequest error:', e);
      }
    }
    return { success: true };
  },

  // --- PROFILES ---
  async getProfile(userId: string): Promise<Profile | null> {
    const localProfiles = getStoredCustomProfiles();
    const localMatch = localProfiles.find(p => p.id === userId || p.email.toLowerCase() === userId.toLowerCase());

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (!error && data) {
          saveStoredCustomProfile(data as Profile);
          return data as Profile;
        }
      } catch (err) {
        console.error('Supabase getProfile error:', err);
      }
    }

    if (localMatch) return localMatch;
    return inMemoryProfiles.find(p => p.id === userId || p.email.toLowerCase() === userId.toLowerCase()) || 
           mockProfiles.find(p => p.id === userId || p.email.toLowerCase() === userId.toLowerCase()) || 
           inMemoryProfiles[0];
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        // Strict guard: Disallow role update directly from client
        const safeUpdates = { ...updates };
        delete safeUpdates.role;

        const { error } = await supabase
          .from('profiles')
          .update({ ...safeUpdates, updated_at: new Date().toISOString() })
          .eq('id', userId);
        if (error) {
          console.warn('Supabase updateProfile warning:', error.message);
        }
      } catch (err: unknown) {
        console.warn('Supabase updateProfile error:', err);
      }
    }

    // Always update local persistence so changes are permanent
    const localProfiles = getStoredCustomProfiles();
    const foundLocal = localProfiles.find(p => p.id === userId);
    if (foundLocal) {
      saveStoredCustomProfile({ ...foundLocal, ...updates, updated_at: new Date().toISOString() });
    }

    const idx = inMemoryProfiles.findIndex(p => p.id === userId);
    if (idx !== -1) {
      inMemoryProfiles[idx] = { ...inMemoryProfiles[idx], ...updates, updated_at: new Date().toISOString() };
    }
    return { success: true };
  },

  async setVerificationStatus(userId: string, status: VerificationStatus, feedback?: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase
          .from('profiles')
          .update({ verification_status: status, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (e) {
        console.warn('Supabase setVerificationStatus error:', e);
      }
    }

    // Update in local storage
    const localProfiles = getStoredCustomProfiles();
    const pIdx = localProfiles.findIndex(p => p.id === userId);
    if (pIdx >= 0) {
      localProfiles[pIdx].verification_status = status;
      localProfiles[pIdx].updated_at = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(localProfiles));
      }
    }

    // Update in memory
    const memIdx = inMemoryProfiles.findIndex(p => p.id === userId);
    if (memIdx >= 0) {
      inMemoryProfiles[memIdx].verification_status = status;
    }

    // Update verification request if present
    const verifReqs = getStoredVerificationRequests();
    const vIdx = verifReqs.findIndex(v => v.user_id === userId);
    if (vIdx >= 0) {
      verifReqs[vIdx].status = status;
      verifReqs[vIdx].admin_feedback = feedback || null;
      verifReqs[vIdx].reviewed_at = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem(VERIF_STORAGE_KEY, JSON.stringify(verifReqs));
      }
    }

    const memVIdx = inMemoryVerifications.findIndex(v => v.user_id === userId);
    if (memVIdx >= 0) {
      inMemoryVerifications[memVIdx].status = status;
      inMemoryVerifications[memVIdx].admin_feedback = feedback || null;
      inMemoryVerifications[memVIdx].reviewed_at = new Date().toISOString();
    }

    return { success: true };
  },

  async searchAlumni(params: {
    query?: string;
    studyProgram?: string;
    industry?: string;
    mentorOnly?: boolean;
  }): Promise<Profile[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        let query = supabase
          .from('profiles')
          .select('*')
          .eq('role', 'alumni')
          .eq('is_active', true);

        if (params.studyProgram && params.studyProgram !== 'all') {
          query = query.eq('study_program', params.studyProgram);
        }
        if (params.industry && params.industry !== 'all') {
          query = query.eq('industry', params.industry);
        }
        if (params.mentorOnly) {
          query = query.eq('is_mentor', true);
        }
        if (params.query) {
          query = query.or(`full_name.ilike.%${params.query}%,company.ilike.%${params.query}%,job_title.ilike.%${params.query}%`);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Supabase searchAlumni error:', error.message);
          return [];
        }
        return (data || []) as Profile[];
      } catch (err) {
        console.error('Supabase searchAlumni unexpected error:', err);
        return [];
      }
    }

    return inMemoryProfiles.filter(p => {
      if (p.role !== 'alumni' || !p.is_active) return false;
      if (params.studyProgram && params.studyProgram !== 'all' && p.study_program !== params.studyProgram) return false;
      if (params.industry && params.industry !== 'all' && p.industry !== params.industry) return false;
      if (params.mentorOnly && !p.is_mentor) return false;
      if (params.query) {
        const q = params.query.toLowerCase();
        const matchesName = p.full_name.toLowerCase().includes(q);
        const matchesCompany = (p.company || '').toLowerCase().includes(q);
        const matchesJob = (p.job_title || '').toLowerCase().includes(q);
        const matchesSkills = p.skills.some(s => s.toLowerCase().includes(q));
        return matchesName || matchesCompany || matchesJob || matchesSkills;
      }
      return true;
    });
  },

  // --- OPPORTUNITIES ---
  async getOpportunities(filter?: { type?: string; query?: string }): Promise<Opportunity[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        let query = supabase
          .from('opportunities')
          .select('*, author:profiles(*)')
          .eq('status', 'published')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (filter?.type && filter.type !== 'all') {
          query = query.eq('type', filter.type);
        }
        if (filter?.query) {
          query = query.or(`title.ilike.%${filter.query}%,description.ilike.%${filter.query}%,company_or_org.ilike.%${filter.query}%`);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Supabase getOpportunities error:', error.message);
          return [];
        }
        return (data || []) as Opportunity[];
      } catch (err) {
        console.error('Supabase getOpportunities unexpected error:', err);
        return [];
      }
    }

    return inMemoryOpportunities.filter(o => {
      if (o.status !== 'published' || !o.is_approved) return false;
      if (filter?.type && filter.type !== 'all' && o.type !== filter.type) return false;
      if (filter?.query) {
        const q = filter.query.toLowerCase();
        const matchesTitle = o.title.toLowerCase().includes(q);
        const matchesDesc = o.description.toLowerCase().includes(q);
        const matchesOrg = (o.company_or_org || '').toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesOrg;
      }
      return true;
    });
  },

  async createOpportunity(data: Omit<Opportunity, 'id' | 'created_at' | 'updated_at' | 'applications_count'>): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('opportunities').insert(data);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal membuat peluang';
        return { success: false, error: msg };
      }
    }

    const newOpp: Opportunity = {
      ...data,
      id: `opp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      applications_count: 0
    };
    inMemoryOpportunities.unshift(newOpp);
    return { success: true };
  },

  // --- CONNECTION REQUESTS ---
  async getConnectionRequests(userId: string): Promise<ConnectionRequest[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('connection_requests')
          .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getConnectionRequests error:', error.message);
          return [];
        }
        return (data || []) as ConnectionRequest[];
      } catch (err) {
        console.error('Supabase getConnectionRequests unexpected error:', err);
        return [];
      }
    }

    return inMemoryRequests.filter(r => r.sender_id === userId || r.receiver_id === userId);
  },

  async sendConnectionRequest(senderId: string, receiverId: string, note?: string): Promise<{ success: boolean; error?: string }> {
    if (senderId === receiverId) {
      return { success: false, error: 'Tidak dapat mengirim permintaan koneksi ke diri sendiri' };
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('connection_requests').insert({
          sender_id: senderId,
          receiver_id: receiverId,
          note,
          status: 'pending'
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal mengirim permintaan';
        return { success: false, error: msg };
      }
    }

    // Check duplicate pending in memory
    const existing = inMemoryRequests.find(r => 
      ((r.sender_id === senderId && r.receiver_id === receiverId) ||
       (r.sender_id === receiverId && r.receiver_id === senderId)) &&
      r.status === 'pending'
    );
    if (existing) {
      return { success: false, error: 'Permintaan koneksi sudah pernah dikirim dan masih pending' };
    }

    const newReq: ConnectionRequest = {
      id: `req-${Date.now()}`,
      sender_id: senderId,
      receiver_id: receiverId,
      status: 'pending',
      note: note || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender: inMemoryProfiles.find(p => p.id === senderId),
      receiver: inMemoryProfiles.find(p => p.id === receiverId)
    };
    inMemoryRequests.unshift(newReq);
    return { success: true };
  },

  async updateConnectionRequestStatus(requestId: string, status: ConnectionRequestStatus): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from('connection_requests')
          .update({ status })
          .eq('id', requestId);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memperbarui status';
        return { success: false, error: msg };
      }
    }

    const idx = inMemoryRequests.findIndex(r => r.id === requestId);
    if (idx !== -1) {
      inMemoryRequests[idx].status = status;
      inMemoryRequests[idx].updated_at = new Date().toISOString();
    }
    return { success: true };
  },

  // --- MESSAGES & CHAT ---
  async getConversations(userId: string): Promise<Conversation[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('conversations')
          .select('*, members:conversation_members(*, profile:profiles(*))')
          .order('updated_at', { ascending: false });
        if (error) {
          console.error('Supabase getConversations error:', error.message);
          return [];
        }
        return (data || []) as Conversation[];
      } catch (err) {
        console.error('Supabase getConversations unexpected error:', err);
        return [];
      }
    }
    return inMemoryConversations;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:profiles(*)')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        if (error) {
          console.error('Supabase getMessages error:', error.message);
          return [];
        }
        return (data || []) as Message[];
      } catch (err) {
        console.error('Supabase getMessages unexpected error:', err);
        return [];
      }
    }
    return inMemoryMessages.filter(m => m.conversation_id === conversationId);
  },

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<{ success: boolean; message?: Message; error?: string }> {
    if (!content.trim()) return { success: false, error: 'Pesan tidak boleh kosong' };

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            content: content.trim()
          })
          .select('*, sender:profiles(*)')
          .single();
        if (error) return { success: false, error: error.message };
        return { success: true, message: data as Message };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal mengirim pesan';
        return { success: false, error: msg };
      }
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      sender: inMemoryProfiles.find(p => p.id === senderId)
    };
    inMemoryMessages.push(newMsg);
    return { success: true, message: newMsg };
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getNotifications error:', error.message);
          return [];
        }
        return (data || []) as NotificationItem[];
      } catch (err) {
        console.error('Supabase getNotifications unexpected error:', err);
        return [];
      }
    }
    return inMemoryNotifications.filter(n => n.user_id === userId);
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
      } catch (err) {
        console.error('markNotificationRead error:', err);
      }
      return;
    }
    const idx = inMemoryNotifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) inMemoryNotifications[idx].is_read = true;
  },

  // --- ADMIN CENTER ---
  async getAdminStats() {
    const allUsers = await this.getAllUsers();
    const studentsCount = allUsers.filter(u => u.role === 'student').length;
    const alumniCount = allUsers.filter(u => u.role === 'alumni').length;
    const unverifiedUsersCount = allUsers.filter(u => u.verification_status === 'unverified' || u.verification_status === 'pending').length;

    let oppsCount = inMemoryOpportunities.length;
    let pendingVerifRequests = inMemoryVerifications.filter(v => v.status === 'pending').length;

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const [
          { count: oppCount },
          { count: verifCount }
        ] = await Promise.all([
          supabase.from('opportunities').select('*', { count: 'exact', head: true }),
          supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ]);
        if (typeof oppCount === 'number') oppsCount = oppCount;
        if (typeof verifCount === 'number') pendingVerifRequests = verifCount;
      } catch (err) {
        console.warn('Supabase getAdminStats count notice:', err);
      }
    }

    return {
      totalStudents: studentsCount,
      totalAlumni: alumniCount,
      totalOpportunities: oppsCount,
      pendingVerifications: Math.max(pendingVerifRequests, unverifiedUsersCount)
    };
  },

  async getAllUsers(role?: string): Promise<Profile[]> {
    const localProfiles = getStoredCustomProfiles();
    let combinedProfiles: Profile[] = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (role && role !== 'all') {
          query = query.eq('role', role);
        }
        const { data, error } = await query;
        if (!error && data) {
          const profileMap = new Map<string, Profile>();
          // 1. Supabase records
          for (const p of data as Profile[]) {
            profileMap.set(p.id, p);
            profileMap.set(p.email.toLowerCase(), p);
          }
          // 2. Merge local custom profiles (background push if not in Supabase)
          for (const lp of localProfiles) {
            if (!profileMap.has(lp.id) && !profileMap.has(lp.email.toLowerCase())) {
              profileMap.set(lp.id, lp);
              // Background sync to Supabase
              Promise.resolve(supabase.from('profiles').upsert(lp)).catch(() => {});
            }
          }
          combinedProfiles = Array.from(new Set(profileMap.values()));
        } else {
          console.warn('Supabase getAllUsers error, fallback to combined local:', error?.message);
          const profileMap = new Map<string, Profile>();
          for (const p of [...localProfiles, ...inMemoryProfiles]) {
            profileMap.set(p.id, p);
          }
          combinedProfiles = Array.from(profileMap.values());
        }
      } catch (err) {
        console.warn('Supabase getAllUsers unexpected error:', err);
        const profileMap = new Map<string, Profile>();
        for (const p of [...localProfiles, ...inMemoryProfiles]) {
          profileMap.set(p.id, p);
        }
        combinedProfiles = Array.from(profileMap.values());
      }
    } else {
      const profileMap = new Map<string, Profile>();
      // 1. Static mock profiles
      for (const p of [...inMemoryProfiles, ...mockProfiles]) {
        profileMap.set(p.id, p);
        profileMap.set(p.email.toLowerCase(), p);
      }
      // 2. Custom registered profiles (overwrites or prepends)
      for (const lp of localProfiles) {
        profileMap.set(lp.id, lp);
        profileMap.set(lp.email.toLowerCase(), lp);
      }
      combinedProfiles = Array.from(new Set(profileMap.values()));
    }

    // Sort descending by created_at so newest registered user is at the very top
    combinedProfiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (role && role !== 'all') {
      return combinedProfiles.filter(p => p.role === role);
    }
    return combinedProfiles;
  },

  async getVerificationRequests(): Promise<VerificationRequestItem[]> {
    const localVerifs = getStoredVerificationRequests();
    let requests: VerificationRequestItem[] = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('verification_requests')
          .select('*, user:profiles(*)')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const vMap = new Map<string, VerificationRequestItem>();
          for (const v of data as VerificationRequestItem[]) {
            vMap.set(v.id, v);
            vMap.set(v.user_id, v);
          }
          for (const lv of localVerifs) {
            if (!vMap.has(lv.id) && !vMap.has(lv.user_id)) {
              vMap.set(lv.id, lv);
            }
          }
          requests = Array.from(new Set(vMap.values()));
        } else {
          requests = [...localVerifs, ...inMemoryVerifications];
        }
      } catch (err) {
        requests = [...localVerifs, ...inMemoryVerifications];
      }
    } else {
      const vMap = new Map<string, VerificationRequestItem>();
      for (const v of [...localVerifs, ...inMemoryVerifications]) {
        vMap.set(v.id, v);
        vMap.set(v.user_id, v);
      }
      requests = Array.from(new Set(vMap.values()));
    }

    // Auto-synthesize verification items for newly registered users who don't have an explicit request yet
    const allUsers = await this.getAllUsers();
    for (const u of allUsers) {
      if ((u.verification_status === 'unverified' || u.verification_status === 'pending') && u.role !== 'admin') {
        const exists = requests.some(r => r.user_id === u.id);
        if (!exists) {
          const synthReq: VerificationRequestItem = {
            id: `vreq-${u.id}`,
            user_id: u.id,
            role: u.role,
            nim_or_alumni_id: u.nim || 'NIM-' + u.id.slice(-6),
            document_url: null,
            notes: `Pendaftaran baru ${u.role === 'student' ? 'Mahasiswa' : 'Alumni'} Program Studi ${u.study_program}`,
            status: 'pending',
            created_at: u.created_at,
            user: u
          };
          requests.unshift(synthReq);
        }
      }
    }

    return requests;
  },

  async reviewVerification(requestId: string, status: VerificationStatus, feedback?: string): Promise<{ success: boolean; error?: string }> {
    let targetUserId = '';
    const verifList = await this.getVerificationRequests();
    const found = verifList.find(v => v.id === requestId);
    if (found) {
      targetUserId = found.user_id;
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        await supabase
          .from('verification_requests')
          .update({
            status,
            admin_feedback: feedback,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', requestId);
      } catch (err: unknown) {
        console.warn('Supabase reviewVerification notice:', err);
      }
    }

    // Update target user profile verification status
    if (targetUserId) {
      await this.setVerificationStatus(targetUserId, status, feedback);
    }

    // Update local storage verification list
    const localVerifs = getStoredVerificationRequests();
    const vIdx = localVerifs.findIndex(v => v.id === requestId);
    if (vIdx !== -1) {
      localVerifs[vIdx].status = status;
      localVerifs[vIdx].admin_feedback = feedback || null;
      localVerifs[vIdx].reviewed_at = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem(VERIF_STORAGE_KEY, JSON.stringify(localVerifs));
      }
    }

    const idx = inMemoryVerifications.findIndex(v => v.id === requestId);
    if (idx !== -1) {
      inMemoryVerifications[idx].status = status;
      inMemoryVerifications[idx].admin_feedback = feedback || null;
      inMemoryVerifications[idx].reviewed_at = new Date().toISOString();
    }

    return { success: true };
  },

  async getReports(): Promise<ReportItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('reports')
          .select('*, reporter:profiles!reporter_id(*), reported_user:profiles!reported_user_id(*), reported_opportunity:opportunities(*)')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getReports error:', error.message);
          return [];
        }
        return (data || []) as ReportItem[];
      } catch (err) {
        console.error('Supabase getReports unexpected error:', err);
        return [];
      }
    }
    return inMemoryReports;
  },

  async reviewReport(reportId: string, status: ReportStatus, adminNotes?: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from('reports')
          .update({ status, admin_notes: adminNotes, resolved_at: new Date().toISOString() })
          .eq('id', reportId);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memperbarui laporan';
        return { success: false, error: msg };
      }
    }

    const idx = inMemoryReports.findIndex(r => r.id === reportId);
    if (idx !== -1) {
      inMemoryReports[idx].status = status;
      inMemoryReports[idx].admin_notes = adminNotes || null;
      inMemoryReports[idx].resolved_at = new Date().toISOString();
    }
    return { success: true };
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*, admin:profiles!admin_id(*)')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getAuditLogs error:', error.message);
          return [];
        }
        return (data || []) as AuditLogItem[];
      } catch (err) {
        console.error('Supabase getAuditLogs unexpected error:', err);
        return [];
      }
    }
    return inMemoryAuditLogs;
  }
};
