<script setup lang="ts">
import type { CircosConfig } from "@/lib/circos"
import { arc } from "d3"
import { computed, ref } from "vue"
const circos = ref<CircosConfig>({
  tracks: [
    {
      r0: 0,
      r1: 200,
      id: "track1",
    },
    {
      r0: 210,
      r1: 400,
      id: "track2",
    },
    {
      r0: 410,
      r1: 600,
      id: "track3",
    },
  ]
})

const outmostRadius = computed(() => {
  return Math.max(...circos.value.tracks.map((track) => track.r1))
})

function getRandomColor() {
  const getRandomNumber = () => Math.floor(Math.random() * 256)
  return `rgb(${getRandomNumber()}, ${getRandomNumber()}, ${getRandomNumber()})`
}
</script>
<template>
  <div          h-full w-full flex items-center justify-center p-2  >
    <svg :viewBox="`-${outmostRadius} -${outmostRadius} ${2 * outmostRadius} ${2 * outmostRadius}`" class="h-90% w-90% lg:(h-75% w-75%)">
      <g v-for="track in circos.tracks" :key="track.id">
        <path :d="arc()({ startAngle: 0, endAngle: 2 * Math.PI, innerRadius: track.r0, outerRadius: track.r1 }) ?? undefined"
          class="fill-teal hover:fill-red" stroke-border transition-all duration-300/>
      </g>
    </svg>
  </div>
</template>