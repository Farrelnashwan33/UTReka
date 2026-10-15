<script lang="ts">
  import { GraduationCap, Heart, Mail, MapPin, ExternalLink } from 'lucide-svelte';
</script>

<footer class="bg-[#183153] text-[#FAF9F6] border-t border-[#183153]/50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Col 1: Brand Info -->
      <div class="md:col-span-2 space-y-4">
        <a href="/" class="inline-block group" title="UT REKA">
          <img 
            src="/images/ut-reka-logo.png" 
            alt="UT REKA Relasi Karir" 
            class="h-16 w-auto rounded-2xl object-contain shadow-md group-hover:scale-102 transition-transform" 
          />
        </a>

        <p class="text-sm text-gray-300 max-w-md leading-relaxed">
          "Dari Kampus Terbuka, Menuju Karier Tanpa Batas."  
          Platform jejaring profesional terpercaya yang menghubungkan mahasiswa dan alumni Universitas Terbuka di seluruh Indonesia dan luar negeri.
        </p>

        <div class="pt-2 text-xs text-gray-400 border-l-2 border-[#FFD43B] pl-3 py-1">
          Pemberitahuan: UT REKA merupakan inisiatif independen jejaring profesional berbasis komunitas mahasiswa dan alumni UT. Dilengkapi area branding siap-integrasi institusi resmi.
        </div>
      </div>

      <!-- Col 2: Navigasi Cepat -->
      <div class="space-y-3">
        <h4 class="text-sm font-bold tracking-wider uppercase text-[#FFD43B]">Navigasi</h4>
        <ul class="space-y-2 text-sm text-gray-300">
          <li><a href="/#beranda" class="hover:text-white transition">Beranda</a></li>
          <li><a href="/#tentang" class="hover:text-white transition">Tentang UT REKA</a></li>
          <li><a href="/#fitur" class="hover:text-white transition">Fitur Mahasiswa & Alumni</a></li>
          <li><a href="/#cara-kerja" class="hover:text-white transition">Cara Kerja</a></li>
          <li><a href="/#faq" class="hover:text-white transition">Pertanyaan Umum (FAQ)</a></li>
        </ul>
      </div>

      <!-- Col 3: Kontak & Komunitas -->
      <div class="space-y-3">
        <h4 class="text-sm font-bold tracking-wider uppercase text-[#FFD43B]">Kontak & Komunitas</h4>
        <ul class="space-y-2.5 text-sm text-gray-300">
          <li class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-[#FFD43B]" />
            <span>kontak@ut-reka.id</span>
          </li>
          <li class="flex items-start gap-2">
            <MapPin class="w-4 h-4 text-[#FFD43B] shrink-0 mt-0.5" />
            <span>Pusat Jejaring Komunitas Mahasiswa & Alumni UT, Indonesia</span>
          </li>
          <li class="pt-2">
            <a 
              href="https://www.ut.ac.id" 
              target="_blank" 
              rel="noreferrer"
              class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FFD43B] transition"
            >
              <span>Portal Resmi UT (ut.ac.id)</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
      <div>
        © 2026 UT REKA. Hak Cipta Dilindungi Undang-Undang.
      </div>
      <div class="flex items-center gap-6">
        <a href="#tentang" class="hover:text-white transition">Kebijakan Privasi</a>
        <a href="#tentang" class="hover:text-white transition">Syarat Penggunaan</a>
        <a href="#tentang" class="hover:text-white transition">Panduan Keamanan Komunitas</a>
      </div>
    </div>
  </div>
</footer>
