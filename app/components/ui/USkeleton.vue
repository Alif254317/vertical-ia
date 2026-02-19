<script setup lang="ts">
interface Props {
  variant?: 'text' | 'circle' | 'rect' | 'card'
  width?: string
  height?: string
  lines?: number
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '',
  height: '',
  lines: 1,
  animate: true,
})

const baseClass = 'rounded bg-neutral-200'
const shimmerClass = 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-[shimmer_1.5s_infinite]'
</script>

<template>
  <!-- Text lines -->
  <div v-if="variant === 'text'" class="space-y-2.5">
    <div
      v-for="n in lines"
      :key="n"
      :class="[baseClass, animate ? shimmerClass : '']"
      :style="{
        width: n === lines && lines > 1 ? '75%' : (width || '100%'),
        height: height || '0.875rem',
      }"
    />
  </div>

  <!-- Circle (avatar placeholder) -->
  <div
    v-else-if="variant === 'circle'"
    :class="[baseClass, animate ? shimmerClass : '', 'rounded-full']"
    :style="{
      width: width || '2.5rem',
      height: height || width || '2.5rem',
    }"
  />

  <!-- Rectangle (image placeholder) -->
  <div
    v-else-if="variant === 'rect'"
    :class="[baseClass, animate ? shimmerClass : '', 'rounded-xl']"
    :style="{
      width: width || '100%',
      height: height || '8rem',
    }"
  />

  <!-- Card skeleton -->
  <div
    v-else-if="variant === 'card'"
    class="rounded-2xl border border-neutral-200 bg-white p-5"
  >
    <div class="flex items-center gap-3 mb-4">
      <div :class="[baseClass, animate ? shimmerClass : '', 'h-10 w-10 rounded-full']" />
      <div class="flex-1 space-y-2">
        <div :class="[baseClass, animate ? shimmerClass : '', 'h-3 w-1/3']" />
        <div :class="[baseClass, animate ? shimmerClass : '', 'h-2.5 w-1/4']" />
      </div>
    </div>
    <div class="space-y-2.5">
      <div :class="[baseClass, animate ? shimmerClass : '', 'h-3 w-full']" />
      <div :class="[baseClass, animate ? shimmerClass : '', 'h-3 w-5/6']" />
      <div :class="[baseClass, animate ? shimmerClass : '', 'h-3 w-2/3']" />
    </div>
  </div>
</template>
