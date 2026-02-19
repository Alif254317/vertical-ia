## Fase XX — Central de Projetos & Tarefas

> **Objetivo:** Gestão de projetos e tarefas com 4 visualizações, integração com reuniões e agentes IA.

| # | Tarefa | Status | Detalhes |
|---|--------|--------|----------|
| X.1 | Criar tabelas: projects, project_members, tasks, subtasks, task_comments, task_attachments, task_tags, task_tag_links | ⬜ | Migration SQL + RLS por org_id |
| X.2 | Composable: useProjects | ⬜ | CRUD projetos, membros, cores, ícones |
| X.3 | Composable: useTasks | ⬜ | CRUD tarefas, filtros, ordenação, paginação, drag & drop status |
| X.4 | Composable: useSubtasks | ⬜ | CRUD subtarefas, toggle concluído, reordenar |
| X.5 | Composable: useTaskComments | ⬜ | CRUD comentários em tempo real |
| X.6 | Composable: useTaskTags | ⬜ | CRUD tags customizáveis por org |
| X.7 | Página: /projects | ⬜ | Grid de projetos (cards), busca, filtro status, "+ Novo Projeto" |
| X.8 | Componente: ProjectCard | ⬜ | Ícone, cor, nome, progresso, membros (avatars), contagem tarefas |
| X.9 | Componente: ProjectFormModal | ⬜ | Nome, descrição, cor (color picker), ícone, visibilidade, membros |
| X.10 | Página: /projects/:id (shell) | ⬜ | Header do projeto + toggle de visualização (Lista/Kanban/Calendário/Gantt) |
| X.11 | Componente: TaskListView | ⬜ | Tabela com colunas (título, status, prioridade, responsável, data, tags), sort, filtros |
| X.12 | Componente: TaskKanbanView | ⬜ | 4 colunas de status, drag & drop (vue-draggable/dnd-kit), cards compactos |
| X.13 | Componente: TaskCalendarView | ⬜ | Calendário mensal/semanal, tarefas por due_date, drag para mover data |
| X.14 | Componente: TaskGanttView | ⬜ | Timeline horizontal, barras start→due, zoom dia/semana/mês, linha "hoje" |
| X.15 | Componente: TaskCard (kanban) | ⬜ | Título, avatar responsável, prioridade (cor), tags, data, progresso subtarefas |
| X.16 | Componente: TaskDetailDrawer | ⬜ | Drawer lateral: edição inline de campos, subtarefas, comentários, anexos, atividade |
| X.17 | Componente: SubtaskList | ⬜ | Checklist com toggle, adicionar, reordenar, atribuir |
| X.18 | Componente: TaskComments | ⬜ | Lista de comentários + input de novo comentário (markdown) |
| X.19 | Componente: TaskAttachments | ⬜ | Upload, lista de arquivos, preview, download |
| X.20 | Componente: TagSelector | ⬜ | Multi-select de tags + criar nova tag inline |
| X.21 | Componente: PrioritySelector | ⬜ | Dropdown com ícones de cor (urgente→baixa) |
| X.22 | Componente: AssigneeSelector | ⬜ | Dropdown de membros com avatar + busca |
| X.23 | Página: /projects/dashboard | ⬜ | Dashboard consolidado com KPIs |
| X.24 | Componente: TaskKPICards | ⬜ | 5 cards: total, conclusão, atraso, tempo médio, produtividade (com trend) |
| X.25 | Componente: TaskStatusDonut | ⬜ | Gráfico donut por status (concluídas, em andamento, não iniciadas) |
| X.26 | Componente: ProductivityBarChart | ⬜ | Barras mensais de produtividade |
| X.27 | Componente: WorkloadTable | ⬜ | Tabela: pessoa, departamento, tarefas, taxa conclusão, status |
| X.28 | Componente: DepartmentDistribution | ⬜ | Cards por departamento com barra de progresso |
| X.29 | Python: tool "create_task" para agentes | ⬜ | Function call que cria tarefa no Supabase via agente |
| X.30 | Python: tool "list_tasks" para agentes | ⬜ | Function call que lista/filtra tarefas |
| X.31 | Python: tool "update_task" para agentes | ⬜ | Function call que atualiza status, responsável, prazo |
| X.32 | Integração: reuniões → tarefas automáticas | ⬜ | Após gerar ata, criar tarefas no projeto vinculado com source='meeting' |
| X.33 | Sidebar: adicionar item "Projetos" na navegação | ⬜ | Ícone + link + badge com tarefas pendentes do user |

**Estimativa: 5-7 dias**

### Posição sugerida no ROADMAP

Inserir como **Fase 07** (antes de Agentes de IA), pois:
- Depende de: Fase 04 (membros/multitenancy) para saber quem são os usuários
- É dependência de: Fase 09 (reuniões, que cria tarefas automaticamente) e Fase 07-atual (agentes, que manipulam tarefas como tools)

**Nova ordem sugerida:**
- Fase 06 — Chat Hub & Conversas
- **Fase 07 — Central de Projetos & Tarefas** ← NOVO
- Fase 08 — Agentes de IA (antigo 07)
- Fase 09 — Base de Conhecimento (antigo 08)
- Fase 10 — Central de Reuniões (antigo 09) — agora cria tarefas automaticamente
- ...demais fases renumeradas
