# UT REKA (Universitas Terbuka Karier) - Setup & Deployment Guide

> **Tagline**: *"Dari Kampus Terbuka, Menuju Karier Tanpa Batas."*  
> **Target Supabase URL**: `https://ukhijyupfrpfztugtjuu.supabase.co`  
> **Frontend**: SvelteKit 2+ / Svelte 5 + TypeScript + Tailwind CSS  
> **Deployment Target**: Vercel

---

## 1. Prasyarat Sistem
- **Node.js**: v18+ (disarankan v20 atau v25)
- **NPM**: v9+
- Akun Supabase dengan akses ke project `ukhijyupfrpfztugtjuu`

---

## 2. Setup Database Supabase

### Langkah A: Melalui Supabase SQL Editor (Paling Cepat & Direkomendasikan)
1. Buka dashboard Supabase: [https://supabase.com/dashboard/project/ukhijyupfrpfztugtjuu](https://supabase.com/dashboard/project/ukhijyupfrpfztugtjuu)
2. Klik menu **SQL Editor** pada navigasi kiri.
3. Buat query baru, lalu salin dan tempel seluruh isi file:
   ```
   supabase/migrations/20261011000001_initial_schema.sql
   ```
4. Klik tombol **Run** (Jalankan).
5. Skema tabel, tipe enum, fungsi trigger `handle_new_user()`, proteksi eskalasi role, indeks performa, serta aturan Row Level Security (RLS) lengkap akan langsung aktif.

### Langkah B: Melalui Supabase CLI (Jika terpasang lokal)
```bash
# Login ke Supabase
npx supabase login

# Tautkan ke remote project
npx supabase link --project-ref ukhijyupfrpfztugtjuu

# Terapkan migrasi ke database remote
npx supabase db push
```

---

## 3. Konfigurasi Environment Variables

Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi nilai kredensial dari dashboard Supabase (**Project Settings -> API**):
```env
PUBLIC_SUPABASE_URL=https://ukhijyupfrpfztugtjuu.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon_public_key_anda>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_opsional_hanya_untuk_admin_server>
```

> ⚠️ **Catatan Keamanan**: Jangan pernah membagikan `SUPABASE_SERVICE_ROLE_KEY` ke client browser atau meng-commit file `.env` ke Git!

---

## 4. Instalasi dan Menjalankan Aplikasi Lokal

```bash
# 1. Install dependencies
npm install

# 2. Type-check integritas TypeScript & Svelte
npm run check

# 3. Jalankan server development
npm run dev
```

Buka browser di `http://localhost:5173`.

---

## 5. Pengujian & Validasi

```bash
# Validasi TypeScript & Svelte compiler
npm run check

# Build produksi untuk Vercel
npm run build
```

---

## 6. Deployment ke Vercel

1. Hubungkan repositori GitHub/GitLab ke Vercel.
2. Konfigurasikan environment variables di dashboard Vercel (**Settings -> Environment Variables**):
   - `PUBLIC_SUPABASE_URL`: `https://ukhijyupfrpfztugtjuu.supabase.co`
   - `PUBLIC_SUPABASE_ANON_KEY`: `<anon_key>`
3. Vercel akan otomatis mengenali `@sveltejs/adapter-vercel` dan melakukan build.
