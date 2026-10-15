export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

let toasts = $state<Toast[]>([]);

export const toastStore = {
  get items() {
    return toasts;
  },

  add(message: string, type: Toast['type'] = 'info', durationMs = 4000) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    toasts.push({ id, type, message });

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  },

  success(message: string, durationMs = 4000) {
    this.add(message, 'success', durationMs);
  },

  error(message: string, durationMs = 5000) {
    this.add(message, 'error', durationMs);
  },

  warning(message: string, durationMs = 4500) {
    this.add(message, 'warning', durationMs);
  },

  info(message: string, durationMs = 4000) {
    this.add(message, 'info', durationMs);
  },

  remove(id: string) {
    const idx = toasts.findIndex(t => t.id === id);
    if (idx !== -1) {
      toasts.splice(idx, 1);
    }
  }
};
