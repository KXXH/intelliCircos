<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import SettingsPanel from './SettingsPanel.vue'
import { Button } from '@/components/ui/button'
import { useFigureStore } from '@/stores/figure'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSmartMerge } from '@/lib/circos/smartMerge'

const isOpen = ref(true)
const trackType = ref<string>()
const { addPartialTrack } = useSmartMerge()
const figrueStore = useFigureStore()
function onTrackAdd() {
  const innerRadius = figrueStore.layout?.config.innerRadius
  const outerRadius = figrueStore.layout?.config.outerRadius
  // emits
  const track = addPartialTrack({
    config: {},
    type: trackType.value,
  }, figrueStore.tracks, 'out', {
    innerRadius: innerRadius ?? figrueStore.width,
    outerRadius: outerRadius ?? figrueStore.width,
  })
  // reset
  trackType.value = undefined

  // add track
  figrueStore.tracks = track
}
</script>

<template>
  <SettingsPanel v-model:open="isOpen" panel-title="General Settings">
    <div space="y-2" mb-3>
      <div class="block text-left text-sm text-foreground font-medium tracking-tight">
        Add a track
      </div>
      <div flex gap-2>
        <Select v-model="trackType" class="flex-1">
          <SelectTrigger>
            <SelectValue placeholder="Select a figure" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="line">
                Line
              </SelectItem>
              <SelectItem value="scatter">
                Scatter
              </SelectItem>
              <SelectItem value="histogram">
                Histogram
              </SelectItem>
              <SelectItem value="highlight">
                Highlight
              </SelectItem>
              <SelectItem value="heatmap">
                Heatmap
              </SelectItem>
              <SelectItem value="stack">
                Stack
              </SelectItem>
              <SelectItem value="chords">
                Chords
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button size="sm" class="text-sm" :disabled="!trackType" @click="onTrackAdd">
          <Plus class="5 w-5" />
        </Button>
      </div>
    </div>
  </SettingsPanel>
</template>
