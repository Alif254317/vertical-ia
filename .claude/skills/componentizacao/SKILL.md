---
name: componentizacao
description: >
  Use esta skill quando for criar, refatorar ou organizar componentes Vue no Nuxt 4.
  Cobre nomenclatura, tipagem, separação UI/lógica, lazy hydration e server components.
version: "1.0"
risk: safe
tags: [vue, nuxt4, componentes, boas-praticas, typescript]
---

# Componentização — Nuxt 4

## Overview

Regras obrigatórias para criar, organizar e manter componentes Vue dentro de um projeto Nuxt 4. Todo componente deve ser pequeno, coeso, tipado e livre de lógica de dados. A lógica vive nos composables; o componente apenas consome e renderiza.

## When to Use

- Use quando for criar um novo componente `.vue`
- Use quando for refatorar um componente existente
- Use quando precisar decidir onde colocar lógica (componente vs composable vs util)
- Use quando for organizar subpastas dentro de `app/components/`
- NÃO use para lógica de data fetching → veja a skill de data-fetching (quando disponível)
- NÃO use para rotas/páginas → páginas têm regras próprias

## Quick Reference

| Decisão | Resposta |
|---------|---------|
| Onde criar componentes? | `app/components/` |
| Nomenclatura de arquivo | `PascalCase.vue` (ex: `UserCard.vue`) |
| Script setup obrigatório? | Sim, sempre `<script setup lang="ts">` |
| Lógica de dados no componente? | Nunca. Use composables (`useX`) |
| Tipagem de props? | `defineProps<T>()` com interface explícita |
| Tipagem de emits? | `defineEmits<T>()` com interface explícita |
| Auto-imports? | Não. Use imports explícitos sempre |
| ID dinâmico no template? | Use `useId()` para evitar hydration mismatch |
| Componente pesado abaixo do fold? | Use `<LazyComponente hydrate-on-visible />` |
| Componente sem interatividade? | Considere `.server.vue` (server component) |

---

## Estrutura Obrigatória de um Componente

Todo componente `.vue` segue esta ordem de blocos:

```vue
<script setup lang="ts">
// 1. Imports explícitos
import { ref, computed } from 'vue'
import { useId } from '#app'
import type { UserDTO } from '~/shared/types/UserDTO'

// 2. Props e Emits (tipados)
interface Props {
  user: UserDTO
  isActive?: boolean
}

interface Emits {
  (e: 'select', userId: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const emit = defineEmits<Emits>()

// 3. Composables
const { data, pending } = useAuth()

// 4. Estado local (refs, reactives)
const isOpen = ref(false)

// 5. Computed
const displayName = computed(() => `${props.user.name} - ${props.user.email}`)

// 6. Métodos
function handleSelect() {
  emit('select', props.user.id)
}

// 7. Lifecycle hooks (se necessário)
onMounted(() => {
  // ...
})
</script>

<template>
  <!-- 8. Template — único root element recomendado para SSR -->
  <div :id="useId()">
    <h3>{{ displayName }}</h3>
    <button @click="handleSelect">Selecionar</button>
  </div>
</template>

<style scoped>
/* 9. Estilos sempre com scoped */
</style>
```

### Regras da estrutura

1. **Ordem dos blocos**: `<script setup>` → `<template>` → `<style scoped>`
2. **Ordem dentro do script**: imports → props/emits → composables → estado → computed → métodos → lifecycle
3. **`lang="ts"` é obrigatório** em todo `<script setup>`
4. **Imports explícitos sempre** — não dependa de auto-imports do Nuxt
5. **`useId()` para IDs dinâmicos** — nunca gere IDs manualmente (evita hydration mismatch)
6. **`scoped` nos estilos** — exceto quando intencionalmente global

---

## Nomenclatura

### Arquivos de componentes

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componente comum | `PascalCase.vue` | `UserCard.vue` |
| Componente de domínio | `[Domínio][Ação/Tipo].vue` | `AuthLoginForm.vue` |
| Componente base/genérico | `Base[Nome].vue` | `BaseButton.vue`, `BaseModal.vue` |
| Componente de layout | `[Nome]Layout.vue` | `DefaultLayout.vue` |
| Server component | `[Nome].server.vue` | `StaticFooter.server.vue` |
| Componente client-only | `[Nome].client.vue` | `RichEditor.client.vue` |

