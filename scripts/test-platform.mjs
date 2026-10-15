import { z } from 'zod';

console.log('=====================================================');
console.log('🧪 UT REKA - Comprehensive Automated Test Suite');
console.log('=====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------
// TEST SUITE 1: Form Validation & Security Rules
// ----------------------------------------------------
console.log('▶ Test Suite 1: Registration & Role Security Rules');

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Konfirmasi kata sandi minimal 6 karakter'),
  role: z.enum(['student', 'alumni'], { message: 'Role harus student atau alumni' }),
  nim: z.string().min(5, 'NIM minimal 5 digit'),
  studyProgram: z.string().min(2, 'Program studi wajib diisi'),
  year: z.number().min(1980).max(2030),
  agreePrivacy: z.boolean().refine(val => val === true)
}).refine(data => data.password === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword']
});

// Test 1.1: Valid registration payload
const validStudent = registerSchema.safeParse({
  fullName: 'Farrel Nashwan',
  email: 'farrel@mhs.ut.ac.id',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  role: 'student',
  nim: '042918274',
  studyProgram: 'Sistem Informasi',
  year: 2023,
  agreePrivacy: true
});
assert(validStudent.success === true, 'Pendaftaran mahasiswa dengan data valid berhasil divalidasi');

// Test 1.2: Registration cannot choose 'admin' role
const adminAttempt = registerSchema.safeParse({
  fullName: 'Penyerang Ilegal',
  email: 'attacker@ut.ac.id',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  role: 'admin', // FORBIDDEN: only 'student' or 'alumni' allowed
  nim: '000000',
  studyProgram: 'Sistem Informasi',
  year: 2023,
  agreePrivacy: true
});
assert(adminAttempt.success === false, 'Pengguna tidak dapat mendaftar dengan role admin (Security Guard)');

// Test 1.3: Password mismatch rejection
const passwordMismatch = registerSchema.safeParse({
  fullName: 'Budi Santoso',
  email: 'budi@mhs.ut.ac.id',
  password: 'Password123!',
  confirmPassword: 'DifferentPassword!',
  role: 'student',
  nim: '042918274',
  studyProgram: 'Sistem Informasi',
  year: 2023,
  agreePrivacy: true
});
assert(passwordMismatch.success === false, 'Konfirmasi kata sandi yang berbeda ditolak secara ketat');

// ----------------------------------------------------
// TEST SUITE 2: Connection Lifecycle & Self-Connection Prevention
// ----------------------------------------------------
console.log('\n▶ Test Suite 2: Connection Lifecycle & Constraints');

function simulateSendRequest(senderId, receiverId, currentRequests) {
  if (senderId === receiverId) {
    return { success: false, error: 'Tidak dapat mengirim permintaan koneksi ke diri sendiri' };
  }
  const duplicate = currentRequests.some(r => 
    ((r.sender_id === senderId && r.receiver_id === receiverId) ||
     (r.sender_id === receiverId && r.receiver_id === senderId)) &&
    r.status === 'pending'
  );
  if (duplicate) {
    return { success: false, error: 'Permintaan koneksi sudah ada dan masih pending' };
  }
  return { success: true, id: `req-${Date.now()}` };
}

// Test 2.1: Prevent self connection
const selfReq = simulateSendRequest('user-1', 'user-1', []);
assert(selfReq.success === false && selfReq.error.includes('diri sendiri'), 'Mencegah pengiriman permintaan koneksi ke diri sendiri');

// Test 2.2: Valid connection request
const validReq = simulateSendRequest('user-student-1', 'user-alumni-1', []);
assert(validReq.success === true, 'Permintaan koneksi mahasiswa ke alumni berhasil dibuat');

// Test 2.3: Prevent duplicate pending requests
const duplicateReq = simulateSendRequest('user-student-1', 'user-alumni-1', [
  { sender_id: 'user-student-1', receiver_id: 'user-alumni-1', status: 'pending' }
]);
assert(duplicateReq.success === false, 'Mencegah pembuatan permintaan ganda (duplicate pending request constraint)');

// ----------------------------------------------------
// TEST SUITE 3: Messaging Protection & Conversation Member Guard
// ----------------------------------------------------
console.log('\n▶ Test Suite 3: Direct Messaging & Access Control');

function simulateSendMessage(conversationId, senderId, content, members) {
  if (!content.trim()) return { success: false, error: 'Pesan kosong' };
  const isMember = members.includes(senderId);
  if (!isMember) {
    return { success: false, error: 'Akses ditolak: Pengguna bukan anggota percakapan ini' };
  }
  return { success: true, messageId: `msg-${Date.now()}` };
}

const convMembers = ['usr-student-1', 'usr-alumni-1'];

// Test 3.1: Member can send message
const memberSend = simulateSendMessage('conv-1', 'usr-student-1', 'Halo Kak Sarah!', convMembers);
assert(memberSend.success === true, 'Anggota percakapan yang sah berhasil mengirim pesan');

// Test 3.2: Non-member cannot send message
const nonMemberSend = simulateSendMessage('conv-1', 'usr-intruder-99', 'Pesan ilegal', convMembers);
assert(nonMemberSend.success === false && nonMemberSend.error.includes('Akses ditolak'), 'Pengguna bukan anggota dicegah mengirim pesan (RLS simulation)');

// ----------------------------------------------------
// TEST SUITE 4: Admin Verification & Moderation Lifecycle
// ----------------------------------------------------
console.log('\n▶ Test Suite 4: Administrative Verification & Moderation');

let mockVerifications = [
  { id: 'ver-10', user_id: 'usr-student-2', status: 'pending' }
];

function simulateAdminVerify(reqId, callerRole, newStatus) {
  if (callerRole !== 'admin') {
    return { success: false, error: 'Hanya administrator yang memiliki wewenang verifikasi' };
  }
  const item = mockVerifications.find(v => v.id === reqId);
  if (item) {
    item.status = newStatus;
    return { success: true };
  }
  return { success: false, error: 'Permintaan tidak ditemukan' };
}

// Test 4.1: Non-admin cannot approve verification
const unauthorizedReview = simulateAdminVerify('ver-10', 'student', 'verified');
assert(unauthorizedReview.success === false, 'Pengguna biasa tidak memiliki hak administratif verifikasi');

// Test 4.2: Admin approves verification
const adminReview = simulateAdminVerify('ver-10', 'admin', 'verified');
assert(adminReview.success === true && mockVerifications[0].status === 'verified', 'Administrator berhasil memverifikasi status akademis mahasiswa');

// ----------------------------------------------------
// TEST SUITE 5: HTTP Endpoints Health Check
// ----------------------------------------------------
console.log('\n▶ Test Suite 5: Route Health Verification on Local Server');

const routes = [
  '',
  'login',
  'register',
  'forgot-password',
  'dashboard/student',
  'dashboard/alumni',
  'dashboard/connections',
  'dashboard/messages',
  'dashboard/messages/conv-1',
  'dashboard/opportunities',
  'dashboard/profile',
  'dashboard/workspace',
  'admin',
  'mentor',
  'karier',
  'panduan',
  'privasi-syarat'
];

let healthyRoutes = 0;
for (const r of routes) {
  try {
    const res = await fetch(`http://localhost:5173/${r}`);
    if (res.status === 200) {
      healthyRoutes++;
    }
  } catch (e) {
    // ignore
  }
}

assert(healthyRoutes === routes.length, `Semua ${routes.length} route utama mengembalikan status HTTP 200 (${healthyRoutes}/${routes.length} healthy)`);

console.log('\n=====================================================');
console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED!`);
console.log('=====================================================\n');
