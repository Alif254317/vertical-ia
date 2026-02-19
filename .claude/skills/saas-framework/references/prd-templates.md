# PRD Templates — Copiar e Preencher

## Template Genérico

```markdown
# PRD: [Nome do Módulo]

## Objetivo
[Uma frase: o que este módulo resolve para o usuário]

## Contexto
- **Persona**: [quem usa — admin? membro? visitante?]
- **Trigger**: [quando o usuário acessa — após login? via menu?]
- **Dependências**: [módulos que precisam existir antes]

## User Stories
- [ ] Como [persona], quero [ação específica], para [benefício claro]
- [ ] Como [persona], quero [ação específica], para [benefício claro]
- [ ] Como [persona], quero [ação específica], para [benefício claro]

## Telas / Rotas
| Rota | Descrição | Auth? | Layout |
|------|-----------|-------|--------|
| /path | O que mostra | Sim/Não | default/auth |

## Modelo de Dados

### Tabela: [nome]
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | uuid (PK) | Sim | Auto-gerado |
| org_id | uuid (FK) | Sim | Ref organizations |
| name | text | Sim | Nome do item |
| created_at | timestamptz | Sim | Default now() |

### RLS Policies
- SELECT: membros da org veem seus dados
- INSERT: membros da org criam dados
- UPDATE: owner ou admin atualizam
- DELETE: apenas owner deleta

### Relações
- [tabela] → organizations (org_id)
- [tabela] → members (created_by)

## Regras de Negócio
1. [Regra verificável com condição e resultado]
2. [Regra verificável com condição e resultado]

## Critérios de Aceite
- [ ] [Ação específica] → [resultado esperado]
- [ ] [Ação específica] → [resultado esperado]
- [ ] [Ação específica] → [resultado esperado]
- [ ] Loading state aparece durante carregamento
- [ ] Empty state aparece quando lista está vazia
- [ ] Erro mostra toast com mensagem clara
- [ ] Funciona em mobile (responsivo)

## Fora de Escopo
- [Feature que NÃO será implementada neste módulo]
- [Feature que fica para versão futura]
```

---

## Template: Módulo CRUD (mais comum)

```markdown
# PRD: [Entidade] Management

## Objetivo
Permitir que [persona] crie, visualize, edite e delete [entidade]s dentro da organização.

## Contexto
- **Persona**: membro da organização (qualquer role)
- **Trigger**: via sidebar → [seção]
- **Dependências**: auth (Fase 2), multi-tenancy (Fase 3)

## User Stories
- [ ] Como membro, quero ver a lista de [entidade]s da minha org
- [ ] Como membro, quero criar um novo [entidade]
- [ ] Como membro, quero editar um [entidade] existente
- [ ] Como membro, quero deletar um [entidade] (com confirmação)
- [ ] Como membro, quero buscar [entidade]s por nome
- [ ] Como membro, quero ordenar [entidade]s por data ou nome

## Telas / Rotas
| Rota | Descrição | Auth? |
|------|-----------|-------|
| /dashboard/[entidade]s | Lista com busca e filtros | Sim |
| /dashboard/[entidade]s/new | Form de criação | Sim |
| /dashboard/[entidade]s/[id] | Detalhe/edição | Sim |

## Modelo de Dados

### Tabela: [entidade]s
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| id | uuid (PK) | Sim |
| org_id | uuid (FK→organizations) | Sim |
| name | text | Sim |
| description | text | Não |
| status | text (active/archived) | Sim, default 'active' |
| created_by | uuid (FK→members) | Sim |
| created_at | timestamptz | Sim |
| updated_at | timestamptz | Sim |

### RLS Policies
- SELECT: org_members com user_id = auth.uid()
- INSERT: idem + set org_id = org ativa
- UPDATE: idem
- DELETE: apenas owner/admin da org

## Regras de Negócio
1. Nome é obrigatório e deve ter entre 2 e 100 caracteres
2. Não pode existir 2 [entidade]s com mesmo nome na mesma org
3. Delete é soft (muda status para 'archived'), não hard delete
4. Lista mostra apenas status='active' por padrão

## Critérios de Aceite
- [ ] Criar [entidade] → aparece na lista
- [ ] Editar [entidade] → mudanças refletem imediatamente
- [ ] Deletar [entidade] → some da lista, mostra toast de confirmação
- [ ] Busca filtra em tempo real (debounce 300ms)
- [ ] Lista vazia mostra empty state com CTA para criar
- [ ] Form valida campos antes de enviar
- [ ] Loading skeleton durante carregamento
- [ ] User de outra org não vê os dados (testar RLS)

## Fora de Escopo
- Exportar lista como CSV
- Bulk actions (selecionar vários e deletar)
- Histórico de alterações (audit log)
```

---

## Template: Módulo Settings

```markdown
# PRD: Settings — [Seção]

## Objetivo
Permitir que [persona] configure [aspecto] da conta/organização.

## Contexto
- **Persona**: admin ou owner da organização
- **Trigger**: via Settings sidebar
- **Dependências**: auth (Fase 2)

## User Stories
- [ ] Como admin, quero alterar [configuração] da organização
- [ ] Como admin, quero ver o estado atual de [configuração]

## Telas / Rotas
| Rota | Descrição | Auth? | Role? |
|------|-----------|-------|-------|
| /dashboard/settings/[secao] | Form de configuração | Sim | admin+ |

## Regras de Negócio
1. Apenas admin e owner podem acessar
2. Mudanças são salvas com feedback visual (toast success)
3. Campos sensíveis pedem confirmação antes de salvar

## Critérios de Aceite
- [ ] Form carrega com valores atuais
- [ ] Salvar mostra loading no botão + toast de sucesso
- [ ] Membro comum não consegue acessar (redirect ou 403)
- [ ] Validação inline em campos obrigatórios
```

---

## Template: Módulo Dashboard/Analytics

```markdown
# PRD: Dashboard

## Objetivo
Visão geral do estado da organização: métricas, atividade recente, ações rápidas.

## Contexto
- **Persona**: qualquer membro
- **Trigger**: primeira tela após login
- **Dependências**: auth + módulos de dados

## User Stories
- [ ] Como membro, quero ver [métrica 1] em destaque
- [ ] Como membro, quero ver [métrica 2] em destaque
- [ ] Como membro, quero ver atividade recente
- [ ] Como membro, quero ter atalhos para ações comuns

## Telas / Rotas
| Rota | Descrição | Auth? |
|------|-----------|-------|
| /dashboard | Dashboard principal | Sim |

## Componentes
- StatCard (métrica + variação + ícone)
- ActivityFeed (lista de eventos recentes)
- QuickActions (grid de botões de ação)

## Dados
- Métricas calculadas via views ou queries agregadas
- Atividade recente: últimos 10 eventos (qualquer tabela)
- Cache: useAsyncData com cache de 60s

## Critérios de Aceite
- [ ] Métricas carregam em < 1s
- [ ] Skeleton loading durante carregamento
- [ ] Dados refletem apenas org ativa
- [ ] Responsivo: cards empilham em mobile
```