### Props

```typescript
// ✅ Correto — interface explícita com tipos claros
interface Props {
  title: string
  count: number
  items: ProductDTO[]
  variant?: 'primary' | 'secondary'
  isDisabled?: boolean
}

// ❌ Errado — sem tipagem ou com any
const props = defineProps({
  title: String,     // sem tipo forte
  data: Object,      // any implícito
})
```

### Emits

```typescript
// ✅ Correto — interface tipada
interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}
const emit = defineEmits<Emits>()

// ❌ Errado — array sem tipagem
const emit = defineEmits(['update', 'delete'])
```

### Slots

```vue
<!-- ✅ Correto — slots nomeados e tipados -->
<template>
  <div>
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot :items="filteredItems" :count="total" />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>

<!-- Uso do componente -->
<MyComponent>
  <template #header>
    <h1>Título</h1>
  </template>
  <template #default="{ items, count }">
    <p>{{ count }} itens</p>
  </template>
</MyComponent>
```

---

## Separação UI vs Lógica

### Decision Tree

```
O código faz fetch de dados ou chama API?
  └── Sim → composable (useX.ts)
O código contém regra de negócio?
  └── Sim → composable (useX.ts)
O código é uma função pura sem reatividade?
  └── Sim → util (utils/funcao.ts)
O código é estado compartilhado entre componentes?
  └── Sim → composable com useState()
O código é apenas renderização visual?
  └── Sim → componente (.vue)
```

### Exemplo correto de separação

```typescript
// app/composables/useProducts.ts
import { useFetch } from '#app'
import type { ProductDTO } from '~/shared/types/ProductDTO'

export function useProducts(categoryId: Ref<string>) {
  const { data: products, pending, error } = useFetch<ProductDTO[]>(
    () => `/api/products?category=${categoryId.value}`,
    { watch: [categoryId] }
  )

  const total = computed(() => products.value?.length ?? 0)

  return { products, pending, error, total }
}
```

```vue
<!-- app/components/ProductList.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useProducts } from '~/app/composables/useProducts'
import type { ProductDTO } from '~/shared/types/ProductDTO'

interface Props {
  categoryId: string
}

interface Emits {
  (e: 'select', product: ProductDTO): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const categoryRef = computed(() => props.categoryId)
const { products, pending, total } = useProducts(categoryRef)
</script>

<template>
  <div>
    <p v-if="pending">Carregando...</p>
    <p v-else-if="!products?.length">Nenhum produto encontrado</p>
    <ul v-else>
      <li
        v-for="product in products"
        :key="product.id"
        @click="emit('select', product)"
      >
        {{ product.name }} — R$ {{ product.price }}
      </li>
    </ul>
    <span>Total: {{ total }}</span>
  </div>
</template>
```

### O que NUNCA colocar dentro de um componente

- Chamadas `$fetch` ou `useFetch` direto no componente → use composable
- Regras de validação complexas → use composable ou util
- Transformação de dados → use computed no composable
- Constantes ou enums → use `shared/constants/`
- Tipos/interfaces → use `shared/types/` ou `app/types/`

---

## Organização de Pastas

### Estrutura recomendada para `app/components/`

```
app/components/
├── base/                    # Componentes genéricos reutilizáveis
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   ├── BaseModal.vue
│   └── BaseCard.vue
├── auth/                    # Componentes do domínio de autenticação
│   ├── AuthLoginForm.vue
│   └── AuthRegisterForm.vue
├── product/                 # Componentes do domínio de produto
│   ├── ProductCard.vue
│   ├── ProductList.vue
│   └── ProductFilter.vue
├── user/                    # Componentes do domínio de usuário
│   ├── UserAvatar.vue
│   └── UserProfileCard.vue
└── shared/                  # Componentes compartilhados entre domínios
    ├── AppHeader.vue
    ├── AppFooter.vue
    └── AppSidebar.vue
```

### Regras de organização

