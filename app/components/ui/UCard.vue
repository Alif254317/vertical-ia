<script setup lang="ts">
interface Props {
  variant?: 'light' | 'dark' | 'accent' | 'outline'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'lg' | 'xl' | '2xl' | '3xl'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'light',
  hover: false,
  padding: 'md',
  rounded: '2xl',
})

const paddings: Record<string, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const roundedMap: Record<string, string> = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const variantClasses: Record<string, string> = {
  light: 'bg-neutral-200/50 border border-neutral-300 text-neutral-900',
  dark: 'bg-neutral-900 border border-neutral-800 text-white',
  accent: 'bg-brand-400 border border-white/15 text-white shadow-lg shadow-brand-900/40',
  outline: 'bg-white border border-neutral-200 text-neutral-900',
}

const hoverClasses: Record<string, string> = {
  light: 'hover:bg-neutral-950 hover:text-white hover:border-neutral-950',
  dark: 'hover:bg-neutral-800 hover:border-neutral-700',
  accent: 'hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-900/50',
  outline: 'hover:border-neutral-400 hover:shadow-md',
}
</script>

<template>
  <div
    :class="[
      variantClasses[variant],
      paddings[padding],
      roundedMap[rounded],
      hover ? [hoverClasses[variant], 'transition-all duration-300 cursor-pointer'] : '',
    ]"
  >
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>
