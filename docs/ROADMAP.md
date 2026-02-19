# ROADMAP — Vertical IA

> Plano de desenvolvimento sequencial. Referência detalhada: `docs/tasks/TASKS.md`

| Fase | Descrição | Status |
|------|-----------|--------|
| 01 | Setup (Nuxt 4, Tailwind, PWA, @nuxt/icon) | ✅ Concluída |
| 02 | Design System (tokens.css + 22 componentes UI + 4 layouts) | ✅ Concluída |
| 03 | Autenticação (Supabase Auth, login, register, middlewares, UserMenu) | ✅ Concluída |
| **04** | **Membros & Multitenancy (orgs, users, sectors, RLS, convites)** | **Em progresso** |
| 05 | Emails Transacionais (Resend, convite, welcome, reset, alertas) | Pendente |
| 06 | Chat Hub & Conversas (conversations, messages, streaming, anexos) | Pendente |
| 07 | Central de Projetos & Tarefas (kanban, lista, calendário, gantt, dashboard) | Pendente |
| 08 | Agentes de IA (CRUD, OpenRouter, streaming, task tools, Python backend) | Pendente |
| 09 | Base de Conhecimento (pastas, upload, RAG, status indexação) | Pendente |
| 10 | Central de Reuniões (gravação, transcrição, atas IA, tarefas automáticas) | Pendente |
| 11 | Integrações MCP (catálogo, conexão self-service, health check) | Pendente |
| 12 | Painéis e KPIs (dashboards, gráficos, dados como RAG) | Pendente |
| 13 | Configurações (admin: empresa, equipe, agentes, knowledge, billing) | Pendente |
| 14 | Billing & Limites (Asaas, planos, controle de uso, add-ons) | Pendente |
| 15 | Deploy & Produção (Vercel, Cloud Run, PWA, domínio, SSL, Sentry, E2E) | Pendente |

---

## Dependências entre fases

```
01 Setup
 └─ 02 Design System
     └─ 03 Autenticação
         └─ 04 Multitenancy ← fundação para tudo
             ├─ 05 Emails
             ├─ 06 Chat Hub
             │   └─ 08 Agentes de IA
             │       └─ 09 Base de Conhecimento
             ├─ 07 Projetos & Tarefas
             │   └─ 10 Reuniões (cria tarefas automaticamente)
             ├─ 11 Integrações MCP
             ├─ 12 Painéis e KPIs
             └─ 13 Configurações
                 └─ 14 Billing
                     └─ 15 Deploy
```

## Stack

- **Frontend:** Nuxt 4 + Vue 3 + Tailwind CSS + @nuxt/icon
- **Backend:** Supabase (Auth, Database, Storage, RLS) + Python/FastAPI (Agentes IA)
- **IA:** OpenRouter (200+ modelos) + Agno framework
- **Infra:** Supabase CLI (local dev com Docker) + Vercel (deploy)
