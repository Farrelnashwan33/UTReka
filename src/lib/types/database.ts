export type UserRole = 'student' | 'alumni' | 'admin';
export type ConnectionRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type OpportunityType = 'project' | 'internship' | 'job' | 'mentoring';
export type OpportunityStatus = 'draft' | 'published' | 'closed';
export type ApplicationStatus = 'submitted' | 'reviewed' | 'accepted' | 'rejected';
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  nim?: string | null;
  study_program: string;
  entry_year?: number | null;
  graduation_year?: number | null;
  avatar_url?: string | null;
  bio?: string | null;
  skills: string[];
  interests: string[];
  portfolio_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  company?: string | null;
  job_title?: string | null;
  industry?: string | null;
  is_mentor: boolean;
  mentor_topics: string[];
  verification_status: VerificationStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConnectionRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ConnectionRequestStatus;
  note?: string | null;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Connection {
  id: string;
  user1_id: string;
  user2_id: string;
  connected_at: string;
  partner?: Profile;
}

export interface Conversation {
  id: string;
  title?: string | null;
  created_at: string;
  updated_at: string;
  members?: ConversationMember[];
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: Profile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Opportunity {
  id: string;
  author_id: string;
  title: string;
  description: string;
  type: OpportunityType;
  company_or_org?: string | null;
  location: string;
  requirements: string[];
  deadline?: string | null;
  status: OpportunityStatus;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  applications_count?: number;
}

export interface OpportunityApplication {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  pitch: string;
  portfolio_link?: string | null;
  status: ApplicationStatus;
  created_at: string;
  applicant?: Profile;
  opportunity?: Opportunity;
}

export interface ReportItem {
  id: string;
  reporter_id: string;
  reported_user_id?: string | null;
  reported_opportunity_id?: string | null;
  reason: string;
  details: string;
  status: ReportStatus;
  admin_notes?: string | null;
  created_at: string;
  resolved_at?: string | null;
  reporter?: Profile;
  reported_user?: Profile;
  reported_opportunity?: Opportunity;
}

export interface VerificationRequestItem {
  id: string;
  user_id: string;
  role: UserRole;
  nim_or_alumni_id: string;
  document_url?: string | null;
  notes?: string | null;
  status: VerificationStatus;
  reviewed_by?: string | null;
  admin_feedback?: string | null;
  created_at: string;
  reviewed_at?: string | null;
  user?: Profile;
}

export interface AuditLogItem {
  id: string;
  admin_id?: string | null;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  created_at: string;
  admin?: Profile;
}
