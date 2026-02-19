---
name: ux-design
description: >
  Use esta skill quando for criar interfaces, definir tokens de design, projetar estados
  de tela (empty, loading, error), onboarding, formulários, CTAs ou qualquer decisão
  visual/UX. Cobre Design System com Tailwind CSS e princípios de UX aplicados ao Nuxt 4.
version: "1.0"
risk: safe
tags: [nuxt4, tailwind, ux, design-system, acessibilidade, responsive]
---

# UX Design & Design System — Nuxt 4 + Tailwind CSS

## Overview

Guia completo para decisões de UX e Design System em projetos Nuxt 4 com Tailwind CSS (via `@nuxtjs/tailwindcss`). Define tokens de design, padrões visuais, estados de tela, micro-interactions e acessibilidade. Filosofia: interfaces que o usuário consegue usar sem instrução.

## When to Use

- Use quando for criar qualquer interface ou componente visual
- Use quando for definir ou ajustar tokens de design (cores, spacing, tipografia)
- Use quando for projetar estados de tela (empty, loading, error, success)
- Use quando for criar onboarding, formulários, CTAs ou landing pages
- Use quando precisar garantir acessibilidade e responsividade
- NÃO use para estrutura de pastas → veja `arquitetura-pastas`
- NÃO use para regras de criação de componentes → veja `componentizacao`

---

# PARTE 1 — DESIGN SYSTEM

## Configuração do Tailwind CSS

O projeto usa o módulo `@nuxtjs/tailwindcss`. A configuração segue o padrão CSS-first do Tailwind v4.

### Setup no `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    cssPath: '~/app/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    viewer: true,
  },
})
```

### Arquivo CSS principal

```css
/* app/assets/css/tailwind.css */
@import "tailwindcss";

