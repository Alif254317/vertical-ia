<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { profile } = useUser()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold text-neutral-900">
        Olá, {{ profile?.name || 'Usuário' }}
      </h1>
      <p class="mt-1 text-sm text-neutral-500">
        Bem-vindo à plataforma Vertical IA.
      </p>
    </div>
  </div>
</template>
