---
name: arquitetura-pastas
description: >
  Use esta skill quando for criar novos arquivos/pastas, iniciar um projeto Nuxt 4,
  ou decidir onde colocar código (app vs shared vs server).
version: "1.0"
risk: safe
tags: [nuxt4, estrutura, diretórios, organização, typescript]
---

# Arquitetura de Pastas — Nuxt 4

## Overview

Estrutura de diretórios obrigatória para projetos Nuxt 4. Define onde cada tipo de arquivo deve ser criado, como nomear, quais aliases usar nos imports, e como separar código entre app (client), server e shared. Seguir esta estrutura garante consistência, performance no dev server (file watching otimizado) e type safety entre contextos.

## When to Use

- Use quando for criar qualquer arquivo ou pasta nova no projeto
- Use quando for iniciar um novo projeto Nuxt 4
- Use quando precisar decidir onde colocar código (app vs shared vs server)
- Use quando for refatorar ou reorganizar a estrutura existente
- NÃO use para regras internas de componentes → veja a skill `componentizacao`

## Quick Reference

| O que você quer fazer | Onde colocar |
|----------------------|--------------|
| Componente Vue | `app/components/[domínio]/` |
| Página/rota | `app/pages/` |
| Layout | `app/layouts/` |
| Composable (useX) | `app/composables/` |
| Função pura/helper | `app/utils/` |
| Middleware de rota | `app/middleware/` |
| Plugin Vue | `app/plugins/` |
| CSS/fontes/ícones | `app/assets/` |
| Tipo/interface TypeScript (compartilhado) | `shared/types/` |
| Constante/enum global | `shared/constants/` |
| Util compartilhado (app + server) | `shared/utils/` |
| Rota de API | `server/api/` |
| Middleware server-side | `server/middleware/` |
| Plugin server-side | `server/plugins/` |
| Util só do server | `server/utils/` |
| Arquivo estático (favicon, robots.txt) | `public/` |
| Conteúdo Markdown (Nuxt Content) | `content/` |

---

## Árvore Completa do Projeto

```
my-nuxt-app/
├─ app/                          # ← Código da aplicação Vue (client-side)
│  ├─ assets/                    # Fontes, ícones, imagens, CSS global
│  ├─ components/                # Componentes Vue (por domínio)
│  │  ├─ base/                   # Componentes genéricos (BaseButton, BaseModal)
│  │  ├─ shared/                 # Componentes de app (AppHeader, AppFooter)
│  │  └─ [domínio]/             # Componentes por domínio (user/, product/)
│  ├─ composables/               # Funções reativas (useAuth, useCart)
│  ├─ layouts/                   # Layouts de página (DefaultLayout, AdminLayout)
│  ├─ middleware/                # Middlewares de rota (authGuard, isAdmin)
│  ├─ pages/                     # Rotas baseadas em arquivos
│  ├─ plugins/                   # Plugins Vue (client/server)
│  ├─ utils/                     # Funções puras e helpers sem reatividade
│  ├─ app.vue                    # Shell principal do app
│  ├─ app.config.ts              # Configurações reativas do app
│  └─ error.vue                  # Página de erro global
│
├─ shared/                       # ← Código compartilhado (app + server)
│  ├─ types/                     # Tipos TypeScript (DTOs, interfaces, contratos)
│  ├─ constants/                 # Constantes e enums globais
│  └─ utils/                     # Funções puras usadas em ambos os contextos
│
├─ server/                       # ← Código server-side (Nitro)
│  ├─ api/                       # Rotas de API (auto-prefixadas com /api)
│  ├─ routes/                    # Rotas server sem prefixo /api
│  ├─ middleware/                # Middlewares server-side
│  ├─ plugins/                   # Plugins server-side
│  └─ utils/                     # Utils exclusivos do server
│
├─ content/                      # Conteúdo estático/MD (Nuxt Content, opcional)
├─ public/                       # Arquivos estáticos servidos na raiz (/)
│
├─ .env                          # Variáveis de ambiente (NÃO commitar)
├─ nuxt.config.ts                # Configuração principal do Nuxt
├─ tailwind.config.ts            # Tema e tokens de design (se usar Tailwind)
├─ tsconfig.json                 # TypeScript config (gerado pelo Nuxt 4)
└─ package.json
```

---

## Detalhamento de Cada Diretório

### `app/` — Código da Aplicação

Tudo que roda no contexto Vue (client + SSR) fica aqui. O Nuxt 4 define `app/` como o `srcDir` padrão.

#### `app/components/`

