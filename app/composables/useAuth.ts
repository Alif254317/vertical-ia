export function useAuth() {
  const supabase = useSupabaseClient()
  const toast = useToast()

  const loading = ref(false)
  const error = ref<string | null>(null)

  function clearError() {
    error.value = null
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })

    if (err) {
      error.value = translateAuthError(err.message)
      toast.error('Erro ao entrar', error.value)
    }

    loading.value = false
    return !err
  }

  async function register(email: string, password: string, fullName: string, company?: string) {
    loading.value = true
    error.value = null

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, company: company || '' },
      },
    })

    if (err) {
      error.value = translateAuthError(err.message)
      toast.error('Erro ao criar conta', error.value)
    } else {
      toast.success('Conta criada', 'Verifique seu e-mail para confirmar o cadastro.')
    }

    loading.value = false
    return !err
  }

  async function logout() {
    loading.value = true
    const { error: err } = await supabase.auth.signOut()

    if (err) {
      toast.error('Erro ao sair', err.message)
    }

    loading.value = false
    await navigateTo('/login')
  }

  async function resetPasswordRequest(email: string) {
    loading.value = true
    error.value = null

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (err) {
      error.value = translateAuthError(err.message)
      toast.error('Erro', error.value)
    } else {
      toast.success('E-mail enviado', 'Verifique sua caixa de entrada para redefinir a senha.')
    }

    loading.value = false
    return !err
  }

  async function resetPassword(newPassword: string) {
    loading.value = true
    error.value = null

    const { error: err } = await supabase.auth.updateUser({ password: newPassword })

    if (err) {
      error.value = translateAuthError(err.message)
      toast.error('Erro', error.value)
    } else {
      toast.success('Senha atualizada', 'Sua senha foi redefinida com sucesso.')
    }

    loading.value = false
    return !err
  }

  return {
    loading,
    error,
    clearError,
    login,
    register,
    logout,
    resetPasswordRequest,
    resetPassword,
  }
}

function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'E-mail ainda não confirmado. Verifique sua caixa de entrada.',
    'User already registered': 'Este e-mail já está cadastrado.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.',
    'For security purposes, you can only request this once every 60 seconds': 'Aguarde 60 segundos antes de tentar novamente.',
  }

  return map[message] || 'Ocorreu um erro inesperado. Tente novamente.'
}