1. **Agrupe por domínio** — não por tipo (ex: `product/ProductCard.vue`, não `cards/ProductCard.vue`)
2. **`base/` para componentes genéricos** — botões, inputs, modais que não têm lógica de domínio
3. **`shared/` para componentes de app** — header, footer, sidebar, navegação
4. **Máximo 10 arquivos por pasta** — se passar, crie subpastas
5. **Sem componentes na raiz** — todo componente deve estar em uma subpasta

---

## Tipagem Completa

### Interface de Props com defaults

```typescript
interface Props {
  title: string
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  items?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  isLoading: false,
  items: () => [],
})
```

### Interface para tipos complexos

```typescript
// shared/types/ProductDTO.ts
export interface ProductDTO {
  id: string
  name: string
  price: number
  category: string
  createdAt: string
}

// No componente
import type { ProductDTO } from '~/shared/types/ProductDTO'

interface Props {
  product: ProductDTO
}
```

### Tipagem de template refs

```typescript
import { ref } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

function focusInput() {
  inputRef.value?.focus()
}
```

### Tipagem de expose

```typescript
// Componente filho
defineExpose({
  reset: () => { /* ... */ },
  validate: () => { /* ... */ },
})

// Componente pai
const formRef = ref<InstanceType<typeof MyForm> | null>(null)

function handleSubmit() {
  formRef.value?.validate()
}
```

---

## Lazy Hydration (Performance)

O Nuxt 4 suporta lazy hydration nativa. Use o prefixo `Lazy` no nome do componente + a estratégia de hidratação.

### Quando usar cada estratégia

| Estratégia | Quando usar | Exemplo |
|-----------|-------------|---------|
| `hydrate-on-visible` | Componente abaixo do fold | Footer, seções inferiores |
| `hydrate-on-idle` | Componente não-crítico | Widgets, sidebars |
| `hydrate-on-interaction` | Só precisa funcionar com clique | Modais, dropdowns |
| `hydrate-on-media-query` | Só aparece em certos breakpoints | Menu mobile |
| `hydrate-never` | Zero interatividade | Conteúdo estático renderizado no server |

### Exemplos

```vue
<template>
  <div>
    <!-- Hidrata quando fica visível na tela -->
    <LazyProductReviews hydrate-on-visible />

    <!-- Hidrata quando o browser estiver ocioso (timeout 2s) -->
    <LazySidebar :hydrate-on-idle="2000" />

    <!-- Hidrata no primeiro clique ou hover -->
    <LazyCommentForm hydrate-on-interaction />

    <!-- Hidrata apenas em telas < 768px -->
    <LazyMobileMenu hydrate-on-media-query="(max-width: 768px)" />

    <!-- Nunca hidrata (puro HTML estático) -->
    <LazyStaticBanner hydrate-never />
  </div>
</template>
```

### Regras de lazy hydration

1. **Conteúdo above-the-fold nunca usa lazy hydration** — renderize normalmente
2. **Componentes interativos nunca usam `hydrate-never`**
3. **Cada componente usa no máximo 1 estratégia**
4. **Mudança de props força hidratação imediata** — esteja ciente disso

---

## Server Components

Componentes que **não precisam de interatividade** podem ser renderizados apenas no servidor. Isso reduz o bundle JavaScript enviado ao cliente.

### Quando usar

- Conteúdo estático (footer, banners, blocos de texto)
- Renderização de markdown
- Componentes que usam libs pesadas só no server (ex: syntax highlighting)

### Como criar

Adicione o sufixo `.server.vue` ao arquivo:

```vue
<!-- app/components/shared/AppFooter.server.vue -->
<script setup lang="ts">
import { useId } from '#app'

interface Props {
  companyName: string
  year?: number
}

const props = withDefaults(defineProps<Props>(), {
  year: new Date().getFullYear(),
})
</script>

<template>
  <footer :id="useId()">
    <p>&copy; {{ year }} {{ companyName }}. Todos os direitos reservados.</p>
  </footer>
</template>
```

### Hidratação parcial (client dentro de server component)

Se um server component contém um filho que precisa de interatividade, use `nuxt-client`:

```vue
<!-- app/components/shared/AppHeader.server.vue -->
<template>
  <header>
    <h1>Meu App</h1>
    <!-- Apenas o ThemeToggle será hidratado no client -->
    <ThemeToggle nuxt-client />
  </header>
</template>
```

> **Atenção**: Server components requerem `experimental.componentIslands: true` no `nuxt.config.ts`.

---

## Anti-patterns

### ❌ Componente fazendo fetch direto

```vue
<!-- ERRADO -->
<script setup lang="ts">
const { data } = await useFetch('/api/users')
</script>
```

```vue
<!-- CORRETO -->
<script setup lang="ts">
import { useUsers } from '~/app/composables/useUsers'
const { users, pending } = useUsers()
</script>
```

### ❌ Componente com mais de 200 linhas

Se o componente ultrapassar ~200 linhas, quebre-o:
- Extraia lógica para composables
- Extraia blocos visuais para subcomponentes
- Extraia funções puras para utils

### ❌ Props com `any` ou sem tipagem

```typescript
// ERRADO
const props = defineProps({ data: Object })

// CORRETO
interface Props {
  data: UserDTO
}
const props = defineProps<Props>()
```

### ❌ Emits como array de strings

```typescript
// ERRADO
const emit = defineEmits(['click', 'update'])

// CORRETO
interface Emits {
  (e: 'click'): void
  (e: 'update', value: string): void
}
const emit = defineEmits<Emits>()
```

### ❌ ID hardcoded no template

```vue
<!-- ERRADO — causa hydration mismatch -->
<div id="my-section">

<!-- CORRETO -->
<div :id="useId()">
```

### ❌ Lógica de negócio no template

```vue
<!-- ERRADO -->
<template>
  <span>{{ items.filter(i => i.active).map(i => i.name).join(', ') }}</span>
</template>

<!-- CORRETO -->
<script setup lang="ts">
const activeNames = computed(() =>
  items.value.filter(i => i.active).map(i => i.name).join(', ')
)
</script>
<template>
  <span>{{ activeNames }}</span>
</template>
```

### ❌ Auto-imports sem import explícito

```typescript
// ERRADO — depende de auto-import
const route = useRoute()

// CORRETO — import explícito
import { useRoute } from 'vue-router'
const route = useRoute()
```

---

## Examples

### Exemplo 1 — Componente base reutilizável

```vue
<!-- app/components/base/BaseButton.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  isDisabled?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  isDisabled: false,
})

const emit = defineEmits<Emits>()

function handleClick(event: MouseEvent) {
  if (!props.isLoading && !props.isDisabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--loading': isLoading, 'btn--disabled': isDisabled }
    ]"
    :disabled="isDisabled || isLoading"
    @click="handleClick"
  >
    <span v-if="isLoading" class="btn__spinner" />
    <slot v-else />
  </button>
</template>

<style scoped>
.btn {
  cursor: pointer;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### Exemplo 2 — Componente de domínio com composable

```typescript
// shared/types/UserDTO.ts
export interface UserDTO {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'user' | 'guest'
}
```

```typescript
// app/composables/useUser.ts
import { useFetch } from '#app'
import type { UserDTO } from '~/shared/types/UserDTO'

export function useUser(userId: Ref<string>) {
  const { data: user, pending, error } = useFetch<UserDTO>(
    () => `/api/users/${userId.value}`,
    { watch: [userId] }
  )

  const isAdmin = computed(() => user.value?.role === 'admin')

  return { user, pending, error, isAdmin }
}
```

```vue
<!-- app/components/user/UserProfileCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useId } from '#app'
import { useUser } from '~/app/composables/useUser'
import type { UserDTO } from '~/shared/types/UserDTO'

interface Props {
  userId: string
}

