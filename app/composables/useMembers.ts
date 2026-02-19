import type { Database } from '~/types/database.types'

type DbUser = Database['public']['Tables']['users']['Row']

export interface MemberWithSectors extends DbUser {
  sectors?: { id: string; name: string }[]
}

export function useMembers() {
  const supabase = useSupabaseClient<Database>()
  const { profile } = useUser()
  const toast = useToast()

  const members = ref<MemberWithSectors[]>([])
  const loading = ref(false)

  async function fetchMembers() {
    if (!profile.value?.orgId) return

    loading.value = true
    const { data } = await supabase
      .from('users')
      .select('*, user_sectors(sector_id, sectors(id, name))')
      .eq('org_id', profile.value.orgId)
      .order('name')

    if (data) {
      members.value = data.map((m: any) => ({
        ...m,
        sectors: m.user_sectors?.map((us: any) => us.sectors).filter(Boolean) ?? [],
      }))
    }

    loading.value = false
  }

  async function updateMember(id: string, updates: { role?: string; name?: string }) {
    loading.value = true
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)

    if (error) {
      toast.error('Erro', 'Não foi possível atualizar o membro.')
    } else {
      const idx = members.value.findIndex(m => m.id === id)
      if (idx !== -1) {
        Object.assign(members.value[idx], updates)
      }
      toast.success('Atualizado', 'Dados do membro atualizados.')
    }

    loading.value = false
    return !error
  }

  async function removeMember(id: string) {
    loading.value = true
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Erro', 'Não foi possível remover o membro.')
    } else {
      members.value = members.value.filter(m => m.id !== id)
      toast.success('Removido', 'Membro removido da organização.')
    }

    loading.value = false
    return !error
  }

  async function inviteMember(email: string, role: string) {
    if (!profile.value?.orgId) return false

    loading.value = true

    // Verificar se já existe convite pendente
    const { data: existing } = await supabase
      .from('invites')
      .select('id')
      .eq('org_id', profile.value.orgId)
      .eq('email', email)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (existing) {
      toast.warning('Convite já enviado', 'Já existe um convite pendente para este e-mail.')
      loading.value = false
      return false
    }

    const { data: invite, error } = await supabase
      .from('invites')
      .insert({
        org_id: profile.value.orgId,
        email,
        role,
        invited_by: profile.value.id,
      })
      .select('token')
      .single()

    if (error) {
      toast.error('Erro', 'Não foi possível criar o convite.')
    } else {
      toast.success('Convite criado', `Link de convite gerado para ${email}.`)
    }

    loading.value = false
    return invite?.token ?? null
  }

  return {
    members,
    loading,
    fetchMembers,
    updateMember,
    removeMember,
    inviteMember,
  }
}
