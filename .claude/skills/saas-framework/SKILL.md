---
name: saas-framework
description: "Framework operacional para desenvolver SaaS com Nuxt 4 + Supabase + Claude Code. Define fases, gates de validação, formato de PRD por módulo, e workflow PRD→Plan→Task→Validate→Ship."
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# SaaS Framework — Nuxt 4

Guia operacional passo-a-passo para construir um SaaS completo usando o boilerplate Nuxt 4, Claude Code e Supabase.

## Filosofia

1. **Fases sequenciais** — cada fase tem um gate de validação antes de avançar
2. **PRD por módulo** — um documento focado por feature, não um mega-PRD
3. **Task atômica** — Claude Code executa uma task por vez, valida, e avança
4. **Validação manual obrigatória** — humano testa no browser entre fases
5. **Skills como guardrails** — cada fase referencia as skills relevantes

---

## Visão Geral das Fases

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 0  │  Setup & Ambiente                                │
│  FASE 1  │  Design System                                   │
│  FASE 2  │  Auth & Usuários                                 │
│  FASE 3  │  Multi-tenancy (se aplicável)                    │
│  FASE 4  │  Emails Transacionais                            │
│  FASE 5  │  Módulos do Produto (core features)              │
│  FASE 6  │  Billing & Planos (se aplicável)                 │
│  FASE 7  │  PWA & Performance                               │
│  FASE 8  │  Security Audit                                  │
│  FASE 9  │  Deploy & Go-Live                                │
└─────────────────────────────────────────────────────────────┘
```

Cada fase segue o ciclo:

```
PRD do módulo → Plan (arquitetura) → Tasks (atômicas) → Implementar → Validar → ✅ Gate
```

---

## Formato do PRD por Módulo

Todo módulo começa com um PRD curto e focado. Salvar em `docs/prd/`.

```markdown
# PRD: [Nome do Módulo]

## Objetivo
Uma frase descrevendo o que este módulo resolve.

## Contexto
- Quem usa (persona)
- Quando usa (trigger/fluxo)
- Dependências de outros módulos

## User Stories
- [ ] Como [persona], quero [ação], para [benefício]
- [ ] Como [persona], quero [ação], para [benefício]

## Telas / Rotas
| Rota | Descrição | Auth? |
|------|-----------|-------|
| /exemplo | Descrição | Sim |

## Modelo de Dados
- Tabelas envolvidas (nome, campos principais)
- RLS policies necessárias
- Relações com tabelas existentes

## Regras de Negócio
1. Regra A
2. Regra B

## Critérios de Aceite
- [ ] Critério verificável 1
- [ ] Critério verificável 2

## Fora de Escopo
- O que NÃO fazer neste módulo
```

> **Regra de ouro**: Se o PRD tem mais de 2 páginas, quebre em 2 módulos.

---

## FASE 0 — Setup & Ambiente

### O que fazer (humano)

```bash
# 1. Clonar/criar projeto
npx nuxi@latest init meu-saas
cd meu-saas

# 2. Instalar dependências base
npm install
npx nuxi module add @nuxtjs/supabase
npx nuxi module add @nuxt/icon
npx nuxi module add @vite-pwa/nuxt

# 3. Configurar Supabase
# - Criar projeto no dashboard.supabase.com
# - Copiar URL + anon key para .env

# 4. Configurar estrutura de pastas
# (seguir skill: arquitetura-pastas)
```

### Estrutura de pastas inicial

```
app/
├── assets/css/main.css      # Tailwind v4
├── components/
│   ├── ui/                   # Primitivos (Button, Input, Card...)
│   ├── layout/               # Header, Footer, Sidebar
│   └── shared/               # Componentes reutilizáveis
├── composables/
├── layouts/
│   ├── default.vue
│   └── auth.vue
├── middleware/
├── pages/
│   └── index.vue
└── app.vue
server/
├── api/
├── middleware/
└── utils/
shared/
├── types/
└── utils/
supabase/
├── migrations/
└── seed.sql
docs/
└── prd/
```

### Gate de Validação ✅

- [ ] `npm run dev` roda sem erros
- [ ] Supabase conecta (verificar no console)
- [ ] Estrutura de pastas criada
- [ ] `.env` com `SUPABASE_URL` e `SUPABASE_KEY`
- [ ] Git init + primeiro commit

### Skills referenciadas
- `arquitetura-pastas` — estrutura de diretórios

---

## FASE 1 — Design System

### PRD resumido

> Definir tokens visuais (cores, tipografia, spacing), componentes UI base, dark mode, e padrões de loading/empty/error states.

### Tasks para Claude Code

```
Task 1.1: Configurar Tailwind v4 com CSS tokens
  → Skill: ux-design (seção Design Tokens)
  → Arquivo: app/assets/css/main.css
  → Validar: cores semânticas, dark mode toggle funciona

