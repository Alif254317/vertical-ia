<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { register, loading, error, clearError } = useAuth()

const form = reactive({
  fullName: '',
  email: '',
  company: '',
  password: '',
  confirmPassword: '',
})

const passwordMismatch = computed(
  () => form.confirmPassword.length > 0 && form.password !== form.confirmPassword,
)

const submitted = ref(false)

async function handleSubmit() {
  if (passwordMismatch.value) return

  const success = await register(form.email, form.password, form.fullName, form.company)
  if (success) {
    submitted.value = true
  }
}
</script>

<template>
  <NuxtLayout
    name="auth"
    :title="submitted ? 'Verifique seu e-mail' : 'Criar sua conta'"
    :description="
      submitted
        ? 'Enviamos um link de confirmação para ' + form.email
        : 'Preencha os dados para começar a usar a plataforma'
    "
  >
    <!-- Success state -->
    <div v-if="submitted" class="space-y-6 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
        <Icon name="lucide:mail-check" class="h-8 w-8 text-success-600" />
      </div>
      <p class="text-sm text-neutral-500">
        Clique no link enviado para confirmar seu cadastro e acessar a plataforma.
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

      <UInput
        v-model="form.fullName"
        label="Nome completo"
        placeholder="Seu nome"
        icon="lucide:user"
        required
        @focus="clearError"
      />

      <UInput
        v-model="form.company"
        label="Nome da empresa"
        placeholder="Sua empresa"
        icon="lucide:building-2"
        required
        @focus="clearError"
      />

      <UInput
        v-model="form.email"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        icon="lucide:mail"
        required
        @focus="clearError"
      />

      <UInput
        v-model="form.password"
        type="password"
        label="Senha"
        placeholder="Mínimo 6 caracteres"
        icon="lucide:lock"
        required
        @focus="clearError"
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
        Criar conta
      </UButton>
    </form>

    <template v-if="!submitted" #footer>
      <p class="text-sm text-neutral-500">
        Já tem uma conta?
        <NuxtLink to="/login" class="font-semibold text-neutral-900 hover:underline">
          Entrar
        </NuxtLink>
      </p>
    </template>
  </NuxtLayout>
</template>