Componentes Vue organizados por domínio. Veja a skill `componentizacao` para regras detalhadas.

```
app/components/
├─ base/BaseButton.vue
├─ auth/AuthLoginForm.vue
├─ product/ProductCard.vue
└─ shared/AppHeader.vue
```

#### `app/composables/`

Funções reativas que encapsulam lógica de domínio, data fetching e estado compartilhado.

```typescript
// app/composables/useAuth.ts
import { useState } from '#app'
import type { UserDTO } from '~/shared/types/UserDTO'

export function useAuth() {
  const user = useState<UserDTO | null>('auth-user', () => null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(email: string, password: string) {
    const data = await $fetch<UserDTO>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
}
```

**Regras:**
- Prefixo `use` obrigatório: `useAuth.ts`, `useCart.ts`
- Um composable por arquivo
- Arquivos na raiz de `composables/` são auto-importados pelo Nuxt
- Subpastas não são auto-importadas (precisa export no index ou import manual)

#### `app/utils/`

Funções puras sem reatividade Vue. Não usam `ref`, `computed`, `watch` nem APIs do Vue.

```typescript
// app/utils/formatCurrency.ts
export function formatCurrency(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
```

**Regras:**
- camelCase no nome do arquivo: `formatDate.ts`, `calculateTotal.ts`
- Funções puras — sem side effects, sem reatividade
- Arquivos na raiz de `utils/` são auto-importados pelo Nuxt
- Se precisa usar `ref`/`computed` → é composable, não util

#### `app/pages/`

Rotas baseadas em arquivos. Cada `.vue` vira uma rota automaticamente.

```
app/pages/
├─ index.vue                    # → /
├─ login.vue                    # → /login
├─ profile.vue                  # → /profile
├─ admin/
│  ├─ dashboard.vue             # → /admin/dashboard
│  └─ users.vue                 # → /admin/users
└─ product/
   └─ [id].vue                  # → /product/:id (rota dinâmica)
```

**Regras:**
- Nomes em **minúsculas** sem traços: `login.vue`, `profile.vue`
- Subpastas para agrupar por contexto: `admin/`, `product/`
- Parâmetros dinâmicos entre colchetes: `[id].vue`, `[slug].vue`
- Agrupamento sem afetar URL: use pastas com parênteses `(marketing)/about.vue` → `/about`
- Root element único obrigatório (para transições de rota)

#### `app/layouts/`

Layouts compartilhados entre páginas. Definem estrutura comum (header, footer, sidebar).

```vue
<!-- app/layouts/DefaultLayout.vue -->
<script setup lang="ts">
import AppHeader from '~/app/components/shared/AppHeader.vue'
import AppFooter from '~/app/components/shared/AppFooter.vue'
</script>

<template>
  <div>
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

**Regras:**
- PascalCase: `DefaultLayout.vue`, `AdminLayout.vue`
- Use com `<NuxtLayout>` no `app.vue` ou nas páginas
- Para atribuir layout a uma página, use `definePageMeta`:

```vue
<!-- app/pages/admin/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'AdminLayout',
})
</script>
```

#### `app/middleware/`

Middlewares de rota executados antes da navegação.

```typescript
// app/middleware/authGuard.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

**Regras:**
- camelCase: `authGuard.ts`, `isAdmin.ts`
- Global middleware: adicione `.global` ao nome → `authGuard.global.ts`
- Use `defineNuxtRouteMiddleware` sempre

#### `app/plugins/`

Registros de libs externas, injeções de dependência, inicializações globais.

```typescript
// app/plugins/dayjs.client.ts
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

export default defineNuxtPlugin(() => {
  dayjs.locale('pt-br')
  return {
    provide: {
      dayjs,
    },
  }
})
```

**Regras:**
- Sufixo `.client.ts` → só roda no browser
- Sufixo `.server.ts` → só roda no servidor
- Sem sufixo → roda em ambos
- Use `defineNuxtPlugin` sempre

#### `app/assets/`

Arquivos processados pelo bundler (Vite): fontes, ícones, imagens, CSS global.

```
app/assets/
├─ css/
│  └─ main.css
├─ fonts/
│  └─ Inter-Variable.woff2
└─ images/
   └─ logo.svg
```

**Regra:** Importe com `~/app/assets/...`. Não confunda com `public/` (que serve arquivos estáticos sem processamento).

---

### `shared/` — Código Compartilhado

Código acessível tanto no `app/` (Vue) quanto no `server/` (Nitro). Ideal para tipos, constantes e utils que os dois contextos consomem.

#### `shared/types/`

