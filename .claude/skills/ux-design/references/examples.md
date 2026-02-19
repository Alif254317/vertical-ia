# Exemplos UX — Vue 3 + Tailwind CSS

Exemplos práticos dos patterns da skill `ux-design` em Vue 3 `<script setup lang="ts">` + Tailwind CSS.

---

## 1. Empty States

### First-use — Sem projetos

```vue
<!-- app/components/shared/EmptyStateFirstUse.vue -->
<script setup lang="ts">
import { FolderPlusIcon } from 'lucide-vue-next'

interface Props {
  title?: string
  description?: string
  ctaLabel?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Nenhum projeto ainda',
  description: 'Aqui é onde seus projetos vão aparecer. Comece criando o primeiro.',
  ctaLabel: 'Criar primeiro projeto',
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div
      class="mb-6 flex h-24 w-24 items-center justify-center rounded-full
             bg-gradient-to-br from-primary-100 to-primary-200
             dark:from-primary-900 dark:to-primary-800"
    >
      <FolderPlusIcon class="h-12 w-12 text-primary-500" aria-hidden="true" />
    </div>

    <h2 class="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
      {{ title }}
    </h2>

    <p class="mb-6 max-w-sm text-neutral-500 dark:text-neutral-400">
      {{ description }}
    </p>

    <button
      class="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white
             transition-colors duration-200
             hover:bg-primary-700 active:bg-primary-800
             focus:outline-none focus-visible:outline-2
             focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      @click="emit('action')"
    >
      {{ ctaLabel }}
    </button>

    <p class="mt-4 text-sm text-neutral-400 dark:text-neutral-500">
      Você tem 2 créditos gratuitos para começar
    </p>
  </div>
</template>
```

### Busca — Sem resultados

```vue
<!-- app/components/shared/EmptyStateNoResults.vue -->
<script setup lang="ts">
import { SearchIcon } from 'lucide-vue-next'

interface Props {
  query: string
}

defineProps<Props>()

const emit = defineEmits<{
  clear: []
  browseAll: []
}>()
</script>

<template>
  <div class="flex flex-col items-center py-12 text-center">
    <SearchIcon
      class="mb-4 h-12 w-12 text-neutral-300 dark:text-neutral-600"
      aria-hidden="true"
    />

    <h3 class="mb-1 text-lg font-medium text-neutral-900 dark:text-neutral-100">
      Nenhum resultado para "{{ query }}"
    </h3>

    <p class="mb-4 text-neutral-500 dark:text-neutral-400">
      Tente palavras-chave diferentes ou verifique a ortografia
    </p>

    <div class="flex gap-3">
      <button
        class="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium
               text-neutral-700 transition-colors duration-200
               hover:bg-neutral-50 dark:border-neutral-700
               dark:text-neutral-300 dark:hover:bg-neutral-800
               focus:outline-none focus-visible:outline-2
               focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        @click="emit('clear')"
      >
        Limpar busca
      </button>
      <button
        class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white
               transition-colors duration-200 hover:bg-primary-700
               focus:outline-none focus-visible:outline-2
               focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        @click="emit('browseAll')"
      >
        Ver todos
      </button>
    </div>
  </div>
</template>
```

### Tarefas — Tudo concluído

```vue
<!-- app/components/shared/EmptyStateAllDone.vue -->
<script setup lang="ts">
import { CheckCircleIcon } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center py-16 text-center">
    <div
      class="mb-6 flex h-20 w-20 items-center justify-center rounded-full
             bg-success-50 dark:bg-success-500/10"
    >
      <CheckCircleIcon class="h-10 w-10 text-success-500" aria-hidden="true" />
    </div>

    <h2 class="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
      Tudo em dia!
    </h2>

    <p class="text-neutral-500 dark:text-neutral-400">
      Você completou todas as tarefas. Hora de um café.
    </p>
  </div>
</template>
```

---

## 2. Loading States

### Skeleton Genérico

