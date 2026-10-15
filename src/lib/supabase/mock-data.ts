import type { 
  Profile, 
  Opportunity, 
  ConnectionRequest, 
  Conversation, 
  Message, 
  NotificationItem,
  ReportItem,
  VerificationRequestItem,
  AuditLogItem 
} from '$lib/types/database';

export const mockProfiles: Profile[] = [
  {
    id: 'usr-student-1',
    email: 'budi.santoso@mhs.ut.ac.id',
    full_name: 'Budi Santoso',
    role: 'student',
    nim: '042918274',
    study_program: 'Sistem Informasi',
    entry_year: 2023,
    graduation_year: null,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Mahasiswa UT semester 4 yang antusias dengan Web Development, SvelteKit, dan Cloud Computing. Sedang mencari mentor industri teknologi.',
    skills: ['JavaScript', 'TypeScript', 'SvelteKit', 'Tailwind CSS', 'PostgreSQL'],
    interests: ['Frontend Engineering', 'Fullstack Development', 'Open Source'],
    portfolio_url: 'https://github.com/budisantoso-dev',
    github_url: 'https://github.com/budisantoso-dev',
    linkedin_url: 'https://linkedin.com/in/budisantoso',
    website_url: 'https://budisantoso.dev',
    company: null,
    job_title: null,
    industry: null,
    is_mentor: false,
    mentor_topics: [],
    verification_status: 'verified',
    is_active: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 'usr-alumni-1',
    email: 'sarah.wijaya@alumni.ut.ac.id',
    full_name: 'Sarah Wijaya, S.Kom.',
    role: 'alumni',
    nim: '031829104',
    study_program: 'Sistem Informasi',
    entry_year: 2018,
    graduation_year: 2022,
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    bio: 'Alumni UT 2022. Saat ini berkarir sebagai Senior Frontend Engineer di Tech Unicorn Indonesia. Bersemangat membimbing adik-adik UT menembus industri.',
    skills: ['React', 'SvelteKit', 'System Design', 'Web Performance', 'CI/CD'],
    interests: ['Mentorship', 'EdTech', 'Tech Leadership'],
    portfolio_url: 'https://sarahwijaya.io',
    github_url: 'https://github.com/sarahwijaya',
    linkedin_url: 'https://linkedin.com/in/sarahwijaya',
    website_url: 'https://sarahwijaya.io',
    company: 'GoTo Financial',
    job_title: 'Senior Frontend Engineer',
    industry: 'Financial Technology',
    is_mentor: true,
    mentor_topics: ['Mentoring 1-on-1', 'Review CV & Portofolio', 'Simulasi Interview Teknis', 'Kiat Belajar Mandiri di UT'],
    verification_status: 'verified',
    is_active: true,
    created_at: '2023-11-10T10:00:00Z',
    updated_at: '2024-02-01T12:00:00Z'
  },
  {
    id: 'usr-alumni-2',
    email: 'rizky.pratama@alumni.ut.ac.id',
    full_name: 'Rizky Pratama, S.E.',
    role: 'alumni',
    nim: '028947112',
    study_program: 'Manajemen',
    entry_year: 2017,
    graduation_year: 2021,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Product Manager di E-commerce global. Alumni Manajemen UT yang membuktikan fleksibilitas kuliah UT mampu bersaing di panggung korporasi digital.',
    skills: ['Product Strategy', 'Agile Scrum', 'Data Analysis', 'User Research', 'OKR'],
    interests: ['Product Management', 'Startup Growth', 'Business Analytics'],
    portfolio_url: null,
    github_url: null,
    linkedin_url: 'https://linkedin.com/in/rizkypratama',
    website_url: null,
    company: 'Traveloka',
    job_title: 'Lead Product Manager',
    industry: 'Online Travel & Lifestyle',
    is_mentor: true,
    mentor_topics: ['Karier Product Management', 'Business Case Solution', 'Networking Profesional'],
    verification_status: 'verified',
    is_active: true,
    created_at: '2023-09-20T10:00:00Z',
    updated_at: '2024-01-20T11:00:00Z'
  },
  {
    id: 'usr-student-2',
    email: 'anisa.rahmawati@mhs.ut.ac.id',
    full_name: 'Anisa Rahmawati',
    role: 'student',
    nim: '043819203',
    study_program: 'Ilmu Komunikasi',
    entry_year: 2022,
    graduation_year: null,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Mahasiswa Ilmu Komunikasi UT yang fokus pada Digital Content Strategy dan Corporate Public Relations.',
    skills: ['Copywriting', 'Public Relations', 'Social Media Strategy', 'Canva', 'Storytelling'],
    interests: ['Brand Communication', 'Content Marketing', 'Media Relations'],
    portfolio_url: null,
    github_url: null,
    linkedin_url: 'https://linkedin.com/in/anisa-rahmawati',
    website_url: null,
    company: null,
    job_title: null,
    industry: null,
    is_mentor: false,
    mentor_topics: [],
    verification_status: 'verified',
    is_active: true,
    created_at: '2024-02-05T09:00:00Z',
    updated_at: '2024-02-05T09:00:00Z'
  },
  {
    id: 'usr-admin-1',
    email: 'admin.reka@ut.ac.id',
    full_name: 'Admin UT REKA Pusat',
    role: 'admin',
    nim: 'ADM-9901',
    study_program: 'Pusat Karier & Alumni UT',
    entry_year: 2015,
    graduation_year: 2019,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    bio: 'Administrator Verifikasi dan Tata Kelola Platform UT REKA.',
    skills: ['Platform Moderation', 'Community Management', 'Data Governance'],
    interests: ['Career Development', 'Student Empowerment'],
    portfolio_url: null,
    github_url: null,
    linkedin_url: null,
    website_url: null,
    company: 'Universitas Terbuka',
    job_title: 'Koordinator Hubungan Alumni',
    industry: 'Pendidikan Tinggi',
    is_mentor: false,
    mentor_topics: [],
    verification_status: 'verified',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    author_id: 'usr-alumni-1',
    title: 'Mentoring 1-on-1: Membangun Portofolio Frontend Berstandar Industri',
    description: 'Program mentoring intensif 4 minggu bagi mahasiswa UT yang ingin memperdalam SvelteKit, React, atau TypeScript, serta review langsung portofolio proyek sebelum melamar magang.',
    type: 'mentoring',
    company_or_org: 'Komunitas Alumni Tech UT',
    location: 'Remote (Google Meet)',
    requirements: ['Mahasiswa aktif UT minimal semester 3', 'Pernah membuat minimal 1 project web dasar', 'Komitmen 2 jam/minggu selama 1 bulan'],
    deadline: '2026-11-30',
    status: 'published',
    is_approved: true,
    created_at: '2024-10-01T08:00:00Z',
    updated_at: '2024-10-01T08:00:00Z',
    author: mockProfiles[1],
    applications_count: 5
  },
  {
    id: 'opp-2',
    author_id: 'usr-alumni-2',
    title: 'Proyek Kolaborasi: Riset Kepuasan Pengguna Aplikasi Mobile Learning',
    description: 'Kami sedang membuka kesempatan kolaborasi riset untuk mahasiswa UT (khususnya jurusan Sistem Informasi, Manajemen, atau Ilmu Komunikasi) dalam menyusun user journey map dan analisis feedback.',
    type: 'project',
    company_or_org: 'Traveloka Academy Project',
    location: 'Hybrid / Remote',
    requirements: ['Memahami dasar-dasar User Experience Research', 'Mampu mengolah data kuesioner', 'Sertifikat keikutsertaan resmi disediakan'],
    deadline: '2026-12-15',
    status: 'published',
    is_approved: true,
    created_at: '2024-10-05T10:30:00Z',
    updated_at: '2024-10-05T10:30:00Z',
    author: mockProfiles[2],
    applications_count: 3
  },
  {
    id: 'opp-3',
    author_id: 'usr-alumni-1',
    title: 'Magang Junior Web Developer di Startup EdTech Rekanan',
    description: 'Posisi magang berbayar (paid internship) selama 3-6 bulan untuk membantu pengembangan fitur dashboard interaktif. Terbuka khusus mahasiswa UT dengan jam kerja fleksibel.',
    type: 'internship',
    company_or_org: 'EduNusantara Lab',
    location: 'Remote (WFA)',
    requirements: ['Menguasai HTML, CSS, JavaScript dasar', 'Familiar dengan Git & GitHub', 'Nilai tambah jika memahami Tailwind CSS atau Svelte'],
    deadline: '2026-11-20',
    status: 'published',
    is_approved: true,
    created_at: '2024-10-08T14:15:00Z',
    updated_at: '2024-10-08T14:15:00Z',
    author: mockProfiles[1],
    applications_count: 8
  }
];

