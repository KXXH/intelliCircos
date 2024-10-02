import { type MaybeRef, type Ref, computed, ref, toRaw, unref } from 'vue'
import { csvParse } from 'd3'
import { defineStore } from 'pinia'
import type { DeepPartial } from 'utility-types'
import type { CircosDataFile, EmptyTrack, ITrack, ITrackConfig, Track, TrackId } from '@/lib/circos'

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
  const tracks = ref<ITrack[]>([])
  const renderedTracksMap = ref<Map<TrackId, SVGGraphicsElement>>(new Map())
  const updateTrackConfig = (id: string, opt: MaybeRef<Partial<ITrackConfig>>) => {
    const track = tracks.value.find(t => t.id === id)
    if (track)
      track.config = Object.assign({}, track.config, unref(opt))
  }
  const updateTrackData = (id: string, data: CircosDataFile) => {
    const track = tracks.value.find(t => t.id === id)
    if (track)
      track.data = data
  }
  const layout = computed(() => {
    // const innerRadius = 1.5
    // const outerRadius = 1.8
    // return { innerRadius, outerRadius }
    return tracks.value.find(t => t.type === 'layout')
  })
  const normalTracks = computed(() => {
    return tracks.value.filter(t => t.type !== 'layout')
  })

  const CTMLConfig = computed(() => {
    const skeleton = tracks.value.map(t => ({
      type: t.type,
      innerRadius: t.config.innerRadius,
      outerRadius: t.config.outerRadius,
    })).sort((a, b) => a.innerRadius - b.innerRadius)

    const CTMLTracks = []
    let lastOuterRadius = 0
    let tempTracks = ['']
    for (const token of skeleton) {
      if (token.innerRadius >= lastOuterRadius) {
        CTMLTracks.push(tempTracks)
        tempTracks = []
      }
      tempTracks.push(`<${token.type.replace('layout', 'ideogram')}>`)
      lastOuterRadius = token.outerRadius
    }
    CTMLTracks.push(tempTracks)
    CTMLTracks.push([''])
    return `<START>${CTMLTracks.slice(1, -1).map(t => t.join('')).reverse().join('<split>')}<END>`
  })

  return { width, tracks, updateTrackConfig, updateTrackData, renderedTracksMap, layout, normalTracks, CTMLConfig }
})
