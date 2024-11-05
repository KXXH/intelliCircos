<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { watch, ref, nextTick, unref, toRaw } from 'vue'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { useFigureStore } from '@/stores/figure'

const props = defineProps<{
  panelTitle: string,
  isTitleChange: boolean
  attrsId: string
}>()
const isOpen = defineModel({ default: false })

// 组件标题编辑功能
const isEditing = ref<boolean>(false)
const editTitle = ref<string>(props.panelTitle)
const inputRef = ref<HTMLInputElement | null>(null)
const changeEditStatus = () => {
  // General Setting 不可变
  if (props.isTitleChange) {
    isEditing.value = !isEditing.value
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

const figrueStore = useFigureStore()
const onTrackDelete = () => {
  figrueStore.deleteTrack(props.attrsId)
}

</script>

<template>
  <Collapsible v-model:open="isOpen" class="w-full py-2 space-y-2">
    <div class="flex items-center justify-between px-4 space-x-4">
      <h4 v-if="!isEditing" @click="changeEditStatus" class="font-semibold first-capitalize">
        {{ editTitle }}
      </h4>
      <input v-else class="font-semibold first-capitalize" ref="inputRef" v-model="editTitle"
        @blur="changeEditStatus()" />
      <div class="flex items-center gap-1">
        <Button v-show="props.isTitleChange" variant="ghost" size="sm" class="w-9 p-0" @click="onTrackDelete">
          <Trash2 class="h-5 w-5" color="red"/>
        </Button>
        <CollapsibleTrigger as-child>
          <Button variant="ghost" size="sm" class="w-9 p-0">
            <Transition leave-active-class="transition duration-300 ease-in-out transform" leave-from-class="rotate-0"
              leave-to-class="rotate-180" mode="out-in">
              <ChevronUp v-if="isOpen" class="h-4 w-4" />
              <ChevronDown v-else class="h-4 w-4" />
            </Transition>
            <span class="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
    <Separator />
    <slot name="visibleCollapsed" />
    <CollapsibleContent class="space-y-2">
      <div class="px-4">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
