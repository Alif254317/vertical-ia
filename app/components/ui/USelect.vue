<script setup lang="ts">
interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  options: Option[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Selecionar…',
  disabled: false,
  required: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectId = useId()

const sizeClasses: Record<string, string> = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
}
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="selectId"
      class="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500"
    >
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="focus-ring w-full appearance-none rounded-lg border bg-white pr-10 font-medium text-neutral-900 transition-colors cursor-pointer"
        :class="[
          sizeClasses[size],
          error
            ? 'border-error-400 focus:border-error-500'
            : 'border-neutral-300 hover:border-neutral-400 focus:border-neutral-500',
          disabled ? 'bg-neutral-50 opacity-50 cursor-not-allowed' : '',
          !modelValue ? 'text-neutral-400' : '',
        ]"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          :disabled="opt.disabled"
        >
          {{ opt.label }}
        </option>
      </select>

      <!-- Chevron -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-xs text-error-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-neutral-400">{{ hint }}</p>
  </div>
</template>
