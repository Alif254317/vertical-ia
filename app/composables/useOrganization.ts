import type { Database } from '~/types/database.types'

type Organization = Database['public']['Tables']['organizations']['Row']

export function useOrganization() {
  const supabase = useSupabaseClient<Database>()
  const { profile } = useUser()

  const org = ref<Organization | null>(null)
  const loading = ref(false)

  async function fetchOrg() {
    if (!profile.value?.orgId) return

    loading.value = true
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.value.orgId)
      .single()

    if (data) org.value = data
    loading.value = false
  }

  async function updateOrg(updates: { name?: string; logo_url?: string }) {
    if (!org.value) return false

    loading.value = true
    const { error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', org.value.id)

    if (!error) {
      if (updates.name) org.value.name = updates.name
      if (updates.logo_url !== undefined) org.value.logo_url = updates.logo_url
    }

    loading.value = false
    return !error
  }

  async function uploadLogo(file: File) {
    if (!org.value) return null

    const ext = file.name.split('.').pop()
    const path = `orgs/${org.value.id}/logo.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (error) return null

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    if (urlData?.publicUrl) {
      await updateOrg({ logo_url: urlData.publicUrl })
    }

    return urlData?.publicUrl ?? null
  }

  return {
    org,
    loading,
    fetchOrg,
    updateOrg,
    uploadLogo,
  }
}
