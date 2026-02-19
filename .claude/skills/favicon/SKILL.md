---
name: favicon
description: "Gerar favicons, app icons e configurar @nuxt/icon com Iconify no Nuxt 4. Cobre setup, custom collections, client bundle, favicon generation e web manifest."
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Favicon & Icons — Nuxt 4

Guia completo para configurar ícones no projeto: desde o `@nuxt/icon` (200k+ ícones Iconify) até favicon, apple-touch-icon e PWA manifest.

## Stack

- `@nuxt/icon` — componente `<Icon>` com 200k+ ícones Iconify
- `@iconify-json/*` — coleções instaladas localmente (SSR-friendly)
- SVGs customizados em `app/assets/icons/` — coleções próprias
- `sharp` — geração de favicons estáticos a partir de imagem source

---

## 1. Setup do @nuxt/icon

### Instalação

```bash
npx nuxi module add icon
# Instalar coleções que vai usar:
npm i -D @iconify-json/lucide @iconify-json/heroicons
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: ['@nuxt/icon'],

  icon: {
    // Limitar server bundle às coleções usadas
    serverBundle: {
      collections: ['lucide', 'heroicons'],
    },
    // Client bundle para ícones frequentes (evita requests)
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },
})
```

### app.config.ts

```typescript
export default defineAppConfig({
  icon: {
    size: '24px',
    class: 'icon',
    mode: 'css',
    cssLayer: 'base', // OBRIGATÓRIO com Tailwind CSS v4
    aliases: {
      'spinner': 'lucide:loader-2',
      'close': 'lucide:x',
      'menu': 'lucide:menu',
      'check': 'lucide:check',
      'chevron-down': 'lucide:chevron-down',
      'arrow-right': 'lucide:arrow-right',
    },
  },
})
```

---

## 2. Uso do Componente `<Icon>`

### Básico

```vue
<template>
  <!-- Iconify (200k+ ícones) -->
  <Icon name="lucide:home" />
  <Icon name="heroicons:heart-solid" />

  <!-- Com alias definido no app.config.ts -->
  <Icon name="close" />

  <!-- Tamanho e cor via Tailwind -->
  <Icon name="lucide:star" class="size-6 text-primary-500" />

  <!-- SVG custom local -->
  <Icon name="custom:logo" />
</template>
```

### Regras de Uso

| Regra | Detalhe |
|-------|---------|
| **Sempre instalar coleção local** | `@iconify-json/lucide` — nunca depender da API remota |
| **Preferir `css` mode** | Mais performático, padrão do módulo |
| **`cssLayer: 'base'`** | Obrigatório com Tailwind CSS v4 |
| **Aliases para ícones frequentes** | Definir em `app.config.ts` — facilita troca depois |
| **Nunca construir nome dinamicamente** | ❌ `` :name="`lucide:${icon}`" `` → ✅ `:name="dark ? 'lucide:moon' : 'lucide:sun'"` |
| **Tamanho via Tailwind** | Usar `class="size-5"` ao invés de `:size="20"` |

---

## 3. Coleções SVG Customizadas

Para ícones próprios da marca/produto:

### Estrutura

```
app/assets/icons/
├── logo.svg
├── logo-mark.svg
└── brand-symbol.svg
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
  },
})
```

### Uso

```vue
<Icon name="custom:logo" class="h-8 w-auto" />
<Icon name="custom:brand-symbol" class="size-6" />
```

---

## 4. Favicon & App Icons

### Opção A: Estáticos (Recomendado para produção)

#### Estrutura em `public/`

```
public/
├── favicon.ico          # 32x32 (navegadores)
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png # 180x180 (iOS)
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest
```

#### Gerar a partir de imagem source

```bash
npm i -D sharp
```

```typescript
// scripts/generate-favicons.ts
import sharp from 'sharp'
import { join } from 'path'

const SOURCE = 'source-icon.png' // 512x512 mínimo
const OUTPUT = 'public'

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
]

async function generate() {
  for (const { name, size } of sizes) {
    await sharp(SOURCE)
      .resize(size, size)
      .png()
      .toFile(join(OUTPUT, name))
    console.log(`✅ ${name}`)
  }

  await sharp(SOURCE)
    .resize(32, 32)
    .toFile(join(OUTPUT, 'favicon.ico'))
  console.log('✅ favicon.ico')
}

generate()
```

```bash
npx tsx scripts/generate-favicons.ts
```

#### Configurar no nuxt.config.ts

```typescript
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'theme-color', content: '#6366f1' },
      ],
    },
  },
})
```

#### site.webmanifest

```json
{
  "name": "Nome do App",
  "short_name": "App",
  "description": "Descrição do app",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/"
}
```

