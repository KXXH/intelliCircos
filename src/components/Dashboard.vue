<script setup lang="ts">
import Editor from '@/components/Editor'
import { AIPanel } from '@/components/AIPanel'
</script>

<template>
  <div class="h-full w-full flex">
    <!-- Chat -->
    <div class="h-full w-250px border-r bg-background p-2 lg:w-350px">
      <AIPanel />
    </div>
    <!-- Main -->
    <div class="h-full flex-1">
      <Editor />
    </div>
  </div>
</template>
