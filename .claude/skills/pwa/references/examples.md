# PWA — Exemplos de Componentes Vue

## TypeScript — Interface $pwa

```typescript
interface PwaInjection {
  isPWAInstalled: Ref<boolean>
  showInstallPrompt: Ref<boolean>
  cancelInstall: () => void
  install: () => Promise<void>
  swActivated: Ref<boolean>
  registrationError: Ref<boolean>
  offlineReady: Ref<boolean>
  needRefresh: Ref<boolean>
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  cancelPrompt: () => Promise<void>
  getSWRegistration: () => ServiceWorkerRegistration | undefined
}

// Acessar via:
const { $pwa } = useNuxtApp()
// Ou em template:
// $pwa.needRefresh, $pwa.install(), etc.
```

---

## 1. PwaUpdatePrompt — Toast de Atualização

```vue
<script setup lang="ts">
const { $pwa } = useNuxtApp()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="$pwa?.needRefresh"
      role="alert"
      class="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center
             gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-xl
             dark:border-neutral-700 dark:bg-neutral-900"
    >
      <Icon name="lucide:refresh-cw" class="size-5 shrink-0 text-primary-600" />
      <p class="flex-1 text-sm text-neutral-700 dark:text-neutral-300">
        Nova versão disponível
      </p>
      <button
        class="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white
               hover:bg-primary-700"
        @click="$pwa.updateServiceWorker()"
      >
        Atualizar
      </button>
      <button
        class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        aria-label="Fechar"
        @click="$pwa.cancelPrompt()"
      >
        <Icon name="lucide:x" class="size-4" />
      </button>
    </div>
  </Transition>
</template>
```

---

## 2. PwaInstallBanner — Banner de Instalação

```vue
<script setup lang="ts">
const { $pwa } = useNuxtApp()

const dismissed = ref(false)

function dismiss() {
  dismissed.value = true
  $pwa?.cancelInstall()
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="$pwa?.showInstallPrompt && !dismissed"
      class="sticky top-0 z-40 border-b border-primary-200 bg-primary-50 px-4 py-3
             dark:border-primary-800 dark:bg-primary-950"
    >
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <Icon name="lucide:smartphone" class="size-5 text-primary-600" />
          <p class="text-sm text-primary-900 dark:text-primary-100">
            Instale o app para acesso rápido e uso offline
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white
                   hover:bg-primary-700"
            @click="$pwa.install()"
          >
            Instalar
          </button>
          <button
            class="text-primary-400 hover:text-primary-600"
            aria-label="Fechar"
            @click="dismiss"
          >
            <Icon name="lucide:x" class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
```

---

## 3. PwaOfflineIndicator — Indicador de Status

```vue
<script setup lang="ts">
const online = useOnline() // composable do VueUse ou custom
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="!online"
      class="fixed bottom-0 left-0 right-0 z-50 bg-warning-600 px-4 py-2 text-center
             text-sm font-medium text-white"
    >
      <Icon name="lucide:wifi-off" class="mr-1 inline size-4" />
      Sem conexão — usando dados em cache
    </div>
  </Transition>
</template>
```

### Composable `useOnline` (sem VueUse)

```typescript
// app/composables/useOnline.ts
export function useOnline() {
  const online = ref(true)

  if (import.meta.client) {
    online.value = navigator.onLine

    window.addEventListener('online', () => { online.value = true })
    window.addEventListener('offline', () => { online.value = false })
  }

  return online
}
```

---

## 4. Composable `usePwa` — Wrapper Tipado

```typescript
// app/composables/usePwa.ts
export function usePwa() {
  const { $pwa } = useNuxtApp()

  const isSupported = computed(() => !!$pwa)
  const needRefresh = computed(() => $pwa?.needRefresh ?? false)
  const offlineReady = computed(() => $pwa?.offlineReady ?? false)
  const isInstalled = computed(() => $pwa?.isPWAInstalled ?? false)
  const canInstall = computed(() => $pwa?.showInstallPrompt ?? false)

  async function update() {
    await $pwa?.updateServiceWorker()
  }

  async function dismissUpdate() {
    await $pwa?.cancelPrompt()
  }

  async function install() {
    await $pwa?.install()
  }

  function cancelInstall() {
    $pwa?.cancelInstall()
  }

  return {
    isSupported,
    needRefresh,
    offlineReady,
    isInstalled,
    canInstall,
    update,
    dismissUpdate,
    install,
    cancelInstall,
  }
}
```

Uso:

```vue
<script setup lang="ts">
const { needRefresh, update, canInstall, install } = usePwa()
</script>
```

---

## 5. Runtime Caching — Recipes Comuns

### API Supabase (Network First)

```typescript
{
  urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'supabase-api',
    networkTimeoutSeconds: 5,
    expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
    cacheableResponse: { statuses: [0, 200] },
  },
}
```

### Storage Supabase (Cache First)

```typescript
{
  urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/.*/i,
  handler: 'CacheFirst',
  options: {
    cacheName: 'supabase-storage',
    expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
    cacheableResponse: { statuses: [0, 200] },
  },
}
```

### Google Fonts

```typescript
{
  urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
  handler: 'CacheFirst',
  options: {
    cacheName: 'google-fonts',
    expiration: { maxEntries: 20, maxAgeSeconds: 31536000 },
  },
}
```

### CDN de imagens (Cloudflare, imgix, etc.)

```typescript
{
  urlPattern: /^https:\/\/(images\.unsplash\.com|res\.cloudinary\.com)\/.*/i,
  handler: 'CacheFirst',
  options: {
    cacheName: 'cdn-images',
    expiration: { maxEntries: 100, maxAgeSeconds: 604800 },
  },
}
```

---

## 6. Não Cachear (Exclusões)

Nunca cachear estas rotas:

```typescript
workbox: {
  navigateFallbackDenylist: [
    /^\/api\//, // Server routes internas
    /^\/auth\//, // Fluxos de autenticação
  ],
}
```

Padrões que **nunca** devem ser cacheados:
- WebSocket connections (Supabase Realtime)
- Endpoints de auth/login/logout
- Pagamentos / checkout
- Upload de arquivos
- Server-sent events