@theme {
  /* === CORES === */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;

  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
  --color-neutral-950: #0a0a0a;

  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;

  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  --color-info-50: #f0f9ff;
  --color-info-500: #06b6d4;
  --color-info-600: #0891b2;

  /* === TIPOGRAFIA === */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* === BORDER RADIUS === */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

---

## Cores Semânticas

Cores organizadas por **intenção**, não por valor visual.

| Token | Uso | Exemplo de classe |
|-------|-----|-------------------|
| `primary` | Ações principais, links, brand | `bg-primary-500`, `text-primary-600` |
| `neutral` | Textos, borders, backgrounds | `text-neutral-700`, `bg-neutral-50` |
| `success` | Confirmações, status positivo | `text-success-600`, `bg-success-50` |
| `warning` | Alertas, atenção | `text-warning-600`, `bg-warning-50` |
| `error` | Erros, destrutivo | `text-error-600`, `bg-error-50` |
| `info` | Informacional, dicas | `text-info-600`, `bg-info-50` |

### Regras de uso de cores

- **Texto principal**: `text-neutral-900` (light) / `dark:text-neutral-100`
- **Texto secundário**: `text-neutral-500` (light) / `dark:text-neutral-400`
- **Background padrão**: `bg-white` (light) / `dark:bg-neutral-950`
- **Background sutil**: `bg-neutral-50` (light) / `dark:bg-neutral-900`
- **Borders**: `border-neutral-200` (light) / `dark:border-neutral-800`
- **Links**: `text-primary-600 hover:text-primary-700`
- **Nunca** usar cores hardcoded (ex: `bg-blue-500`). Sempre usar tokens semânticos.

---

## Tipografia

### Escala tipográfica

| Classe | Tamanho | Uso |
|--------|---------|-----|
| `text-xs` | 12px | Captions, labels pequenos |
| `text-sm` | 14px | Texto secundário, labels |
| `text-base` | 16px | Corpo do texto (padrão) |
| `text-lg` | 18px | Texto de destaque |
| `text-xl` | 20px | Subtítulos de seção |
| `text-2xl` | 24px | Títulos de card/seção |
| `text-3xl` | 30px | Títulos de página |
| `text-4xl` | 36px | Hero headlines |

### Regras tipográficas

- **Font principal**: `font-sans` (Inter ou system-ui)
- **Font código**: `font-mono` (JetBrains Mono)
- **Peso do corpo**: `font-normal` (400)
- **Peso de labels/ênfase**: `font-medium` (500)
- **Peso de títulos**: `font-semibold` (600) ou `font-bold` (700)
- **Line height do corpo**: `leading-relaxed` (1.625)
- **Line height de títulos**: `leading-tight` (1.25)
- **Max width para leitura**: `max-w-prose` (~65ch)

---

## Spacing System

| Classe | Valor | Uso comum |
|--------|-------|-----------|
| `p-1` / `gap-1` | 4px | Micro espaçamento interno |
| `p-2` / `gap-2` | 8px | Espaçamento entre ícone e texto |
| `p-3` / `gap-3` | 12px | Padding de inputs, tags |
| `p-4` / `gap-4` | 16px | Padding padrão de cards, gap de listas |
| `p-6` / `gap-6` | 24px | Padding de seções, gap entre cards |
| `p-8` / `gap-8` | 32px | Separação de seções |
| `p-12` / `gap-12` | 48px | Espaçamento entre seções de página |
| `p-16` / `gap-16` | 64px | Separação hero / seção grande |

### Regras de spacing

- **Consistência**: usar sempre a escala do Tailwind (4, 8, 12, 16, 24, 32, 48, 64)
- **Nunca** usar valores arbitrários (`p-[13px]`) exceto para alinhamento pixel-perfect
- **Hierarquia**: mais espaço = mais separação = menos relação entre elementos
- **Inside-out**: padding interno > gap entre irmãos > margin entre seções

---

## Elevation (Shadows)

| Nível | Classe | Uso |
|-------|--------|-----|
| 0 | `shadow-none` | Elementos flat (default) |
| 1 | `shadow-xs` | Inputs, dividers sutis |
| 2 | `shadow-sm` | Cards, dropdowns fechados |
| 3 | `shadow-md` | Cards em hover, dropdowns abertos |
| 4 | `shadow-lg` | Modais, popovers |
| 5 | `shadow-xl` | Toasts, dialogs flutuantes |

**Regra**: Elementos interativos podem subir de elevation no hover com `transition-shadow duration-200`.

---

## Border Radius

| Classe | Uso |
|--------|-----|
| `rounded-md` | Inputs, tags, badges |
| `rounded-lg` | Cards, buttons |
| `rounded-xl` | Cards grandes, modais |
| `rounded-2xl` | Hero sections, overlays |
| `rounded-full` | Avatares, pills, ícones circulares |

**Regra**: Manter consistência por tipo — cards sempre `rounded-lg`, buttons `rounded-lg`, inputs `rounded-md`.

---

## Breakpoints & Responsive

| Breakpoint | Prefixo | Largura | Dispositivo |
|------------|---------|---------|-------------|
| default | — | 0px+ | Mobile (base) |
| `sm` | `sm:` | 640px+ | Mobile landscape |
| `md` | `md:` | 768px+ | Tablet |
| `lg` | `lg:` | 1024px+ | Desktop |
| `xl` | `xl:` | 1280px+ | Desktop grande |
| `2xl` | `2xl:` | 1536px+ | Monitor ultrawide |

### Mobile-first (obrigatório)

**Sempre** começar pelo mobile e adicionar breakpoints maiores:

```html
<!-- ✅ CORRETO: Mobile-first -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

<!-- ❌ ERRADO: Desktop-first -->
<div class="grid grid-cols-3 sm:grid-cols-1">
```

### Patterns responsivos comuns

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Grid de cards | 1 col | 2 cols | 3-4 cols |
| Sidebar + content | Drawer | Sidebar fixa | Sidebar fixa |
| Navegação | Hamburger | Tab bar | Navbar horizontal |
| Tabela de dados | Cards stack | Scroll horizontal | Tabela completa |
| Formulário | 1 coluna | 1 coluna | 2 colunas |
| Hero | Stack vertical | Stack vertical | Side-by-side |

---

## Dark Mode

Estratégia: `class`-based via `@nuxtjs/color-mode`.

### Setup

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
})
```

### Padrões de aplicação

```html
<div class="bg-white dark:bg-neutral-950">
<p class="text-neutral-900 dark:text-neutral-100">Texto principal</p>
<p class="text-neutral-500 dark:text-neutral-400">Texto secundário</p>
<div class="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
<input class="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-100" />
```

### Regras de dark mode

- **Sempre** definir variantes dark junto com as light
- Backgrounds: inverter claro → escuro (`white` → `neutral-950`)
- Textos: inverter escuro → claro (`neutral-900` → `neutral-100`)
- Borders: subir escala (`neutral-200` → `neutral-800`)
- Cores semânticas (primary, success, error): mantêm o mesmo tom
- **Testar**: contraste mínimo 4.5:1 (AA)

---

# PARTE 2 — PRINCÍPIOS DE UX

## Filosofia Core

| Princípio | Aplicação |
|-----------|-----------|
| **ANTECIPAR** | Saber o que o usuário quer antes dele pedir |
| **SIMPLIFICAR** | Reduzir ao essencial — se pode remover, remova |
| **GUIAR** | Mostrar o caminho, não explicar |
| **ENCANTAR** | Pequenos momentos de satisfação nas interações |
| **EMPODERAR** | Fazer o usuário se sentir capaz, não confuso |

### Teste de Usabilidade

Antes de qualquer decisão de UI:

1. O usuário consegue usar isso sem instrução?
2. Parece óbvio e inevitável?
3. Removemos tudo que não é essencial?
4. Cada ação tem feedback claro?

---

## Empty States

**Meta**: Nunca deixar o usuário olhando para tela vazia.

### Tipos

| Tipo | Mindset do usuário | Objetivo |
|------|-------------------|----------|
| **First-use** | Curioso mas inseguro | Guiar para primeira ação |
| **No results** | Frustrado | Ajudar a encontrar |
| **User cleared** | Realizado | Celebrar + sugerir próximo |
| **Error state** | Bloqueado | Caminho claro para resolver |

### Anatomia

```
┌─────────────────────────────────────┐
│         [Ícone/Ilustração]          │  ← Opcional
│      Headline claro e amigável      │  ← O que acontece
│   Breve explicação (1-2 frases)     │  ← Contexto
│      [ CTA Primário ]               │  ← Uma ação clara
│         texto auxiliar              │  ← Orientação extra
└─────────────────────────────────────┘
```

### Regras

- **Nunca vazio de verdade**: sempre ter conteúdo
- **Um CTA principal**: uma ação clara (Lei de Hick)
- **Contextual**: estados diferentes para telas diferentes
- **Starter content**: exemplos pré-criados para explorar
- **Acessível**: decorativos com `aria-hidden="true"`

---

## Loading States

**Meta**: O usuário nunca deve se perguntar "travou?"

### Hierarquia

| Técnica | Quando | Percepção |
|---------|--------|-----------|
| **Skeleton screen** | Conteúdo estruturado | ⭐⭐⭐ Mais rápida |
| **Optimistic UI** | Ações que raramente falham | ⭐⭐⭐ Mais rápida |
| **Progress bar** | Duração conhecida (uploads) | ⭐⭐ Boa |
| **Spinner + texto** | Ações 2-5s | ⭐ Regular |
| **Spinner** | Ações <2s | ⭐ Regular |

### Regras de timing

- **< 100ms**: sem indicador (instantâneo)
- **100ms–1s**: spinner sutil ou skeleton
- **1s–5s**: skeleton com texto ou progress
- **> 5s**: progress bar com estimativa
- **Sempre** manter layout estável (sem layout shift)
- **Skeleton** deve ter a mesma forma do conteúdo real

---

## Onboarding

**Meta**: Levar ao "Momento Aha" o mais rápido possível.

### Patterns

| Pattern | Quando | Implementação |
|---------|--------|---------------|
| **Progressive** | Produtos complexos | Revelar features conforme necessidade |
| **Tour interativo** | Apps feature-rich | Guiar por ações, não explicações |
| **Checklist** | Goal-oriented | 3-5 tasks max com progresso |
| **Contextual** | Produtos simples | Tooltips no primeiro encontro |
| **Empty State** | Content-driven | Telas vazias viram guias |

### Regras

1. **Adiar tudo**: não peça info desnecessária, adie verificação de email
2. **Uma coisa por tela**: uma ação/pergunta por step, com progresso claro
3. **Aprender fazendo**: ações reais com feedback imediato
4. **Celebrar wins**: feedback positivo a cada step

### O que EVITAR

- 5+ telas de intro explicando features
- Onboarding visual diferente do app
- Pedir permissões antes de provar valor
- Forçar registro para ver funcionalidade core

---

## Progressive Disclosure

**Meta**: Mostrar só o necessário, no momento necessário.

### Níveis

```
Nível 0: Essencial (sempre visível)
    ↓
