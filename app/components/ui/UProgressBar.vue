<script setup lang="ts">
interface Props {
  value: number           // 0–100
  max?: number
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md'
  showLabel?: boolean
  label?: string
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  variant: 'default',
  size: 'sm',
  showLabel: false,
  animated: false,
})

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))

const barColor: Record<string, string> = {
  default: 'bg-neutral-950',
  brand: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
}

const trackHeight: Record<string, string> = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
}
</script>

<template>
  <div class="w-full">
    <div v-if="showLabel || label" class="mb-1.5 flex items-center justify-between">
      <span class="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500">
        {{ label || 'Progresso' }}
      </span>
      <span class="text-xs font-mono text-neutral-500">
        {{ Math.round(percentage) }}%
      </span>
    </div>
    <div :class="[trackHeight[size], 'w-full rounded-full bg-neutral-200 overflow-hidden']">
      <div
        :class="[
          barColor[variant],
          trackHeight[size],
          'rounded-full transition-all duration-500 ease-out',
          animated ? 'relative overflow-hidden' : '',
        ]"
        :style="{ width: `${percentage}%` }"
      >
        <!-- Animated shimmer -->
        <div
          v-if="animated && percentage > 0 && percentage < 100"
          class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style="animation: shimmer 1.5s infinite"
        />
      </div>
    </div>
  </div>
</template>
