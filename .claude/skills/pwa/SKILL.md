---
name: pwa
description: "Configurar Progressive Web App no Nuxt 4 com @vite-pwa/nuxt. Cobre setup, manifest, service worker, offline support, prompt de atualização, install prompt, caching strategies, PWA assets e deploy."
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# PWA — Nuxt 4

Guia completo para transformar o app Nuxt 4 em uma Progressive Web App usando `@vite-pwa/nuxt` (Workbox).

## Stack

- `@vite-pwa/nuxt` — módulo zero-config PWA para Nuxt
- Workbox — service worker e caching strategies
- Web App Manifest — metadata para instalação
- PWA Assets — geração automática de ícones a partir de source image

---

## 1. Setup

### Instalação

```bash
npx nuxi@latest module add @vite-pwa/nuxt
```

### nuxt.config.ts — Configuração Mínima

```typescript
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nome do App',
      short_name: 'App',
      description: 'Descrição do app',
      theme_color: '#6366f1',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'pt-BR',
      icons: [
        {
          src: '/pwa-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Precache de todas as rotas navegáveis
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
  },
})
```

### Ícones em `public/`

```
public/
├── pwa-icon-192x192.png   # Ícone padrão
├── pwa-icon-512x512.png   # Ícone grande + maskable
└── favicon.ico             # Fallback navegadores
```

> Gerar ícones com a skill `favicon` (Sharp) ou usar o PWA Assets Generator integrado.

---

## 2. Registrar Web Manifest

Adicionar componente no `app.vue` ou nos layouts:

```vue
<!-- app/app.vue -->
<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

Alternativa com PWA Assets (v0.6.0+):

```vue
<!-- app/app.vue — injeta manifest + theme-color + icon links -->
<template>
  <NuxtPwaAssets />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

Ou registrar via route rules (útil para Netlify/Vercel):

```typescript
// nuxt.config.ts
pwa: {
  registerWebManifestInRouteRules: true,
}
```

---

## 3. Estratégias de Service Worker

### Opção A: `generateSW` (Padrão — Recomendado)

O Workbox gera o service worker automaticamente. Ideal para a maioria dos casos.

```typescript
pwa: {
  strategies: 'generateSW', // padrão
  registerType: 'autoUpdate',
  workbox: {
    navigateFallback: '/',
    globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    // Cache de API em runtime
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 24h
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
          },
        },
      },
      {
        urlPattern: /\.(?:woff2?|ttf|otf|eot)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'font-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
          },
        },
      },
    ],
  },
}
```

### Opção B: `injectManifest` (Avançado)

Para service worker customizado com controle total.

```typescript
pwa: {
  strategies: 'injectManifest',
  srcDir: 'public',
  filename: 'sw.js',
}
```

```javascript
// public/sw.js
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Precache assets do build
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// API: Network First
registerRoute(
  /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/,
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 86400 }),
    ],
  })
)

// Imagens: Cache First
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 604800 }),
    ],
  })
)
```

> Precisa instalar: `npm i -D workbox-precaching workbox-routing workbox-strategies workbox-expiration`

---

## 4. Caching Strategies — Quando Usar Cada

| Estratégia | Uso | Exemplo |
|------------|-----|---------|
| **CacheFirst** | Assets estáticos que raramente mudam | Imagens, fontes, CSS/JS de build |
| **NetworkFirst** | Dados que precisam ser frescos mas funcionam offline | API calls, dados de Supabase |
| **StaleWhileRevalidate** | Conteúdo que pode estar levemente desatualizado | Páginas de listagem, configs |
| **NetworkOnly** | Nunca cachear | Pagamentos, auth, dados em tempo real |
| **CacheOnly** | Só funciona com precache | Assets do build |

---

## 5. Prompt de Atualização

### Auto Update (Recomendado para apps simples)

```typescript
pwa: {
  registerType: 'autoUpdate',
}
```

O service worker atualiza automaticamente — o usuário sempre tem a versão mais recente.

### Prompt for Update (Recomendado para apps complexos)

```typescript
pwa: {
  registerType: 'prompt',
  client: {
    installPrompt: true,
    periodicSyncForUpdates: 3600, // Checar atualizações a cada 1h
  },
}
```

Componente de prompt:

```vue
<!-- app/components/PwaUpdatePrompt.vue -->
<script setup lang="ts">
const { $pwa } = useNuxtApp()
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="$pwa?.needRefresh"
      class="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border
             border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-700
             dark:bg-neutral-900"
    >
      <p class="text-sm text-neutral-700 dark:text-neutral-300">
        Nova versão disponível!
      </p>
      <div class="mt-3 flex gap-2">
        <button
          class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white
                 hover:bg-primary-700"
          @click="$pwa.updateServiceWorker()"
        >
          Atualizar
        </button>
        <button
          class="rounded-lg px-4 py-2 text-sm text-neutral-500
                 hover:text-neutral-700 dark:hover:text-neutral-300"
          @click="$pwa.cancelPrompt()"
        >
          Depois
        </button>
      </div>
    </div>
  </Transition>
</template>
```

Usar no layout:

```vue
<!-- app/layouts/default.vue -->
<template>
  <div>
    <slot />
    <PwaUpdatePrompt />
  </div>
</template>
```

---

## 6. Install Prompt (Botão "Instalar App")

### Habilitar

```typescript
// nuxt.config.ts
pwa: {
  client: {
    installPrompt: true,
  },
}
```

### Componente de instalação