Nível 1: Importante (1 clique)
    ↓
Nível 2: Avançado (2 cliques)
    ↓
Nível 3+: Evitar
```

### Patterns

| Pattern | Caso de uso |
|---------|------------|
| **Accordion** | FAQs, settings |
| **Tabs** | Conteúdo categorizado |
| **Hover/Click** | Interfaces densas |
| **"Ver mais"** | Listas longas |
| **Modal/Drawer** | Ações complexas |
| **Wizard** | Processos multi-step |

### Regras

- Default simples — interface mínima viável
- Max 3 níveis — se precisa mais, reorganize
- Affordances claras — usuário sabe que há mais
- Lembrar estado — persistir preferências
- Não esconder info crítica

---

## CTAs & Conversão

### Hierarquia

```
PRIMARY    →  Alto contraste, tamanho proeminente, cor primary
SECONDARY  →  Menor contraste, outline ou ghost
TERTIARY   →  Estilo de link (text-only)
```

### Fórmula de copy

```
[Verbo de ação] + [O que ganha] + [Urgência/Benefício]

"Começar agora →"
"Criar conta grátis"
"Ver como funciona"
```

### Conversões melhores

| Em vez de... | Use... | Por quê |
|-------------|--------|---------|
| "Enviar" | "Criar minha conta" | Orientado à ação |
| "Cadastrar" | "Começar grátis" | Mostra valor |
| "Saiba mais" | "Ver como funciona" | Específico |
| "Comprar" | "Garantir meu acesso" | Menor fricção |

### Regras

- **Acima do fold**: CTA primário sempre visível
- **Após benefício**: CTA segue proposta de valor
- **Foco único**: um CTA primário por viewport
- **Tamanho**: mínimo 44px altura (acessibilidade)
- **Whitespace**: espaço ao redor para respirar

---

## Forms UX

### Regras gerais

- Menos campos = mais conversão (~7% por campo extra)
- 1 coluna mobile, 2 colunas desktop só se campos relacionados
- Labels sempre visíveis (não usar placeholder como label)
- Autofocus no primeiro campo
- Tab order lógico

### Validação inline

```
Timing: Validar ao blur, não enquanto digita
Sucesso: ✅ checkmark verde sutil
Erro: ❌ borda vermelha + mensagem abaixo
Neutro: Borda padrão
```

### Mensagens de erro

| Ruim | Bom |
|------|-----|
| "Campo inválido" | "Use um email válido, ex: nome@email.com" |
| "Erro no formulário" | "A senha precisa ter pelo menos 8 caracteres" |
| "Valor incorreto" | "O CEP deve ter 8 números, ex: 01310-100" |

### Regras de erro

- **Inline**: abaixo do campo, não em toast
- **Específico**: exatamente o que está errado e como corrigir
- **Imediato**: feedback no blur, não só no submit
- **Persistente**: visível até corrigir
- **Não culpar**: "O email precisa de @" em vez de "Você digitou errado"

---

## Micro-interactions & Feedback

### Feedback por ação

| Ação | Feedback | Timing |
|------|----------|--------|
| Click/Tap | Visual (escala, cor) | <100ms |
| Form Submit | Loading → Sucesso/Erro | Progressivo |
| Background | Indicador de progresso | Contínuo |
| Completion | Sucesso + próximo passo | Imediato |
| Error | Mensagem inline + solução | Imediato |

### Estados de botão

```
Default → Hover → Active → Loading → Success/Error → Default
```

### Transições

- **Duração padrão**: `duration-200` (hover, active)
- **Duração média**: `duration-300` (modais, drawers, accordions)
- **Easing**: `ease-in-out` maioria, `ease-out` entradas, `ease-in` saídas
- **Regra**: animações devem ser funcionais, não decorativas

---

## Acessibilidade Essencial (WCAG AA)

### Regras mínimas

| Regra | Requisito |
|-------|-----------|
| Contraste texto | 4.5:1 (normal), 3:1 (grande) |
| Contraste UI | 3:1 para borders, icons, inputs |
| Focus visible | Indicador visível em todos interativos |
| Keyboard nav | Tudo acessível via Tab, Enter, Space, Esc |
| Alt text | Informativas com `alt`, decorativas com `alt=""` |
| Labels | Todo input com label associado |
| Headings | Hierarquia lógica (h1 → h2 → h3) |
| Touch target | Mínimo 44x44px |

### Por componente

**Botões**: `<button>` para ações, `<a>` para nav. `aria-label` quando só ícone. Focus ring com `focus-visible:outline-2 focus-visible:outline-primary-500`.

**Modais**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, `Esc` fecha, foco retorna ao trigger.

**Formulários**: `<label for="">`, `aria-describedby` para erros, `aria-invalid="true"` em campos com erro, `aria-required="true"`.

**Imagens**: Informativas `alt="descrição"`, decorativas `alt="" aria-hidden="true"`.

### Focus ring padrão

```html
<button class="focus:outline-none focus-visible:outline-2
               focus-visible:outline-offset-2 focus-visible:outline-primary-500">
