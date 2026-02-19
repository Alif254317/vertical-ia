# TASKS — Vertical IA

> Tarefas sequenciais para execução no Claude Code.
> Cada tarefa deve ser implementada, testada e confirmada antes de avançar.
> Referência: docs/PRD.md | docs/ROADMAP.md

---

## Como usar este documento

1. Abra o Claude Code na raiz do projeto `vertical-ia`
2. Peça: "Leia docs/tasks/TASKS.md. Execute a próxima tarefa pendente (⬜)."
3. Após concluir, marque como ✅ e avance para a próxima
4. Ao final de cada fase, faça `git commit`

**Legenda:** ✅ Feito | 🔵 Em progresso | ⬜ Pendente

---

## FASE 03 — Autenticação

### 3.1 — Configurar Supabase Auth
- **Status:** ✅
- **Tipo:** Config
- **O que fazer:**
  - Verificar que SUPABASE_URL e SUPABASE_KEY estão no `.env`
  - Verificar que `@nuxtjs/supabase` está instalado e configurado no `nuxt.config.ts`
  - Configurar redirect URL: `http://localhost:3000/auth/confirm`
- **Critério de aceite:** `useSupabaseClient()` retorna cliente válido

### 3.2 — Composable useAuth
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/composables/useAuth.ts`
- **O que fazer:**
  ```ts
  // Funções necessárias:
  login(email: string, password: string): Promise<void>
  register(email: string, password: string, metadata: { name: string, company: string }): Promise<void>
  logout(): Promise<void>
  resetPassword(email: string): Promise<void>
  user: Ref<User | null>  // reativo, atualiza automaticamente
  loading: Ref<boolean>
  error: Ref<string | null>
  ```
  - Usar `useSupabaseClient()` internamente
  - Tratar erros em português: "Email ou senha incorretos", "Email já cadastrado", etc.
- **Critério de aceite:** Funções executam sem erro no console

### 3.3 — Página /login
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/pages/login.vue`
- **O que fazer:**
  - Layout: `auth` (usa AuthLayout.vue)
  - Formulário com UInput (email + password) e UButton (Entrar)
  - Link "Esqueci minha senha" → /forgot-password
  - Link "Criar conta" → /register
  - Loading state no botão durante login
  - Exibir erro inline se credenciais inválidas
  - Após login: redirect para /
- **Estilo:**
  - Card branco rounded-2xl com sombra sutil
  - Logo/título "Vertical IA" acima do form
  - Fundo #E6E6E6
  - Labels uppercase tracking-widest 0.65rem
  - Botão primary: bg-neutral-950 text-white rounded-full
- **Critério de aceite:** Login funcional com redirect

### 3.4 — Página /register
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/pages/register.vue`
- **O que fazer:**
  - Layout: `auth`
  - Campos: nome completo, email, senha, confirmar senha, nome da empresa
  - Validação: senha mínimo 8 chars, senhas conferem, email válido
  - Após registro: redirect para /login com toast "Conta criada! Verifique seu email."
  - Link "Já tem conta? Entrar" → /login
- **Estilo:** Mesmo padrão visual do login
- **Critério de aceite:** Registro cria usuário no Supabase Auth

### 3.5 — Página /forgot-password
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/pages/forgot-password.vue`
- **O que fazer:**
  - Layout: `auth`
  - Campo: email
  - Botão: "Enviar link de recuperação"
  - Após enviar: mensagem "Link enviado para seu email"
  - Link "Voltar para login" → /login
- **Critério de aceite:** Supabase envia email de reset

### 3.6 — Página /reset-password
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/pages/reset-password.vue`
- **O que fazer:**
  - Layout: `auth`
  - Campos: nova senha, confirmar nova senha
  - Botão: "Redefinir senha"
  - Após sucesso: redirect para /login com toast "Senha redefinida!"
  - Capturar token da URL (Supabase envia via query params)
- **Critério de aceite:** Senha alterada com sucesso

### 3.7 — Middleware auth.ts
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/middleware/auth.ts`
- **O que fazer:**
  - Verificar se usuário está autenticado via Supabase
  - Se não: redirect para /login
  - Aplicar como middleware global (exceto rotas públicas)
- **Critério de aceite:** Acessar / sem login redireciona para /login

