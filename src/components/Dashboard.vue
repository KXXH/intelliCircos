<script setup lang="ts">
import Editor from '@/components/Editor.vue'
import { AIPanel } from '@/components/AIPanel'
</script>

<template>
  <div class="h-full w-full flex">
    <!-- Chat -->
    <div class="border-r h-full w-250px lg:w-350px p-2">
      <AIPanel />
    </div>
    <!-- Main -->
    <div class="h-full flex-1">
      <Editor />
    </div>
  </div>
</template>