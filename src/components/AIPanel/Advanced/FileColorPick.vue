<script setup lang="ts">
import { Circle } from 'lucide-vue-next'
import { ref } from 'vue'
import {
  PopoverArrow,
} from 'radix-vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { generateCategorialPalette } from '@/lib/palette'

const props = defineProps<{
  class?: string
}>()

const palette = [...generateCategorialPalette()]

// enum Color {
//   Red = '#FFC1C1',
//   Orange = '#FFA07A',
//   Yellow = '#FFFFE0',
//   Green = '#98FB98',
//   Blue = '#87CEFA',
//   Indigo = '#4B0082',
//   Violet = '#EE82EE',
//   Black = '#696969',
//   // Red = 'red',
//   // Orange = 'orange',
//   // Yellow = 'yellow',
//   // Green = 'green',
//   // Blue = 'blue',
//   // Indigo = 'indigo',
//   // Violet = 'violet',
//   // Black = 'black',
// }

type Color = typeof palette[number]

const value = defineModel<Color>({
  default: '#FFC1C1' as Color,
})
const open = ref(false)
function click(color: Color) {
  value.value = color
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Circle :class="cn('h-4 w-4 brightness-120 dark:brightness-100', props.class)" :stroke-width="2" :fill="value" />
    </PopoverTrigger>
    <PopoverContent
      class="w-40 bg-opacity-20 p-2 backdrop-blur backdrop-filter" align="start" side="bottom"
      :align-offset="-10"
    >
      <div grid="~ cols-4">
        <Button
          v-for="color in palette" :key="color" size="icon" variant="ghost"
          class="h-8 w-8 rounded-full transition-transform ease hover:scale-125" @click="click(color)"
        >
          <Circle class="h-4 w-4 brightness-120 dark:brightness-100" :stroke-width="2" :class="`fill-${color}`" :fill="color" />
        </Button>
      </div>
      <PopoverArrow class="fill-background stroke-border" :width="15" :height="7" />
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
