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
    email: 'tasya.angelicia@mhs.ut.ac.id',
    full_name: 'Tasya Angelicia Tenggara',
    role: 'student',
    nim: '042918274',
    study_program: 'S1 Sistem Informasi',
    entry_year: 2023,
    graduation_year: null,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Mahasiswa S1 Sistem Informasi UT yang fokus pada Product Management, UI/UX Research, dan inovasi platform digital.',
    skills: ['Product Strategy', 'UI/UX Design', 'Data Analysis', 'User Research', 'Scrum Agile'],
    interests: ['Product Management', 'EdTech', 'Digital Transformation'],
    portfolio_url: 'https://github.com/tasyaangelicia',
    github_url: 'https://github.com/tasyaangelicia',
    linkedin_url: 'https://linkedin.com/in/tasyaangelicia',
    website_url: 'https://tasyaangelicia.dev',
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
    email: 'azdzikri.hisyam@alumni.ut.ac.id',
    full_name: 'Azdzikri Muhammad Hisyam Soleh, S.Kom.',
    role: 'alumni',
    nim: '031829104',
    study_program: 'S1 Sistem Informasi',
    entry_year: 2019,
    graduation_year: 2023,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Alumni UT berkarier sebagai Cloud & DevOps Specialist di Telkom Indonesia. Bersemangat membimbing rekan mahasiswa seputar infrastruktur cloud.',
    skills: ['Cloud Computing', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux Systems', 'Network Security'],
    interests: ['Cloud Architecture', 'DevOps', 'Mentorship'],
    portfolio_url: 'https://azdzikrihisyam.dev',
    github_url: 'https://github.com/azdzikrihisyam',
    linkedin_url: 'https://linkedin.com/in/azdzikrihisyam',
    website_url: 'https://azdzikrihisyam.dev',
    company: 'Telkom Indonesia',
    job_title: 'Cloud & DevOps Specialist',
    industry: 'Telecommunications & IT',
    is_mentor: true,
    mentor_topics: ['Mentoring 1-on-1', 'Sertifikasi Cloud & DevOps', 'Infrastruktur IT Skalabilitas Tinggi'],
    verification_status: 'verified',
    is_active: true,
    created_at: '2023-11-10T10:00:00Z',
    updated_at: '2024-02-01T12:00:00Z'
  },
  {
    id: 'usr-alumni-2',
    email: 'maulana.chrysant@alumni.ut.ac.id',
    full_name: 'Maulana Chrysant, S.Kom.',
    role: 'alumni',
    nim: '028947112',
    study_program: 'S1 Sistem Informasi',
    entry_year: 2018,
    graduation_year: 2022,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Senior Software Engineer di Google. Menguasai arsitektur distributed systems dan siap mendampingi simulasi wawancara teknis mahasiswa UT.',
    skills: ['TypeScript', 'Go', 'Distributed Systems', 'System Design', 'Cloud Architecture'],
    interests: ['Distributed Systems', 'Open Source', 'Engineering Excellence'],
    portfolio_url: 'https://maulanachrysant.dev',
    github_url: 'https://github.com/maulanachrysant',
    linkedin_url: 'https://linkedin.com/in/maulanachrysant',
    website_url: 'https://maulanachrysant.dev',
    company: 'Google',
    job_title: 'Senior Software Engineer',
    industry: 'Technology & Cloud',
    is_mentor: true,
    mentor_topics: ['Simulasi Interview Teknis', 'Review CV & Portofolio', 'System Design & Code Quality'],
    verification_status: 'verified',
    is_active: true,
    created_at: '2023-09-20T10:00:00Z',
    updated_at: '2024-01-20T11:00:00Z'
  },
  {
    id: 'usr-student-2',
    email: 'keisha.refanaura@mhs.ut.ac.id',
    full_name: 'Keisha Refanaura Hakim',
    role: 'student',
    nim: '043819203',
    study_program: 'S1 Akuntansi & Keuangan',
    entry_year: 2023,
    graduation_year: null,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Mahasiswa Akuntansi & Data Analytics UT. Tertarik pada Financial Modeling, Business Intelligence, dan audit korporasi.',
    skills: ['Data Analytics', 'Python', 'SQL', 'Financial Modeling', 'Tableau & PowerBI'],
    interests: ['Data Science', 'Financial Analysis', 'Business Intelligence'],
    portfolio_url: 'https://github.com/keisharefanaura',
    github_url: 'https://github.com/keisharefanaura',
    linkedin_url: 'https://linkedin.com/in/keisharefanaura',
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
    email: 'farrel.nashwan@admin.ut.ac.id',
    full_name: 'Akhmad Farrel Nashwan',
    role: 'admin',
    nim: 'ADM-0105',
    study_program: 'Pusat Karier & Alumni UT',
    entry_year: 2020,
    graduation_year: 2024,
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    bio: 'Lead Administrator & Fullstack Engineer UT REKA. Mengawal tata kelola, integrasi sistem, dan kurasi komunitas mahasiswa & alumni.',
    skills: ['Platform Moderation', 'Fullstack Engineering', 'System Security', 'Community Governance'],
    interests: ['Educational Technology', 'Career Acceleration', 'High-Performance Platforms'],
    portfolio_url: 'https://github.com/farrelnashwan',
    github_url: 'https://github.com/farrelnashwan',
    linkedin_url: 'https://linkedin.com/in/farrelnashwan',
    website_url: null,
    company: 'Universitas Terbuka',
    job_title: 'Koordinator Sistem UT REKA',
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
    note: 'Halo Mas Azdzikri, saya Tasya dari Sistem Informasi UT. Sangat tertarik dengan perjalanan karier Mas di bidang Cloud & DevOps!',
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
    note: 'Selamat siang Mas Azdzikri, salam kenal dari Keisha mahasiswa UT!',
    created_at: '2024-10-09T15:20:00Z',
    updated_at: '2024-10-09T15:20:00Z',
    sender: mockProfiles[3],
    receiver: mockProfiles[1]
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Azdzikri M. Hisyam & Tasya Angelicia',
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
    content: 'Halo Mas Azdzikri! Terima kasih banyak sudah menerima permintaan koneksi saya.',
    created_at: '2024-09-11T09:10:00Z'
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_id: 'usr-alumni-1',
    content: 'Sama-sama Tasya! Senang sekali bisa terhubung dengan sesama mahasiswa Sistem Informasi UT. Ada yang sedang kamu pelajari saat ini?',
    created_at: '2024-09-11T09:25:00Z'
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-1',
    sender_id: 'usr-student-1',
    content: 'Saya sedang mendalami manajemen produk digital dan web modern untuk proyek portofolio, Mas. Kira-kira apa tips paling penting saat menghadapi technical screening?',
    created_at: '2024-10-10T14:20:00Z'
  },
  {
    id: 'msg-4',
    conversation_id: 'conv-1',
    sender_id: 'usr-alumni-1',
    content: 'Fokus pada fondasi: asynchronous JavaScript, arsitektur cloud, dan bagaimana caramu memecahkan masalah langkah demi langkah saat technical interview!',
    created_at: '2024-10-10T14:30:00Z'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'usr-student-1',
    title: 'Koneksi Diterima',
    message: 'Azdzikri Muhammad Hisyam Soleh telah menerima permintaan koneksi Anda.',
    type: 'connection_accepted',
    link: '/dashboard/messages/conv-1',
    is_read: true,
    created_at: '2024-09-11T09:00:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'usr-student-1',
    title: 'Pesan Baru',
    message: 'Azdzikri Muhammad Hisyam Soleh mengirim pesan dalam percakapan.',
    type: 'new_message',
    link: '/dashboard/messages/conv-1',
    is_read: false,
    created_at: '2024-10-10T14:30:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'usr-alumni-1',
    title: 'Permintaan Koneksi Baru',
    message: 'Keisha Refanaura Hakim ingin terhubung dengan Anda.',
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
    document_url: 'https://example.com/ijazah-azdzikri.pdf',
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
    document_url: 'https://example.com/ktm-keisha.pdf',
    notes: 'KTM Aktif Semester 5 Sistem Informasi.',
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
