# Design Tokens — Quick Reference

Tabela rápida de todos os tokens do Design System. Consulta rápida para uso durante desenvolvimento.

---

## Cores Semânticas

### Primary (Brand / Ações principais)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary-50` | `#eff6ff` | Background hover sutil |
| `primary-100` | `#dbeafe` | Background de badges, tags |
| `primary-200` | `#bfdbfe` | Borders de elementos selecionados |
| `primary-300` | `#93c5fd` | Borders de inputs focados (light) |
| `primary-400` | `#60a5fa` | Ícones secundários |
| `primary-500` | `#3b82f6` | Ícones, indicadores, focus ring |
| `primary-600` | `#2563eb` | **Botões, links, CTAs** |
| `primary-700` | `#1d4ed8` | Hover de botões e links |
| `primary-800` | `#1e40af` | Active/pressed state |
| `primary-900` | `#1e3a8a` | Texto em backgrounds claros |
| `primary-950` | `#172554` | Background dark mode sutil |

### Neutral (Texto / Borders / Backgrounds)

| Token | Hex | Uso |
|-------|-----|-----|
| `neutral-50` | `#fafafa` | Background sutil (light) |
| `neutral-100` | `#f5f5f5` | Background de seções alternadas |
| `neutral-200` | `#e5e5e5` | Borders (light), dividers |
| `neutral-300` | `#d4d4d4` | Borders de inputs (light) |
| `neutral-400` | `#a3a3a3` | Placeholders, ícones inativos |
| `neutral-500` | `#737373` | **Texto secundário (light)** |
| `neutral-600` | `#525252` | Texto de labels |
| `neutral-700` | `#404040` | Texto de corpo (light), borders de inputs (dark) |
| `neutral-800` | `#262626` | Borders (dark), backgrounds de cards (dark) |
| `neutral-900` | `#171717` | **Texto principal (light)**, backgrounds (dark) |
| `neutral-950` | `#0a0a0a` | **Background principal (dark)** |

### Success (Confirmação / Positivo)

| Token | Hex | Uso |
|-------|-----|-----|
| `success-50` | `#f0fdf4` | Background de alertas de sucesso |
| `success-500` | `#22c55e` | Ícones de sucesso, checkmarks |
| `success-600` | `#16a34a` | Texto de sucesso |
| `success-700` | `#15803d` | Texto de sucesso em background claro |

### Warning (Atenção / Alerta)

| Token | Hex | Uso |
|-------|-----|-----|
| `warning-50` | `#fffbeb` | Background de alertas de warning |
| `warning-500` | `#f59e0b` | Ícones de warning |
| `warning-600` | `#d97706` | Texto de warning |

### Error (Erro / Destrutivo)

| Token | Hex | Uso |
|-------|-----|-----|
| `error-50` | `#fef2f2` | Background de alertas de erro |
| `error-500` | `#ef4444` | Ícones de erro, borders de inputs inválidos |
| `error-600` | `#dc2626` | Texto de erro, botões destrutivos |
| `error-700` | `#b91c1c` | Hover de botões destrutivos |

### Info (Informacional / Dicas)

| Token | Hex | Uso |
|-------|-----|-----|
| `info-50` | `#f0f9ff` | Background de alertas info |
| `info-500` | `#06b6d4` | Ícones info |
| `info-600` | `#0891b2` | Texto info |

---

## Mapeamento Light ↔ Dark

| Elemento | Light | Dark |
|----------|-------|------|
| Background página | `bg-white` | `dark:bg-neutral-950` |
| Background sutil | `bg-neutral-50` | `dark:bg-neutral-900` |
| Background card | `bg-white` | `dark:bg-neutral-900` |
| Background input | `bg-white` | `dark:bg-neutral-900` |
| Texto principal | `text-neutral-900` | `dark:text-neutral-100` |
| Texto secundário | `text-neutral-500` | `dark:text-neutral-400` |
| Texto terciário | `text-neutral-400` | `dark:text-neutral-500` |
| Border padrão | `border-neutral-200` | `dark:border-neutral-800` |
| Border input | `border-neutral-300` | `dark:border-neutral-700` |
| Placeholder | `placeholder:text-neutral-400` | `dark:placeholder:text-neutral-500` |
| Hover sutil | `hover:bg-neutral-50` | `dark:hover:bg-neutral-800` |

---

## Tipografia

### Fontes

| Token | Valor | Classe |
|-------|-------|--------|
| Sans | `'Inter', ui-sans-serif, system-ui, sans-serif` | `font-sans` |
| Mono | `'JetBrains Mono', ui-monospace, monospace` | `font-mono` |

