<script setup lang="ts">
import { ref } from 'vue'
import DataUpload from './DataUpload.vue'
import DataTypeSelect from './DataTypeSelect.vue'
import FileListItem from './FileListItem.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const value = ref('karyotype')
const choices = [
  { value: 'karyotype', label: 'Karyotype' },
  { value: 'attachment', label: 'Attachment' },
]
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <CardTitle>Advanced Configuration</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-1">
        <DataTypeSelect v-model="value" :choices="choices" />
        <DataUpload />
      </div>
      <div>
        <h2 text="sm" border-b font-bold line-height-7>
          Karyotype
        </h2>
        <ul flex="~ col" my-2 gap-1 text-sm>
          <FileListItem filename="hg19.fa" is-karyotype />
        </ul>
      </div>
      <div>
        <h2 text="sm" border-b font-bold line-height-7>
          Attachments
        </h2>
        <ul flex="~ col" my-2 gap-1 text-sm>
          <FileListItem filename="snp1m.txt" />
          <FileListItem filename="snp250kb.txt" />
          <FileListItem filename="snp.txt" />
        </ul>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
