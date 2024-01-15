<script setup lang="ts">
import Header from "@/components/Header.vue";
import Dashboard from "./components/Dashboard.vue";
</script>

<template>
  <div class="flex flex-col h-[100vh] w-full overflow-x-hidden">
    <Header />
    <main class="flex-1">
      <Dashboard />
    </main>
  </div>
</template>

