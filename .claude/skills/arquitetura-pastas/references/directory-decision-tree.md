# Decision Tree — Onde Colocar o Arquivo

Referência rápida para decidir onde criar cada arquivo no projeto Nuxt 4.

---

## Fluxo Principal

```
1. O código usa APIs reativas do Vue? (ref, computed, watch, useState)
   │
   ├─ SIM → app/composables/useX.ts
   │
   └─ NÃO ↓

2. O código roda APENAS no server?
   │
   ├─ SIM → É rota HTTP?
   │   ├─ SIM → server/api/recurso.metodo.ts
   │   └─ NÃO → server/utils/nome.ts
   │
   └─ NÃO ↓

3. O código é usado tanto no app/ quanto no server/?
   │
   ├─ SIM → É tipo/interface?
   │   ├─ SIM → shared/types/Nome.ts
   │   └─ NÃO → É constante/enum?
   │       ├─ SIM → shared/constants/nome.ts
   │       └─ NÃO → shared/utils/nome.ts
   │
   └─ NÃO (só no app/) ↓

4. O que é?
   ├─ Componente visual       → app/components/[domínio]/Nome.vue
   ├─ Página/rota             → app/pages/nome.vue
   ├─ Layout                  → app/layouts/NomeLayout.vue
   ├─ Middleware de rota       → app/middleware/nome.ts
   ├─ Plugin/lib externa       → app/plugins/nome[.client|.server].ts
   ├─ Função pura (sem Vue)   → app/utils/nome.ts
   └─ Arquivo estático         → public/nome.ext
```

---

## Tabela Rápida de Aliases

| De onde importa | Alias | Exemplo |
|----------------|-------|---------|
| `shared/` | `#shared` | `import { ROLES } from '#shared/constants/roles'` |
| `server/` | `#server` | `import { hash } from '#server/utils/hashPassword'` |
| Raiz do projeto | `~/` | `import type { UserDTO } from '~/shared/types/UserDTO'` |

---

## Auto-import: O que funciona automaticamente

| Diretório | Auto-importado? |
|-----------|----------------|
| `app/composables/*.ts` | ✅ |
| `app/utils/*.ts` | ✅ |
| `shared/types/*.ts` | ✅ |
| `shared/utils/*.ts` | ✅ |
| `server/utils/*.ts` | ✅ (dentro do server/) |
| `shared/constants/*.ts` | ❌ → use `#shared/constants/` |
| Qualquer subpasta | ❌ → import manual ou re-export |
