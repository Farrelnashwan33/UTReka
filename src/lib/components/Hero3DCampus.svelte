<script lang="ts">
  import { onMount } from 'svelte';
  import { Sparkles, Users, Award, Briefcase, CheckCircle2 } from 'lucide-svelte';

  let containerEl: HTMLDivElement | null = null;
  let rotateX = $state(0);
  let rotateY = $state(0);

  function handleMouseMove(e: MouseEvent) {
    if (!containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    rotateY = Math.max(-10, Math.min(10, (x / rect.width) * 20));
    rotateX = Math.max(-10, Math.min(10, -(y / rect.height) * 20));
  }

  function handleMouseLeave() {
    rotateX = 0;
    rotateY = 0;
  }
</script>

<div 
  bind:this={containerEl}
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  role="region"
  aria-label="Visual Kampus 3D UT REKA"
  class="relative w-full aspect-4/3 sm:aspect-16/11 lg:aspect-square max-w-xl mx-auto perspective-1000 select-none group"
>
  <!-- Background Glow & Grid Ornaments -->
  <div class="absolute -inset-4 bg-gradient-to-tr from-[#FFD43B]/20 via-[#183153]/10 to-transparent rounded-3xl blur-2xl -z-10"></div>
  
  <!-- 3D Transform Main Stage -->
  <div 
    class="w-full h-full relative rounded-3xl overflow-hidden border border-[#E7E5E0] shadow-2xl bg-gradient-to-b from-[#183153] to-[#102138] transition-transform duration-200 ease-out"
    style="transform: rotateX({rotateX}deg) rotateY({rotateY}deg); transform-style: preserve-3d;"
  >
    <!-- Actual Campus Photograph with Architectural Blend -->
    <img 
      src="/images/kampus-ut-pamulang.jpg" 
      alt="Gedung Kampus Universitas Terbuka Pamulang" 
      class="w-full h-full object-cover object-center opacity-75 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 ease-out"
      loading="eager"
    />

    <!-- Gradient Sheen Overlays -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#183153] via-[#183153]/40 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[#183153]/60 via-transparent to-[#183153]/30"></div>

    <!-- 3D Campus Architectural & Geometric Wireframe Accents -->
    <div class="absolute inset-0 pointer-events-none opacity-25">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFD43B" stroke-width="0.8" stroke-dasharray="2 4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#campus-grid)" />
      </svg>
    </div>

    <!-- Digital Connection Beams -->
    <div class="absolute top-1/4 left-1/3 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#FFD43B] to-transparent transform -rotate-45 animate-pulse"></div>
    <div class="absolute top-2/3 right-1/4 w-40 h-0.5 bg-gradient-to-r from-transparent via-[#18866B] to-transparent transform rotate-12 animate-pulse"></div>

    <!-- Center Badge: Universitas Terbuka Karier Hub -->
    <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl text-left">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#183153] flex items-center justify-center text-[#FFD43B]">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-extrabold text-[#183153]">Ekosistem Mahasiswa & Alumni</h4>
            <p class="text-xs text-gray-600">Terbuka di 39 UPBJJ Dalam & Luar Negeri</p>
          </div>
        </div>
        <div class="hidden sm:flex items-center gap-1 bg-[#18866B]/10 text-[#18866B] px-2.5 py-1 rounded-full text-xs font-bold">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Terverifikasi</span>
        </div>
      </div>
    </div>

    <!-- Floating 3D Mentor Card 1 (Top Right) -->
    <div 
      class="absolute top-6 right-6 max-w-56 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xl transition-transform duration-300 transform group-hover:translate-y-[-4px]"
      style="transform: translateZ(30px);"
    >
      <div class="flex items-center gap-2.5">
        <img 
          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" 
          alt="Sarah Wijaya" 
          class="w-10 h-10 rounded-xl object-cover ring-2 ring-[#FFD43B]"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-1">
            <span class="text-xs font-bold text-[#183153] truncate">Sarah Wijaya</span>
            <span class="w-2 h-2 rounded-full bg-[#18866B]"></span>
          </div>
          <p class="text-[10px] text-gray-500 truncate">Senior Engineer @ GoTo</p>
          <div class="flex items-center gap-1 mt-0.5">
            <span class="text-[9px] font-bold bg-[#FFD43B]/30 text-[#183153] px-1 py-0.2 rounded">Mentor SI</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating 3D Stats Pill 2 (Top Left) -->
    <div 
      class="absolute top-10 left-6 p-3 rounded-2xl bg-[#183153]/90 text-white backdrop-blur-md border border-white/20 shadow-xl"
      style="transform: translateZ(40px);"
    >
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-[#FFD43B] text-[#183153] flex items-center justify-center font-bold text-xs">
          <Sparkles class="w-4 h-4" />
        </div>
        <div>
          <div class="text-xs font-bold">1-on-1 Mentoring</div>
          <div class="text-[10px] text-gray-300">Siap bimbing karier tech</div>
        </div>
      </div>
    </div>

    <!-- Floating 3D Badge 3 (Middle Right) -->
    <div 
      class="hidden sm:flex absolute top-1/2 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg items-center gap-2"
      style="transform: translateZ(25px);"
    >
      <Briefcase class="w-4 h-4 text-[#183153]" />
      <span class="text-[11px] font-bold text-gray-800">Proyek & Magang Terkurasi</span>
    </div>
  </div>
</div>
