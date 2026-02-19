<script setup lang="ts">
interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  loading?: boolean
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
  emptyText?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  striped: false,
  hoverable: true,
  compact: false,
  emptyText: 'Nenhum dado encontrado',
  sortDir: 'asc',
})

const emit = defineEmits<{
  'sort': [key: string, dir: 'asc' | 'desc']
  'row-click': [row: Record<string, any>, index: number]
}>()

function handleSort(col: Column) {
  if (!col.sortable) return
  const dir = props.sortBy === col.key && props.sortDir === 'asc' ? 'desc' : 'asc'
  emit('sort', col.key, dir)
}

const alignClass = (align?: string) => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

const cellPadding = computed(() => props.compact ? 'px-3 py-2' : 'px-4 py-3')
</script>

<template>
  <div class="w-full overflow-x-auto rounded-2xl border border-neutral-300 bg-white">
    <table class="w-full text-sm">
      <!-- Header -->
      <thead>
        <tr class="border-b border-neutral-200">
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              cellPadding,
              alignClass(col.align),
              col.sortable ? 'cursor-pointer select-none hover:bg-neutral-50' : '',
            ]"
            :style="col.width ? `width: ${col.width}` : ''"
            class="text-[0.65rem] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-50/50"
            @click="handleSort(col)"
          >
            <div class="flex items-center gap-1.5" :class="col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''">
              {{ col.label }}
              <template v-if="col.sortable && sortBy === col.key">
                <Icon
                  :name="sortDir === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  class="h-3.5 w-3.5 text-neutral-700"
                />
              </template>
              <template v-else-if="col.sortable">
                <Icon name="lucide:chevrons-up-down" class="h-3.5 w-3.5 text-neutral-300" />
              </template>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <!-- Loading skeleton -->
        <template v-if="loading">
          <tr v-for="i in 5" :key="`skel-${i}`" class="border-b border-neutral-100">
            <td v-for="col in columns" :key="col.key" :class="cellPadding">
              <div class="skeleton h-4 rounded" :style="{ width: `${50 + Math.random() * 40}%` }" />
            </td>
          </tr>
        </template>

        <!-- Empty state -->
        <template v-else-if="data.length === 0">
          <tr>
            <td :colspan="columns.length" class="px-4 py-12 text-center">
              <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:inbox" class="h-8 w-8 text-neutral-300" />
                <p class="text-sm text-neutral-500">{{ emptyText }}</p>
              </div>
            </td>
          </tr>
        </template>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="(row, idx) in data"
            :key="idx"
            :class="[
              'border-b border-neutral-100 last:border-0 transition-colors',
              hoverable ? 'hover:bg-neutral-50 cursor-pointer' : '',
              striped && idx % 2 === 1 ? 'bg-neutral-25' : '',
            ]"
            @click="emit('row-click', row, idx)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[cellPadding, alignClass(col.align)]"
              class="text-neutral-800"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="idx">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
