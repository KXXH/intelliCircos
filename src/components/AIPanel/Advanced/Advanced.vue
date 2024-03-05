<script setup lang="ts">
import { ref } from 'vue'
import DataUpload from './DataUpload.vue'
import DataTypeSelect from './DataTypeSelect.vue'
import FileListItem from './FileListItem.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDataStore } from '@/stores/data'

const value = ref('karyotype')
const choices = [
  { value: 'karyotype', label: 'Karyotype' },
  { value: 'attachment', label: 'Attachment' },
]
const dataStore = useDataStore()
function onFileUploaded(file: File) {
  if (value.value === 'karyotype')
    dataStore.addFile(file, 'karyotype')
  else
    dataStore.addFile(file)
}
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <CardTitle>Advanced Configuration</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-1">
        <DataTypeSelect v-model="value" :choices="choices" />
        <DataUpload @file-uploaded="onFileUploaded" />
      </div>
      <div>
        <h2 text="sm" border-b font-bold line-height-7>
          Karyotype
        </h2>
        <ul flex="~ col" my-2 gap-1 text-sm>
          <FileListItem v-for="file in dataStore.karyotypes" :key="file.name" :filename="file.name" is-karyotype />
        </ul>
      </div>
      <div>
        <h2 text="sm" border-b font-bold line-height-7>
          Attachments
        </h2>
        <ul flex="~ col" my-2 gap-1 text-sm>
          <FileListItem v-for="file in dataStore.attachments" :key="file.name" v-model:color="file.color" :filename="file.name" />
          <!-- <FileListItem filename="snp1m.txt" />
          <FileListItem filename="snp250kb.txt" />
          <FileListItem filename="snp.txt" /> -->
        </ul>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
