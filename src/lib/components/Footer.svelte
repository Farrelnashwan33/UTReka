<script lang="ts">
  import { GraduationCap, Heart, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-svelte';
</script>

<footer class="bg-[#F8FAFC] text-[#334155] border-t border-[#E2E8F0]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Col 1: Brand Info -->
      <div class="md:col-span-2 space-y-4">
        <a href="/" class="inline-block group" title="UT REKA">
          <div class="p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs inline-block">
            <img 
              src="/images/ut-reka-logo-transparent.png" 
              alt="UT REKA Relasi Karir" 
              class="h-12 w-auto object-contain group-hover:scale-102 transition-transform" 
            />
          </div>
        </a>

        <p class="text-sm text-[#64748B] max-w-md leading-relaxed">
          "Dari Kampus Terbuka, Menuju Karier Tanpa Batas."  
          Platform jejaring profesional terpercaya yang menghubungkan mahasiswa dan alumni Universitas Terbuka di seluruh Indonesia dan luar negeri.
        </p>

        <div class="pt-2 text-xs text-[#D97706] font-medium border-l-2 border-[#F59E0B] pl-3 py-1">
          Pemberitahuan: UT REKA merupakan inisiatif kolaboratif pengembangan karier civitas akademika dan Ikatan Alumni Universitas Terbuka (IKA UT).
        </div>
      </div>

      <!-- Col 2: Navigasi Cepat -->
      <div class="space-y-3">
        <h4 class="text-xs font-black tracking-wider uppercase text-[#1E40AF]">Navigasi Program</h4>
        <ul class="space-y-2 text-sm text-[#64748B]">
          <li><a href="/" class="hover:text-[#1E40AF] transition">Beranda</a></li>
          <li><a href="/mentor" class="hover:text-[#1E40AF] transition">Program Mentor</a></li>
          <li><a href="/karier" class="hover:text-[#1E40AF] transition">Peluang Karier & Magang</a></li>
          <li><a href="/panduan" class="hover:text-[#1E40AF] transition">Panduan & Bantuan</a></li>
        </ul>
      </div>

      <!-- Col 3: Kontak & Komunitas -->
      <div class="space-y-3">
        <h4 class="text-xs font-black tracking-wider uppercase text-[#1E40AF]">Komunitas & Legal</h4>
        <ul class="space-y-2.5 text-sm text-[#64748B]">
          <li class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-[#1E40AF]" />
            <span>kontak@ut-reka.id</span>
          </li>
          <li class="flex items-start gap-2">
            <MapPin class="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" />
            <span>Pusat Komunitas Mahasiswa & Alumni UT, Indonesia</span>
          </li>
          <li class="pt-2">
            <a 
              href="https://www.ut.ac.id" 
              target="_blank" 
              rel="noreferrer"
              class="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1E40AF] transition font-medium"
            >
              <span>Portal Resmi UT (ut.ac.id)</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mt-14 pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
      <div>
        © 2026 UT REKA — Universitas Terbuka Karier. Hak Cipta Dilindungi Undang-Undang.
      </div>
      <div class="flex items-center gap-6">
        <a href="/privasi-syarat" class="hover:text-[#1E40AF] transition">Kebijakan Privasi</a>
        <a href="/privasi-syarat" class="hover:text-[#1E40AF] transition">Syarat Ketentuan</a>
        <a href="/panduan" class="hover:text-[#1E40AF] transition">Panduan Keamanan</a>
      </div>
    </div>
  </div>
</footer>
