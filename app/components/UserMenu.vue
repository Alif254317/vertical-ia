<script setup lang="ts">
const { profile, initials } = useUser()
const { logout, loading } = useAuth()

const menuItems = computed(() => [
  {
    label: 'Meu perfil',
    icon: 'lucide:user',
    action: () => navigateTo('/settings/profile'),
  },
  {
    label: 'Configurações',
    icon: 'lucide:settings',
    action: () => navigateTo('/settings'),
  },
  { divider: true, label: '' },
  {
    label: loading.value ? 'Saindo...' : 'Sair',
    icon: 'lucide:log-out',
    danger: true,
    action: () => logout(),
  },
])
</script>

<template>
  <UDropdown :items="menuItems" align="right" width="14rem">
    <template #trigger>
      <button
        type="button"
        class="focus-ring flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-3 transition-colors hover:bg-neutral-50"
      >
        <UAvatar
          :src="profile?.avatarUrl"
          :name="profile?.name"
          size="sm"
        />
        <span class="hidden text-xs font-semibold text-neutral-700 sm:block">
          {{ profile?.name }}
        </span>
        <Icon name="lucide:chevron-down" class="h-3 w-3 text-neutral-400" />
      </button>
    </template>
  </UDropdown>
</template>