### 3.8 — Middleware guest.ts
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/middleware/guest.ts`
- **O que fazer:**
  - Verificar se usuário está autenticado
  - Se sim: redirect para /
  - Aplicar nas páginas: login, register, forgot-password
- **Critério de aceite:** Acessar /login logado redireciona para /

### 3.9 — Composable useUser
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/composables/useUser.ts`
- **O que fazer:**
  ```ts
  // Retorna dados enriquecidos do usuário logado
  user: Ref<{
    id: string
    email: string
    name: string
    avatar_url: string | null
    role: 'super_admin' | 'admin' | 'manager' | 'member'
    org_id: string
    org_name: string
  } | null>
  isAdmin: ComputedRef<boolean>
  isManager: ComputedRef<boolean>
  ```
  - Buscar dados do profile no Supabase (tabela users — será criada na Fase 04)
  - Por enquanto, usar metadata do Auth como fallback
- **Critério de aceite:** `useUser()` retorna dados do usuário logado

### 3.10 — Componente UserMenu
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/components/UserMenu.vue`
- **O que fazer:**
  - Avatar do usuário (UAvatar com iniciais como fallback)
  - Click abre dropdown (UDropdown) com:
    - Nome + email (header)
    - Meu Perfil → /profile (placeholder)
    - Configurações → /settings (placeholder)
    - Separador
    - Sair (chama logout)
- **Estilo:** Dropdown com fundo branco, rounded-xl, sombra
- **Critério de aceite:** Menu abre, logout funciona

### 3.11 — Integrar UserMenu no AppHeader
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/components/AppHeader.vue`
- **O que fazer:**
  - Adicionar `<UserMenu />` no canto direito do header
  - Mostrar só quando autenticado
- **Critério de aceite:** Header mostra UserMenu após login

### 3.12 — Página Home (/) com AppLayout
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/pages/index.vue`
- **O que fazer:**
  - Usar AppLayout (sidebar + header + content)
  - Conteúdo placeholder: "Bem-vindo ao Vertical IA" + nome do usuário
  - Middleware: auth (exige login)
- **Critério de aceite:** Após login, usuário vê a home com layout completo

### 3.13 — Commit Fase 03
- **Status:** ✅
- **Tipo:** Git
- **Comando:**
  ```bash
  git add .
  git commit -m "feat: Phase 03 - Authentication (Supabase Auth, login, register, middlewares, UserMenu)"
  ```

---

## FASE 04 — Membros & Multitenancy

### 4.1 — SQL: Tabelas organizations, users, sectors
- **Status:** ✅
- **Tipo:** SQL Migration
- **O que fazer:**
  - Criar arquivo `supabase/migrations/001_organizations_users.sql`
  - Tabelas:
    ```sql
    -- organizations
    CREATE TABLE organizations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text UNIQUE NOT NULL,
      logo_url text,
      plan text DEFAULT 'starter',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- users (profile vinculado ao auth.users)
    CREATE TABLE users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      auth_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
      org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
      name text NOT NULL,
      email text NOT NULL,
      role text NOT NULL DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'manager', 'member')),
      avatar_url text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- sectors
    CREATE TABLE sectors (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
      name text NOT NULL,
      created_at timestamptz DEFAULT now()
    );

    -- user_sectors (muitos-para-muitos)
    CREATE TABLE user_sectors (
      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
      sector_id uuid REFERENCES sectors(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, sector_id)
    );
    ```
- **Critério de aceite:** Tabelas criadas no Supabase sem erros

### 4.2 — SQL: RLS Policies
- **Status:** ✅
- **Tipo:** SQL Migration
- **O que fazer:**
  - Habilitar RLS em todas as tabelas
  - Policy: usuário só vê dados da própria org
  - Admin pode CRUD tudo na org
  - Member só lê e edita próprio perfil
  ```sql
  ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;

  -- Exemplo policy: users veem apenas sua org
  CREATE POLICY "users_org_isolation" ON users
    FOR ALL USING (
      org_id = (SELECT org_id FROM users WHERE auth_id = auth.uid())
    );
  ```
- **Critério de aceite:** Query de outra org retorna vazio

### 4.3 — SQL: Trigger auto-create org + admin no registro
- **Status:** ✅
- **Tipo:** SQL Function
- **O que fazer:**
  - Trigger `on_auth_user_created` que:
    1. Cria organization com name = metadata.company
    2. Cria user com role = 'admin', org_id = nova org
  ```sql
  CREATE OR REPLACE FUNCTION handle_new_user()
  RETURNS TRIGGER AS $$
  DECLARE
    new_org_id uuid;
  BEGIN
    INSERT INTO organizations (name, slug)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'company', 'Minha Empresa'),
      LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'company', 'empresa-' || gen_random_uuid()), ' ', '-'))
    )
    RETURNING id INTO new_org_id;

    INSERT INTO users (auth_id, org_id, name, email, role)
    VALUES (
      NEW.id,
      new_org_id,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
      NEW.email,
      'admin'
    );

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  ```
- **Critério de aceite:** Registro cria org + user automaticamente

### 4.4 — Atualizar useUser para buscar do DB
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/composables/useUser.ts`
- **O que fazer:**
  - Buscar dados da tabela `users` JOIN `organizations`
  - Retornar role, org_id, org_name reais do banco
