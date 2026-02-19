export type AppRole = 'super_admin' | 'admin' | 'manager' | 'member'

const ROLE_LEVEL: Record<AppRole, number> = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  member: 1,
}

export function usePermissions() {
  const { profile } = useUser()

  const role = computed<AppRole>(() => profile.value?.role ?? 'member')

  const isSuperAdmin = computed(() => role.value === 'super_admin')
  const isAdmin = computed(() => ROLE_LEVEL[role.value] >= ROLE_LEVEL.admin)
  const isManager = computed(() => ROLE_LEVEL[role.value] >= ROLE_LEVEL.manager)
  const isMember = computed(() => !!profile.value)

  function hasRole(requiredRole: AppRole): boolean {
    return ROLE_LEVEL[role.value] >= ROLE_LEVEL[requiredRole]
  }

  function can(action: string): boolean {
    const permissions: Record<string, AppRole> = {
      'org.update': 'admin',
      'org.delete': 'super_admin',
      'members.invite': 'admin',
      'members.remove': 'admin',
      'members.update_role': 'admin',
      'sectors.manage': 'manager',
      'projects.create': 'manager',
      'projects.delete': 'admin',
      'tasks.create': 'member',
      'tasks.delete': 'admin',
    }

    const requiredRole = permissions[action]
    if (!requiredRole) return true
    return hasRole(requiredRole)
  }

  return {
    role,
    isSuperAdmin,
    isAdmin,
    isManager,
    isMember,
    hasRole,
    can,
  }
}
