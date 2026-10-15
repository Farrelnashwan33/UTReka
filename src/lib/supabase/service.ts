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
  // --- PROFILES ---
  async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Supabase getProfile error:', error.message);
        return null;
      }
      return data as Profile;
    }
    return inMemoryProfiles.find(p => p.id === userId) || inMemoryProfiles[0];
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        // Strict guard: Disallow role or verification_status update directly from client
        const safeUpdates = { ...updates };
        delete safeUpdates.role;
        delete safeUpdates.verification_status;

        const { error } = await supabase
          .from('profiles')
          .update(safeUpdates)
          .eq('id', userId);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
        return { success: false, error: msg };
      }
    }

    const idx = inMemoryProfiles.findIndex(p => p.id === userId);
    if (idx !== -1) {
      inMemoryProfiles[idx] = { ...inMemoryProfiles[idx], ...updates, updated_at: new Date().toISOString() };
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
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const [
          { count: studentCount },
          { count: alumniCount },
          { count: oppCount },
          { count: pendingVerifications }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'alumni'),
          supabase.from('opportunities').select('*', { count: 'exact', head: true }),
          supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ]);
        return {
          totalStudents: studentCount || 0,
          totalAlumni: alumniCount || 0,
          totalOpportunities: oppCount || 0,
          pendingVerifications: pendingVerifications || 0
        };
      } catch (err) {
        console.error('Supabase getAdminStats error:', err);
        return {
          totalStudents: 0,
          totalAlumni: 0,
          totalOpportunities: 0,
          pendingVerifications: 0
        };
      }
    }

    return {
      totalStudents: inMemoryProfiles.filter(p => p.role === 'student').length,
      totalAlumni: inMemoryProfiles.filter(p => p.role === 'alumni').length,
      totalOpportunities: inMemoryOpportunities.length,
      pendingVerifications: inMemoryVerifications.filter(v => v.status === 'pending').length
    };
  },

  async getAllUsers(role?: string): Promise<Profile[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (role && role !== 'all') {
          query = query.eq('role', role);
        }
        const { data, error } = await query;
        if (error) {
          console.error('Supabase getAllUsers error:', error.message);
          return [];
        }
        return (data || []) as Profile[];
      } catch (err) {
        console.error('Supabase getAllUsers unexpected error:', err);
        return [];
      }
    }
    if (role && role !== 'all') return inMemoryProfiles.filter(p => p.role === role);
    return inMemoryProfiles;
  },

  async getVerificationRequests(): Promise<VerificationRequestItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('verification_requests')
          .select('*, user:profiles(*)')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getVerificationRequests error:', error.message);
          return [];
        }
        return (data || []) as VerificationRequestItem[];
      } catch (err) {
        console.error('Supabase getVerificationRequests unexpected error:', err);
        return [];
      }
    }
    return inMemoryVerifications;
  },

  async reviewVerification(requestId: string, status: VerificationStatus, feedback?: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from('verification_requests')
          .update({
            status,
            admin_feedback: feedback,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', requestId);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memproses verifikasi';
        return { success: false, error: msg };
      }
    }

    const idx = inMemoryVerifications.findIndex(v => v.id === requestId);
    if (idx !== -1) {
      inMemoryVerifications[idx].status = status;
      inMemoryVerifications[idx].admin_feedback = feedback || null;
      inMemoryVerifications[idx].reviewed_at = new Date().toISOString();
      const userIdx = inMemoryProfiles.findIndex(p => p.id === inMemoryVerifications[idx].user_id);
      if (userIdx !== -1) inMemoryProfiles[userIdx].verification_status = status;
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
