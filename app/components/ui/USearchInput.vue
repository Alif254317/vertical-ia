<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  loading?: boolean
  shortcut?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pesquisar…',
  loading: false,
  shortcut: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function clear() {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    emit('search', props.modelValue)
  }
}

// Keyboard shortcut (e.g. "k" → Cmd+K / Ctrl+K)
onMounted(() => {
  if (!props.shortcut) return
  function handler(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === props.shortcut) {
      e.preventDefault()
      inputRef.value?.focus()
    }
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})
</script>

<template>
  <div class="relative">
    <!-- Search icon -->
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
      <svg
        class="h-4 w-4 text-neutral-400"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <input
      ref="inputRef"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="focus-ring h-10 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-20 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors hover:border-neutral-400 focus:border-neutral-500 disabled:opacity-40 disabled:cursor-not-allowed"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown="onKeydown"
    />

    <!-- Right side: clear + shortcut -->
    <div class="absolute inset-y-0 right-0 flex items-center gap-1.5 pr-3">
      <!-- Loading spinner -->
      <svg
        v-if="loading"
        class="h-4 w-4 animate-spin text-neutral-400"
        fill="none" viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>

      <!-- Clear button -->
      <button
        v-if="modelValue && !loading"
        type="button"
        class="flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 transition-colors"
        @click="clear"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Shortcut hint -->
      <kbd
        v-if="shortcut && !modelValue"
        class="hidden sm:inline-flex h-5 items-center rounded border border-neutral-300 bg-neutral-100 px-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-neutral-400"
      >
        ⌘{{ shortcut.toUpperCase() }}
      </kbd>
    </div>
  </div>
</template>
