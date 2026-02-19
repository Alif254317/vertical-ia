<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const supabase = useSupabaseClient()
const { register, loading, error, clearError } = useAuth()

const token = route.params.token as string

const invite = ref<{
  id: string
  email: string
  role: string
  org_id: string
  expires_at: string
  organizations?: { name: string }
} | null>(null)

const inviteError = ref<string | null>(null)
const submitted = ref(false)

const form = reactive({
  fullName: '',
  password: '',
  confirmPassword: '',
})

const passwordMismatch = computed(
  () => form.confirmPassword.length > 0 && form.password !== form.confirmPassword,
)

// Buscar convite
const { data, error: fetchError } = await supabase
  .from('invites')
  .select('id, email, role, org_id, expires_at, organizations(name)')
  .eq('token', token)
  .is('accepted_at', null)
  .gt('expires_at', new Date().toISOString())
  .single()

if (fetchError || !data) {
  inviteError.value = 'Convite inválido, expirado ou já utilizado.'
} else {
  invite.value = data as any
}

async function handleSubmit() {
  if (!invite.value || passwordMismatch.value) return

  const success = await register(
    invite.value.email,
    form.password,
    form.fullName,
    (invite.value as any).organizations?.name,
  )

  if (success) {
    // Marcar convite como aceito
    await supabase
      .from('invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.value.id)

    submitted.value = true
  }
}
</script>

<template>
  <NuxtLayout
    name="auth"
    :title="inviteError ? 'Convite inválido' : submitted ? 'Conta criada!' : 'Você foi convidado'"
    :description="
      inviteError
        ? ''
        : submitted
          ? 'Verifique seu e-mail para confirmar o cadastro'
          : `Junte-se a ${(invite as any)?.organizations?.name ?? 'a equipe'} no Vertical IA`
    "
  >
    <!-- Invite error -->
    <div v-if="inviteError" class="space-y-6 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
        <Icon name="lucide:link-2-off" class="h-8 w-8 text-error-600" />
      </div>
      <p class="text-sm text-neutral-500">{{ inviteError }}</p>
      <UButton variant="secondary" block @click="navigateTo('/login')">
        Ir para o login
      </UButton>
    </div>

    <!-- Success -->
    <div v-else-if="submitted" class="space-y-6 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
        <Icon name="lucide:mail-check" class="h-8 w-8 text-success-600" />
      </div>
      <p class="text-sm text-neutral-500">
        Verifique sua caixa de entrada em <strong>{{ invite?.email }}</strong> para ativar sua conta.
      </p>
      <UButton variant="secondary" block @click="navigateTo('/login')">
        Voltar para o login
      </UButton>
    </div>

    <!-- Form -->
    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
      <div
        v-if="error"
        class="flex items-center gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
      >
        <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
        <span>{{ error }}</span>
        <button type="button" class="ml-auto" @click="clearError">
          <Icon name="lucide:x" class="h-3.5 w-3.5" />
        </button>
      </div>

      <!-- Email (read-only) -->
      <UInput
        :model-value="invite?.email ?? ''"
        type="email"
        label="E-mail"
        icon="lucide:mail"
        disabled
      />

      <UInput
        v-model="form.fullName"
        label="Nome completo"
        placeholder="Seu nome"
        icon="lucide:user"
        required
      />

      <UInput
        v-model="form.password"
        type="password"
        label="Senha"
        placeholder="Mínimo 6 caracteres"
        icon="lucide:lock"
        required
      />

      <UInput
        v-model="form.confirmPassword"
        type="password"
        label="Confirmar senha"
        placeholder="Repita a senha"
        icon="lucide:lock"
        :error="passwordMismatch ? 'As senhas não coincidem' : undefined"
        required
      />

      <UButton
        type="submit"
        block
        size="lg"
        :loading="loading"
        :disabled="passwordMismatch"
        icon="lucide:user-plus"
      >
        Aceitar convite
      </UButton>
    </form>
  </NuxtLayout>
</template>