- **Critério de aceite:** useUser retorna dados reais após login

### 4.5 — Composable useOrganization
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/composables/useOrganization.ts`
- **O que fazer:**
  - `org`: dados da organização do usuário logado
  - `updateOrg(data)`: atualizar nome, logo
  - `uploadLogo(file)`: upload para Supabase Storage
- **Critério de aceite:** Admin edita dados da org

### 4.6 — Composable useMembers
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/composables/useMembers.ts`
- **O que fazer:**
  - `members`: lista de membros da org
  - `addMember(data)`: criar usuário na org
  - `updateMember(id, data)`: editar role, setor
  - `removeMember(id)`: remover da org
  - `inviteMember(email, role)`: gerar convite
- **Critério de aceite:** CRUD completo de membros

### 4.7 — Composable useSectors
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/composables/useSectors.ts`
- **O que fazer:**
  - `sectors`: lista de setores da org
  - `addSector(name)`: criar setor
  - `updateSector(id, name)`: renomear
  - `removeSector(id)`: excluir
  - `assignUser(userId, sectorId)`: vincular usuário a setor
- **Critério de aceite:** CRUD de setores funciona

### 4.8 — Composable usePermissions
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/composables/usePermissions.ts`
- **O que fazer:**
  - `can(action: string)`: verifica se user tem permissão
  - `isAdmin`, `isManager`, `isMember`: computed booleans
  - `hasRole(role)`: check direto
- **Critério de aceite:** Permissões controlam visibilidade de UI

### 4.9 — Server API: Convites
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `server/api/invite.post.ts`
- **O que fazer:**
  - Recebe: email, role, org_id
  - Gera token único
  - Salva convite no DB (criar tabela `invites`)
  - Retorna link de convite
  - (Email será integrado na Fase 05)
- **Critério de aceite:** Endpoint retorna link válido

