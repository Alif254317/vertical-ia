-- ============================================================
-- FASE 04 — Membros & Multitenancy
-- Migration: organizations, users, sectors, user_sectors
-- ============================================================

-- ── 1. Tabelas ──────────────────────────────────────────────

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  plan text NOT NULL DEFAULT 'starter',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'manager', 'member')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_sectors (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sector_id uuid NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, sector_id)
);

CREATE TABLE invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by uuid REFERENCES users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── 2. Indexes ──────────────────────────────────────────────

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sectors_org_id ON sectors(org_id);
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_org_id ON invites(org_id);
CREATE INDEX idx_invites_email ON invites(email);

-- ── 3. Helper function (RLS performance) ────────────────────

CREATE OR REPLACE FUNCTION public.get_my_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT org_id FROM public.users WHERE auth_id = (SELECT auth.uid())
$$;

-- ── 4. RLS ──────────────────────────────────────────────────

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- organizations: membros veem sua org
CREATE POLICY "org_select" ON organizations
  FOR SELECT TO authenticated
  USING (id = (SELECT public.get_my_org_id()));

CREATE POLICY "org_update" ON organizations
  FOR UPDATE TO authenticated
  USING (id = (SELECT public.get_my_org_id()))
  WITH CHECK (id = (SELECT public.get_my_org_id()));

-- users: membros veem colegas da mesma org
CREATE POLICY "users_select" ON users
  FOR SELECT TO authenticated
  USING (org_id = (SELECT public.get_my_org_id()));

CREATE POLICY "users_update_self" ON users
  FOR UPDATE TO authenticated
  USING (auth_id = (SELECT auth.uid()))
  WITH CHECK (auth_id = (SELECT auth.uid()));

-- admin/super_admin podem inserir e deletar users na org
CREATE POLICY "users_insert" ON users
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id = (SELECT public.get_my_org_id())
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin')
  );

CREATE POLICY "users_delete" ON users
  FOR DELETE TO authenticated
  USING (
    org_id = (SELECT public.get_my_org_id())
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin')
  );

-- sectors: membros veem setores da org
CREATE POLICY "sectors_select" ON sectors
  FOR SELECT TO authenticated
  USING (org_id = (SELECT public.get_my_org_id()));

CREATE POLICY "sectors_manage" ON sectors
  FOR ALL TO authenticated
  USING (
    org_id = (SELECT public.get_my_org_id())
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin', 'manager')
  )
  WITH CHECK (
    org_id = (SELECT public.get_my_org_id())
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin', 'manager')
  );

-- user_sectors: mesma lógica de sectors
CREATE POLICY "user_sectors_select" ON user_sectors
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = user_sectors.user_id
        AND u.org_id = (SELECT public.get_my_org_id())
    )
  );

CREATE POLICY "user_sectors_manage" ON user_sectors
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = user_sectors.user_id
        AND u.org_id = (SELECT public.get_my_org_id())
    )
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin', 'manager')
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = user_sectors.user_id
        AND u.org_id = (SELECT public.get_my_org_id())
    )
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin', 'manager')
  );

-- invites: admin da org gerencia convites
CREATE POLICY "invites_select" ON invites
  FOR SELECT TO authenticated
  USING (org_id = (SELECT public.get_my_org_id()));

CREATE POLICY "invites_manage" ON invites
  FOR ALL TO authenticated
  USING (
    org_id = (SELECT public.get_my_org_id())
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin')
  )
  WITH CHECK (
    org_id = (SELECT public.get_my_org_id())
    AND (SELECT role FROM public.users WHERE auth_id = (SELECT auth.uid())) IN ('super_admin', 'admin')
  );

-- invites: acesso público por token (para página /invite/[token])
CREATE POLICY "invites_select_by_token" ON invites
  FOR SELECT TO anon
  USING (accepted_at IS NULL AND expires_at > now());

-- ── 5. Trigger: auto-create org + user on auth signup ───────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_org_id uuid;
  org_slug text;
  company_name text;
BEGIN
  company_name := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'company'), ''), 'Minha Empresa');

  -- Gerar slug único
  org_slug := LOWER(REGEXP_REPLACE(company_name, '[^a-zA-Z0-9]+', '-', 'g'));
  org_slug := TRIM(BOTH '-' FROM org_slug);
  IF org_slug = '' THEN
    org_slug := 'org';
  END IF;
  org_slug := org_slug || '-' || SUBSTR(gen_random_uuid()::text, 1, 8);

  INSERT INTO public.organizations (name, slug)
  VALUES (company_name, org_slug)
  RETURNING id INTO new_org_id;

  INSERT INTO public.users (auth_id, org_id, name, email, role)
  VALUES (
    NEW.id,
    new_org_id,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    'admin'
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 6. Updated_at trigger ───────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
