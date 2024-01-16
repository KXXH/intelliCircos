<script setup lang="ts">
import Header from "@/components/Header.vue"
import Dashboard from "./components/Dashboard.vue"

</script>

<template>
  <div class="h-[100vh] w-full flex flex-col overflow-x-hidden">
    <Header />
    <main class="flex-1 overflow-hidden">
      <Dashboard />
    </main>
  </div>
</template>