export const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req-1',
    sender_id: 'usr-student-1',
    receiver_id: 'usr-alumni-1',
    status: 'accepted',
    note: 'Halo Mbak Sarah, saya Budi dari Sistem Informasi UT. Sangat tertarik dengan perjalanan karier Mbak di GoTo!',
    created_at: '2024-09-10T11:00:00Z',
    updated_at: '2024-09-11T09:00:00Z',
    sender: mockProfiles[0],
    receiver: mockProfiles[1]
  },
  {
    id: 'req-2',
    sender_id: 'usr-student-2',
    receiver_id: 'usr-alumni-1',
    status: 'pending',
    note: 'Selamat siang Kak Sarah, salam kenal dari Anisa mahasiswa UT!',
    created_at: '2024-10-09T15:20:00Z',
    updated_at: '2024-10-09T15:20:00Z',
    sender: mockProfiles[3],
    receiver: mockProfiles[1]
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Sarah Wijaya & Budi Santoso',
    created_at: '2024-09-11T09:05:00Z',
    updated_at: '2024-10-10T14:30:00Z',
    unread_count: 1
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'usr-student-1',
    content: 'Halo Mbak Sarah! Terima kasih banyak sudah menerima permintaan koneksi saya.',
    created_at: '2024-09-11T09:10:00Z'
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_id: 'usr-alumni-1',
    content: 'Sama-sama Budi! Senang sekali bisa terhubung dengan sesama mahasiswa Sistem Informasi UT. Ada yang sedang kamu pelajari saat ini?',
    created_at: '2024-09-11T09:25:00Z'
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-1',
    sender_id: 'usr-student-1',
    content: 'Saya sedang mendalami SvelteKit dan PostgreSQL untuk proyek portofolio, Mbak. Kira-kira apa tips paling penting saat menghadapi technical screening?',
    created_at: '2024-10-10T14:20:00Z'
  },
  {
    id: 'msg-4',
    conversation_id: 'conv-1',
    sender_id: 'usr-alumni-1',
    content: 'Fokus pada fondasi: asynchronous JavaScript, state management, dan bagaimana caramu memecahkan masalah langkah demi langkah saat live coding!',
    created_at: '2024-10-10T14:30:00Z'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'usr-student-1',
    title: 'Koneksi Diterima',
    message: 'Sarah Wijaya telah menerima permintaan koneksi Anda.',
    type: 'connection_accepted',
    link: '/dashboard/messages/conv-1',
    is_read: true,
    created_at: '2024-09-11T09:00:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'usr-student-1',
    title: 'Pesan Baru',
    message: 'Sarah Wijaya mengirim pesan dalam percakapan.',
    type: 'new_message',
    link: '/dashboard/messages/conv-1',
    is_read: false,
    created_at: '2024-10-10T14:30:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'usr-alumni-1',
    title: 'Permintaan Koneksi Baru',
    message: 'Anisa Rahmawati ingin terhubung dengan Anda.',
    type: 'connection_request',
    link: '/dashboard/connections',
    is_read: false,
    created_at: '2024-10-09T15:20:00Z'
  }
];

