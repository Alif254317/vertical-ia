<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  description?: string
  actionLabel?: string
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Nenhum item encontrado',
  description: '',
  actionLabel: '',
  compact: false,
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center text-center"
    :class="compact ? 'py-8 px-4' : 'py-16 px-6'"
  >
    <!-- Icon slot or default -->
    <div
      class="mb-4 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400"
      :class="compact ? 'h-12 w-12' : 'h-16 w-16'"
    >
      <slot name="icon">
        <svg
          :class="compact ? 'h-5 w-5' : 'h-7 w-7'"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
    </div>

    <h3
      class="font-semibold text-neutral-900"
      :class="compact ? 'text-sm' : 'text-base'"
    >
      {{ title }}
    </h3>

    <p
      v-if="description"
      class="mt-1 max-w-sm text-neutral-500"
      :class="compact ? 'text-xs' : 'text-sm'"
    >
      {{ description }}
    </p>

    <!-- Action button -->
    <button
      v-if="actionLabel"
      type="button"
      class="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
      @click="emit('action')"
    >
      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {{ actionLabel }}
    </button>

    <!-- Extra slot for custom content -->
    <slot />
  </div>
</template>