Task 1.2: Criar componentes UI base
  → Skill: componentizacao + ux-design
  → Componentes: Button, Input, Card, Badge, Avatar, Modal, Toast
  → Validar: cada componente renderiza com props tipadas

Task 1.3: Criar layouts (default + auth)
  → Skill: componentizacao
  → Arquivos: app/layouts/default.vue, app/layouts/auth.vue
  → Validar: layout troca entre rotas, responsivo

Task 1.4: Configurar ícones e favicon
  → Skill: favicon
  → Validar: ícones carregam, favicon aparece na aba
```

### Gate de Validação ✅

- [ ] Tokens de cor funcionam (light + dark)
- [ ] Componentes UI renderizam corretamente
- [ ] Layout responsivo (mobile + desktop)
- [ ] Favicon + ícones configurados
- [ ] Screenshot da home com design system aplicado

---

## FASE 2 — Auth & Usuários

### PRD resumido

> Telas de autenticação completas: login, criar conta, esqueci senha, redefinir senha. Tabela `members` (profile do usuário), middleware de proteção de rotas, session management.

### Modelo de dados

```sql
-- Tabela de perfis (extends auth.users)
create table public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.members enable row level security;

create policy "Users can view own profile"
  on public.members for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.members for update
  using (auth.uid() = id);