```vue
<!-- app/components/base/BaseSkeleton.vue -->
<script setup lang="ts">
interface Props {
  class?: string
}
defineProps<Props>()
</script>

<template>
  <div
    :class="[
      'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800',
      $props.class,
    ]"
    aria-hidden="true"
  />
</template>
```

### Skeleton de Card

```vue
<!-- app/components/base/BaseCardSkeleton.vue -->
<script setup lang="ts">
import BaseSkeleton from '~/app/components/base/BaseSkeleton.vue'
</script>

<template>
  <div class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
    <BaseSkeleton class="mb-4 aspect-video w-full rounded-lg" />
    <BaseSkeleton class="mb-2 h-5 w-3/4" />
    <BaseSkeleton class="mb-1 h-4 w-full" />
    <BaseSkeleton class="h-4 w-2/3" />
    <BaseSkeleton class="mt-4 h-10 w-full rounded-lg" />
  </div>
</template>
```

### Grid com Loading State

```vue
<script setup lang="ts">
import BaseCardSkeleton from '~/app/components/base/BaseCardSkeleton.vue'
import ProductCard from '~/app/components/product/ProductCard.vue'
import { useProducts } from '~/app/composables/useProducts'

const { products, isLoading } = useProducts()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
    <template v-if="isLoading">
      <BaseCardSkeleton v-for="i in 6" :key="i" />
    </template>
    <template v-else>
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </template>
  </div>
</template>
```

---

## 3. Onboarding Checklist

```vue
<!-- app/components/shared/OnboardingChecklist.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, ChevronRightIcon } from 'lucide-vue-next'

interface Task {
  id: string
  label: string
  done: boolean
}

interface Props {
  tasks: Task[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  taskClick: [taskId: string]
}>()

const completedCount = computed(() => props.tasks.filter((t) => t.done).length)
const progressPercent = computed(
  () => (completedCount.value / props.tasks.length) * 100,
)
</script>

<template>
  <div
    class="max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm
           dark:border-neutral-800 dark:bg-neutral-900"
  >
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-semibold text-neutral-900 dark:text-neutral-100">
        Primeiros passos
      </h3>
      <span class="text-sm text-neutral-500 dark:text-neutral-400">
        {{ completedCount }}/{{ tasks.length }}
      </span>
    </div>

    <!-- Progress bar -->
    <div
      class="mb-6 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"
      role="progressbar"
      :aria-valuenow="progressPercent"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Progresso: ${completedCount} de ${tasks.length} tarefas`"
    >
      <div
        class="h-full rounded-full bg-primary-500 transition-all duration-500"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <!-- Tasks -->
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task.id">
        <button
          :class="[
            'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
            task.done
              ? 'bg-neutral-50 dark:bg-neutral-800/50'
              : 'cursor-pointer bg-primary-50 hover:bg-primary-100 dark:bg-primary-950 dark:hover:bg-primary-900',
          ]"
          :disabled="task.done"
          @click="!task.done && emit('taskClick', task.id)"
        >
          <div
            :class="[
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
              task.done
                ? 'bg-success-500'
                : 'border-2 border-primary-300 bg-white dark:border-primary-600 dark:bg-neutral-900',
            ]"
          >
            <CheckIcon v-if="task.done" class="h-4 w-4 text-white" aria-hidden="true" />
          </div>

          <span
            :class="[
              task.done
                ? 'text-neutral-400 line-through dark:text-neutral-500'
                : 'text-neutral-700 dark:text-neutral-300',
            ]"
          >
            {{ task.label }}
          </span>

          <ChevronRightIcon
            v-if="!task.done"
            class="ml-auto h-5 w-5 text-neutral-400"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
```

**Uso:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tasks = ref([
  { id: '1', label: 'Faça upload da primeira imagem', done: true },
  { id: '2', label: 'Gere uma variação', done: false },
  { id: '3', label: 'Salve no seu projeto', done: false },
  { id: '4', label: 'Baixe sua criação', done: false },
])

function handleTaskClick(taskId: string) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) task.done = true
}
</script>

<template>
  <OnboardingChecklist :tasks="tasks" @task-click="handleTaskClick" />
</template>
```

