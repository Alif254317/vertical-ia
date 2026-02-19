## 4.11 — Central de Projetos & Tarefas

### Visão Geral

Módulo de gestão de projetos e tarefas integrado à plataforma, funcionando como um ClickUp simplificado. Permite que equipes organizem, acompanhem e executem trabalho com visibilidade completa — desde a criação manual até a geração automática via IA (atas de reunião e chat com agentes).

### Hierarquia

```
Organização (org)
  └── Projeto (ex: "Lançamento App v2", "Campanha Black Friday")
        └── Tarefa (unidade de trabalho com responsável, prazo, status)
              └── Subtarefa (checklist detalhado dentro da tarefa)
```

### Entidades

#### Projeto (`projects`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| org_id | uuid | FK → organizations |
| name | text | Nome do projeto |
| description | text | Descrição (opcional) |
| color | text | Cor para identificação visual (hex) |
| icon | text | Ícone do projeto (Lucide icon name) |
| status | enum | `active`, `archived`, `completed` |
| visibility | enum | `org_wide` (toda org vê), `members_only` (só membros do projeto) |
| created_by | uuid | FK → users |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### Membro do Projeto (`project_members`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| project_id | uuid | FK → projects |
| user_id | uuid | FK → users |
| role | enum | `owner`, `editor`, `viewer` |
| joined_at | timestamptz | |

#### Tarefa (`tasks`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| project_id | uuid | FK → projects |
| org_id | uuid | FK → organizations |
| title | text | Título da tarefa |
| description | text | Descrição rica (markdown) |
| status | enum | `todo`, `in_progress`, `review`, `done` |
| priority | enum | `urgent`, `high`, `medium`, `low` |
| assignee_id | uuid | FK → users (responsável) |
| created_by | uuid | FK → users |
| start_date | date | Data de início (opcional) |
| due_date | date | Data de entrega |
| completed_at | timestamptz | Quando foi marcada como concluída |
| estimated_hours | decimal | Estimativa de tempo em horas |
| actual_hours | decimal | Tempo real gasto (opcional) |
| position | integer | Ordem no kanban/lista |
| source | enum | `manual`, `meeting`, `agent` |
| source_id | uuid | FK → meetings.id ou messages.id (quando criada por IA) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### Subtarefa (`subtasks`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| task_id | uuid | FK → tasks |
| title | text | Descrição da subtarefa |
| is_completed | boolean | Concluída ou não |
| assignee_id | uuid | FK → users (opcional) |
| position | integer | Ordem na lista |
| created_at | timestamptz | |

#### Comentário (`task_comments`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| task_id | uuid | FK → tasks |
| user_id | uuid | FK → users |
| content | text | Texto do comentário (markdown) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### Anexo (`task_attachments`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| task_id | uuid | FK → tasks |
| user_id | uuid | FK → users |
| file_name | text | Nome do arquivo |
| file_url | text | URL no Supabase Storage |
| file_size | bigint | Tamanho em bytes |
| file_type | text | MIME type |
| created_at | timestamptz | |

#### Tag (`task_tags`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| org_id | uuid | FK → organizations |
| name | text | Nome da tag (ex: "bug", "feature", "urgente") |
| color | text | Cor (hex) |

#### Vínculo Tag ↔ Tarefa (`task_tag_links`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| task_id | uuid | FK → tasks |
| tag_id | uuid | FK → task_tags |

### Status Fixos

| Status | Label PT-BR | Cor | Descrição |
|--------|-------------|-----|-----------|
| `todo` | A fazer | Cinza | Tarefa pendente, não iniciada |
| `in_progress` | Em andamento | Azul | Sendo executada |
| `review` | Revisão | Amarelo | Aguardando revisão/aprovação |
| `done` | Concluído | Verde | Finalizada |

### Prioridades

| Prioridade | Label | Cor | Ícone |
|------------|-------|-----|-------|
| `urgent` | Urgente | Vermelho | 🔴 |
| `high` | Alta | Laranja | 🟠 |
| `medium` | Média | Amarelo | 🟡 |
| `low` | Baixa | Cinza | ⚪ |

### Visualizações

#### 1. Lista (Tabela)
- Colunas: título, status (badge), prioridade (ícone), responsável (avatar), data de entrega, tags, progresso subtarefas
- Ordenação por qualquer coluna
- Filtros: status, prioridade, responsável, tag, data
- Busca por título

#### 2. Kanban
- Colunas = status (A fazer | Em andamento | Revisão | Concluído)
- Drag & drop entre colunas (atualiza status automaticamente)
- Card mostra: título, avatar do responsável, prioridade (cor), tags, data, progresso subtarefas
- Contagem de tarefas por coluna

