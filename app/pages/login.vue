<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { login, loading, error, clearError } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

async function handleSubmit() {
  const success = await login(form.email, form.password)
  if (success) {
    await navigateTo('/')
  }
}
</script>

<template>
  <NuxtLayout
    name="auth"
    title="Entrar na sua conta"
    description="Insira suas credenciais para acessar a plataforma"
  >
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Error banner -->
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
        v-model="form.email"
        type="email"
        label="E-mail"
        placeholder="seu@email.com"
        icon="lucide:mail"
        required
        @focus="clearError"
      />

      <div>
        <UInput
          v-model="form.password"
          type="password"
          label="Senha"
          placeholder="Sua senha"
          icon="lucide:lock"
          required
          @focus="clearError"
        />
        <div class="mt-2 text-right">
          <NuxtLink
            to="/forgot-password"
            class="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Esqueceu a senha?
          </NuxtLink>
        </div>
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        :loading="loading"
        icon="lucide:arrow-right"
      >
        Entrar
      </UButton>
    </form>

    <template #footer>
      <p class="text-sm text-neutral-500">
        Ainda não tem conta?
        <NuxtLink to="/register" class="font-semibold text-neutral-900 hover:underline">
          Criar conta
        </NuxtLink>
      </p>
    </template>
  </NuxtLayout>
</template>
