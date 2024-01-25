export interface KaryotypeData {
  id: string
  label: string
  len: number
  color: string
  [key: string]: any
}

export interface GenomeData {
  chromosome: string
  start: number
  end: number
  value: number
  [key: string]: any
}

interface EndpointData {
  id: string
  start: number
  end: number
  [key: string]: any
}

export interface ChordData {
  start: EndpointData
  end: EndpointData
}

export interface LineData {
  block_id: string
  position: number
  value: number
}

export interface HeatmapData {
  block_id: string
  start: number
  end: number
  value: number
}

export interface StackData {
  block_id: string
  start: number
  end: number
}

export interface TextData extends LineData {
  value: string
}

export type HistogramData = HeatmapData
export type HighlightData = StackData
export type ScatterData = LineData
