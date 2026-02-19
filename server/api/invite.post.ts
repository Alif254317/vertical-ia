import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, role, org_id, invited_by } = body

  if (!email || !role || !org_id) {
    throw createError({ statusCode: 400, statusMessage: 'email, role e org_id são obrigatórios.' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabase.url as string,
    config.supabaseServiceKey as string,
  )

  // Verificar convite duplicado
  const { data: existing } = await supabase
    .from('invites')
    .select('id')
    .eq('org_id', org_id)
    .eq('email', email)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Já existe um convite pendente para este e-mail.' })
  }

  const { data: invite, error } = await supabase
    .from('invites')
    .insert({ org_id, email, role, invited_by })
    .select('id, token, email, role, expires_at')
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const baseUrl = getRequestURL(event).origin
  const inviteUrl = `${baseUrl}/invite/${invite.token}`

  return {
    invite,
    url: inviteUrl,
  }
})