### 4.10 — Página /invite/:token
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/pages/invite/[token].vue`
- **O que fazer:**
  - Buscar convite pelo token
  - Se válido: form de registro (nome, senha)
  - Ao confirmar: cria usuário vinculado à org do convite
  - Se expirado/inválido: mensagem de erro
- **Critério de aceite:** Convidado cria conta e entra na org

### 4.11 — Componente OrgSelector
- **Status:** ✅
- **Tipo:** Código
- **Arquivo:** `app/components/OrgSelector.vue`
- **O que fazer:**
  - Mostra nome da org atual na sidebar
  - (Futuro: dropdown para trocar de org se multi-org)
  - Por agora: display only com logo/nome
- **Critério de aceite:** Nome da org aparece na sidebar

### 4.12 — Commit Fase 04
- **Status:** ✅
- **Tipo:** Git
- **Comando:**
  ```bash
  git add .
  git commit -m "feat: Phase 04 - Members & Multitenancy (orgs, users, sectors, RLS, invites)"
  ```

---

## FASE 05 — Emails Transacionais

### 5.1 — Instalar e configurar Resend
- **Status:** ⬜
- **Tipo:** Config
- **O que fazer:**
  - `npm install resend`
  - Adicionar `RESEND_API_KEY` no `.env`
  - Criar `server/utils/resend.ts` com cliente configurado
- **Critério de aceite:** Import funciona sem erro

### 5.2 — Template: Convite de colaborador
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `server/email/templates/invite.ts`
- **O que fazer:**
  - HTML email responsivo
  - Texto: "[Nome] te convidou para [Empresa] no Vertical IA"
  - Botão CTA: "Aceitar Convite" → link do convite
  - Footer com logo Vertical IA
- **Critério de aceite:** Email renderiza corretamente

### 5.3 — Template: Bem-vindo
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `server/email/templates/welcome.ts`
- **O que fazer:**
  - "Bem-vindo ao Vertical IA, [Nome]!"
  - Próximos passos: configurar equipe, criar primeiro agente
  - Botão: "Acessar Plataforma"
- **Critério de aceite:** Email enviado após registro

### 5.4 — Template: Reset de senha
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `server/email/templates/reset-password.ts`
- **O que fazer:**
  - "Redefina sua senha"
  - Botão: "Redefinir Senha" → link do Supabase
  - Aviso: "Se não solicitou, ignore este email"
- **Critério de aceite:** Email funcional para reset

### 5.5 — Template: Alerta de limite
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `server/email/templates/usage-alert.ts`
- **O que fazer:**
  - "Você atingiu [X]% dos seus créditos de IA"
  - Barra de progresso visual
  - Botão: "Ver Planos" → /settings/billing
- **Critério de aceite:** Email renderiza com dados dinâmicos

### 5.6 — Server API: /api/email/send
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `server/api/email/send.post.ts`
- **O que fazer:**
  - Recebe: template, to, data
  - Renderiza template com dados
  - Envia via Resend
  - Retorna status
- **Critério de aceite:** Endpoint envia emails

### 5.7 — Integrar envio de email no fluxo de convite
- **Status:** ⬜
- **Tipo:** Código
- **O que fazer:**
  - No `server/api/invite.post.ts`, após gerar convite, chamar /api/email/send com template invite
- **Critério de aceite:** Convidar membro envia email real

### 5.8 — Commit Fase 05
- **Status:** ⬜
- **Tipo:** Git
- **Comando:**
  ```bash
  git add .
  git commit -m "feat: Phase 05 - Transactional Emails (Resend, invite, welcome, reset, alerts)"
  ```

---

## FASE 06 — Chat Hub & Conversas

### 6.1 — SQL: Tabelas conversations e messages
- **Status:** ⬜
- **Tipo:** SQL Migration
- **O que fazer:**
  ```sql
  CREATE TABLE conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid REFERENCES organizations(id),
    user_id uuid REFERENCES users(id),
    agent_id uuid, -- FK será adicionada na Fase 08
    title text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content text NOT NULL,
    metadata jsonb DEFAULT '{}', -- attachments, model usado, tokens, etc
    created_at timestamptz DEFAULT now()
  );
  ```
  - RLS: usuário só vê conversas da própria org
- **Critério de aceite:** Tabelas criadas com RLS

### 6.2 — Composable useConversations
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useConversations.ts`
- **O que fazer:**
  - `conversations`: lista ordenada por updated_at
  - `createConversation(agentId?)`: nova conversa
  - `deleteConversation(id)`: excluir
  - `renameConversation(id, title)`: renomear
- **Critério de aceite:** CRUD de conversas funciona

### 6.3 — Composable useChat
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useChat.ts`
- **O que fazer:**
  - `messages`: lista de mensagens da conversa atual
  - `sendMessage(content, attachments?)`: envia e recebe resposta
  - `streamResponse()`: SSE streaming do backend Python
  - `loadHistory(conversationId)`: carregar mensagens anteriores
  - `isStreaming`: ref booleano
  - `isLoading`: ref booleano
- **Critério de aceite:** Mensagens enviadas e recebidas (mock por enquanto)

### 6.4 — Componente ConversationList
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/ConversationList.vue`
- **O que fazer:**
  - Lista na sidebar com conversas do usuário
  - Cada item: título (ou preview da primeira msg), data
  - Click seleciona conversa
  - Botão "+ Nova Conversa"
  - Busca por título
- **Critério de aceite:** Lista renderiza e navega

