<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, remove } = useToast()

const typeStyles: Record<string, { bg: string; icon: string; border: string }> = {
  success: {
    bg: 'bg-success-50',
    border: 'border-success-200',
    icon: 'text-success-500',
  },
  error: {
    bg: 'bg-error-50',
    border: 'border-error-200',
    icon: 'text-error-500',
  },
  warning: {
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    icon: 'text-warning-500',
  },
  info: {
    bg: 'bg-info-50',
    border: 'border-info-200',
    icon: 'text-info-500',
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-4 scale-95"
        enter-to-class="opacity-100 translate-x-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0 scale-100"
        leave-to-class="opacity-0 translate-x-4 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            typeStyles[toast.type]?.bg || 'bg-white',
            typeStyles[toast.type]?.border || 'border-neutral-200',
          ]"
          class="flex items-start gap-3 rounded-xl border p-4 shadow-lg"
        >
          <!-- Icon -->
          <div :class="typeStyles[toast.type]?.icon || 'text-neutral-500'" class="flex-shrink-0 mt-0.5">
            <!-- Success -->
            <svg v-if="toast.type === 'success'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Error -->
            <svg v-else-if="toast.type === 'error'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- Warning -->
            <svg v-else-if="toast.type === 'warning'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <!-- Info -->
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-900">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="text-xs text-neutral-600" :class="toast.title ? 'mt-0.5' : ''">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close -->
          <button
            type="button"
            class="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
            @click="remove(toast.id)"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
