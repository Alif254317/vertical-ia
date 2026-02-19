<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  persistent?: boolean // no click outside to close
  hideClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  persistent: false,
  hideClose: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick() {
  if (!props.persistent) close()
}

// Escape key
onMounted(() => {
  function handler(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.modelValue && !props.persistent) close()
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})

// Lock body scroll
watch(() => props.modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
          @click="onOverlayClick"
        />

        <!-- Panel -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="modelValue"
            :class="[sizeClasses[size]]"
            class="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
          >
            <!-- Header -->
            <div v-if="title || !hideClose" class="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-4">
              <div>
                <h2 v-if="title" class="text-sm font-bold uppercase tracking-widest text-neutral-900">
                  {{ title }}
                </h2>
                <p v-if="description" class="mt-1 text-xs text-neutral-500">{{ description }}</p>
              </div>
              <button
                v-if="!hideClose"
                type="button"
                class="focus-ring flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                @click="close"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-5">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
              <slot name="footer" :close="close" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
