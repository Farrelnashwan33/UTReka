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

<div class="ut-card p-5 sm:p-6 relative overflow-hidden group ut-card-hover bg-white border border-[#E2E8F0]">
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="text-xs font-bold text-[#64748B] uppercase tracking-wider">{title}</p>
      <h3 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-2 font-heading tracking-tight">{value}</h3>
      {#if subtitle}
        <p class="text-xs text-[#64748B] mt-1 font-medium">{subtitle}</p>
      {/if}
      {#if change}
        <div class="flex items-center gap-1.5 mt-2.5 text-xs font-bold text-[#1E40AF]">
          <span>{change}</span>
        </div>
      {/if}
    </div>

    {#if IconComponent}
      <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105
        {color === 'yellow' ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' : ''}
        {color === 'navy' ? 'bg-[#1E40AF] text-white' : ''}
        {color === 'green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
        {color === 'blue' ? 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]' : ''}"
      >
        <IconComponent class="w-5 h-5 stroke-[2.2]" />
      </div>
    {/if}
  </div>
</div>
