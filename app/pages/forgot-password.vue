<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { resetPasswordRequest, loading, error, clearError } = useAuth()

const email = ref('')
const submitted = ref(false)

async function handleSubmit() {
  const success = await resetPasswordRequest(email.value)
  if (success) {
    submitted.value = true
  }
}
</script>

<template>
  <NuxtLayout
    name="auth"
    :title="submitted ? 'E-mail enviado' : 'Recuperar senha'"
    :description="
      submitted
        ? 'Verifique sua caixa de entrada'
        : 'Informe seu e-mail para receber o link de redefinição'
    "
  >
    <!-- Success state -->
    <div v-if="submitted" class="space-y-6 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-info-100">
        <Icon name="lucide:mail-check" class="h-8 w-8 text-info-600" />
      </div>
      <p class="text-sm text-neutral-500">
        Enviamos um link de redefinição para <strong class="text-neutral-900">{{ email }}</strong>.
        Verifique também a pasta de spam.
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
        v-model="email"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        icon="lucide:mail"
        required
        @focus="clearError"
      />

      <UButton
        type="submit"
        block
        size="lg"
        :loading="loading"
        icon="lucide:send"
      >
        Enviar link
      </UButton>
    </form>

    <template v-if="!submitted" #footer>
      <p class="text-sm text-neutral-500">
        Lembrou a senha?
        <NuxtLink to="/login" class="font-semibold text-neutral-900 hover:underline">
          Entrar
        </NuxtLink>
      </p>
    </template>
  </NuxtLayout>
</template>
