<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div m="x-2 y-4" p="2" border rounded-lg shadow transition="~ all ease" :class="isOpen ? 'open' : 'closed'" bg="background" @click="isOpen = !isOpen">
    <template v-if="isOpen">
      <svg />
    </template>
  </div>
</template>

<style scoped>
.open {
  height: 90%;
  width: 90%;
  position: absolute;
}

.closed {
  height: 120px;
}
</style>
