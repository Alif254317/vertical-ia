<template>
  <AppLayout>
    <template #sidebar>
      <AppSidebar>
        <template #logo>
          <OrgSelector />
        </template>
        <template #footer>
          <UserMenu />
        </template>
      </AppSidebar>
    </template>
    <template #header>
      <AppHeader>
        <template #user>
          <UserMenu />
        </template>
      </AppHeader>
    </template>
    <slot />
  </AppLayout>
</template>