```vue
<!-- app/components/PwaInstallButton.vue -->
<script setup lang="ts">
const { $pwa } = useNuxtApp()
</script>

<template>
  <button
    v-if="$pwa?.showInstallPrompt"
    class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm
           font-medium text-white hover:bg-primary-700"
    @click="$pwa.install()"
  >
    <Icon name="lucide:download" class="size-4" />
    Instalar App
  </button>
</template>
```

### Verificar se já está instalado

```vue
<script setup lang="ts">
const { $pwa } = useNuxtApp()

const isInstalled = computed(() => $pwa?.isPWAInstalled)
</script>

<template>
  <div v-if="isInstalled">
    ✅ App instalado
  </div>
</template>
```

---

## 7. Offline Ready

### Notificar o usuário

```vue
<script setup lang="ts">
const { $pwa } = useNuxtApp()
const toast = useToast() // do seu sistema de toasts

onMounted(() => {
  if ($pwa?.offlineReady) {
    toast.success('App pronto para uso offline!')
  }
})
</script>
```

### Página offline fallback

```vue
<!-- app/pages/offline.vue -->
<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <Icon name="lucide:wifi-off" class="size-16 text-neutral-400" />
    <h1 class="mt-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
      Sem conexão
    </h1>
    <p class="mt-2 text-neutral-600 dark:text-neutral-400">
      Verifique sua internet e tente novamente.
    </p>
    <button
      class="mt-6 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white"
      @click="window.location.reload()"
    >
      Tentar novamente
    </button>
  </div>
</template>
```

---

## 8. PWA Assets Generator

Gerar todos os ícones a partir de uma única imagem source:

### Instalação

```bash
npm i -D @vite-pwa/assets-generator
```

### Configuração

```typescript
// nuxt.config.ts
pwa: {
  pwaAssets: {
    image: 'public/source-icon.svg', // ou .png (mínimo 512x512)
  },
}
```

Usar `<NuxtPwaAssets />` no `app.vue` ao invés de `<VitePwaManifest />` — injeta automaticamente manifest link + theme-color + icon links.

### Geração manual via CLI

```bash
npx @vite-pwa/assets-generator --preset minimal public/source-icon.svg
```

Presets disponíveis: `minimal`, `android`, `windows`, `apple`, `full`.

---

## 9. Desenvolvimento

### Habilitar PWA no dev

```typescript
pwa: {
  devOptions: {
    enabled: true,
    type: 'module',
    navigateFallbackAllowlist: [/^\/$/],
  },
}
```

> ⚠️ Usar apenas para testar PWA features. Desabilitar para dev normal (performance).

### Testar PWA

1. Build: `nuxt build` → `node .output/server/index.mjs`
2. Abrir DevTools → Application → Service Workers
3. Verificar: manifest detectado, SW registrado, app instalável
4. Testar offline: Network → Offline → Refresh

---

## 10. Configuração Completa de Produção

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],

  pwa: {
    registerType: 'prompt',

    manifest: {
      name: 'Meu App',
      short_name: 'App',
      description: 'Descrição completa do app',
      theme_color: '#6366f1',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'pt-BR',
      categories: ['productivity'],
      icons: [
        { src: '/pwa-icon-64x64.png', sizes: '64x64', type: 'image/png' },
        { src: '/pwa-icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/pwa-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },

    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-api',
            expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
          },
        },
        {
          urlPattern: /\.(?:woff2?|ttf|otf|eot)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts',
            expiration: { maxEntries: 20, maxAgeSeconds: 31536000 },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
          },
        },
      ],
    },

    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
  },
})
```

---

## 11. Deploy — Considerações por Plataforma

| Plataforma | Configuração Extra |
|------------|-------------------|
| **Vercel** | `registerWebManifestInRouteRules: true` |
| **Netlify** | `registerWebManifestInRouteRules: true` + headers `_headers` |
| **Cloudflare** | Funciona out-of-the-box |
| **Node.js / Docker** | Funciona out-of-the-box |

Headers recomendados para o service worker:

```
/sw.js
  Cache-Control: no-cache
  Service-Worker-Allowed: /
```

---

## 12. Checklist PWA

Antes de ir para produção:

- [ ] Manifest com `name`, `short_name`, `icons` (192 + 512), `theme_color`, `display`
- [ ] Ícone 192x192 PNG
- [ ] Ícone 512x512 PNG
- [ ] Ícone maskable (512x512 com safe zone)
- [ ] Service worker registrado e funcional
- [ ] App funciona offline (ao menos página base)
- [ ] HTTPS habilitado (obrigatório para SW)
- [ ] `<VitePwaManifest />` ou `<NuxtPwaAssets />` no app.vue
- [ ] Prompt de atualização implementado (se `registerType: 'prompt'`)
- [ ] Runtime caching para API e assets estáticos
- [ ] Testado via Lighthouse → PWA score 100
- [ ] Testado instalação em mobile (Android + iOS)

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| SW não registra em dev | Habilitar `devOptions.enabled: true` |
| App não é instalável | Faltam ícones 192+512, ou `display` não é `standalone` |
| Manifest não aparece | Adicionar `<VitePwaManifest />` no app.vue |
| Cache desatualizado | Configurar `cleanupOutdatedCaches: true` |
| `$pwa` é undefined | Normal em dev sem `devOptions.enabled` |
| Lighthouse PWA < 100 | Verificar HTTPS, manifest, ícones, offline support |
| Conflito com Supabase realtime | Não cachear WebSocket connections — usar `NetworkOnly` |
| iOS não instala | Safari exige HTTPS + manifest válido; não suporta install prompt nativo |
| Build grande demais | Ajustar `globPatterns` para excluir assets desnecessários |
