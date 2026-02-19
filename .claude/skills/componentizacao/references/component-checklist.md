# Checklist — Criar Componente Vue (Nuxt 4)

Use este checklist toda vez que for criar ou revisar um componente.

## Antes de criar

- [ ] O componente tem responsabilidade única? (faz apenas uma coisa)
- [ ] Já existe componente similar que pode ser reutilizado?
- [ ] A lógica de dados está em um composable separado?
- [ ] A pasta de destino está correta? (`base/`, `[domínio]/`, `shared/`)

## Estrutura do arquivo

- [ ] `<script setup lang="ts">` (TypeScript obrigatório)
- [ ] Ordem: script → template → style
- [ ] Imports explícitos (sem auto-imports)
- [ ] Props tipadas com `defineProps<Interface>()`
- [ ] Emits tipados com `defineEmits<Interface>()`
- [ ] Defaults via `withDefaults()` quando necessário
- [ ] `useId()` para qualquer ID dinâmico no template
- [ ] `<style scoped>` (exceto quando intencionalmente global)

## Nomenclatura

- [ ] Arquivo em PascalCase (`UserCard.vue`)
- [ ] Nome descritivo: `[Domínio][Ação/Tipo].vue`
- [ ] Prefixo `Base` para componentes genéricos
- [ ] Sufixo `.server.vue` se for server-only
- [ ] Sufixo `.client.vue` se for client-only

## Qualidade

- [ ] Nenhum `any` no código
- [ ] Nenhuma lógica de fetch/API no componente
- [ ] Nenhum `Math.random()` ou `Date.now()` no template
- [ ] Componente tem menos de 200 linhas
- [ ] Nenhuma prop desestruturada (usa `props.x` no script)
- [ ] Computed para qualquer lógica no template

## Performance (quando aplicável)

- [ ] Componente abaixo do fold usa `Lazy` + hydration strategy
- [ ] Componente estático usa `.server.vue`
- [ ] Listas grandes usam `:key` único e estável