```

**Nunca** usar `outline-none` sem `focus-visible` como substituto.

---

# PARTE 3 — CHECKLIST

## Checklist de UX por tela

### Antes de construir
- [ ] Qual é o objetivo do usuário nesta tela?
- [ ] Qual é a UMA ação principal?
- [ ] Qual é a informação mínima necessária?

### Design System
- [ ] Cores semânticas (primary, success, error)?
- [ ] Tipografia na escala definida?
- [ ] Spacing consistente?
- [ ] Dark mode implementado?

### Estados de tela
- [ ] Empty states projetados?
- [ ] Loading states (skeleton)?
- [ ] Error states com soluções claras?
- [ ] Success states com próximo passo?

### Interações
- [ ] Toda ação tem feedback visual?
- [ ] Transições suaves (200-300ms)?
- [ ] Estados de botão completos (hover, active, loading, disabled)?

### Formulários
- [ ] Labels visíveis?
- [ ] Validação inline no blur?
- [ ] Mensagens de erro específicas?
- [ ] Autofocus + tab order?

### Responsive
- [ ] Mobile-first?
- [ ] Touch targets >= 44px?
- [ ] Layout funcional em 320px?

### Acessibilidade
- [ ] Contraste AA?
- [ ] Keyboard nav funcional?
- [ ] Focus rings visíveis?
- [ ] Alt text + labels?
- [ ] Hierarquia de headings?

---

## Limitations

- Para implementação de componentes, veja `componentizacao`
- Tokens de design são sugestões iniciais — ajuste para identidade do projeto
- Acessibilidade nível AAA não coberta — foco em AA
- Animações complexas (Lottie, GSAP) fora do escopo
- Testes de usabilidade e A/B testing fora do escopo técnico

## References

- `references/examples.md` → Exemplos completos em Vue + Tailwind
- `references/design-tokens.md` → Tabela rápida de tokens