### 6.5 — Componente ChatInput
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/ChatInput.vue`
- **O que fazer:**
  - Textarea auto-expand
  - Botão de enviar (ícone send)
  - Botão de anexo (upload de arquivo)
  - Preview de anexos antes de enviar
  - Enter envia, Shift+Enter nova linha
  - Desabilitado durante streaming
- **Estilo:** Borda rounded-2xl, fundo branco, sombra sutil
- **Critério de aceite:** Input funcional com upload

### 6.6 — Componente ChatMessage
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/ChatMessage.vue`
- **O que fazer:**
  - Props: role (user/assistant), content, metadata, timestamp
  - User: bolha alinhada à direita, fundo neutral-200
  - Assistant: alinhada à esquerda, fundo branco
  - Markdown rendering (negrito, listas, links, código)
  - Code blocks com syntax highlight e botão "Copiar"
  - Imagens/vídeos/áudio inline
  - Timestamp hover
- **Critério de aceite:** Mensagens renderizadas com markdown

### 6.7 — Componente ChatMediaRenderer
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/ChatMediaRenderer.vue`
- **O que fazer:**
  - Renderiza mídia conforme tipo:
    - Imagens: lightbox com zoom
    - Vídeo: player inline
    - Áudio: player com waveform
    - PDF: preview com link para download
  - Botão de download em todos
- **Critério de aceite:** Mídias renderizadas inline

### 6.8 — Página / (Home)
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/pages/index.vue` (atualizar)
- **O que fazer:**
  - Saudação: "Bom dia, [Nome]! Como posso ajudar?"
  - Carrossel de agentes disponíveis (placeholder cards)
  - Campo de chat centralizado (ChatInput)
  - Sugestões de prompts rápidos
- **Critério de aceite:** Home mostra saudação e campo de chat

### 6.9 — Página /chat/:id
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/pages/chat/[id].vue`
- **O que fazer:**
  - Layout com lista de mensagens (scroll) + ChatInput fixo no bottom
  - Carregar histórico da conversa
  - Auto-scroll para última mensagem
  - Indicador "Digitando..." durante streaming
  - Empty state se conversa vazia
- **Critério de aceite:** Conversa completa funcional

### 6.10 — Upload de anexos para Supabase Storage
- **Status:** ⬜
- **Tipo:** Código
- **O que fazer:**
  - Bucket `chat-attachments` no Supabase Storage
  - Upload via composable
  - Retornar URL pública do arquivo
  - Salvar referência no metadata da message
- **Critério de aceite:** Upload funciona e URL é acessível

### 6.11 — Commit Fase 06
- **Status:** ⬜
- **Tipo:** Git
- **Comando:**
  ```bash
  git add .
  git commit -m "feat: Phase 06 - Chat Hub (conversations, messages, streaming, attachments, markdown)"
  ```

---

## FASE 07 — Central de Projetos & Tarefas

### 7.1 — SQL: Tabelas de projetos e tarefas
- **Status:** ⬜
- **Tipo:** SQL Migration
- **O que fazer:**
  - Criar todas as tabelas conforme PRD seção 4.11:
    - projects, project_members, tasks, subtasks
    - task_comments, task_attachments, task_tags, task_tag_links
  - RLS em todas (isolamento por org_id)
  - Indexes: tasks(project_id), tasks(assignee_id), tasks(status), tasks(due_date)
- **Critério de aceite:** Tabelas criadas com RLS e indexes

### 7.2 — Composable useProjects
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useProjects.ts`
- **O que fazer:**
  - `projects`: lista de projetos da org
  - `createProject(data)`: nome, cor, ícone, visibilidade
  - `updateProject(id, data)`: editar
  - `archiveProject(id)`: arquivar
  - `addMember(projectId, userId, role)`: adicionar membro
  - `removeMember(projectId, userId)`: remover
- **Critério de aceite:** CRUD completo de projetos

### 7.3 — Composable useTasks
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useTasks.ts`
- **O que fazer:**
  - `tasks`: lista filtrada de tarefas do projeto
  - `createTask(data)`: título, descrição, assignee, priority, dates, tags
  - `updateTask(id, data)`: editar qualquer campo
  - `deleteTask(id)`: excluir
  - `moveTask(id, newStatus)`: mover no kanban (drag & drop)
  - `reorderTask(id, newPosition)`: reordenar
  - Filtros: status, priority, assignee, tag, date range
  - Ordenação: por data, prioridade, título
- **Critério de aceite:** CRUD + filtros + reorder funcionam

### 7.4 — Composable useSubtasks
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useSubtasks.ts`
- **O que fazer:**
  - `subtasks(taskId)`: lista de subtarefas
  - `addSubtask(taskId, title)`: criar
  - `toggleSubtask(id)`: marcar/desmarcar
  - `deleteSubtask(id)`: excluir
  - `reorderSubtask(id, newPosition)`: reordenar