```typescript
// shared/types/UserDTO.ts
export interface UserDTO {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
}

// shared/types/ApiResponse.ts
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
```

**Regras:**
- PascalCase: `UserDTO.ts`, `ProductDTO.ts`
- Arquivos em `shared/types/` são auto-importados
- Use `import type` nos arquivos consumidores

#### `shared/constants/`

```typescript
// shared/constants/roles.ts
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
```

```typescript
// shared/constants/httpStatus.ts
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const
```

**Regras:**
- Constantes em UPPER_SNAKE_CASE
- Arquivos em `shared/constants/` NÃO são auto-importados
- Importe via alias: `import { ROLES } from '#shared/constants/roles'`

#### `shared/utils/`

Funções puras usadas tanto no app quanto no server.

```typescript
// shared/utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
```

**Regras:**
- Arquivos em `shared/utils/` são auto-importados em ambos os contextos
- Subpastas dentro de `shared/utils/` NÃO são auto-importadas

#### Auto-import vs import manual em `shared/`

| Local | Auto-importado? |
|-------|----------------|
| `shared/types/*.ts` | ✅ Sim |
| `shared/utils/*.ts` | ✅ Sim |
| `shared/constants/*.ts` | ❌ Não — use `#shared/constants/arquivo` |
| `shared/*.ts` (raiz) | ❌ Não — use `#shared/arquivo` |
| `shared/qualquer-subpasta/*.ts` | ❌ Não — use `#shared/subpasta/arquivo` |

---

### `server/` — Código Server-Side

Código que roda exclusivamente no Nitro (server). Nunca é enviado ao client.

#### `server/api/`

Rotas de API auto-prefixadas com `/api`.

```typescript
// server/api/users.get.ts → GET /api/users
import type { UserDTO } from '~/shared/types/UserDTO'

export default defineEventHandler(async (event): Promise<UserDTO[]> => {
  // buscar usuários do banco
  return []
})
```

```typescript
// server/api/users.post.ts → POST /api/users
import type { UserDTO } from '~/shared/types/UserDTO'

export default defineEventHandler(async (event): Promise<UserDTO> => {
  const body = await readBody(event)
  // criar usuário
  return body as UserDTO
})
```

```typescript
// server/api/users/[id].get.ts → GET /api/users/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // buscar usuário por id
  return { id }
})
```

**Regras de nomenclatura:**

| Arquivo | Rota gerada |
|---------|------------|
| `server/api/users.get.ts` | `GET /api/users` |
| `server/api/users.post.ts` | `POST /api/users` |
| `server/api/users/[id].get.ts` | `GET /api/users/:id` |
| `server/api/users/[id].put.ts` | `PUT /api/users/:id` |
| `server/api/users/[id].delete.ts` | `DELETE /api/users/:id` |
| `server/routes/health.ts` | `GET /health` (sem prefixo /api) |

- Use `defineEventHandler` sempre
- Tipo o retorno da função
- Parâmetros dinâmicos entre colchetes: `[id]`, `[slug]`
- Sufixo com método HTTP: `.get.ts`, `.post.ts`, `.put.ts`, `.delete.ts`

#### `server/utils/`

Utils exclusivos do server. Auto-importados dentro do contexto `server/`.

```typescript
// server/utils/hashPassword.ts
import { hash } from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}
```

**Regra:** Use o alias `#server` para imports limpos dentro do server:

```typescript
// server/api/users/[id]/profile.ts
import { hashPassword } from '#server/utils/hashPassword'
```

#### `server/middleware/`

Middlewares server-side que interceptam toda requisição.

```typescript
// server/middleware/log.ts
export default defineEventHandler((event) => {
  console.log(`[${event.method}] ${getRequestURL(event)}`)
})
```

---

## Decision Tree: Onde Colocar o Código

```
O código usa APIs do Vue (ref, computed, watch)?
├── Sim → É reativo?
│   ├── Sim → app/composables/ (useX.ts)
│   └── Não → Improvável. Revise.
├── Não → O código roda APENAS no server?
│   ├── Sim → server/utils/ ou server/api/
│   └── Não → O código é usado tanto no app quanto no server?
│       ├── Sim → shared/
│       │   ├── É tipo/interface? → shared/types/
│       │   ├── É constante/enum? → shared/constants/
│       │   └── É função pura? → shared/utils/
│       └── Não → Só no app?
│           ├── É função pura sem reatividade? → app/utils/
│           ├── É componente visual? → app/components/
│           ├── É página/rota? → app/pages/
│           └── É middleware de rota? → app/middleware/
```

---

## Aliases de Import

