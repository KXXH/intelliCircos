<script setup lang="ts">
import Header from "@/components/Header.vue"
import Dashboard from "./components/Dashboard.vue"
import GuideOverlay from "./components/Editor/GuideOverlay.vue"
import { useInteractionStore } from "./stores/interaction"
import { computed } from "vue"
const interactionStore = useInteractionStore()
const line = computed(() => interactionStore.lines?.[0])
</script>

<template>
  <div class="h-[100vh] w-full flex flex-col overflow-x-hidden">
    <Header />
    <main class="flex-1 overflow-hidden">
      <Dashboard />
    </main>
    <GuideOverlay :x1="line?.x1" :y1="line?.y1" :x2="line?.x2" :y2="line?.y2"/>
  </div>
</template>