-- Trigger para criar member automaticamente no signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.members (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Tasks para Claude Code

```
Task 2.1: Criar migration da tabela members + trigger
  → Skill: supabase-postgres
  → Arquivo: supabase/migrations/001_members.sql
  → Validar: migration roda sem erros no Supabase

Task 2.2: Criar página de Login
  → Rota: /auth/login
  → Usar: useSupabaseClient().auth.signInWithPassword()
  → Layout: auth
  → Validar: login funciona, redireciona para /dashboard

Task 2.3: Criar página de Registro
  → Rota: /auth/register
  → Usar: useSupabaseClient().auth.signUp()
  → Incluir: full_name nos metadata
  → Validar: registro funciona, member criado na tabela

Task 2.4: Criar página Esqueci Senha
  → Rota: /auth/forgot-password
  → Usar: useSupabaseClient().auth.resetPasswordForEmail()
  → Validar: email de reset é enviado

Task 2.5: Criar página Redefinir Senha
  → Rota: /auth/reset-password
  → Usar: useSupabaseClient().auth.updateUser()
  → Validar: senha é atualizada, redireciona para login

Task 2.6: Criar middleware de auth
  → Arquivo: app/middleware/auth.ts
  → Proteger rotas /dashboard/*
  → Validar: rota protegida redireciona para /auth/login

Task 2.7: Criar página de perfil do usuário
  → Rota: /dashboard/settings/profile
  → Editar: full_name, avatar_url
  → Validar: dados salvam e aparecem no header
```

### Gate de Validação ✅

- [ ] Login com email/senha funciona
- [ ] Registro cria usuário + member
- [ ] Esqueci senha envia email
- [ ] Redefinir senha funciona via link
- [ ] Rotas protegidas redirecionam
- [ ] Perfil edita e salva
- [ ] Logout funciona e limpa session

---

## FASE 3 — Multi-tenancy (se aplicável)

### PRD resumido

> Suporte a organizações/workspaces. Usuário pode pertencer a múltiplas orgs. Dados isolados por org_id + RLS. Fluxo de criação de org, convite de membros, troca de org ativa.

### Modelo de dados

```sql
-- Organizações
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Membros da organização
create table public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now(),
  unique(org_id, user_id)
);

-- Convites
create table public.org_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  email text not null,
  role text default 'member',
  invited_by uuid references auth.users(id),
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- RLS: dados isolados por org
-- Todas as tabelas de negócio devem ter org_id + policy:
-- using (org_id in (
--   select org_id from public.org_members where user_id = auth.uid()
-- ))
```

### Tasks para Claude Code

```
Task 3.1: Criar migrations (organizations, org_members, org_invites)
Task 3.2: Criar composable useOrganization()
  → org ativa, trocar org, listar orgs do usuário
Task 3.3: Criar fluxo de criação de organização
  → Rota: /onboarding/create-org (pós-registro)
Task 3.4: Criar org switcher no header
Task 3.5: Criar página de membros da org
  → Rota: /dashboard/settings/members
  → Listar, convidar, remover, mudar role
Task 3.6: Criar fluxo de aceite de convite
  → Rota: /invite/[token]
Task 3.7: Aplicar RLS com org_id em todas as tabelas
```

### Gate de Validação ✅

- [ ] Criar org funciona
- [ ] Convite envia email e aceite adiciona membro
- [ ] Org switcher troca contexto
- [ ] Dados isolados (user da org A não vê dados da org B)
- [ ] RLS policies testadas via SQL direto

---

## FASE 4 — Emails Transacionais

### PRD resumido

> Configurar envio de emails via Supabase + Resend. Templates para: confirmação de conta, reset de senha, convite para org, notificações do sistema.

### Tasks para Claude Code

```
Task 4.1: Configurar Resend no Supabase
  → Dashboard: Authentication > Email Templates
  → Configurar SMTP custom com Resend
  → Validar: email de confirmação chega formatado

Task 4.2: Customizar templates de email do Supabase Auth
  → Confirmação de email
  → Reset de senha
  → Magic link (se usado)
  → Validar: cada template envia corretamente

Task 4.3: Criar server route para emails custom
  → Arquivo: server/api/email/send.post.ts
  → Usar SDK do Resend para emails de app (convites, notificações)
  → Validar: email de convite chega com link correto

Task 4.4: Criar templates HTML de email
  → Pasta: server/utils/email-templates/
  → Templates responsivos, com logo e branding
  → Validar: renderiza bem no Gmail, Outlook, mobile
```

### Gate de Validação ✅

- [ ] Email de confirmação chega e formata corretamente
- [ ] Email de reset de senha funciona end-to-end
- [ ] Email de convite funciona end-to-end
- [ ] Emails não caem em spam (verificar SPF/DKIM no Resend)
- [ ] Templates responsivos testados

---

## FASE 5 — Módulos do Produto

Esta é a fase mais longa e variável. Cada módulo de negócio segue o mesmo ciclo.

### Ciclo por módulo

```
1. Escrever PRD do módulo         → docs/prd/modulo-x.md
2. Enviar PRD para Claude Code    → "Leia o PRD e crie um plano. NÃO escreva código."
3. Revisar plano                  → Ajustar se necessário
4. Executar tasks                 → Uma por vez, validar entre elas
5. Testar no browser              → Fluxo completo
6. Gate de validação              → Checklist do módulo
7. Commit                         → git commit -m "feat: módulo X"
```

### Prompt padrão para iniciar módulo

```
Leia o PRD em docs/prd/[modulo].md.
Antes de escrever qualquer código:
1. Analise o codebase atual
2. Identifique quais arquivos serão criados/modificados
3. Crie um plano de implementação com tasks numeradas
4. Estime dependências entre tasks

Siga as skills: componentizacao, arquitetura-pastas, ux-design, supabase-postgres.
Responda apenas com o plano. NÃO implemente ainda.
```

### Prompt para executar task

```
Execute a Task [N] do plano.
Após implementar, liste:
- Arquivos criados/modificados
- O que testar no browser
- Próxima task
```

### Exemplos de módulos comuns em SaaS

| Módulo | Tabelas | Rotas típicas |
|--------|---------|---------------|
| Dashboard | — | /dashboard |
| Projetos | projects | /dashboard/projects, /dashboard/projects/[id] |
| Tarefas | tasks | /dashboard/projects/[id]/tasks |
| Documentos | documents | /dashboard/docs, /dashboard/docs/[id] |
| Notificações | notifications | /dashboard/notifications |
| Settings | — | /dashboard/settings/* |
| Logs/Audit | audit_logs | /dashboard/settings/logs |
| API Keys | api_keys | /dashboard/settings/api-keys |

### Gate de Validação por módulo ✅

- [ ] CRUD completo funciona (criar, ler, editar, deletar)
- [ ] RLS policies aplicadas e testadas
- [ ] Loading states em todas as telas
- [ ] Empty states em listas vazias
- [ ] Error handling (toast de erro ao falhar)
- [ ] Responsivo (mobile + desktop)
- [ ] Tipagem completa (sem `any`)

---

## FASE 6 — Billing & Planos (se aplicável)

### PRD resumido

> Integração com Stripe para cobrança recorrente. Tabela de planos, subscription management, webhook handler, paywall em features premium.

### Tasks para Claude Code

```
Task 6.1: Criar tabelas (plans, subscriptions, billing_events)
Task 6.2: Criar server routes para Stripe
  → POST /api/billing/checkout (criar checkout session)
  → POST /api/billing/portal (customer portal)
  → POST /api/billing/webhook (receber eventos)
Task 6.3: Criar composable useSubscription()
Task 6.4: Criar página de pricing
  → Rota: /pricing
Task 6.5: Criar página de billing
  → Rota: /dashboard/settings/billing
Task 6.6: Implementar paywall
  → Composable: useFeatureGate('feature-name')
  → Mostrar upgrade prompt em features premium
```

### Gate de Validação ✅

- [ ] Checkout cria subscription no Stripe
- [ ] Webhook atualiza subscription no banco
- [ ] Upgrade/downgrade funciona
- [ ] Cancelamento funciona
- [ ] Paywall bloqueia features premium
- [ ] Testar em modo de teste do Stripe

---

## FASE 7 — PWA & Performance

### Tasks para Claude Code

```
Task 7.1: Configurar @vite-pwa/nuxt
  → Skill: pwa
  → Manifest, ícones, service worker
  → Validar: app instalável no mobile

Task 7.2: Configurar caching strategies
  → Skill: pwa (seção Runtime Caching)
  → API: NetworkFirst, Imagens: CacheFirst, Fonts: CacheFirst
  → Validar: app funciona offline (dados em cache)

Task 7.3: Implementar prompt de atualização
  → Skill: pwa (seção Prompt de Atualização)
  → Componente PwaUpdatePrompt
  → Validar: toast aparece quando há versão nova

Task 7.4: Otimizar performance
  → Lazy load componentes pesados
  → useAsyncData com cache
  → Imagens com NuxtImg (se aplicável)
  → Validar: Lighthouse Performance > 90
```

### Gate de Validação ✅

- [ ] App instalável como PWA (Android + iOS)
- [ ] Lighthouse PWA score 100
- [ ] Lighthouse Performance > 90
- [ ] Service worker registrado e funcional
- [ ] Funciona offline com dados em cache

---

## FASE 8 — Security Audit

### Tasks para Claude Code

```
Task 8.1: Rodar security-auditor agent
  → Agent: security-auditor
  → "Execute o security audit seguindo .claude/agents/security-auditor.md"
  → Corrigir findings CRITICAL e HIGH

Task 8.2: Revisar RLS policies
  → Skill: supabase-postgres
  → Testar cada policy com diferentes roles
  → Validar: nenhum leak de dados entre orgs/users

Task 8.3: Revisar headers de segurança
  → CSP, HSTS, X-Frame-Options
  → Configurar em nuxt.config.ts routeRules

Task 8.4: Revisar variáveis de ambiente
  → Nenhuma secret em runtimeConfig.public
  → Todas as keys server-only em runtimeConfig (sem NUXT_PUBLIC_)
```

### Gate de Validação ✅

- [ ] Zero findings CRITICAL
- [ ] Zero findings HIGH
- [ ] RLS testada com SQL direto (user A não vê dados de B)
- [ ] Nenhuma secret exposta no client
- [ ] Headers de segurança configurados
- [ ] HTTPS enforçado

---

## FASE 9 — Deploy & Go-Live

### Tasks

```
Task 9.1: Configurar Vercel
  → Framework: Nuxt
  → Environment variables configuradas
  → Validar: build funciona, preview URL acessível

Task 9.2: Configurar domínio custom
  → DNS apontando para Vercel
  → SSL automático
  → Validar: domínio acessível com HTTPS

Task 9.3: Configurar Supabase production
  → Projeto separado para prod (ou usar branching)
  → Migrations aplicadas
  → RLS ativa em TODAS as tabelas
  → Validar: conexão funciona em prod

Task 9.4: Smoke test em produção
  → Registro + Login + Fluxo completo
  → Testar em mobile
  → Testar emails
  → Testar pagamento (se aplicável)
```

### Gate de Validação Final ✅

- [ ] App online via domínio custom + HTTPS
- [ ] Auth funciona end-to-end
- [ ] Emails chegam e formatam corretamente
- [ ] PWA instalável
- [ ] Dados persistem e RLS funciona
- [ ] Lighthouse > 80 em tudo
- [ ] Monitoring configurado

---

## Referência Rápida — Skills por Fase

| Fase | Skills | Agent |
|------|--------|-------|
| 0 Setup | arquitetura-pastas | — |
| 1 Design System | ux-design, componentizacao, favicon | — |
| 2 Auth | supabase-postgres, componentizacao | — |
| 3 Multi-tenancy | supabase-postgres | — |
| 4 Emails | — | — |
| 5 Módulos | componentizacao, arquitetura-pastas, ux-design, supabase-postgres | — |
| 6 Billing | supabase-postgres | — |
| 7 PWA | pwa, favicon | — |
| 8 Security | supabase-postgres | security-auditor |
| 9 Deploy | — | — |
