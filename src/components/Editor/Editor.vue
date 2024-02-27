<script setup lang="ts">
import CircosView from './CircosView.vue'
import StylePanel from './StylePanel'
import Explainer from './RecommendExplainer/Explainer.vue'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
</script>

<template>
  <div class="relative h-full flex bg-background">
    <div class="relative h-full flex flex-[3] flex-col overflow-x-hidden">
      <CircosView />
      <!-- <Explainer /> -->
    </div>
    <!-- Sidebar -->
    <Transition
      enter-active-class="transition duration-300 ease-in-out" enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0" leave-active-class="transition duration-300 ease-in-out"
      leave-from-class="transform translate-x-0" leave-to-class="transform translate-x-full"
    >
      <div v-show="layoutStore.rightPanelOpen" class="absolute right-0 z-2 h-full w-[300px] overflow-y-auto border-l bg-background p-2 lg:static lg:flex-[1]">
        <StylePanel />
      </div>
    </Transition>
    <!-- Mask -->
    <div
      :data-state="layoutStore.rightPanelOpen ? 'open' : 'closed'"
      class="absolute z-1 h-full w-full bg-background/80 transition-opacity duration-300 data-[state=closed]:pointer-events-none lg:hidden data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
      @click="() => layoutStore.toggleRightPanel()"
    />
  </div>
</template>
