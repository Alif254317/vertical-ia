<script setup lang="ts">
interface Props {
  sidebarCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sidebarCollapsed: false,
})

const mobileMenuOpen = ref(false)
const collapsed = ref(props.sidebarCollapsed)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#E6E6E6]">
    <!-- Sidebar: Desktop -->
    <div class="hidden lg:flex">
      <slot name="sidebar">
        <AppSidebar v-model:collapsed="collapsed" />
      </slot>
    </div>

    <!-- Sidebar: Mobile overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-40 lg:hidden"
        >
          <div class="absolute inset-0 bg-neutral-950/50" @click="mobileMenuOpen = false" />
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <div v-if="mobileMenuOpen" class="relative z-50 h-full w-[260px]">
              <slot name="sidebar">
                <AppSidebar />
              </slot>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <slot name="header">
        <AppHeader @menu-toggle="toggleMobileMenu" />
      </slot>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div class="mx-auto max-w-7xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
