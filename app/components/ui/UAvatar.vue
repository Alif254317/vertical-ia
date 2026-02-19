<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'full' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  size: 'md',
  rounded: 'full',
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
})

const sizeClasses: Record<string, string> = {
  xs: 'h-6 w-6 text-[0.5rem]',
  sm: 'h-8 w-8 text-[0.6rem]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-base',
}

const roundedClasses: Record<string, string> = {
  full: 'rounded-full',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
}

const statusColor: Record<string, string> = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  away: 'bg-warning-500',
  busy: 'bg-error-500',
}

const statusSize: Record<string, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
}

const imgError = ref(false)
</script>

<template>
  <div class="relative inline-flex flex-shrink-0">
    <!-- Image -->
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="alt || name || 'Avatar'"
      :class="[sizeClasses[size], roundedClasses[rounded], 'object-cover']"
      @error="imgError = true"
    />

    <!-- Fallback initials -->
    <div
      v-else
      :class="[
        sizeClasses[size],
        roundedClasses[rounded],
        'flex items-center justify-center bg-neutral-200 font-bold uppercase tracking-wider text-neutral-600',
      ]"
    >
      {{ initials }}
    </div>

    <!-- Status indicator -->
    <span
      v-if="status"
      :class="[
        statusColor[status],
        statusSize[size],
        'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
      ]"
    />
  </div>
</template>
