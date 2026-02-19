<script setup lang="ts">
interface Tab {
  key: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

interface Props {
  tabs: Tab[]
  modelValue: string
  variant?: 'pills' | 'underline'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'pills',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function select(tab: Tab) {
  if (tab.disabled) return
  emit('update:modelValue', tab.key)
}
</script>

<template>
  <div>
    <!-- Tab navigation -->
    <div
      :class="[
        'flex gap-1',
        variant === 'pills' ? 'bg-neutral-200/50 rounded-full p-1 border border-neutral-300' : 'border-b border-neutral-200',
      ]"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="focus-ring relative inline-flex items-center gap-2 font-semibold uppercase tracking-widest transition-all duration-200 whitespace-nowrap"
        :class="[
          size === 'sm' ? 'text-[0.65rem] px-3 py-1.5' : 'text-xs px-4 py-2',
          variant === 'pills'
            ? modelValue === tab.key
              ? 'bg-neutral-950 text-white rounded-full shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700 rounded-full'
            : modelValue === tab.key
              ? 'text-neutral-950 border-b-2 border-neutral-950 -mb-px'
              : 'text-neutral-500 hover:text-neutral-700',
          tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        ]"
        :disabled="tab.disabled"
        @click="select(tab)"
      >
        <Icon v-if="tab.icon" :name="tab.icon" class="h-3.5 w-3.5" />
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.badge !== undefined"
          class="inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold leading-none"
          :class="modelValue === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-300 text-neutral-600'"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- Tab content -->
    <div class="mt-4">
      <template v-for="tab in tabs" :key="tab.key">
        <div v-if="modelValue === tab.key">
          <slot :name="tab.key" />
        </div>
      </template>
    </div>
  </div>
</template>
