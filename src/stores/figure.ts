import { type MaybeRef, type Ref, computed, ref, toRaw } from 'vue'
import { csvParse } from 'd3'
import { defineStore } from 'pinia'
import type { DeepPartial } from 'utility-types'
import type { EmptyTrack, ITrack, ITrackConfig, Track, TrackId } from '@/lib/circos'

// const width = 500
const gieStainColor: Record<string, string> = {
  gpos100: 'rgb(0,0,0)',
  gpos: 'rgb(0,0,0)',
  gpos75: 'rgb(130,130,130)',
  gpos66: 'rgb(160,160,160)',
  gpos50: 'rgb(200,200,200)',
  gpos33: 'rgb(210,210,210)',
  gpos25: 'rgb(200,200,200)',
  gvar: 'rgb(220,220,220)',
  gneg: 'rgb(255,255,255)',
  acen: 'rgb(217,47,39)',
  stalk: 'rgb(100,127,164)',
  select: 'rgb(135,177,255)',
}

export const useFigureStore = defineStore('figure', () => {
  const width = ref(500)
  const tracks = ref<ITrack[]>([
    {
      config: {
        innerRadius: width.value / 2 - 100,
        outerRadius: width.value / 2 - 80,
        labels: { display: false },
        ticks: { display: false },
      },
      data: 'GRCh37',
      type: 'layout',
      id: 'GRCh37',
    },
    {
      config: {
        innerRadius: width.value / 2 - 100,
        outerRadius: width.value / 2 - 80,
        opacity: 0.3,
        color(d: any) {
          return gieStainColor[d.gieStain]
        },
        tooltipContent(d: any) {
          return d.name
        },
      },
      data: 'cytobands',
      type: 'highlight',
      id: 'cytobands',
    },
    {
      config: {
        innerRadius: 0.5,
        outerRadius: 0.8,
        maxGap: 1000000,
        min: 0,
        max: 0.015,
        color: '#222222',
        axes: [
          {
            spacing: 0.001,
            thickness: 1,
            color: '#666666',
          },
        ],
        backgrounds: [
          {
            start: 0,
            end: 0.002,
            color: '#f44336',
            opacity: 0.5,
          },
          {
            start: 0.006,
            end: 0.015,
            color: '#4caf50',
            opacity: 0.5,
          },
        ],
        tooltipContent: null,
      },
      data: 'snp250',
      type: 'line',
      id: 'snp-250',
    },
    {
      config: {
        innerRadius: 0.5,
        outerRadius: 0.8,
        min: 0,
        max: 0.015,
        fill: false,
        strokeWidth: 0,
        tooltipContent(d: any) {
          return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
        },
      },
      data: 'snp250',
      type: 'scatter',
      id: 'snp-250-tooltip',
    },
    {
      config: {
        innerRadius: 1.01,
        outerRadius: 1.15,
        maxGap: 1000000,
        min: 0,
        max: 0.015,
        color: '#222222',
        axes: [
          {
            position: 0.002,
            color: '#f44336',
          },
          {
            position: 0.006,
            color: '#4caf50',
          },
        ],
        tooltipContent: null,
      },
      data: 'snp',
      type: 'line',
      id: 'snp',
    },
    {
      config: {
        innerRadius: 1.01,
        outerRadius: 1.15,
        maxGap: 1000000,
        min: 0,
        max: 0.015,
        color: '#f44336',
        tooltipContent: null,
      },
      data: 'snp1m',
      type: 'line',
      id: 'snp1m',
    },
    {
      config: {
        innerRadius: 0.85,
        outerRadius: 0.95,
        maxGap: 1000000,
        direction: 'in',
        min: 0,
        max: 0.015,
        color: '#222222',
        axes: [
          {
            position: 0.01,
            color: '#4caf50',
          },
          {
            position: 0.008,
            color: '#4caf50',
          },
          {
            position: 0.006,
            color: '#4caf50',
          },
          {
            position: 0.002,
            color: '#f44336',
          },
        ],
        tooltipContent: null,
      },
      data: 'snp',
      type: 'line',
      id: 'snp-in',
    },
    {
      config: {
        innerRadius: 0.85,
        outerRadius: 0.95,
        maxGap: 1000000,
        direction: 'in',
        min: 0,
        max: 0.015,
        color: '#f44336',
        tooltipContent: null,
      },
      data: 'snp1m',
      type: 'line',
      id: 'snp1m-in',
    },
  ])
  const renderedTracksMap = ref<Map<TrackId, SVGGraphicsElement>>(new Map())
  const updateTrack = (id: string, opt: Ref<Partial<ITrackConfig>>) => {
    const track = tracks.value.find(t => t.id === id)
    if (track)
      track.config = Object.assign({}, track.config, toRaw(opt))
  }
  const layout = computed(() => {
    return tracks.value.find(t => t.type === 'layout')
  })
  const normalTracks = computed(() => {
    return tracks.value.filter(t => t.type !== 'layout')
  })

  return { width, tracks, updateTrack, renderedTracksMap, layout, normalTracks }
})
