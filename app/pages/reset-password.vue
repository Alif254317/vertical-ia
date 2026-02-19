<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { resetPassword, loading, error, clearError } = useAuth()

const form = reactive({
  password: '',
  confirmPassword: '',
})

const passwordMismatch = computed(
  () => form.confirmPassword.length > 0 && form.password !== form.confirmPassword,
)

const submitted = ref(false)

async function handleSubmit() {
  if (passwordMismatch.value) return

  const success = await resetPassword(form.password)
  if (success) {
    submitted.value = true
  }
}
</script>

<template>
  <NuxtLayout
    name="auth"
    :title="submitted ? 'Senha redefinida' : 'Nova senha'"
    :description="
      submitted
        ? 'Sua senha foi atualizada com sucesso'
        : 'Escolha uma nova senha para sua conta'
    "
  >
    <!-- Success state -->
    <div v-if="submitted" class="space-y-6 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
        <Icon name="lucide:check-circle" class="h-8 w-8 text-success-600" />
      </div>
      <p class="text-sm text-neutral-500">
        Você já pode acessar a plataforma com sua nova senha.
      </p>
      <UButton block size="lg" @click="navigateTo('/login')">
        Ir para o login
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
        v-model="form.password"
        type="password"
        label="Nova senha"
        placeholder="Mínimo 6 caracteres"
        icon="lucide:lock"
        required
        @focus="clearError"
      />

      <UInput
        v-model="form.confirmPassword"
        type="password"
        label="Confirmar nova senha"
        placeholder="Repita a nova senha"
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
        icon="lucide:key-round"
      >
        Redefinir senha
      </UButton>
    </form>
  </NuxtLayout>
</template>
