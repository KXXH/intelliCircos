<script setup lang="ts">
import GeneralSettings from './GeneralSettings.vue'
import TrackSettings from './TrackSettings.vue'
import { useFigureStore } from '@/stores/figure'
const figure = useFigureStore()
</script>

<template>
  <div class="">
    <GeneralSettings />
    <TrackSettings v-for="track in figure.tracks" :key="track.id" :track-title="track.id" :track-id="track.id" :r0="track.r0" :r1="track.r1"/>
  </div>
</template>
