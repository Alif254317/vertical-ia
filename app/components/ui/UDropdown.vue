<script setup lang="ts">
interface DropdownItem {
  label: string
  icon?: string
  action?: () => void
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

interface Props {
  items: DropdownItem[]
  align?: 'left' | 'right'
  width?: string
}

withDefaults(defineProps<Props>(), {
  align: 'left',
  width: '12rem',
})

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function handleSelect(item: DropdownItem) {
  if (item.disabled || item.divider) return
  item.action?.()
  close()
}

// Close on click outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
      close()
    }
  })
})

// Close on Escape
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
})
</script>

<template>
  <div ref="triggerRef" class="relative inline-block">
    <!-- Trigger -->
    <div @click="toggle">
      <slot name="trigger">
        <button
          type="button"
          class="focus-ring inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <slot name="trigger-label">Opções</slot>
          <Icon name="lucide:chevron-down" class="h-3.5 w-3.5" />
        </button>
      </slot>
    </div>

    <!-- Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-[var(--z-dropdown)] mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
        :class="align === 'right' ? 'right-0' : 'left-0'"
        :style="{ minWidth: width }"
      >
        <template v-for="(item, idx) in items" :key="idx">
          <!-- Divider -->
          <div v-if="item.divider" class="my-1 border-t border-neutral-100" />

          <!-- Item -->
          <button
            v-else
            type="button"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors"
            :class="[
              item.disabled
                ? 'opacity-40 cursor-not-allowed'
                : item.danger
                  ? 'text-error-600 hover:bg-error-50'
                  : 'text-neutral-700 hover:bg-neutral-50',
            ]"
            :disabled="item.disabled"
            @click="handleSelect(item)"
          >
            <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4 shrink-0" />
            <span>{{ item.label }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>
