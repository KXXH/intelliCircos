import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { EmptyTrack, Track, TrackId } from '@/lib/circos'

export const useFigureStore = defineStore('figure', () => {
  const tracks = ref<EmptyTrack[]>([
    {
      r0: 0,
      r1: 200,
      id: 'track1',
      type: 'empty',
      background: 'teal',
      onPointerEnter: (track) => {
        track.background = 'red'
      },
      onPointerLeave(track) {
        track.background = 'teal'
      },
    },
    {
      r0: 210,
      r1: 400,
      id: 'track2',
      background: 'teal',
      type: 'empty',
      onPointerEnter: (track) => {
        track.background = 'red'
      },
    },
    {
      r0: 410,
      r1: 600,
      id: 'track3',
      background: 'teal',
      type: 'empty',
      onPointerEnter: (track) => {
        track.background = 'red'
      },
    },
  ])
  const renderedTracksMap = ref<Map<TrackId, SVGGraphicsElement>>(new Map())
  return { tracks, renderedTracksMap }
})
