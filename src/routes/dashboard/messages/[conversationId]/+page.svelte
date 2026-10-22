<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/state';
  import { authStore } from '$lib/stores/auth.svelte';
  import { platformService } from '$lib/supabase/service';
  import { getSupabaseClient, isSupabaseConfigured } from '$lib/supabase/client';
  import { toastStore } from '$lib/stores/toast.svelte';
  import type { Message } from '$lib/types/database';
  import { ArrowLeft, Send, CheckCircle2, Shield, User, Clock } from 'lucide-svelte';

  const conversationId = page.params.conversationId ?? '';
  let messages = $state<Message[]>([]);
  let newMessage = $state('');
  let isLoading = $state(true);
  let isSending = $state(false);
  let chatBoxEl: HTMLDivElement | null = null;
  let realtimeChannel: ReturnType<ReturnType<typeof getSupabaseClient>['channel']> | null = null;

  function scrollToBottom() {
    setTimeout(() => {
      if (chatBoxEl) {
        chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
      }
    }, 60);
  }

  onMount(async () => {
    isLoading = true;
    try {
      messages = await platformService.getMessages(conversationId);
      scrollToBottom();

      // Setup Supabase Realtime if configured
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        realtimeChannel = supabase
          .channel(`public:messages:conversation_id=eq.${conversationId}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
            (payload: { new: unknown }) => {
              const incoming = payload.new as Message;
              if (!messages.some(m => m.id === incoming.id)) {
                messages.push(incoming);
                scrollToBottom();
              }
            }
          )
          .subscribe();
      }
    } catch (e) {
      console.warn('Failed to load chat:', e);
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => {
    if (realtimeChannel && isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      supabase.removeChannel(realtimeChannel);
    }
  });

  async function handleSend(e: SubmitEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !authStore.profile || isSending) return;

    const content = newMessage.trim();
    newMessage = '';
    isSending = true;

    const res = await platformService.sendMessage(conversationId, authStore.profile.id, content);
    isSending = false;

    if (res.success && res.message) {
      if (!messages.some(m => m.id === res.message?.id)) {
        messages.push(res.message);
      }
      scrollToBottom();
    } else {
      toastStore.error(res.error || 'Gagal mengirim pesan');
    }
  }
</script>

<svelte:head>
  <title>UT REKA — Ruang Diskusi</title>
</svelte:head>

<!-- Mobile Full-Height Messenger Frame -->
<div class="h-[calc(100dvh-130px)] md:h-[calc(100dvh-140px)] flex flex-col bg-white rounded-3xl border border-[#E5E8EF] shadow-xs overflow-hidden max-w-md sm:max-w-2xl md:max-w-4xl mx-auto">
  <!-- Mobile Chat Header Bar -->
  <div class="p-3.5 sm:p-4 border-b border-[#E5E8EF] bg-white flex items-center justify-between gap-3 shrink-0">
    <div class="flex items-center gap-2.5 min-w-0">
      <a 
        href="/dashboard/messages" 
        class="p-2 -ml-1 rounded-xl text-[#68738A] hover:text-[#101B35] hover:bg-[#F7F6F2] transition touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center"
        aria-label="Kembali ke daftar pesan"
      >
        <ArrowLeft class="w-5 h-5" />
      </a>

      <div class="relative shrink-0">
        <div class="w-10 h-10 rounded-2xl bg-[#101B35] text-white flex items-center justify-center font-bold">
          <User class="w-5 h-5" />
        </div>
        <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
      </div>

      <div class="min-w-0">
        <div class="flex items-center gap-1.5">
          <h2 class="text-xs sm:text-sm font-extrabold text-[#101B35] truncate">Diskusi Bimbingan</h2>
          <CheckCircle2 class="w-3.5 h-3.5 text-[#3157D5] shrink-0" />
        </div>
        <p class="text-[10px] text-[#3157D5] font-bold truncate">
          Kanal Privat Terverifikasi UT
        </p>
      </div>
    </div>
  </div>

  <!-- Messages Scroll Stream -->
  <div 
    bind:this={chatBoxEl}
    class="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3.5 bg-[#F7F6F2]"
  >
    {#if isLoading}
      <div class="p-8 text-center text-xs text-[#68738A]">Memuat riwayat percakapan...</div>
    {:else if messages.length === 0}
      <div class="p-8 text-center space-y-2">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto text-[#68738A] border border-[#E5E8EF]">
          <Clock class="w-5 h-5" />
        </div>
        <p class="text-xs font-bold text-[#101B35]">Belum ada pesan dalam percakapan ini</p>
        <p class="text-[11px] text-[#68738A]">Kirimkan sapaan hangat atau pertanyaan seputar karier Anda.</p>
      </div>
    {:else}
      {#each messages as msg (msg.id)}
        {@const isMe = msg.sender_id === authStore.profile?.id}
        <div class="flex {isMe ? 'justify-end' : 'justify-start'}">
          <div class="max-w-[82%] sm:max-w-md space-y-1">
            <div class="flex items-center gap-1.5 text-[10px] text-[#68738A] {isMe ? 'justify-end' : 'justify-start'} px-1">
              <span>{isMe ? 'Anda' : (msg.sender?.full_name || 'Rekan')}</span>
              <span>•</span>
              <span>{new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div class="p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs
              {isMe ? 'bg-[#3157D5] text-white rounded-br-xs' : 'bg-white border border-[#E5E8EF] text-[#20283B] rounded-bl-xs'}">
              {msg.content}
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Docked Message Input Bar (Bottom) -->
  <div class="p-2.5 sm:p-3 border-t border-[#E5E8EF] bg-white shrink-0">
    <form onsubmit={handleSend} class="flex items-center gap-2">
      <input 
        type="text"
        bind:value={newMessage}
        placeholder="Tulis pesan Anda..."
        class="flex-1 px-4 py-3 rounded-2xl bg-[#F7F6F2] border border-[#E5E8EF] text-xs sm:text-sm text-[#20283B] outline-none focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5]/20 transition"
      />
      <button 
        type="submit"
        disabled={isSending || !newMessage.trim()}
        class="h-11 w-11 rounded-2xl bg-[#3157D5] text-white hover:bg-[#2646B8] transition shadow-xs flex items-center justify-center shrink-0 disabled:opacity-40 touch-manipulation"
        aria-label="Kirim pesan"
      >
        <Send class="w-4 h-4 stroke-[2.5]" />
      </button>
    </form>
  </div>
</div>
