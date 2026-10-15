<script lang="ts">
  import type { Component } from 'svelte';

  let { 
    title, 
    value, 
    subtitle, 
    change, 
    icon: IconComponent,
    color = 'yellow' 
  } = $props<{
    title: string;
    value: string | number;
    subtitle?: string;
    change?: string;
    icon?: any;
    color?: 'yellow' | 'navy' | 'green' | 'blue';
  }>();
</script>

<div class="ut-card p-6 relative overflow-hidden group ut-card-hover">
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <h3 class="text-3xl font-extrabold text-[#183153] mt-2 font-heading">{value}</h3>
      {#if subtitle}
        <p class="text-xs text-gray-600 mt-1">{subtitle}</p>
      {/if}
      {#if change}
        <div class="flex items-center gap-1.5 mt-3 text-xs font-bold text-[#18866B]">
          <span>{change}</span>
        </div>
      {/if}
    </div>

    {#if IconComponent}
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs
        {color === 'yellow' ? 'bg-[#FFD43B] text-[#183153]' : ''}
        {color === 'navy' ? 'bg-[#183153] text-[#FAF9F6]' : ''}
        {color === 'green' ? 'bg-[#18866B]/15 text-[#18866B]' : ''}
        {color === 'blue' ? 'bg-[#EAF4FF] text-[#183153]' : ''}"
      >
        <IconComponent class="w-6 h-6 stroke-[2.2]" />
      </div>
    {/if}
  </div>
</div>