export const mockReports: ReportItem[] = [
  {
    id: 'rep-1',
    reporter_id: 'usr-student-1',
    reported_user_id: null,
    reported_opportunity_id: 'opp-3',
    reason: 'Informasi lowongan kadaluarsa',
    details: 'Mohon update tanggal penutupan lowongan pada batch magang ini.',
    status: 'pending',
    admin_notes: null,
    created_at: '2024-10-09T12:00:00Z',
    resolved_at: null,
    reporter: mockProfiles[0]
  }
];

export const mockVerificationRequests: VerificationRequestItem[] = [
  {
    id: 'ver-1',
    user_id: 'usr-alumni-1',
    role: 'alumni',
    nim_or_alumni_id: '031829104',
    document_url: 'https://example.com/ijazah-sarah.pdf',
    notes: 'Lulusan SI UT UPBJJ Jakarta tahun 2022.',
    status: 'verified',
    reviewed_by: 'usr-admin-1',
    admin_feedback: 'Terverifikasi sesuai data kelulusan UT.',
    created_at: '2023-11-10T10:00:00Z',
    reviewed_at: '2023-11-11T08:00:00Z',
    user: mockProfiles[1]
  },
  {
    id: 'ver-2',
    user_id: 'usr-student-2',
    role: 'student',
    nim_or_alumni_id: '043819203',
    document_url: 'https://example.com/ktm-anisa.pdf',
    notes: 'KTM Aktif Semester 5 Ilmu Komunikasi.',
    status: 'pending',
    reviewed_by: null,
    admin_feedback: null,
    created_at: '2024-10-08T10:00:00Z',
    reviewed_at: null,
    user: mockProfiles[3]
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: 'log-1',
    admin_id: 'usr-admin-1',
    action: 'VERIFY_USER',
    target_type: 'PROFILE',
    target_id: 'usr-alumni-1',
    details: { reason: 'Dokumen kelulusan valid', status: 'verified' },
    created_at: '2023-11-11T08:00:00Z'
  },
  {
    id: 'log-2',
    admin_id: 'usr-admin-1',
    action: 'APPROVE_OPPORTUNITY',
    target_type: 'OPPORTUNITY',
    target_id: 'opp-1',
    details: { title: 'Mentoring 1-on-1' },
    created_at: '2024-10-01T08:30:00Z'
  }
];
