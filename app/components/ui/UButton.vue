<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
  iconRight?: string
  pill?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  pill: true,
  block: false,
})

const variantClasses: Record<string, string> = {
  primary: 'bg-gradient-to-r from-neutral-700 to-neutral-800 text-neutral-200 hover:brightness-110',
  secondary: 'bg-neutral-200/50 border border-neutral-300 text-neutral-700 hover:bg-neutral-300/60',
  ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-950',
  danger: 'bg-error-600 text-white hover:bg-error-700',
  accent: 'bg-brand-500 text-white hover:bg-brand-600',
}

const sizeClasses: Record<string, string> = {
  xs: 'h-7 px-3 text-[0.65rem] gap-1.5',
  sm: 'h-8 px-4 text-xs gap-1.5',
  md: 'h-9 px-6 text-xs gap-2',
  lg: 'h-11 px-8 text-sm gap-2',
}

const shadowStyle = computed(() => {
  if (props.disabled || props.variant === 'ghost') return ''
  if (props.variant === 'primary') return 'box-shadow: var(--shadow-btn-primary);'
  if (props.variant === 'secondary') return 'box-shadow: var(--shadow-btn-secondary);'
  return ''
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="focus-ring relative inline-flex items-center justify-center font-semibold uppercase tracking-widest transition-all duration-300 whitespace-nowrap select-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      pill ? 'rounded-full' : 'rounded-lg',
      block ? 'w-full' : '',
    ]"
    :style="shadowStyle"
  >
    <!-- Slide overlay effect for primary -->
    <div
      v-if="variant === 'primary' && !disabled"
      class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
    />

    <!-- Loading spinner -->
    <Icon
      v-if="loading"
      name="lucide:loader-2"
      class="h-4 w-4 animate-spin"
    />

    <!-- Left icon -->
    <Icon
      v-else-if="icon"
      :name="icon"
      class="h-4 w-4 shrink-0"
    />

    <!-- Content -->
    <span class="relative">
      <slot />
    </span>

    <!-- Right icon -->
    <Icon
      v-if="iconRight && !loading"
      :name="iconRight"
      class="h-4 w-4 shrink-0"
    />
  </button>
</template>