---

## 4. Progressive Disclosure — Accordion

```vue
<!-- app/components/shared/DisclosureSection.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next'

interface Props {
  title: string
  description?: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
})

const isOpen = ref(props.defaultOpen)
const contentId = useId()
const triggerId = useId()
</script>

<template>
  <div class="border-b border-neutral-200 last:border-0 dark:border-neutral-800">
    <button
      :id="triggerId"
      class="flex w-full items-center justify-between py-4 text-left
             focus:outline-none focus-visible:outline-2
             focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      @click="isOpen = !isOpen"
    >
      <div>
        <h3 class="font-medium text-neutral-900 dark:text-neutral-100">
          {{ title }}
        </h3>
        <p v-if="description" class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ description }}
        </p>
      </div>
      <ChevronDownIcon
        :class="[
          'h-5 w-5 text-neutral-400 transition-transform duration-200',
          isOpen && 'rotate-180',
        ]"
        aria-hidden="true"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-300 ease-out overflow-hidden"
      leave-active-class="transition-all duration-200 ease-in overflow-hidden"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-96 opacity-100"
      leave-from-class="max-h-96 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div
        v-show="isOpen"
        :id="contentId"
        role="region"
        :aria-labelledby="triggerId"
        class="pb-4 pl-4"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
```

**Uso:**

```vue
<DisclosureSection title="Notificações" description="Gerencie como você recebe alertas">
  <!-- settings de notificações -->
</DisclosureSection>

<DisclosureSection title="Privacidade" description="Controle quem vê suas informações">
  <!-- settings de privacidade -->
</DisclosureSection>
```

---

## 5. Botão com Loading States

```vue
<!-- app/components/base/BaseButton.vue -->
<script setup lang="ts">
import { LoaderCircleIcon, CheckIcon } from 'lucide-vue-next'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'
type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface Props {
  state?: ButtonState
  variant?: ButtonVariant
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  state: 'idle',
  variant: 'primary',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses: Record<ButtonVariant, string> = {
  primary: `bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800
            active:scale-[0.98]`,
  secondary: `border border-neutral-300 text-neutral-700 bg-white
              hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300
              dark:bg-neutral-900 dark:hover:bg-neutral-800`,
  ghost: `text-primary-600 hover:bg-primary-50 dark:text-primary-400
          dark:hover:bg-primary-950`,
}
</script>

<template>
  <button
    :class="[
      'relative inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3',
      'text-sm font-medium transition-all duration-200',
      'focus:outline-none focus-visible:outline-2',
      'focus-visible:outline-offset-2 focus-visible:outline-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      variantClasses[variant],
    ]"
    :disabled="disabled || state === 'loading'"
    @click="emit('click', $event)"
  >
    <!-- Loading -->
    <template v-if="state === 'loading'">
      <span class="opacity-0"><slot /></span>
      <div class="absolute inset-0 flex items-center justify-center">
        <LoaderCircleIcon class="h-5 w-5 animate-spin" aria-hidden="true" />
      </div>
      <span class="sr-only">Carregando...</span>
    </template>

    <!-- Success -->
    <template v-else-if="state === 'success'">
      <CheckIcon class="h-5 w-5 text-success-500" aria-hidden="true" />
      <span>Feito!</span>
    </template>

    <!-- Default -->
    <template v-else>
      <slot />
    </template>
  </button>
</template>
```

**Uso:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'
const btnState = ref<ButtonState>('idle')

async function handleSave() {
  btnState.value = 'loading'
  try {
    await $fetch('/api/data', { method: 'POST', body: {} })
    btnState.value = 'success'
    setTimeout(() => (btnState.value = 'idle'), 2000)
  } catch {
    btnState.value = 'error'
    setTimeout(() => (btnState.value = 'idle'), 3000)
  }
}
</script>