O Nuxt 4 oferece aliases para imports limpos e seguros entre contextos.

| Alias | Aponta para | Onde pode ser usado |
|-------|------------|-------------------|
| `~/` | Raiz do projeto | Em qualquer lugar |
| `#app` | Contexto da aplicação Vue | `app/` apenas |
| `#shared` | Diretório `shared/` | `app/` e `server/` |
| `#server` | Diretório `server/` | `server/` apenas |

### Exemplos de uso

```typescript
// No app/ — importando de shared
import type { UserDTO } from '~/shared/types/UserDTO'
import { ROLES } from '#shared/constants/roles'

// No server/ — importando de shared
import type { UserDTO } from '~/shared/types/UserDTO'
import { slugify } from '#shared/utils/slugify'

// No server/ — importando de server
import { hashPassword } from '#server/utils/hashPassword'
```

### Proteção de contexto

- `#server` **NÃO pode** ser importado no `app/` → gera erro
- `#app` **NÃO pode** ser importado no `server/` → gera erro
- `#shared` pode ser importado em ambos → esse é o propósito

---

## Nomenclatura Consolidada

| Diretório | Padrão de nome | Exemplo |
|-----------|---------------|---------|
| `app/components/` | PascalCase.vue | `UserCard.vue` |
| `app/pages/` | minúsculas sem traço | `login.vue`, `profile.vue` |
| `app/layouts/` | PascalCase.vue | `DefaultLayout.vue` |
| `app/composables/` | useX em camelCase | `useAuth.ts` |
| `app/middleware/` | camelCase | `authGuard.ts` |
| `app/utils/` | camelCase | `formatDate.ts` |
| `app/plugins/` | camelCase + sufixo | `dayjs.client.ts` |
| `shared/types/` | PascalCase | `UserDTO.ts` |
| `shared/constants/` | camelCase (arquivo), UPPER_SNAKE (valores) | `roles.ts` |
| `shared/utils/` | camelCase | `slugify.ts` |
| `server/api/` | recurso.metodo.ts | `users.get.ts` |
| `server/utils/` | camelCase | `hashPassword.ts` |
| `server/middleware/` | camelCase | `log.ts` |

---

## Arquivos Raiz

### `nuxt.config.ts`

Configuração principal do framework. Módulos, runtime config, features experimentais.

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],

  runtimeConfig: {
    // Variáveis secretas (só server) — definidas via .env
    databaseUrl: '',
    jwtSecret: '',

    // Variáveis públicas (client + server)
    public: {
      apiBaseUrl: '',
      appName: 'Meu App',
    },
  },

  experimental: {
    componentIslands: true, // Habilita server components
  },
})
```

### `app.config.ts`

Configurações reativas do app, acessíveis via `useAppConfig()`. Sem dados sensíveis.

```typescript
export default defineAppConfig({
  theme: {
    primaryColor: '#3b82f6',
  },
  ui: {
    rounded: 'md',
  },
})
```

### `.env`

Variáveis de ambiente. **Nunca commitar no Git.**

```bash
# Server only (acesso via runtimeConfig)
NUXT_DATABASE_URL=postgresql://localhost:5432/mydb
NUXT_JWT_SECRET=super-secret-key

# Public (acesso via runtimeConfig.public)
NUXT_PUBLIC_API_BASE_URL=https://api.example.com
NUXT_PUBLIC_APP_NAME=Meu App
```

**Regras:**
- Prefixo `NUXT_` para injetar automaticamente no `runtimeConfig`
- Prefixo `NUXT_PUBLIC_` para variáveis acessíveis no client
- Adicione `.env` ao `.gitignore`
- Crie um `.env.example` com as chaves sem valores para documentação

### `tsconfig.json`

O Nuxt 4 gera automaticamente com project references separando `app/`, `server/` e `shared/`. **Não edite manualmente** — use `nuxt.config.ts` para customizar o TypeScript.

---

## Anti-patterns

### ❌ Arquivo na raiz em vez de dentro de `app/`

```
# ERRADO — Nuxt 4 espera código dentro de app/
components/UserCard.vue
pages/login.vue
composables/useAuth.ts

# CORRETO
app/components/user/UserCard.vue
app/pages/login.vue
app/composables/useAuth.ts
```

### ❌ Tipos em `app/types/` quando o server também usa

```
# ERRADO — server não acessa app/
app/types/UserDTO.ts

# CORRETO — shared é acessível por ambos
shared/types/UserDTO.ts
```

### ❌ Import de `#server` no código do app

