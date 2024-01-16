<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
</script>

<template>
  <div class="flex h-full bg-background">
    <div class="h-full flex-[3]"></div>
    <!-- Sidebar -->
    <Transition enter-active-class="transition duration-300 ease-in-out" enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0" leave-active-class="transition duration-300 ease-in-out"
      leave-from-class="transform translate-x-0" leave-to-class="transform translate-x-full">
      <div v-show="layoutStore.rightPanelOpen" class="border-l h-full lg:flex-[1] lg:static absolute w-[300px] right-0">
      </div>
    </Transition>
  </div>
</template>