<template>
  <BaseButton :state="btnState" @click="handleSave">
    Salvar alterações
  </BaseButton>
</template>
```

---

## 6. Input com Validação Inline

```vue
<!-- app/components/base/BaseInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
  label: string
  type?: string
  placeholder?: string
  error?: string
  success?: boolean
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: '',
  success: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const inputId = useId()
const errorId = useId()
</script>

<template>
  <div class="space-y-1">
    <label
      :for="inputId"
      class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
    >
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-invalid="!!error"
        :aria-describedby="error ? errorId : undefined"
        :aria-required="required"
        :class="[
          'w-full rounded-md border px-4 py-2.5 text-sm transition-colors duration-200',
          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
          'focus:outline-none focus:ring-2',
          'dark:bg-neutral-900 dark:text-neutral-100',
          error
            ? 'border-error-300 focus:ring-error-500 dark:border-error-700'
            : success
              ? 'border-success-300 focus:ring-success-500 dark:border-success-700'
              : 'border-neutral-300 focus:ring-primary-500 dark:border-neutral-700',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur')"
      />

      <!-- Success icon -->
      <svg
        v-if="success && !error"
        class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success-500"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <!-- Error icon -->
      <svg
        v-if="error"
        class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-error-500"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="text-sm text-error-600 dark:text-error-500"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
```

**Uso com validação:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const emailError = ref('')
const emailValid = ref(false)

function validateEmail() {
  if (!email.value) {
    emailError.value = 'O email é obrigatório'
    emailValid.value = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Use um email válido, ex: nome@email.com'
    emailValid.value = false
  } else {
    emailError.value = ''
    emailValid.value = true
  }
}
</script>

<template>
  <BaseInput
    v-model="email"
    label="Email"
    type="email"
    placeholder="seu@email.com"
    :error="emailError"
    :success="emailValid"
    required
    @blur="validateEmail"
  />
</template>
```

---

## 7. Toast Notification

```vue
<!-- app/components/shared/AppToast.vue -->
<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from 'lucide-vue-next'

type ToastType = 'success' | 'error' | 'info'

interface Props {
  type: ToastType
  message: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const config: Record<ToastType, { bg: string; icon: typeof CheckCircleIcon; iconColor: string }> = {
  success: {
    bg: 'bg-success-50 border-success-200 dark:bg-success-500/10 dark:border-success-800',
    icon: CheckCircleIcon,
    iconColor: 'text-success-500',
  },
  error: {
    bg: 'bg-error-50 border-error-200 dark:bg-error-500/10 dark:border-error-800',
    icon: XCircleIcon,
    iconColor: 'text-error-500',
  },
  info: {
    bg: 'bg-info-50 border-info-200 dark:bg-info-500/10 dark:border-info-800',
    icon: InfoIcon,
    iconColor: 'text-info-500',
  },
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="translate-y-[-8px] opacity-0"
    leave-to-class="translate-y-[-8px] opacity-0"
  >
    <div
      :class="[
        'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg',
        config[type].bg,
      ]"
      role="alert"
    >
      <component
        :is="config[type].icon"
        :class="['h-5 w-5 shrink-0', config[type].iconColor]"
        aria-hidden="true"
      />

      <p class="text-sm text-neutral-700 dark:text-neutral-300">
        {{ message }}
      </p>

      <button
        class="ml-auto rounded p-1 transition-colors hover:bg-neutral-100
               dark:hover:bg-neutral-800
               focus:outline-none focus-visible:outline-2
               focus-visible:outline-primary-500"
        aria-label="Fechar notificação"
        @click="emit('close')"
      >
        <XIcon class="h-4 w-4 text-neutral-400" aria-hidden="true" />
      </button>
    </div>
  </Transition>
</template>
```

### Composable useToast

