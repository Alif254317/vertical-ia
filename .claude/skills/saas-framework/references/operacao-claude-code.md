# SaaS Framework — Operação com Claude Code

## Workflow PRD → Plan → Task → Validate

### 1. Criar PRD

Humano escreve o PRD do módulo em `docs/prd/[modulo].md` usando o template da SKILL.md.

Dica: seja específico nos critérios de aceite. "Funciona" não é critério. "Login redireciona para /dashboard em menos de 2s" é critério.

### 2. Gerar Plano de Implementação

Enviar para Claude Code:

```
Leia o PRD em docs/prd/[modulo].md.

Antes de escrever qualquer código:
1. Analise o codebase atual (composables, componentes, pages existentes)
2. Identifique quais arquivos serão criados/modificados
3. Crie um plano de implementação com tasks numeradas
4. Estime dependências entre tasks
5. Indique qual skill seguir para cada task

Siga as skills: componentizacao, arquitetura-pastas, ux-design, supabase-postgres.
Responda APENAS com o plano. NÃO implemente nada.
```

Revisar o plano:
- Tasks muito grandes? → Pedir para quebrar
- Ordem errada? → Corrigir dependências
- Faltou algo do PRD? → Apontar
- Padrão diferente do projeto? → Ajustar

### 3. Executar Tasks

Uma task por vez:

```
Execute a Task [N] do plano.

Regras:
- Siga a skill [nome-da-skill]
- Não avance para a próxima task
- Após implementar, liste:
  1. Arquivos criados/modificados
  2. O que devo testar no browser
  3. Qualquer decisão que você tomou
```

### 4. Validar

Humano testa no browser:
- Fluxo funciona?
- Visual correto?
- Responsivo?
- Console sem erros?

Se falhou:
```
A Task [N] tem um problema: [descreva o bug exato].
Log do console: [cole o erro].
Corrija apenas este problema sem alterar outras tasks.
```

Se passou → avançar para próxima task.

### 5. Gate de Fase

Quando todas as tasks da fase terminarem, rodar o checklist do gate.
Só avançar para próxima fase quando TODOS os itens estiverem ✅.

---

## Prompts Úteis

### Diagnóstico (quando algo quebra)

```
Algo deu errado. Antes de corrigir:
1. Leia o erro abaixo
2. Liste 3 hipóteses do que pode estar causando
3. Para cada hipótese, diga qual arquivo verificar
4. Só então proponha a correção

Erro: [cole aqui]
```

### Refatoração segura

```
Refatore [componente/arquivo] seguindo a skill [nome].
Regras:
- Manter a mesma API pública (props, emits, exports)
- Não mudar comportamento, apenas estrutura
- Listar todas as mudanças feitas
```

### Revisar antes de commitar

```
Revise os arquivos modificados nesta sessão:
1. Há algum console.log esquecido?
2. Há algum `any` no TypeScript?
3. As RLS policies cobrem todos os casos?
4. Há algum dado sensível exposto no client?
```

### Criar migration SQL

```
Crie uma migration Supabase para [descrição].
Siga a skill supabase-postgres.

Regras:
- Incluir RLS policies
- Incluir índices necessários
- Incluir comentários explicando cada policy
- NÃO usar CASCADE em deletes (a menos que explicitamente pedido)
- Salvar em: supabase/migrations/[NNN]_[nome].sql
```

---

## Anti-Patterns a Evitar

### ❌ Mega-PRD de 10 páginas

Quebre em módulos de 1-2 páginas. Claude Code perde contexto com PRDs grandes e pula requisitos.

### ❌ "Faça tudo de uma vez"

Claude Code funciona melhor com tasks focadas. "Crie todo o sistema de auth" → vai pular coisas. "Crie a página de login" → vai fazer direito.

### ❌ Não validar entre tasks

Se a Task 2 depende da Task 1, e Task 1 tem bug, Task 2 vai herdar e amplificar o bug. Sempre valide.

### ❌ Contexto poluído

Após 5+ tasks na mesma sessão, Claude Code começa a "esquecer" regras. Use `/clear` entre tasks complexas.

### ❌ Não referenciar skills

Sem referência explícita à skill, Claude Code usa padrões genéricos que podem conflitar com o projeto. Sempre diga "Siga a skill X".

### ❌ PRD vago

"O sistema deve ser rápido" → inútil.
"A listagem carrega em < 500ms com 100 items" → útil.

---

## Padrão de Commits

```bash
# Fase 0-1: Infraestrutura
chore(setup): configuração inicial do projeto
feat(design): design system + componentes UI base

# Fase 2-4: Fundação
feat(auth): páginas de autenticação + middleware
feat(auth): tabela members + perfil de usuário
feat(tenancy): organizações + convites + RLS
feat(email): configuração Resend + templates

# Fase 5: Módulos
feat(projects): CRUD de projetos
feat(tasks): CRUD de tarefas dentro de projetos
feat(notifications): sistema de notificações

# Fase 6-7: Monetização + PWA
feat(billing): integração Stripe + paywall
feat(pwa): service worker + offline support

# Fase 8-9: Finalização
fix(security): correções do audit
chore(deploy): configuração Vercel + domínio

# Correções
fix(auth): redirect loop após login
fix(tenancy): RLS leak na tabela tasks
```

---

## Checklist Pré-Launch Completo

### Funcional
- [ ] Registro → Confirmação email → Login funciona end-to-end
- [ ] Todas as features do MVP testadas
- [ ] Fluxos de erro testados (dados inválidos, rede fora, etc)

### Segurança
- [ ] RLS em TODAS as tabelas
- [ ] Nenhuma secret no client
- [ ] Headers de segurança (CSP, HSTS, etc)
- [ ] Rate limiting em endpoints críticos

### Performance
- [ ] Lighthouse Performance > 80
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse SEO > 90

### Infra
- [ ] Environment variables em prod
- [ ] Domínio custom + HTTPS
- [ ] Supabase em region correta
- [ ] Backups configurados no Supabase
- [ ] Error monitoring (Sentry ou similar)

### Legal
- [ ] Página de termos de uso
- [ ] Página de política de privacidade
- [ ] Cookie banner (se LGPD/GDPR)

### Marketing
- [ ] Landing page com proposta de valor
  → Skill: marketing-copy
- [ ] Meta tags / OG tags configuradas
- [ ] Analytics configurado (Vercel Analytics, GA, ou similar)