### Escala de Tamanhos

| Classe | px | rem | Uso |
|--------|-----|-----|-----|
| `text-xs` | 12 | 0.75 | Captions, badges |
| `text-sm` | 14 | 0.875 | Labels, texto auxiliar |
| `text-base` | 16 | 1 | Corpo (padrão) |
| `text-lg` | 18 | 1.125 | Destaque |
| `text-xl` | 20 | 1.25 | Subtítulos |
| `text-2xl` | 24 | 1.5 | Títulos de card |
| `text-3xl` | 30 | 1.875 | Títulos de página |
| `text-4xl` | 36 | 2.25 | Hero headlines |

### Pesos

| Classe | Valor | Uso |
|--------|-------|-----|
| `font-normal` | 400 | Corpo do texto |
| `font-medium` | 500 | Labels, ênfase, botões |
| `font-semibold` | 600 | Títulos de seção |
| `font-bold` | 700 | Títulos de página, hero |

### Line Heights

| Classe | Valor | Uso |
|--------|-------|-----|
| `leading-tight` | 1.25 | Títulos |
| `leading-snug` | 1.375 | Subtítulos |
| `leading-normal` | 1.5 | Default |
| `leading-relaxed` | 1.625 | Corpo de texto longo |

---

## Spacing

### Escala Completa

| Classe | px | rem | Uso típico |
|--------|-----|-----|-----------|
| `1` | 4 | 0.25 | Micro gap (ícone-texto inline) |
| `1.5` | 6 | 0.375 | Gap mínimo entre itens |
| `2` | 8 | 0.5 | Gap ícone-texto, padding mínimo |
| `2.5` | 10 | 0.625 | Padding vertical de inputs pequenos |
| `3` | 12 | 0.75 | Padding de tags, inputs |
| `4` | 16 | 1 | Padding de cards, gap de listas |
| `5` | 20 | 1.25 | Gap entre grupos de form |
| `6` | 24 | 1.5 | Padding de seções, gap entre cards |
| `8` | 32 | 2 | Separação entre blocos |
| `10` | 40 | 2.5 | Gap entre seções menores |
| `12` | 48 | 3 | Gap entre seções de página |
| `16` | 64 | 4 | Separação hero/seção grande |
| `20` | 80 | 5 | Padding vertical de hero |
| `24` | 96 | 6 | Espaço máximo entre seções |

### Referência Rápida por Componente

| Componente | Padding | Gap interno |
|------------|---------|-------------|
| Button | `px-4 py-2` (sm) / `px-6 py-3` (md) | `gap-2` |
| Input | `px-4 py-2.5` | — |
| Card | `p-4` (sm) / `p-4 md:p-6` (md) | `gap-4` |
| Modal | `p-6` | `gap-6` |
| Section | `py-12` / `py-16` | `gap-8` |
| Page | `px-4 md:px-6 lg:px-8` | `gap-12` |
| Navbar | `px-4 py-3` | `gap-4` |
| Badge/Tag | `px-2.5 py-0.5` | `gap-1` |
| Toast | `px-4 py-3` | `gap-3` |

---

## Border Radius

| Classe | Valor | Uso |
|--------|-------|-----|
| `rounded-sm` | 0.25rem (4px) | Micro elementos |
| `rounded-md` | 0.375rem (6px) | Inputs, tags, badges |
| `rounded-lg` | 0.5rem (8px) | **Cards, buttons** |
| `rounded-xl` | 0.75rem (12px) | Cards grandes, modais |
| `rounded-2xl` | 1rem (16px) | Hero sections |
| `rounded-full` | 9999px | Avatares, pills |

### Por Componente

| Componente | Radius |
|------------|--------|
| Button | `rounded-lg` |
| Input | `rounded-md` |
| Card | `rounded-lg` |
| Modal | `rounded-xl` |
| Badge | `rounded-md` |
| Avatar | `rounded-full` |
| Toast | `rounded-lg` |
| Tooltip | `rounded-lg` |
| Progress bar | `rounded-full` |

---

## Shadows (Elevation)

| Nível | Classe | Uso |
|-------|--------|-----|
| 0 | `shadow-none` | Flat (default) |
| 1 | `shadow-xs` | Inputs, dividers |
| 2 | `shadow-sm` | Cards default |
| 3 | `shadow-md` | Cards hover, dropdowns |
| 4 | `shadow-lg` | Modais, popovers |
| 5 | `shadow-xl` | Toasts, dialogs |

### Hover Pattern

```
shadow-sm → hover:shadow-md   (cards)
shadow-md → hover:shadow-lg   (cards destacados)
```

