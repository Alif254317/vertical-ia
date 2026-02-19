<script setup lang="ts">
interface NavItem {
  key: string
  label: string
  icon?: string
  to?: string
  badge?: string | number
  children?: NavItem[]
}

interface Props {
  items?: NavItem[]
  collapsed?: boolean
  activeKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  collapsed: false,
  activeKey: '',
})

const emit = defineEmits<{
  navigate: [item: NavItem]
  'update:collapsed': [value: boolean]
}>()

const expandedGroups = ref<Set<string>>(new Set())

function toggleGroup(key: string) {
  if (expandedGroups.value.has(key)) {
    expandedGroups.value.delete(key)
  } else {
    expandedGroups.value.add(key)
  }
}

function isActive(item: NavItem): boolean {
  return item.key === props.activeKey
}
</script>

<template>
  <aside
    class="flex h-screen flex-col border-r border-neutral-800 bg-neutral-950 text-neutral-400 transition-all duration-300"
    :class="collapsed ? 'w-16' : 'w-[260px]'"
  >
    <!-- Logo area -->
    <div class="flex h-16 items-center border-b border-neutral-800 px-4">
      <slot name="logo">
        <div class="flex items-center gap-2.5">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-sm">
            V
          </div>
          <span v-if="!collapsed" class="text-sm font-bold uppercase tracking-widest text-white">
            Vertical
          </span>
        </div>
      </slot>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto scrollbar-thin scrollbar-dark py-4 px-2">
      <ul class="space-y-0.5">
        <template v-for="item in items" :key="item.key">
          <!-- Group with children -->
          <li v-if="item.children?.length">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5 hover:text-white"
              :class="collapsed ? 'justify-center' : ''"
              @click="toggleGroup(item.key)"
            >
              <Icon v-if="item.icon" :name="item.icon" class="h-4.5 w-4.5 flex-shrink-0" />
              <span v-if="!collapsed" class="flex-1 text-xs font-semibold uppercase tracking-widest">
                {{ item.label }}
              </span>
              <svg
                v-if="!collapsed"
                class="h-3.5 w-3.5 transition-transform duration-200"
                :class="expandedGroups.has(item.key) ? 'rotate-90' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <!-- Children -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <ul v-if="!collapsed && expandedGroups.has(item.key)" class="mt-0.5 ml-4 space-y-0.5 overflow-hidden">
                <li v-for="child in item.children" :key="child.key">
                  <NuxtLink
                    v-if="child.to"
                    :to="child.to"
                    class="flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors"
                    :class="isActive(child) ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'"
                    @click="emit('navigate', child)"
                  >
                    <Icon v-if="child.icon" :name="child.icon" class="h-4 w-4 flex-shrink-0" />
                    <span class="truncate">{{ child.label }}</span>
                    <span
                      v-if="child.badge !== undefined"
                      class="ml-auto rounded-full bg-brand-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-brand-400"
                    >
                      {{ child.badge }}
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </li>

          <!-- Simple item -->
          <li v-else>
            <NuxtLink
              v-if="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
              :class="[
                collapsed ? 'justify-center' : '',
                isActive(item) ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white',
              ]"
              @click="emit('navigate', item)"
            >
              <Icon v-if="item.icon" :name="item.icon" class="h-4.5 w-4.5 flex-shrink-0" />
              <span v-if="!collapsed" class="text-xs font-medium truncate">{{ item.label }}</span>
              <span
                v-if="!collapsed && item.badge !== undefined"
                class="ml-auto rounded-full bg-brand-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-brand-400"
              >
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Bottom area (user/settings) -->
    <div class="border-t border-neutral-800 p-3">
      <slot name="footer" />
    </div>
  </aside>
</template>

<style scoped>
.h-4\.5 { height: 1.125rem; }
.w-4\.5 { width: 1.125rem; }
</style>
