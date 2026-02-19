<script setup lang="ts">
interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  disabled?: boolean
  variant?: 'default' | 'brand'
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  showValue: false,
  disabled: false,
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const percentage = computed(() =>
  ((props.modelValue - props.min) / (props.max - props.min)) * 100,
)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="mb-1.5 flex items-center justify-between">
      <label v-if="label" class="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500">
        {{ label }}
      </label>
      <span v-if="showValue" class="text-xs font-mono text-neutral-600">
        {{ modelValue }}
      </span>
    </div>
    <div class="relative flex items-center">
      <input
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        class="slider w-full cursor-pointer appearance-none bg-transparent"
        :class="[
          variant === 'brand' ? 'slider--brand' : 'slider--default',
          disabled ? 'opacity-40 cursor-not-allowed' : '',
        ]"
        @input="onInput"
      />
    </div>
  </div>
</template>

<style scoped>
/* Track */
.slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 9999px;
  background: linear-gradient(
    to right,
    var(--track-fill) 0%,
    var(--track-fill) v-bind(percentage + '%'),
    #e5e5e5 v-bind(percentage + '%'),
    #e5e5e5 100%
  );
}
.slider::-moz-range-track {
  height: 6px;
  border-radius: 9999px;
  background: #e5e5e5;
}
.slider::-moz-range-progress {
  height: 6px;
  border-radius: 9999px;
  background: var(--track-fill);
}

/* Thumb */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: white;
  border: 2px solid var(--track-fill);
  margin-top: -6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s, box-shadow 0.15s;
}
.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: white;
  border: 2px solid var(--track-fill);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s, box-shadow 0.15s;
}
.slider:hover::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.slider:hover::-moz-range-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Variants */
.slider--default { --track-fill: #0a0a0a; }
.slider--brand { --track-fill: #f97316; }
</style>
