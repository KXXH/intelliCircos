<script setup lang="ts">
import { arc } from 'd3'
import { computed } from 'vue'
import Track from './CircosRender/Track.vue'
import Render from './CircosRender/Render.vue'
import { useFigureStore } from '@/stores/figure'
import { useInteractionStore } from '@/stores/interaction'

const figure = useFigureStore()
const outmostRadius = computed(() => {
  return Math.max(...figure.tracks.map(track => track.r1))
})

// const interactionStore = useInteractionStore()
// const activeTrackIds = computed(() => new Set(interactionStore.activeTracks.map(track => track.id)))
</script>

<template>
  <div h-full w-full flex items-center justify-center p-2>
    <Render />
    <!-- <svg
      :viewBox="`-${outmostRadius} -${outmostRadius} ${2 * outmostRadius} ${2 * outmostRadius}`"
      class="h-90% w-90% lg:(h-75% w-75%)"
    >
      <g v-for="track in figure.tracks" :key="track.id" :data-track-id="track.id">
        <Track :track="track" />
      </g>
    </svg> -->
  </div>
</template>
