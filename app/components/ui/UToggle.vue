<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

const trackSize: Record<string, string> = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
}
const thumbSize: Record<string, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
}
const thumbTranslate: Record<string, string> = {
  sm: 'translate-x-4',
  md: 'translate-x-5',
}
</script>

<template>
  <div
    class="flex items-start gap-3"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
    @click="toggle"
  >
    <!-- Track -->
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="focus-ring relative inline-flex flex-shrink-0 items-center rounded-full transition-colors duration-200"
      :class="[
        trackSize[size],
        modelValue ? 'bg-neutral-950' : 'bg-neutral-300',
      ]"
    >
      <!-- Thumb -->
      <span
        class="inline-block rounded-full bg-white shadow-sm transition-transform duration-200"
        :class="[
          thumbSize[size],
          modelValue ? thumbTranslate[size] : 'translate-x-1',
        ]"
      />
    </button>

    <!-- Label -->
    <div v-if="label || description" class="select-none">
      <span v-if="label" class="text-sm font-medium text-neutral-900">{{ label }}</span>
      <p v-if="description" class="text-xs text-neutral-500 mt-0.5">{{ description }}</p>
    </div>
  </div>
</template>
