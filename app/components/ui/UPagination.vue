<script setup lang="ts">
interface Props {
  totalItems: number
  perPage?: number
  modelValue: number // current page (1-based)
  maxButtons?: number
  showInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  perPage: 10,
  maxButtons: 5,
  showInfo: true,
})

const emit = defineEmits<{
  'update:modelValue': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage))

const pages = computed(() => {
  const total = totalPages.value
  const current = props.modelValue
  const max = props.maxButtons
  const pages: (number | '...')[] = []

  if (total <= max) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  const half = Math.floor((max - 2) / 2)
  let start = Math.max(2, current - half)
  let end = Math.min(total - 1, current + half)

  if (current <= half + 1) {
    end = max - 1
  } else if (current >= total - half) {
    start = total - max + 2
  }

  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)

  return pages
})

function go(page: number) {
  if (page < 1 || page > totalPages.value || page === props.modelValue) return
  emit('update:modelValue', page)
}
</script>

<template>
  <div class="flex items-center gap-4">
    <!-- Info -->
    <span v-if="showInfo" class="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500">
      {{ (modelValue - 1) * perPage + 1 }}–{{ Math.min(modelValue * perPage, totalItems) }}
      de {{ totalItems }}
    </span>

    <div class="flex items-center gap-1">
      <!-- Prev -->
      <button
        type="button"
        class="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="modelValue <= 1"
        @click="go(modelValue - 1)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Pages -->
      <template v-for="(page, i) in pages" :key="i">
        <span v-if="page === '...'" class="px-1 text-xs text-neutral-400">…</span>
        <button
          v-else
          type="button"
          class="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200"
          :class="[
            page === modelValue
              ? 'bg-neutral-950 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-200',
          ]"
          @click="go(page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        type="button"
        class="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="modelValue >= totalPages"
        @click="go(modelValue + 1)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
