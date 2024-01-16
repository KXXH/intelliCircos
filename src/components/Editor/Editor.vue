<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import CircosView from './CircosView.vue'
import StylePanel from './StylePanel'

const layoutStore = useLayoutStore()
</script>

<template>
  <div class="relative h-full flex bg-background">
    <div class="h-full flex-[3]">
      <CircosView />
    </div>
    <!-- Sidebar -->
    <Transition enter-active-class="transition duration-300 ease-in-out" enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0" leave-active-class="transition duration-300 ease-in-out"
      leave-from-class="transform translate-x-0" leave-to-class="transform translate-x-full">
      <div v-show="layoutStore.rightPanelOpen" class="absolute right-0 z-2 h-full w-[300px] border-l bg-background p-2 lg:static lg:flex-[1]">
        <StylePanel />
      </div>
    </Transition>
    <!-- Mask -->
    <div
      :data-state="layoutStore.rightPanelOpen ? 'open' : 'closed'"
      @click="() => layoutStore.toggleRightPanel()"
      class="data-[state=open]:fade-in-0ßß absolute z-1 h-full w-full data-[state=closed]:animate-out data-[state=open]:animate-in bg-background/80 data-[state=closed]:hidden lg:hidden data-[state=closed]:fade-out-0"
    ></div>

  </div>
</template>