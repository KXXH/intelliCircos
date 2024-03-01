<script setup lang="ts">
import GeneralSettings from './GeneralSettings.vue'
import TrackSettings from './TrackSettings.vue'
import LineTrackSettings from './Tracks/LineTrackSettings.vue'
import ScatterTrackSettings from './Tracks/ScatterTrackSettings.vue'
import HistogramTrackSettings from './Tracks/HistogramTrackSettings.vue'
import HeatmapTrackSettings from './Tracks/HeatmapTrackSettings.vue'
import ChordTrackSettings from './Tracks/ChordTrackSettings.vue'
import HighlightTrackSettings from './Tracks/HighlightTrackSettings.vue'
import StackTrackSettings from './Tracks/StackTrackSettings.vue'
import { useFigureStore } from '@/stores/figure'

// const figure = useFigureStore()
</script>

<template>
  <div class="">
    <GeneralSettings />
    <!-- <TrackSettings v-for="track in figure.tracks" :key="track.id" :track-title="track.id" :track-id="track.id" :r0="track.r0" :r1="track.r1" /> -->
    <LineTrackSettings />
    <ScatterTrackSettings />
    <HistogramTrackSettings />
    <HeatmapTrackSettings />
    <ChordTrackSettings />
    <HighlightTrackSettings />
    <StackTrackSettings />
  </div>
</template>
