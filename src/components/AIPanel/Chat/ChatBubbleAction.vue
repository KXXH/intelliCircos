<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

withDefaults(defineProps<{
  hint: string
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'link' | 'outline'
}>(), {
  variant: 'outline',
})
const emits = defineEmits<{
  click: [event: PointerEvent]
}>()

const iconEl = ref<HTMLElement>()
const hintEl = ref<HTMLElement>()

const { width: iconWidth } = useElementSize(iconEl)
const { width: hintWidth } = useElementSize(hintEl)
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button size="sm" class="bubble-action box-content h-6 w-[--icon-width] flex justify-start overflow-hidden px-2 text-xs transition-all delay-200 hover:w-[--full-width]" :variant="variant" @click="e => emits('click', e)">
        <div ref="iconEl">
          <slot ref="iconEl" name="icon" />
        </div>
        <span ref="hintEl" class="bubble-action-hint pl-1 transition-opacity delay-200">{{ hint }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent v-if="$slots.popover" :side-offset="4" align="start" side="bottom" as-child class="z-50 rounded-md p-2 shadow-md">
      <slot name="popover" />
    </PopoverContent>
  </Popover>
</template>

<style scoped>
.bubble-action {
  --full-width: v-bind("`${iconWidth + hintWidth}px`");
  --icon-width: v-bind("`${iconWidth}px`");
}

.bubble-action .bubble-action-hint {
  opacity: 0%;
}

.bubble-action:hover .bubble-action-hint {
  opacity: 100%;
}
</style>