```typescript
// ERRADO — gera erro de contexto
// dentro de app/composables/useUser.ts
import { hashPassword } from '#server/utils/hashPassword'

// CORRETO — use uma rota de API
const { data } = await useFetch('/api/users', { method: 'POST', body: { password } })
```

### ❌ Util reativo em `app/utils/`

```typescript
// ERRADO — utils não devem ter reatividade
// app/utils/userState.ts
import { ref } from 'vue'
export const currentUser = ref(null) // Isso é um composable!

// CORRETO — mova para composables
// app/composables/useCurrentUser.ts
export function useCurrentUser() {
  const currentUser = useState('current-user', () => null)
  return { currentUser }
}
```

### ❌ Variável sensível no `runtimeConfig.public`

```typescript
// ERRADO — expõe segredo ao client
runtimeConfig: {
  public: {
    databaseUrl: '', // NUNCA!
  },
}

// CORRETO — apenas no runtimeConfig (sem public)
runtimeConfig: {
  databaseUrl: '', // Acessível só no server
}
```

---

## Examples

### Feature completa: CRUD de produtos

Exemplo mostrando onde cada arquivo fica ao criar uma feature de ponta a ponta.

```
shared/types/ProductDTO.ts          ← Tipo compartilhado
shared/constants/categories.ts      ← Constantes de categoria

server/api/products.get.ts          ← GET /api/products
server/api/products.post.ts         ← POST /api/products
server/api/products/[id].get.ts     ← GET /api/products/:id
server/api/products/[id].put.ts     ← PUT /api/products/:id
server/api/products/[id].delete.ts  ← DELETE /api/products/:id

app/composables/useProducts.ts      ← Lógica de data fetching
app/composables/useProductForm.ts   ← Lógica do formulário

app/components/product/ProductCard.vue    ← Card do produto
app/components/product/ProductList.vue    ← Lista de produtos
app/components/product/ProductForm.vue    ← Formulário

app/pages/products.vue              ← Página de listagem /products
app/pages/products/[id].vue         ← Página de detalhe /products/:id

app/utils/formatCurrency.ts         ← Formatação de preço (se não existir)
```

---

## Troubleshooting

### Import não encontrado com alias `#shared`

- **Sintoma**: `Cannot find module '#shared/constants/roles'`
- **Causa**: O arquivo não está no local correto ou o Nuxt não gerou os tipos
- **Solução**:
  - Verifique se o arquivo está em `shared/constants/roles.ts`
  - Rode `npx nuxi prepare` para regenerar os tipos
  - Reinicie o dev server

### Auto-import não funciona em subpasta

- **Sintoma**: Função em `app/composables/auth/useLogin.ts` não é auto-importada
- **Causa**: O Nuxt só auto-importa arquivos na raiz de `composables/` e `utils/`
- **Solução**:
  - Mova para a raiz: `app/composables/useLogin.ts`
  - Ou crie um `app/composables/auth/index.ts` que re-exporta
  - Ou importe manualmente: `import { useLogin } from '~/app/composables/auth/useLogin'`

### Erro de contexto: `#server` importado no client

- **Sintoma**: `Cannot import #server from client code`
- **Causa**: Tentou importar código do `server/` dentro de `app/`
- **Solução**: Código server-only nunca deve ser importado no app. Se precisa da funcionalidade, exponha via rota de API (`server/api/`) e consuma com `useFetch`

### Tipo de `shared/types/` não é reconhecido

- **Sintoma**: Interface em `shared/types/UserDTO.ts` não auto-completa
- **Causa**: O Nuxt gera projetos TypeScript separados para app, server e shared
- **Solução**:
  - Rode `npx nuxi prepare`
  - Verifique se `tsconfig.json` na raiz contém as project references
  - No VS Code, use `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Página não aparece como rota

- **Sintoma**: Arquivo `app/pages/sobre.vue` não gera a rota `/sobre`
- **Causa**: `<NuxtPage />` não está no `app.vue` ou o arquivo não tem root element único
- **Solução**:
  - Confirme que `app.vue` contém `<NuxtPage />`
  - Confirme que a página tem um único elemento raiz no template
  - Verifique se o nome está em minúsculas

---

## Limitations

- Esta skill define a estrutura geral do projeto. Para regras internas de componentes, veja `componentizacao`
- A pasta `shared/` é uma feature do Nuxt 4+ — não existe no Nuxt 3 sem configuração manual
- O alias `#server` foi adicionado no Nuxt 4.3 — versões anteriores podem não suportá-lo
- Projetos com Nuxt Layers ou monorepos podem ter estrutura adicional não coberta aqui
