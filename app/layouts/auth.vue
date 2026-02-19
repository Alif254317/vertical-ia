<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left: Branding panel (hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 flex-col justify-between bg-neutral-950 p-12 text-white">
      <slot name="branding">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold">
            V
          </div>
          <span class="text-sm font-bold uppercase tracking-widest">Vertical IA</span>
        </div>

        <!-- Hero text -->
        <div>
          <h1 class="font-display text-5xl font-medium uppercase tracking-tighter leading-none">
            Inteligência<br />Artificial<br />para seu<br />negócio
          </h1>
          <p class="mt-6 max-w-sm text-sm uppercase tracking-widest text-neutral-400">
            Orquestre mais de 200 modelos de IA em uma única plataforma
          </p>
        </div>

        <!-- Footer -->
        <p class="text-[0.65rem] uppercase tracking-widest text-neutral-600">
          &copy; {{ new Date().getFullYear() }} Vertical IA. Todos os direitos reservados.
        </p>
      </slot>
    </div>

    <!-- Right: Auth form -->
    <div class="flex w-full lg:w-1/2 flex-col items-center justify-center bg-[#E6E6E6] px-6 py-12">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="mb-8 flex items-center gap-2.5 lg:hidden">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-sm">
            V
          </div>
          <span class="text-sm font-bold uppercase tracking-widest text-neutral-900">Vertical IA</span>
        </div>

        <!-- Title -->
        <div v-if="title" class="mb-8">
          <h2 class="text-xl font-bold text-neutral-900">{{ title }}</h2>
          <p v-if="description" class="mt-1 text-sm text-neutral-500">{{ description }}</p>
        </div>

        <!-- Form content -->
        <slot />

        <!-- Footer slot (links, etc.) -->
        <div v-if="$slots.footer" class="mt-6 text-center">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
