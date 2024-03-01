<script setup lang="ts">
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { TooltipRoot } from 'radix-vue';
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils';
import { onMounted } from 'vue';

interface Props {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'link' | 'outline'
  size?: 'sm' | 'lg' | 'icon' | 'default'
  as?: string
  delayDuration?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  class?: string
}
const props = defineProps<Props>()
const open = defineModel<boolean>("open", { default: false })
function onOpen(val: boolean) {
  if (lock) return;
  open.value = val
}

// 奇怪的bug，不能在组件挂载时刻及之前允许open赋值
let lock = true;
onMounted(() => {
  setTimeout(() => {
    lock = false;
  })
})
</script>

<template>
  <TooltipRoot :open="open" :default-open="false" @update:open="onOpen">
    <!-- <Tooltip> -->
    <TooltipTrigger>
      <Button :class="props.class" :size="size" :variant="variant">
        <slot />
      </Button>
    </TooltipTrigger>
    <TooltipContent :align="align" :align-offset="alignOffset" :side="side" :side-offset="sideOffset">
      <slot name="hint" />
    </TooltipContent>
  </TooltipRoot>
</template>

<style scoped></style>