- **Critério de aceite:** Checklist funcional

### 7.5 — Composable useTaskComments
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useTaskComments.ts`
- **O que fazer:**
  - `comments(taskId)`: lista de comentários
  - `addComment(taskId, content)`: criar
  - `updateComment(id, content)`: editar
  - `deleteComment(id)`: excluir
- **Critério de aceite:** Comentários CRUD funcional

### 7.6 — Composable useTaskTags
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useTaskTags.ts`
- **O que fazer:**
  - `tags`: lista de tags da org
  - `createTag(name, color)`: criar tag
  - `deleteTag(id)`: excluir
  - `addTagToTask(taskId, tagId)`: vincular
  - `removeTagFromTask(taskId, tagId)`: desvincular
- **Critério de aceite:** Tags customizáveis funcionam

### 7.7 — Página /projects
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/pages/projects/index.vue`
- **O que fazer:**
  - Grid de ProjectCard (3 colunas desktop, 1 mobile)
  - Cada card: ícone, cor, nome, contagem tarefas, avatars membros, barra progresso
  - Botão "+ Novo Projeto" abre modal
  - Filtro: ativos / arquivados
  - Busca por nome
- **Critério de aceite:** Listagem com cards renderiza

### 7.8 — Componente ProjectFormModal
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/projects/ProjectFormModal.vue`
- **O que fazer:**
  - Campos: nome, descrição, cor (color picker), ícone (icon picker), visibilidade
  - Seção de membros: multi-select de usuários da org com role (owner/editor/viewer)
  - Modo criar e modo editar
- **Critério de aceite:** Modal cria e edita projetos

### 7.9 — Página /projects/:id (shell com toggle de views)
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/pages/projects/[id].vue`
- **O que fazer:**
  - Header: nome do projeto, cor, botão "+ Nova Tarefa", filtros
  - Toggle de visualização: Lista | Kanban | Calendário | Gantt
  - Renderizar componente correspondente
  - Botão de configurações do projeto
- **Critério de aceite:** Toggle troca entre views

### 7.10 — Componente TaskListView
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/projects/TaskListView.vue`
- **O que fazer:**
  - Tabela (UTable) com colunas: título, status (badge), prioridade (ícone cor), responsável (avatar), due_date, tags, progresso subtarefas
  - Sort por qualquer coluna
  - Click na linha abre TaskDetailDrawer
  - Empty state quando sem tarefas
- **Critério de aceite:** Tabela com sort funciona

### 7.11 — Componente TaskKanbanView
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/projects/TaskKanbanView.vue`
- **O que fazer:**
  - 4 colunas: A fazer | Em andamento | Revisão | Concluído
  - Cards draggable entre colunas (usar vuedraggable ou similar)
  - Ao mover: atualiza status automaticamente
  - Contagem de tarefas no header de cada coluna
  - Botão "+ Tarefa" em cada coluna
- **Critério de aceite:** Drag & drop atualiza status

### 7.12 — Componente TaskCalendarView
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/projects/TaskCalendarView.vue`
- **O que fazer:**
  - Calendário mensal/semanal
  - Tarefas posicionadas por due_date
  - Cor = prioridade ou projeto
  - Click na tarefa abre drawer
  - Tarefas atrasadas em vermelho
  - Navegação mês anterior/próximo
- **Critério de aceite:** Calendário renderiza tarefas

### 7.13 — Componente TaskGanttView
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/projects/TaskGanttView.vue`
- **O que fazer:**
  - Barras horizontais: start_date → due_date
  - Zoom: dia, semana, mês
  - Linha vertical "hoje"
  - Indicador de progresso nas barras (subtarefas concluídas)
  - Scroll horizontal
  - Tarefas sem start_date = ponto na due_date
- **Critério de aceite:** Timeline renderiza com barras

### 7.14 — Componente TaskCard (para Kanban)
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/projects/TaskCard.vue`
- **O que fazer:**
  - Título, avatar responsável, badge prioridade (cor), tags, due_date
  - Barra de progresso subtarefas (ex: 3/5)
  - Indicador de atraso se due_date < hoje
  - Click abre TaskDetailDrawer
