<script setup lang="ts">
interface Props {
  variant?: 'light' | 'dark' | 'brand' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
  removable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'light',
  size: 'md',
  dot: false,
  removable: false,
})

const emit = defineEmits<{
  remove: []
}>()

const variantClasses: Record<string, string> = {
  light: 'bg-[#E6E6E6] border-neutral-400 text-neutral-700',
  dark: 'bg-neutral-950 border-neutral-800 text-white',
  brand: 'bg-brand-50 border-brand-200 text-brand-700',
  success: 'bg-success-50 border-success-200 text-success-700',
  warning: 'bg-warning-50 border-warning-200 text-warning-700',
  error: 'bg-error-50 border-error-200 text-error-700',
  info: 'bg-info-50 border-info-200 text-info-700',
}

const dotColors: Record<string, string> = {
  light: 'bg-neutral-500',
  dark: 'bg-neutral-400',
  brand: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
}

const sizeClasses: Record<string, string> = {
  sm: 'text-[0.6rem] px-2 py-0.5',
  md: 'text-[0.65rem] px-2.5 py-1',
}
</script>

<template>
  <span
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      'inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-widest leading-none',
    ]"
  >
    <!-- Status dot -->
    <span
      v-if="dot"
      :class="[dotColors[variant], 'h-1.5 w-1.5 rounded-full flex-shrink-0']"
    />

    <slot />

    <!-- Remove button -->
    <button
      v-if="removable"
      type="button"
      class="ml-0.5 -mr-1 flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors hover:bg-black/10"
      @click.stop="emit('remove')"
    >
      <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
</template>