### Opção B: SVG Inline como Favicon

Para favicons simples baseados em texto/letra:

```typescript
// nuxt.config.ts → app.head.link
{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
```

```xml
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#6366f1"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="white">
    A
  </text>
</svg>
```

Suporta dark mode nativo:

```xml
<!-- public/favicon.svg com dark mode -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    rect { fill: #6366f1; }
    text { fill: white; }
    @media (prefers-color-scheme: dark) {
      rect { fill: #818cf8; }
    }
  </style>
  <rect width="32" height="32" rx="6"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="system-ui, sans-serif" font-size="20" font-weight="700">
    A
  </text>
</svg>
```

---

## 5. Design Guidelines por Tipo de App

| Tipo | Estilo | Cores | Ícone |
|------|--------|-------|-------|
| Finance/Banking | Mínimo, profissional | Azul, verde, escuro | Letra, escudo, gráfico |
| Produtividade | Clean, moderno | Roxo, azul | Check, layers, grid |
| Social/Comunidade | Amigável, quente | Laranja, rosa | Coração, pessoas, chat |
| Dev Tools | Técnico, dark | Cinza escuro, cyan | Terminal, brackets, code |
| E-commerce | Bold, confiável | Laranja, azul | Carrinho, bag, tag |
| Saúde/Fitness | Energético, fresco | Verde, teal | Coração, folha, pulso |
| Educação | Acessível | Azul, amarelo | Livro, lâmpada, cap |

### Paletas para Gradiente

```css
/* Profissional */  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
/* Criativo */      background: linear-gradient(135deg, #ec4899, #8b5cf6);
/* Crescimento */   background: linear-gradient(135deg, #059669, #10b981);
/* Energia */       background: linear-gradient(135deg, #ea580c, #f59e0b);
/* Confiança */     background: linear-gradient(135deg, #0284c7, #06b6d4);
/* Mínimo escuro */ background: #0f172a;
/* Mínimo claro */  background: #f8fafc;
```

---

## 6. Workflow para Gerar Favicon

### Passo 1: Detectar informações do projeto

```bash
# Verificar esses arquivos em ordem:
cat package.json           # name, description
cat nuxt.config.ts         # app.head.title, theme-color
cat app/app.config.ts      # icon config
cat README.md              # H1 = nome do app
ls public/favicon*         # ícones existentes
```

### Passo 2: Escolher abordagem

| Cenário | Abordagem |
|---------|-----------|
| Tem logo/imagem source (512x512+) | **Opção A** — Sharp para gerar todos os tamanhos |
| App profissional sem logo ainda | **Opção B** — SVG com letra/inicial + gradiente da marca |
| MVP/protótipo rápido | **Opção B** — SVG com emoji ou ícone simples |

### Passo 3: Gerar e configurar

1. Criar os arquivos em `public/`
2. Configurar `app.head.link` no `nuxt.config.ts`
3. Criar `public/site.webmanifest`
4. Testar em devtools → Application → Manifest

---

## 7. Coleções Iconify Recomendadas

| Coleção | Pacote | Ícones | Ideal para |
|---------|--------|--------|------------|
| Lucide | `@iconify-json/lucide` | 1500+ | UI geral, mais popular |
| Heroicons | `@iconify-json/heroicons` | 300+ | UI com estilo Tailwind |
| Phosphor | `@iconify-json/ph` | 1200+ | UI versátil, 6 pesos |
| Material Symbols | `@iconify-json/material-symbols` | 3000+ | UI Material Design |
| Simple Icons | `@iconify-json/simple-icons` | 2800+ | Logos de marcas/serviços |
| Logos | `@iconify-json/logos` | 1300+ | Logos coloridos de tech |
| Flag | `@iconify-json/flag` | 500+ | Bandeiras de países |

### Regra: Máximo 2-3 coleções por projeto

Manter consistência visual. Escolher 1 principal (ex: Lucide) + 1 para logos (Simple Icons).

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Ícone não aparece (CSS mode) | Adicionar `cssLayer: 'base'` no `app.config.ts` |
| Ícone carrega com delay | Instalar coleção local `@iconify-json/xxx` |
| Favicon não atualiza | Hard refresh `Cmd+Shift+R`, limpar cache |
| Apple icon não aparece | Deve ser PNG 180x180 exato |
| Custom SVG não encontrado | Verificar `prefix` e `dir` no `nuxt.config.ts` |
| Build lento com muitos ícones | Usar `serverBundle.collections` para limitar |
| Ícone quebra em SSR | Não usar `provider: 'iconify'`, manter `local` |
| Nome dinâmico não detectado no scan | Adicionar manualmente em `clientBundle.icons` |
