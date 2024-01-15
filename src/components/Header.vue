<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
</script>

<template>
  <header class="flex h-[50px] border items-center lg:px-4 px-2 py-1">
    <div class="flex overflow-hidden items-center">
      <img class="mx-2" alt="IntelliCircos logo" src="../assets/LOGO-Large.svg" width="36" height="36" />
      <span class="text-xl font-rounded font-medium">Intelli</span>
      <span class="text-xl font-rounded text-[#E41279]">Circos</span>
    </div>
    <div class="flex-1"></div>
    <div class="flex items-center text-primary">
      <Button variant="outline" size="icon" @click="() => layoutStore.toggleRightPanel()">
        <Transition enter-active-class="transition duration-300 ease-in-out" enter-from-class="transform rotate-180"
          enter-to-class="transform rotate-0" mode="out-in">
          <PanelRightClose v-if="layoutStore.rightPanelOpen" class="w-5 h-5" :stroke-width="2" />
          <PanelRightOpen v-else class="w-5 h-5" :stroke-width="2" />
        </Transition>
      </Button>
    </div>
  </header>
</template>