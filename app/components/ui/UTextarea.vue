<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  rows?: number
  maxlength?: number
  disabled?: boolean
  required?: boolean
  resize?: 'none' | 'vertical' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  disabled: false,
  required: false,
  resize: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaId = useId()

const charCount = computed(() => props.modelValue?.length ?? 0)
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="textareaId"
      class="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500"
    >
      {{ label }}
      <span v-if="required" class="text-error-500">*</span>
    </label>

    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength"
      :disabled="disabled"
      :required="required"
      class="focus-ring w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 transition-colors"
      :class="[
        error
          ? 'border-error-400 focus:border-error-500'
          : 'border-neutral-300 hover:border-neutral-400 focus:border-neutral-500',
        disabled ? 'bg-neutral-50 opacity-50 cursor-not-allowed' : '',
      ]"
      :style="{ resize }"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <div class="mt-1 flex items-center justify-between">
      <p v-if="error" class="text-xs text-error-500">{{ error }}</p>
      <p v-else-if="hint" class="text-xs text-neutral-400">{{ hint }}</p>
      <span v-else />
      <span v-if="maxlength" class="text-[0.65rem] font-mono text-neutral-400">
        {{ charCount }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>
