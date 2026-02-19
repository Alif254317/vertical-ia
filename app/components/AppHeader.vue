<script setup lang="ts">
interface Props {
  title?: string
  showSearch?: boolean
  showBreadcrumb?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
  showBreadcrumb: false,
})

const emit = defineEmits<{
  menuToggle: []
  search: [query: string]
}>()

const searchQuery = ref('')
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
    <!-- Left: Title / Breadcrumb -->
    <div class="flex items-center gap-4">
      <!-- Mobile menu toggle -->
      <button
        type="button"
        class="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 lg:hidden"
        @click="emit('menuToggle')"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <slot name="left">
        <h1 v-if="title" class="text-sm font-bold uppercase tracking-widest text-neutral-900">
          {{ title }}
        </h1>
      </slot>
    </div>

    <!-- Center: Search -->
    <div v-if="showSearch" class="hidden md:block w-full max-w-md mx-8">
      <USearchInput
        v-model="searchQuery"
        shortcut="k"
        placeholder="Pesquisar…"
        @search="emit('search', $event)"
      />
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">
      <slot name="right">
        <!-- Notifications -->
        <button
          type="button"
          class="focus-ring relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <!-- Notification dot -->
          <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <!-- User avatar slot -->
        <slot name="user" />
      </slot>
    </div>
  </header>
</template>

<style scoped>
.h-4\.5 { height: 1.125rem; }
.w-4\.5 { width: 1.125rem; }
</style>
