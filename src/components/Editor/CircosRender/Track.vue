<script setup lang="ts">
import { arc } from 'd3'
import type { Track } from '@/lib/circos'

const track = defineModel<Track>('track', { required: true })
</script>

<template>
  <path
    :d="arc()({ startAngle: 0, endAngle: 2 * Math.PI, innerRadius: track.r0, outerRadius: track.r1 }) ?? undefined"
    stroke-border transition-all duration-300
    :fill="track.background"
    @pointerenter="(event) => track.onPointerEnter?.(track, event)"
    @pointerleave="(event) => track.onPointerLeave?.(track, event)"
  />
</template>
