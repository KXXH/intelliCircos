<script setup lang="ts">
import { computed } from 'vue'
import DataViewTable from './DataViewTable.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDataStore } from '@/stores/data'

const props = defineProps<{
  title: string
  filename: string
}>()
const dataStore = useDataStore()
const data = computed(() => dataStore.files.find(f => f.name === props.filename)?.content ?? [])
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent class="grid-rows-[auto_minmax(0,1fr)] max-h-80vh overflow-hidden !max-w-90vw">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="overflow-y-auto">
        <DataViewTable :data="data" />
      </div>
      <slot />
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