- **Critério de aceite:** Card compacto com todas as infos

### 7.15 — Componente TaskDetailDrawer
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/projects/TaskDetailDrawer.vue`
- **O que fazer:**
  - Drawer lateral (direita, 480px)
  - Título editável inline
  - Campos: status, prioridade, responsável, datas, estimativa, tags
  - Seção: SubtaskList
  - Seção: TaskComments
  - Seção: TaskAttachments
  - Botão excluir tarefa
  - Fechar com X ou Escape
- **Critério de aceite:** Drawer com edição completa

### 7.16 — Componentes auxiliares
- **Status:** ⬜
- **Tipo:** Código
- **O que fazer:**
  - `SubtaskList.vue` — checklist com toggle, add, reorder
  - `TaskComments.vue` — lista + input novo comentário
  - `TaskAttachments.vue` — upload, lista, preview, download
  - `TagSelector.vue` — multi-select + criar tag inline
  - `PrioritySelector.vue` — dropdown com ícones de cor
  - `AssigneeSelector.vue` — dropdown com avatars + busca
- **Critério de aceite:** Todos funcionam no drawer

### 7.17 — Página /projects/dashboard
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/pages/projects/dashboard.vue`
- **O que fazer:**
  - 5 KPI cards no topo: total tarefas, taxa conclusão, atraso, tempo médio, produtividade (com trend ↑↓)
  - Gráfico donut: status das tarefas
  - Gráfico barras: produtividade mensal
  - Tabela: carga por pessoa (nome, dept, tarefas, taxa, status)
  - Cards: distribuição por departamento
  - Filtros: período, projeto, setor
  - Usar Chart.js ou similar para gráficos
- **Critério de aceite:** Dashboard conforme design de referência

### 7.18 — Adicionar "Projetos" na sidebar
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/AppSidebar.vue`
- **O que fazer:**
  - Novo item no menu: ícone FolderKanban + "Projetos" → /projects
  - Badge com contagem de tarefas pendentes do usuário
- **Critério de aceite:** Link na sidebar funciona

### 7.19 — Commit Fase 07
- **Status:** ⬜
- **Tipo:** Git
- **Comando:**
  ```bash
  git add .
  git commit -m "feat: Phase 07 - Projects & Tasks (kanban, list, calendar, gantt, dashboard)"
  ```

---

## FASE 08 — Agentes de IA

### 8.1 — SQL: Tabelas agents, model_catalog
- **Status:** ⬜
- **Tipo:** SQL Migration
- **O que fazer:**
  - agents: id, org_id, name, description, system_prompt, model_id, temperature, max_tokens, type (chat/tool), sector_id, avatar_url, is_active, capabilities (jsonb), created_by, created_at
  - model_catalog: id, openrouter_id, display_name, provider, tier (economy/standard/premium), cost_per_1k_input, cost_per_1k_output, context_window, supports_vision, supports_tools
  - agent_knowledge_bases: agent_id, knowledge_folder_id
  - agent_integrations: agent_id, integration_id
  - RLS em todas
- **Critério de aceite:** Tabelas criadas

### 8.2 — Seed: model_catalog
- **Status:** ⬜
- **Tipo:** SQL Seed
- **O que fazer:**
  - Popular com modelos do OpenRouter:
    - Economy: gpt-4o-mini, gemini-flash, llama-3.1, mistral
    - Standard: gpt-4o, claude-sonnet, gemini-pro, deepseek
    - Premium: claude-opus, gpt-4, gemini-ultra, o1
  - Incluir: custo, context_window, supports_vision, supports_tools
- **Critério de aceite:** Modelos no banco

### 8.3 — Composable useAgents
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useAgents.ts`
- **O que fazer:**
  - CRUD completo de agentes
  - Filtros: tipo, setor, modelo
  - Paginação
- **Critério de aceite:** CRUD funcional

### 8.4 — Composable useModels
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/composables/useModels.ts`
- **O que fazer:**
  - Listar modelos do catálogo
  - Filtrar por tier do plano da org
  - Agrupar por provider
- **Critério de aceite:** Lista filtrada por plano

### 8.5 — Página /agents
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/pages/agents/index.vue`
- **O que fazer:**
  - Grid de AgentCard
  - Filtros: Todas, Chat, Ferramenta (UTabs)
  - Botão "+ Novo Agente"
  - Busca por nome
