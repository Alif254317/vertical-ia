export default defineNuxtPlugin(async () => {
  const { fetchProfile, user } = useUser()

  // Carrega profile do banco quando user está logado
  if (user.value) {
    await fetchProfile()
  }

  // Observa mudanças no auth user (login/logout)
  watch(user, async (newUser) => {
    if (newUser) {
      await fetchProfile()
    }
  })
})
