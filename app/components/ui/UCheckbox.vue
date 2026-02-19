<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  indeterminate: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxId = useId()
</script>

<template>
  <label
    :for="checkboxId"
    class="inline-flex items-start gap-2.5"
    :class="disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
  >
    <div class="relative flex-shrink-0 mt-0.5">
      <input
        :id="checkboxId"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :indeterminate="indeterminate"
        class="peer sr-only"
        @change="emit('update:modelValue', !modelValue)"
      />
      <div
        class="flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-all duration-150
               peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-950/20 peer-focus-visible:ring-offset-1"
        :class="[
          modelValue || indeterminate
            ? 'border-neutral-950 bg-neutral-950'
            : 'border-neutral-400 bg-white peer-hover:border-neutral-500',
        ]"
      >
        <!-- Check mark -->
        <svg
          v-if="modelValue && !indeterminate"
          class="h-3 w-3 text-white"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <!-- Indeterminate dash -->
        <svg
          v-if="indeterminate"
          class="h-3 w-3 text-white"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
        </svg>
      </div>
    </div>

    <div v-if="label || description">
      <span v-if="label" class="text-sm font-medium text-neutral-900 select-none">{{ label }}</span>
      <p v-if="description" class="text-xs text-neutral-500 mt-0.5 select-none">{{ description }}</p>
    </div>
  </label>
</template>

<style scoped>
.h-4\.5 { height: 1.125rem; }
.w-4\.5 { width: 1.125rem; }
</style>
