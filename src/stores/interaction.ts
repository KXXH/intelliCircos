import { ref } from 'vue'
import { defineStore } from 'pinia'
import { unrefElement } from '@vueuse/core'
import type { MaybeElementRef } from '@vueuse/core'
import { useFigureStore } from './figure'
import type { CurvePoint } from '@/lib/guideLine'
import type { TrackBase } from '@/lib/circos'

// interface GuideLine {
//   x1: number
//   y1: number
//   x2: number
//   y2: number
//   show: boolean
//   id: string
// }
type Curve = CurvePoint[]

let id = 0

export const useInteractionStore = defineStore('interaction', () => {
  const figureStore = useFigureStore()
  const activeTracks = ref<TrackBase[]>([])
  const setActiveTrackId = (id: string) => {
    const track = figureStore.tracks.find(item => id === item.id)
    if (track)
      activeTracks.value = [track]
  }
  const removeActiveTrackId = (id: string) => {
    const index = activeTracks.value.findIndex(item => id === item.id)
    if (index > -1)
      activeTracks.value.splice(index, 1)
  }

  const lines = ref<Curve[]>([])
  const addGuideLine = (line: Curve) => {
    lines.value.push(line)
  }

  const removeGuideLine = (curve: Curve) => {
    // const index = lines.value.findIndex(item => item.id === id)
    // if (index > -1)
    //   lines.value.splice(index, 1)
    lines.value = lines.value.filter(item => item !== curve)
  }

  const addGuideLineFromElement = (left_element: MaybeElementRef, right_element: MaybeElementRef) => {
    const left_element_ref = unrefElement(left_element)
    const right_element_ref = unrefElement(right_element)
    if (!left_element_ref || !right_element_ref)
      return null

    const left_rect = left_element_ref.getBoundingClientRect()
    const right_rect = right_element_ref.getBoundingClientRect()
    const line = {
      x1: left_rect.right,
      y1: left_rect.top + left_rect.height / 2,
      x2: right_rect.left,
      y2: right_rect.top + right_rect.height / 2,
      show: true,
      id: `${++id}`,
    }
    addGuideLine(line)
    return String(id)
  }

  return { activeTracks, setActiveTrackId, removeActiveTrackId, addGuideLine, removeGuideLine, addGuideLineFromElement, lines }
})