Sempre com `transition-shadow duration-200`.

---

## Breakpoints

| Nome | Prefixo | Min-width | Device |
|------|---------|-----------|--------|
| Base | — | 0px | Mobile |
| sm | `sm:` | 640px | Mobile landscape |
| md | `md:` | 768px | Tablet |
| lg | `lg:` | 1024px | Desktop |
| xl | `xl:` | 1280px | Desktop grande |
| 2xl | `2xl:` | 1536px | Ultrawide |

### Container Widths

| Classe | Uso |
|--------|-----|
| `max-w-sm` (384px) | Modais pequenos, forms auth |
| `max-w-md` (448px) | Cards, sidebars |
| `max-w-lg` (512px) | Modais médios |
| `max-w-xl` (576px) | Modais grandes |
| `max-w-2xl` (672px) | Conteúdo de leitura |
| `max-w-prose` (~65ch) | Texto longo (artigos) |
| `max-w-4xl` (896px) | Conteúdo principal |
| `max-w-6xl` (1152px) | Layout wide |
| `max-w-7xl` (1280px) | Container padrão de página |

---

## Transições

| Uso | Duração | Easing | Classe |
|-----|---------|--------|--------|
| Hover/Active | 150ms | ease-in-out | `transition-colors duration-150` |
| Interações gerais | 200ms | ease-in-out | `transition-all duration-200` |
| Modais/Drawers | 300ms | ease-out (enter) | `transition-all duration-300 ease-out` |
| Saída de elementos | 200ms | ease-in | `transition-all duration-200 ease-in` |
| Shadows | 200ms | ease-in-out | `transition-shadow duration-200` |
| Transform | 200ms | ease-in-out | `transition-transform duration-200` |

---

## Focus Ring (Acessibilidade)

Padrão para **todos** os elementos interativos:

```
focus:outline-none
focus-visible:outline-2
focus-visible:outline-offset-2
focus-visible:outline-primary-500
```

---

## Z-Index

| Camada | Classe | Uso |
|--------|--------|-----|
| Base | `z-0` | Conteúdo normal |
| Dropdown | `z-10` | Dropdowns, menus |
| Sticky | `z-20` | Headers sticky |
| Overlay | `z-30` | Overlays de fundo |
| Modal | `z-40` | Modais, drawers |
| Toast | `z-50` | Toasts, notifications |

---

## Touch Targets

| Elemento | Min Size | Classe |
|----------|----------|--------|
| Button | 44x44px | `min-h-[44px] min-w-[44px]` |
| Link (inline) | 44px height | `py-2` (padding suficiente) |
| Icon button | 44x44px | `p-2.5` com ícone 24px |
| Checkbox/Radio | 44x44px | `h-5 w-5` com padding ao redor |
| List item tap | 44px height | `py-3` mínimo |

---

## Cheat Sheet — Combinações Frequentes

### Botão Primário

```
bg-primary-600 text-white rounded-lg px-6 py-3
font-medium transition-colors duration-200
hover:bg-primary-700 active:bg-primary-800
disabled:opacity-50 disabled:cursor-not-allowed
focus:outline-none focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-primary-500
```

### Botão Secundário

```
border border-neutral-300 bg-white text-neutral-700 rounded-lg px-4 py-2
font-medium transition-colors duration-200
hover:bg-neutral-50
dark:border-neutral-700 dark:bg-neutral-900
dark:text-neutral-300 dark:hover:bg-neutral-800
focus:outline-none focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-primary-500
```

### Card Padrão

```
rounded-lg border border-neutral-200 bg-white p-4 md:p-6
dark:border-neutral-800 dark:bg-neutral-900
```

### Card Hoverable

```
rounded-lg border border-neutral-200 bg-white p-4 md:p-6
shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer
dark:border-neutral-800 dark:bg-neutral-900
```

### Input Padrão

```
w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm
bg-white text-neutral-900
placeholder:text-neutral-400
transition-colors duration-200
focus:outline-none focus:ring-2 focus:ring-primary-500
dark:border-neutral-700 dark:bg-neutral-900
dark:text-neutral-100 dark:placeholder:text-neutral-500
```

### Input com Erro

```
border-error-300 focus:ring-error-500
dark:border-error-700
```

### Badge/Tag

```
inline-flex items-center rounded-md px-2.5 py-0.5
text-xs font-medium
bg-primary-100 text-primary-700
dark:bg-primary-900 dark:text-primary-300
```

### Link

```
text-primary-600 hover:text-primary-700
dark:text-primary-400 dark:hover:text-primary-300
underline-offset-4 hover:underline
```
