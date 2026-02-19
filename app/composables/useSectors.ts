import type { Database } from '~/types/database.types'

type Sector = Database['public']['Tables']['sectors']['Row']

export function useSectors() {
  const supabase = useSupabaseClient<Database>()
  const { profile } = useUser()
  const toast = useToast()

  const sectors = ref<Sector[]>([])
  const loading = ref(false)

  async function fetchSectors() {
    if (!profile.value?.orgId) return

    loading.value = true
    const { data } = await supabase
      .from('sectors')
      .select('*')
      .eq('org_id', profile.value.orgId)
      .order('name')

    if (data) sectors.value = data
    loading.value = false
  }

  async function addSector(name: string) {
    if (!profile.value?.orgId) return false

    loading.value = true
    const { data, error } = await supabase
      .from('sectors')
      .insert({ org_id: profile.value.orgId, name })
      .select()
      .single()

    if (error) {
      toast.error('Erro', 'Não foi possível criar o setor.')
    } else if (data) {
      sectors.value.push(data)
      sectors.value.sort((a, b) => a.name.localeCompare(b.name))
      toast.success('Setor criado', `"${name}" foi adicionado.`)
    }

    loading.value = false
    return !error
  }

  async function updateSector(id: string, name: string) {
    loading.value = true
    const { error } = await supabase
      .from('sectors')
      .update({ name })
      .eq('id', id)

    if (error) {
      toast.error('Erro', 'Não foi possível renomear o setor.')
    } else {
      const idx = sectors.value.findIndex(s => s.id === id)
      if (idx !== -1) sectors.value[idx].name = name
    }

    loading.value = false
    return !error
  }

  async function removeSector(id: string) {
    loading.value = true
    const { error } = await supabase
      .from('sectors')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Erro', 'Não foi possível excluir o setor.')
    } else {
      sectors.value = sectors.value.filter(s => s.id !== id)
      toast.success('Excluído', 'Setor removido.')
    }

    loading.value = false
    return !error
  }

  async function assignUser(userId: string, sectorId: string) {
    const { error } = await supabase
      .from('user_sectors')
      .insert({ user_id: userId, sector_id: sectorId })

    return !error
  }

  async function unassignUser(userId: string, sectorId: string) {
    const { error } = await supabase
      .from('user_sectors')
      .delete()
      .eq('user_id', userId)
      .eq('sector_id', sectorId)

    return !error
  }

  return {
    sectors,
    loading,
    fetchSectors,
    addSector,
    updateSector,
    removeSector,
    assignUser,
    unassignUser,
  }
}
