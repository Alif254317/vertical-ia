import { ref, type Ref } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const toasts: Ref<Toast[]> = ref([])

let counter = 0

function addToast(toast: Omit<Toast, 'id'>) {
  const id = `toast-${++counter}-${Date.now()}`
  const duration = toast.duration ?? 5000

  toasts.value.push({ ...toast, id })

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }

  return id
}

function removeToast(id: string) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) toasts.value.splice(index, 1)
}

function clearToasts() {
  toasts.value = []
}

export function useToast() {
  return {
    toasts,
    add: addToast,
    remove: removeToast,
    clear: clearToasts,
    success: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'success', title, message, duration }),
    error: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'error', title, message, duration }),
    warning: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'warning', title, message, duration }),
    info: (title: string, message?: string, duration?: number) =>
      addToast({ type: 'info', title, message, duration }),
  }
}
