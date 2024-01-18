<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { isDefined, useWindowSize } from '@vueuse/core'

const props = withDefaults(defineProps<{
  x1?: number
  y1?: number
  x2?: number
  y2?: number
}>(), {
  x1: undefined,
  y1: undefined,
  x2: undefined,
  y2: undefined,
})

const isValidProps = computed(() => {
  return isDefined(props.x1) && isDefined(props.y1) && isDefined(props.x2) && isDefined(props.y2)
})

const { width, height } = useWindowSize()
</script>

<template>
  <svg :view-box="`0 0 ${width} ${height}`" :width="width" :height="width"     pointer-events-none fixed h-full w-full >
    <line v-if="isValidProps" :x1="props.x1" :y1="props.y1" :x2="props.x2" :y2="props.y2" stroke="red" stroke-width="1" />
  </svg>
</template>