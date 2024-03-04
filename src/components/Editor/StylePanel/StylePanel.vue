<script setup lang="ts">
import { ref } from 'vue'
import type { z } from 'zod'
import GeneralSettings from './GeneralSettings.vue'
import TrackSettings from './TrackSettings.vue'
import LineTrackSettings from './Tracks/LineTrackSettings.vue'
import ScatterTrackSettings from './Tracks/ScatterTrackSettings.vue'
import HistogramTrackSettings from './Tracks/HistogramTrackSettings.vue'
import HeatmapTrackSettings from './Tracks/HeatmapTrackSettings.vue'
import ChordTrackSettings from './Tracks/ChordTrackSettings.vue'
import HighlightTrackSettings from './Tracks/HighlightTrackSettings.vue'
import StackTrackSettings from './Tracks/StackTrackSettings.vue'
import Form from './Tracks/FormComponents/Form.vue'
import { FormFieldTypes } from './Tracks/FormComponents'
import { useFigureStore } from '@/stores/figure'
import { LineConfig } from '@/schema/circosSchema'

// const figure = useFigureStore()
const lineConfigTest = ref< z.infer<typeof LineConfig>>({
  innerRadius: 0,
  outerRadius: 100,
  opacity: 1,
  min: 0,
  max: 100,
  logScale: false,
  logScaleBase: '10',
  direction: 'out',
  showAxesTooltip: true,
  color: '#000000',
  fillColor: '#000000',
  thickness: 1,
  fill: false,
})
</script>

<template>
  <div class="">
    <GeneralSettings />
    <!-- <TrackSettings v-for="track in figure.tracks" :key="track.id" :track-title="track.id" :track-id="track.id" :r0="track.r0" :r1="track.r1" /> -->
    <!-- <LineTrackSettings /> -->
    <Form
      v-model="lineConfigTest" :schema="LineConfig" form-title="Line" :type-map="{
        color: FormFieldTypes.COLOR,
        fillColor: FormFieldTypes.COLOR,
        opacity: FormFieldTypes.SLIDER,
      }" :option-bindings="{
        logScaleBase: {
          options: [
            {
              label: '2',
              value: '2',
            },
            {
              label: '10',
              value: '10',
            },
          ],
        },
        direction: {
          options: [
            {
              label: 'in',
              value: 'in',
            },
            {
              label: 'out',
              value: 'out',
            },
          ],
        },
        opacity: {
          min: 0,
          max: 1,
          step: 0.01,
        },
      }"
    />
    <!-- <ScatterTrackSettings />
    <HistogramTrackSettings />
    <HeatmapTrackSettings />
    <ChordTrackSettings />
    <HighlightTrackSettings />
    <StackTrackSettings /> -->
  </div>
</template>
@/schema/circosSchema