#### 3. Calendário
- Visualização mensal/semanal
- Tarefas posicionadas pela `due_date`
- Cor do card = prioridade ou projeto
- Drag & drop para mover datas
- Indicador de tarefas atrasadas (vermelho)

#### 4. Gantt / Timeline
- Barras horizontais por tarefa (start_date → due_date)
- Agrupamento por projeto ou responsável
- Zoom: dia, semana, mês
- Indicador de progresso (subtarefas concluídas)
- Linha de "hoje" para referência
- Tarefas sem start_date aparecem como ponto na due_date

### Permissões

| Ação | Admin | Gestor | Colaborador |
|------|-------|--------|-------------|
| Criar projeto | ✅ | ✅ | ❌ |
| Arquivar/excluir projeto | ✅ | ✅ (se owner) | ❌ |
| Criar tarefas | ✅ | ✅ | ✅ |
| Editar tarefas | ✅ | ✅ | ✅ (se assignee ou criador) |
| Mover status (kanban) | ✅ | ✅ | ✅ (se assignee) |
| Excluir tarefas | ✅ | ✅ (se owner do projeto) | ❌ |
| Comentar | ✅ | ✅ | ✅ |
| Ver dashboard consolidado | ✅ | ✅ | ❌ (vê só próprias tarefas) |

### Integração com IA

#### Tarefas a partir de Reuniões
Quando o módulo de reuniões gera a ata (Fase 09), as tarefas extraídas pela IA (assignee → descrição) são automaticamente criadas no projeto vinculado à reunião (ou em um projeto "Inbox" padrão). Campo `source = 'meeting'` e `source_id` aponta para a reunião.

#### Tarefas via Chat com Agente
O agente de IA pode criar, listar e atualizar tarefas como uma tool/function call. Exemplos de interação:
- Usuário: "Cria uma tarefa para o João revisar o contrato até sexta, prioridade alta"
- Agente: cria a tarefa no projeto correto, atribui ao João, define prazo e prioridade
- Usuário: "Quais tarefas estão atrasadas no projeto Lançamento?"
- Agente: consulta e responde com lista formatada

Campo `source = 'agent'` e `source_id` aponta para a mensagem do chat.

### Dashboard Consolidado (KPIs)

> Referência visual: dashboard enviado pelo usuário

#### Métricas Principais (cards no topo)
| Métrica | Cálculo |
|---------|---------|
| Total de Tarefas | COUNT(tasks) no período |
| Taxa de Conclusão | COUNT(done) / COUNT(total) × 100 |
| Tarefas em Atraso | COUNT(due_date < hoje AND status != done) |
| Tempo Médio | AVG(completed_at - created_at) em dias |
| Produtividade | COUNT(done) por semana |

Cada card mostra variação percentual vs período anterior (trend ↑↓).

#### Gráficos
- **Status das Tarefas** — Donut chart: concluídas (verde), em andamento (azul), não iniciadas (cinza/vermelho)
- **Taxa de Produtividade** — Bar chart mensal (Jan-Dez)

#### Tabelas
- **Carga de Trabalho por Pessoa** — Nome, departamento, tarefas (concluídas/total), barra de progresso, status (ativo/atrasado)
- **Distribuição por Departamento** — Setor, membros, tarefas (concluídas/total), barra de progresso, tempo médio

#### Filtros do Dashboard
- Período: 12 meses, 6 meses, 24 horas (presets) + range customizado
- Projeto específico ou todos
- Setor/departamento
- Responsável

### Telas

| # | Tela | Descrição |
|---|------|-----------|
| T16 | /projects | Listagem de projetos (cards grid), botão "+ Novo Projeto" |
| T17 | /projects/:id | Visualização do projeto com toggle entre Lista / Kanban / Calendário / Gantt |
| T18 | /projects/:id/task/:taskId | Modal/drawer lateral com detalhes da tarefa, subtarefas, comentários, anexos, atividade |
| T19 | /projects/dashboard | Dashboard consolidado com KPIs, gráficos e tabelas |

### Critérios de Aceite

1. Usuário cria projeto com nome, cor e ícone
2. Qualquer membro da org cria tarefas com título, descrição, responsável, prioridade, datas e tags
3. Subtarefas funcionam como checklist dentro da tarefa
4. Kanban permite drag & drop entre status com atualização em tempo real
5. Calendário mostra tarefas por data com indicador de atraso
6. Gantt mostra barras de timeline por tarefa com linha de "hoje"
7. Comentários e anexos funcionam na tarefa
8. Tags são customizáveis por org (nome + cor)
9. Dashboard mostra KPIs, gráficos e tabelas conforme spec
10. Tarefas são criadas automaticamente a partir de atas de reunião
11. Agente de IA cria, lista e atualiza tarefas via chat
12. RLS garante isolamento por org_id
