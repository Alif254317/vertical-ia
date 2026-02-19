<script setup lang="ts">
const { profile } = useUser()
</script>

<template>
  <div v-if="profile" class="flex items-center gap-2.5 px-1">
    <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-xs font-bold text-brand-400">
      {{ profile.orgName?.charAt(0)?.toUpperCase() ?? 'O' }}
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-xs font-semibold text-white">{{ profile.orgName }}</p>
      <p class="truncate text-[0.6rem] uppercase tracking-widest text-neutral-500">{{ profile.role }}</p>
    </div>
  </div>
</template>