```typescript
// app/composables/useToast.ts
import { ref } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function show(type: Toast['type'], message: string, duration = 5000) {
    const id = crypto.randomUUID()
    toasts.value.push({ id, type, message })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    remove,
    success: (msg: string) => show('success', msg),
    error: (msg: string) => show('error', msg),
    info: (msg: string) => show('info', msg),
  }
}
```

### Container no Layout

```vue
<!-- No layout principal -->
<script setup lang="ts">
import AppToast from '~/app/components/shared/AppToast.vue'
import { useToast } from '~/app/composables/useToast'

const { toasts, remove } = useToast()
</script>

<template>
  <div>
    <slot />

    <div class="fixed right-4 top-4 z-50 flex flex-col gap-2">
      <AppToast
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :message="toast.message"
        @close="remove(toast.id)"
      />
    </div>
  </div>
</template>
```

---

## 8. Card com Hover Elevation

```vue
<!-- app/components/base/BaseCard.vue -->
<script setup lang="ts">
interface Props {
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  padding: 'md',
})

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
}
</script>

<template>
  <div
    :class="[
      'rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
      paddingClasses[padding],
      hoverable && 'shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer',
    ]"
  >
    <slot />
  </div>
</template>
```

---

## 9. Contextual Tooltip (First-visit)

```vue
<!-- app/components/shared/FeatureTooltip.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  featureKey: string
  message: string
}

const props = defineProps<Props>()

const hasSeen = ref(true)
const isOpen = ref(false)

onMounted(() => {
  const key = `tip-seen-${props.featureKey}`
  hasSeen.value = localStorage.getItem(key) === 'true'
  if (!hasSeen.value) isOpen.value = true
})

function dismiss() {
  isOpen.value = false
  hasSeen.value = true
  localStorage.setItem(`tip-seen-${props.featureKey}`, 'true')
}
</script>

<template>
  <div class="relative inline-block">
    <slot />

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="translate-y-1 opacity-0"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div v-if="isOpen" class="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2">
        <div
          class="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45
                 bg-neutral-900 dark:bg-neutral-100"
        />
        <div
          class="max-w-xs rounded-lg bg-neutral-900 px-4 py-3 shadow-xl
                 dark:bg-neutral-100"
          role="tooltip"
        >
          <p class="mb-2 text-sm text-white dark:text-neutral-900">{{ message }}</p>
          <button
            class="text-xs text-primary-300 hover:text-primary-200
                   dark:text-primary-600 dark:hover:text-primary-700"
            @click="dismiss"
          >
            Entendi
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
```

**Uso:**

```vue
<FeatureTooltip feature-key="export-btn" message="Exporte seus dados em CSV ou PDF">
  <button class="rounded-lg bg-primary-600 px-4 py-2 text-white">Exportar</button>
</FeatureTooltip>
```

---

## 10. Responsive Table → Cards no Mobile

```vue
<!-- app/components/shared/ResponsiveTable.vue -->
<script setup lang="ts">
interface Column {
  key: string
  label: string
  hideOnMobile?: boolean
}

interface Props {
  columns: Column[]
  rows: Record<string, unknown>[]
}

defineProps<Props>()
</script>

<template>
  <!-- Desktop: Tabela -->
  <div class="hidden overflow-x-auto md:block">
    <table class="w-full text-left text-sm">
      <thead>
        <tr class="border-b border-neutral-200 dark:border-neutral-800">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="i"
          class="border-b border-neutral-100 transition-colors
                 hover:bg-neutral-50 dark:border-neutral-800/50
                 dark:hover:bg-neutral-800/50"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-neutral-700 dark:text-neutral-300"
          >
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Mobile: Cards -->
  <div class="space-y-3 md:hidden">
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
    >
      <div
        v-for="col in columns.filter((c) => !c.hideOnMobile)"
        :key="col.key"
        class="flex items-center justify-between py-1.5"
      >
        <span class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {{ col.label }}
        </span>
        <span class="text-sm text-neutral-900 dark:text-neutral-100">
          {{ row[col.key] }}
        </span>
      </div>
    </div>
  </div>
</template>
```