interface Emits {
  (e: 'edit', user: UserDTO): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userIdRef = computed(() => props.userId)
const { user, pending, isAdmin } = useUser(userIdRef)

function handleEdit() {
  if (user.value) {
    emit('edit', user.value)
  }
}
</script>

<template>
  <div :id="useId()" class="user-profile-card">
    <p v-if="pending">Carregando perfil...</p>
    <template v-else-if="user">
      <img :src="user.avatar" :alt="user.name" />
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <span v-if="isAdmin" class="badge-admin">Admin</span>
      <button @click="handleEdit">Editar</button>
    </template>
    <p v-else>Usuário não encontrado</p>
  </div>
</template>

<style scoped>
.user-profile-card {
  padding: 1rem;
  border-radius: 0.5rem;
}

.badge-admin {
  color: white;
  background-color: #e53e3e;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}
</style>
```

### Exemplo 3 — Server component + lazy hydration

```vue
<!-- app/components/shared/AppFooter.server.vue -->
<script setup lang="ts">
interface Props {
  companyName: string
  links: { label: string; href: string }[]
}

const props = defineProps<Props>()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <nav>
      <a v-for="link in links" :key="link.href" :href="link.href">
        {{ link.label }}
      </a>
    </nav>
    <p>&copy; {{ currentYear }} {{ companyName }}</p>
  </footer>
</template>
```

```vue
<!-- Uso na página com lazy hydration -->
<template>
  <div>
    <AppHeader />
    <main>
      <NuxtPage />
    </main>
    <!-- Footer é server component + lazy (nunca hidrata no client) -->
    <LazyAppFooter
      hydrate-never
      company-name="Minha Empresa"
      :links="footerLinks"
    />
  </div>
</template>
```

---

## Troubleshooting

### Hydration Mismatch

- **Sintoma**: Warning no console: `Hydration node mismatch` ou `Hydration text content mismatch`
- **Causa**: O HTML gerado no servidor difere do que o Vue espera no cliente. Geralmente causado por IDs dinâmicos, `Date.now()`, `Math.random()`, ou conteúdo que depende de APIs do browser
- **Solução**:
  - Use `useId()` para IDs dinâmicos
  - Envolva código browser-only com `<ClientOnly>` ou use `.client.vue`
  - Nunca use `Math.random()` ou `Date.now()` para gerar valores no template

### Componente não aparece

- **Sintoma**: O componente não renderiza e não dá erro
- **Causa**: Nome do arquivo não segue a convenção ou está na pasta errada
- **Solução**:
  - Verifique se o nome é `PascalCase.vue`
  - Verifique se está dentro de `app/components/` (ou subpasta)
  - Se usar import explícito, verifique o path
  - Confira se não há erro de tipagem nas props obrigatórias

### Server component não funciona

- **Sintoma**: Componente `.server.vue` se comporta como componente normal
- **Causa**: Feature experimental não habilitada
- **Solução**: Adicione ao `nuxt.config.ts`:
  ```typescript
  export default defineNuxtConfig({
    experimental: {
      componentIslands: true,
    },
  })
  ```

### Lazy component carrega imediatamente

- **Sintoma**: Componente com `hydrate-on-visible` hidrata no load da página
- **Causa**: O componente está acima do fold (visível no viewport inicial) ou props mudaram
- **Causa alternativa**: Não usou o prefixo `Lazy` no nome
- **Solução**:
  - Confirme que o componente está realmente fora do viewport
  - Use `<LazyComponente>` (com prefixo `Lazy`)
  - Evite mudar props antes da hidratação

### Props reativas não atualizam

- **Sintoma**: Componente filho não re-renderiza quando prop muda
- **Causa**: Desestruturação de props quebra a reatividade
- **Solução**:
  ```typescript
  // ❌ ERRADO — perde reatividade
  const { title, count } = defineProps<Props>()

  // ✅ CORRETO — mantém reatividade
  const props = defineProps<Props>()
  // Use props.title, props.count no script
  // Use title, count diretamente no template
  ```

---

## Limitations

- Esta skill cobre apenas componentes dentro de `app/components/`. Páginas (`app/pages/`) e layouts (`app/layouts/`) têm convenções próprias
- Server components (`.server.vue`) são experimentais no Nuxt 4 e podem mudar em versões futuras
- A regra de imports explícitos pode gerar mais verbosidade, mas garante rastreabilidade e evita bugs silenciosos
- Lazy hydration só funciona com SSR habilitado — em modo SPA, todos os componentes hidratam normalmente
