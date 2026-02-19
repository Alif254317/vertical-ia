<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  icon?: string
  iconRight?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = useId()

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
      :for="inputId"
      class="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500"
    >
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>

    <div class="relative">
      <!-- Left icon -->
      <div v-if="icon" class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon :name="icon" class="h-4 w-4 text-neutral-400" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        class="focus-ring w-full rounded-lg border bg-white font-medium text-neutral-900 placeholder:text-neutral-400 transition-colors"
        :class="[
          sizeClasses[size],
          icon ? 'pl-10' : '',
          iconRight ? 'pr-10' : '',
          error
            ? 'border-error-400 focus:border-error-500'
            : 'border-neutral-300 hover:border-neutral-400 focus:border-neutral-500',
          disabled ? 'bg-neutral-50 opacity-50 cursor-not-allowed' : '',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <!-- Right icon -->
      <div v-if="iconRight" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Icon :name="iconRight" class="h-4 w-4 text-neutral-400" />
      </div>
    </div>

    <!-- Hint / Error -->
    <p v-if="error" class="mt-1 text-xs text-error-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-neutral-400">{{ hint }}</p>
  </div>
</template>
