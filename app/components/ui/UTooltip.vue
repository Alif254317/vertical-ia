<script setup lang="ts">
interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 200,
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function show() {
  timer = setTimeout(() => { visible.value = true }, props.delay)
}
function hide() {
  if (timer) clearTimeout(timer)
  visible.value = false
}

const positionClasses: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}
</script>

<template>
  <div
    class="relative inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible"
        role="tooltip"
        class="pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-neutral-950 px-2.5 py-1.5 text-[0.7rem] font-medium text-white shadow-lg"
        :class="positionClasses[position]"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>
