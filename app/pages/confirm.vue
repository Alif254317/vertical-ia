<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const confirmed = ref(false)
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const type = hashParams.get('type')

  if (type === 'recovery') {
    await navigateTo('/reset-password' + window.location.hash)
    return
  }

  confirmed.value = true
})
</script>

<template>
  <NuxtLayout
    name="auth"
    title="Confirmação"
    :description="errorMsg ? 'Ocorreu um erro' : 'Verificando seu e-mail...'"
  >
    <div v-if="errorMsg" class="space-y-6 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
        <Icon name="lucide:x-circle" class="h-8 w-8 text-error-600" />
      </div>
      <p class="text-sm text-neutral-500">{{ errorMsg }}</p>
      <UButton variant="secondary" block @click="navigateTo('/login')">
        Voltar para o login
      </UButton>
    </div>

    <div v-else-if="confirmed" class="space-y-6 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
        <Icon name="lucide:check-circle" class="h-8 w-8 text-success-600" />
      </div>
      <p class="text-sm text-neutral-500">
        Seu e-mail foi confirmado com sucesso!
      </p>
      <UButton block size="lg" @click="navigateTo('/')">
        Acessar plataforma
      </UButton>
    </div>

    <div v-else class="flex justify-center py-12">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-neutral-400" />
    </div>
  </NuxtLayout>
</template>
