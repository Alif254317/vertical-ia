<script setup lang="ts">
interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // MB
  label?: string
  hint?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  multiple: false,
  maxSize: 10,
  label: 'Enviar arquivo',
  hint: 'Arraste ou clique para selecionar',
  disabled: false,
})

const emit = defineEmits<{
  upload: [files: File[]]
  error: [message: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

function open() {
  if (props.disabled) return
  inputRef.value?.click()
}

function handleFiles(fileList: FileList | null) {
  if (!fileList?.length) return
  const files = Array.from(fileList)
  const oversized = files.filter(f => f.size > props.maxSize * 1024 * 1024)
  if (oversized.length) {
    emit('error', `Arquivo excede o limite de ${props.maxSize}MB`)
    return
  }
  emit('upload', files)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  if (props.disabled) return
  handleFiles(e.dataTransfer?.files ?? null)
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  handleFiles(target.files)
  target.value = ''
}
</script>

<template>
  <div>
    <label v-if="label" class="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500">
      {{ label }}
    </label>
    <div
      role="button"
      tabindex="0"
      class="focus-ring group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 transition-all duration-200"
      :class="[
        dragging
          ? 'border-brand-400 bg-brand-50'
          : 'border-neutral-300 bg-neutral-100/50 hover:border-neutral-400 hover:bg-neutral-100',
        disabled ? 'opacity-40 cursor-not-allowed' : '',
      ]"
      @click="open"
      @keydown.enter="open"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <!-- Icon -->
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 transition-colors group-hover:bg-neutral-300">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <span class="text-sm font-medium text-neutral-600">{{ hint }}</span>
      <span class="text-[0.65rem] uppercase tracking-widest text-neutral-400">
        Máx {{ maxSize }}MB
      </span>

      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="hidden"
        @change="onInputChange"
      />
    </div>
  </div>
</template>
