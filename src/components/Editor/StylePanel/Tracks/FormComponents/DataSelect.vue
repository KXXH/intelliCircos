<script setup lang="ts">
import { computed, ref } from 'vue'
import { Circle } from 'lucide-vue-next'
import { useDataStore } from '@/stores/data'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const data = defineModel<string>()
const dataStore = useDataStore()
const selectOpts = computed(() => {
  return dataStore.attachments.map(file => ({ label: file.name, value: file.name, ...file }))
})
</script>

<template>
  <!-- Form Item -->
  <div space="y-2" mb-3>
    <!-- Form Label -->
    <div class="block text-left text-sm text-foreground font-medium tracking-tight">
      Data
    </div>
    <Select v-model="data">
      <SelectTrigger>
        <SelectValue placeholder="Select a file" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="option in selectOpts" :key="option.value" :value="option.value" class="px-2">
            <div flex items-center>
              <Circle class="mr-2 h-4 w-4 brightness-120 dark:brightness-100" :fill="option.color" />
              {{ option.label }}
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <!-- Form description -->
    <p class="text-[0.8rem] text-muted-foreground">
      Configure the data settings for the track.
    </p>
  </div>
</template>

<style scoped>

</style>
