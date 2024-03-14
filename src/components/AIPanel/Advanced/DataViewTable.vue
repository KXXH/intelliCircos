<script setup lang="ts">
import _ from 'lodash-es'
import { computed } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps<{
  data: Record<string, any>[]
}>()

const columns = computed(() => {
  if (props.data.length === 0)
    return []

  return Object.keys(props.data[0])
})
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead v-for="column in columns" :key="column">
          {{ column }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in props.data" :key="row.id">
        <TableCell v-for="column in columns" :key="column">
          {{ row[column] }}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style scoped>

</style>
