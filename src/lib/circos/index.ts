import type { MaybeElementRef } from '@vueuse/core'
import { unrefElement } from '@vueuse/core'
import type { Ref } from 'vue'

// type MaybeSVGGraphicsElementRef = SVGGraphicsElement | Ref<SVGGraphicsElement | undefined>

export type TrackId = string

export interface ITrack {
  r0: number
  r1: number
  id?: TrackId
  type: string
  background?: string
  // onPointerEnter?: <T extends this>(track: T, event: PointerEvent) => void
  onPointerEnter?: (track: ITrack, event: PointerEvent) => void
  // onPointerLeave?: <T extends this>(track: T, event: PointerEvent) => void
  onPointerLeave?: (track: ITrack, event: PointerEvent) => void
  // onClick?: <T extends this>(track: T, event: PointerEvent) => void
  onClick?: (track: ITrack, event: PointerEvent) => void
}

export interface ITrackEvents {
}

export interface EmptyTrack extends ITrack {
  type: 'empty'
}

export interface TextTrack extends ITrack {
  type: 'text'
  text: string
  fontSize: number
  color: string
  fontFamily: string
}

export type Track = (EmptyTrack | TextTrack) & ITrackEvents

export class RenderedTrack {
  track: Track
  svgElement?: SVGGraphicsElement
  constructor(track: Track) {
    this.track = track
  }
}

export interface CircosConfig {
  tracks: Track[]
}
