import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Track } from '@/lib/circos'

export const useFigureStore = defineStore('figure', () => {
  const tracks = ref<Track[]>([
    {
      r0: 0,
      r1: 200,
      id: 'track1',
    },
    {
      r0: 210,
      r1: 400,
      id: 'track2',
    },
    {
      r0: 410,
      r1: 600,
      id: 'track3',
    },
  ])
  return { tracks }
})
