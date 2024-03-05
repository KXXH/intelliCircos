<script setup lang="ts">
import { Dna, Eye, X } from 'lucide-vue-next'
import { withDefaults } from 'vue'
import FileColorPick from './FileColorPick.vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = withDefaults(defineProps<{
  filename: string
  isKaryotype?: boolean
}>(), {
  isKaryotype: false,
})
const color = defineModel<string>('color')
</script>

<template>
  <li h-9 flex items-center gap-2 border rounded px-2>
    <Dna v-if="props.isKaryotype" class="h-4 w-4" />
    <FileColorPick v-else v-model="color" class="cursor-pointer" />
    <pre>{{ props.filename }}</pre>
    <div flex-1 />
    <div flex>
      <Button size="icon" variant="ghost" class="h-6 w-6 rounded-full">
        <Eye class="h-4 w-4" />
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" variant="ghost" class="h-6 w-6 rounded-full">
              <X class="h-4 w-4 color-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p text-muted font-bold>
              Remove Data
            </p>
            <p>
              This will remove the file from the list.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </li>
</template>

<style scoped>

</style>