- **Critério de aceite:** Listagem renderiza

### 8.6 — Componente AgentFormModal
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `app/components/agents/AgentFormModal.vue`
- **O que fazer:**
  - Nome, descrição, avatar upload
  - System prompt (PromptEditor com contador)
  - Modelo (ModelSelector filtrado por plano)
  - Temperatura (TemperatureSlider 0-1)
  - Max tokens
  - Tipo: chat ou ferramenta
  - Setor
  - Knowledge bases (multi-select)
  - Integrações MCP (multi-select, placeholder)
  - Capacidades: gerar imagem, gerar vídeo, gerar áudio (toggles)
- **Critério de aceite:** Modal cria agente com todas as configs

### 8.7 — Componentes auxiliares de agente
- **Status:** ⬜
- **Tipo:** Código
- **O que fazer:**
  - `ModelSelector.vue` — dropdown agrupado por provider, badge tier
  - `TemperatureSlider.vue` — USlider 0-1 com labels "Preciso ← → Criativo"
  - `PromptEditor.vue` — textarea com contador de tokens, dicas
- **Critério de aceite:** Componentes funcionais

### 8.8 — Setup Python Backend
- **Status:** ⬜
- **Tipo:** Config
- **O que fazer:**
  - Criar pasta `backend/` na raiz
  - Python 3.11+, FastAPI, uvicorn
  - `requirements.txt`: fastapi, uvicorn, supabase, openai (para OpenRouter), agno
  - `backend/main.py`: app FastAPI com CORS
  - Endpoint health: GET /api/v1/health
  - `.env` com OPENROUTER_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
- **Critério de aceite:** `uvicorn main:app` roda na porta 8000

### 8.9 — Python: Endpoint POST /api/v1/chat
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `backend/routes/chat.py`
- **O que fazer:**
  - Recebe: conversation_id, message, agent_id
  - Busca config do agente no Supabase
  - Valida tier do modelo vs plano da org
  - Monta agente Agno com prompt/model/temp/tools
  - Executa e retorna via SSE (streaming)
  - Salva mensagem no Supabase
- **Critério de aceite:** Chat com streaming funciona end-to-end

### 8.10 — Python: Tools de tarefas para agentes
- **Status:** ⬜
- **Tipo:** Código
- **Arquivo:** `backend/tools/tasks.py`
- **O que fazer:**
  - `create_task(title, project_id, assignee_email, priority, due_date)`: cria tarefa no Supabase
  - `list_tasks(project_id, status?, assignee?)`: lista/filtra tarefas
  - `update_task(task_id, status?, assignee?, due_date?)`: atualiza tarefa
  - Registrar como tools do agente Agno
- **Critério de aceite:** Agente cria tarefas via chat

### 8.11 — Integrar streaming no frontend
- **Status:** ⬜
- **Tipo:** Código
- **O que fazer:**
  - Atualizar useChat para conectar no backend Python
  - EventSource para SSE
  - Renderização incremental da resposta
- **Critério de aceite:** Chat com IA funciona com streaming real

### 8.12 — Commit Fase 08
- **Status:** ⬜
- **Tipo:** Git
- **Comando:**
  ```bash
  git add .
  git commit -m "feat: Phase 08 - AI Agents (CRUD, OpenRouter, streaming, task tools)"
  ```

---

## FASES 09-15 (Títulos — detalhar quando chegar)

### Fase 09 — Base de Conhecimento
> Pastas, upload, Vertex AI Search, RAG, status indexação

### Fase 10 — Central de Reuniões
> Gravação, transcrição, atas IA, tarefas automáticas, permissões

### Fase 11 — Integrações MCP
> Catálogo, conexão self-service, tools nos agentes, health check

### Fase 12 — Painéis e KPIs
> Dashboards pré-configurados, gráficos, dados como RAG

### Fase 13 — Configurações
> Painel admin: empresa, equipe, agentes, knowledge, billing

### Fase 14 — Billing & Limites
> Asaas, planos, controle de uso, add-ons, upgrade

### Fase 15 — Deploy & Produção
> Vercel, Cloud Run, PWA, domínio, SSL, Sentry, testes E2E

---

*Atualize o status de cada tarefa conforme avança. Ao iniciar uma sessão, peça ao Claude Code para ler este arquivo e executar a próxima tarefa pendente.*
