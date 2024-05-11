import type { MaybeElementRef } from '@vueuse/core'
import { unrefElement } from '@vueuse/core'
import type { Ref } from 'vue'

import type { z } from 'zod'
import type { ChordData, EndpointData, GenomeData, HeatmapData, HighlightData, HistogramData, KaryotypeData, LineData, ScatterData, StackData, TextData } from 'circos/data'
import type { HeatmapConfig, HighlightConfig, HistogramConfig, LineConfig, ScatterConfig } from '@/schema/circosSchema'

// type MaybeSVGGraphicsElementRef = SVGGraphicsElement | Ref<SVGGraphicsElement | undefined>

export type TrackId = string

export type RawCircosData = Array<Record<string, any> | (GenomeData | ChordData | LineData | HeatmapData | StackData | TextData | HistogramData | HighlightData | ScatterData | KaryotypeData)>

export interface CircosDataFile {
  filename: string
  name: string
  content: Record<string, any>[]
  type: 'karyotype' | 'attachment'
  color?: string
}

export type ITrackConfig = z.infer<typeof LineConfig> | z.infer<typeof ScatterConfig> | z.infer<typeof HistogramConfig> | z.infer<typeof HeatmapConfig> | z.infer<typeof HighlightConfig> | { color: (((d: any) => string) | string) } & Record<string, any>
export interface ITrack {
  // r0: number
  // r1: number
  id: TrackId
  type: string
  config: Partial<ITrackConfig>
  data: CircosDataFile
  // data: RawCircosData | (() => RawCircosData) | (() => Promise<RawCircosData>) | string
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
