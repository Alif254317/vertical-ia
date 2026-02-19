import type { Database } from '~/types/database.types'

type DbUser = Database['public']['Tables']['users']['Row']

export interface UserProfile {
  id: string
  authId: string
  email: string
  name: string
  avatarUrl: string | null
  role: 'super_admin' | 'admin' | 'manager' | 'member'
  orgId: string
  orgName: string
}

const dbUser = ref<DbUser | null>(null)
const orgName = ref<string>('')
const fetched = ref(false)

export function useUser() {
  const supabase = useSupabaseClient<Database>()
  const authUser = useSupabaseUser()

  const profile = computed<UserProfile | null>(() => {
    if (!dbUser.value) return null
    return {
      id: dbUser.value.id,
      authId: dbUser.value.auth_id,
      email: dbUser.value.email,
      name: dbUser.value.name,
      avatarUrl: dbUser.value.avatar_url,
      role: dbUser.value.role as UserProfile['role'],
      orgId: dbUser.value.org_id,
      orgName: orgName.value,
    }
  })

  const isAuthenticated = computed(() => !!authUser.value)

  const isAdmin = computed(() => {
    const r = profile.value?.role
    return r === 'super_admin' || r === 'admin'
  })

  const isManager = computed(() => {
    const r = profile.value?.role
    return r === 'super_admin' || r === 'admin' || r === 'manager'
  })

  const initials = computed(() => {
    if (!profile.value?.name) return '?'
    return profile.value.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase()
  })

  async function fetchProfile() {
    if (!authUser.value) {
      dbUser.value = null
      orgName.value = ''
      fetched.value = false
      return
    }

    const { data } = await supabase
      .from('users')
      .select('*, organizations(name)')
      .eq('auth_id', authUser.value.id)
      .single()

    if (data) {
      dbUser.value = data
      orgName.value = (data as any).organizations?.name ?? ''
      fetched.value = true
    }
  }

  async function updateProfile(updates: { name?: string; avatar_url?: string }) {
    if (!dbUser.value) return false

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', dbUser.value.id)

    if (!error) {
      if (updates.name) dbUser.value.name = updates.name
      if (updates.avatar_url !== undefined) dbUser.value.avatar_url = updates.avatar_url
    }

    return !error
  }

  return {
    user: authUser,
    profile,
    dbUser,
    isAuthenticated,
    isAdmin,
    isManager,
    initials,
    fetched,
    fetchProfile,
    updateProfile,
  }
}
