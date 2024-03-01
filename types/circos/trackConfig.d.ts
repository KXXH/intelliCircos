import type { Nullish } from 'utility-types'
import type { ChordData, GenomeData, HeatmapData, HighlightData, HistogramData, KaryotypeData, LineData, ScatterData, StackData, TextData } from './data'

interface AxesConfig {
  axes: any[]
  showAxesTooltip: boolean
}

interface PaletteConfig {
  colorPaletteSize: number
  colorPalette: string
  usePalette: boolean
  colorPaletteReverse: boolean
}

interface RadialConfig {
  innerRadius: number
  outerRadius: number
}

interface ValueConfig {
  min: any
  max: any
  logScale: boolean
  logScaleBase: number
}

interface CommonConfig<T> {
  zIndex: boolean
  opacity: number
  tooltipContent: ((dataItem: T) => string) | Nullish
  events: object
}

export interface LineConfig<T> extends AxesConfig, RadialConfig, CommonConfig<T>, ValueConfig {
  direction: 'in' | 'out'
  color: string | ((dataItem: GenomeData) => string)
  fill: boolean
  fillColor: string
  thickness: number
  maxGap: any
  backgrounds: any[]
}

export interface ScatterConfig<T> extends AxesConfig, RadialConfig, CommonConfig<T>, ValueConfig {
  direction: string
  color: string | ((dataItem: GenomeData) => string)
  fill: boolean
  size: number
  shape: string
  strokeColor: string
  strokeWidth: number
  backgrounds: any[]
}

export interface HistogramConfig<T> extends AxesConfig, RadialConfig, CommonConfig<T>, ValueConfig {
  direction: string
  color: string | ((dataItem: GenomeData) => string)
  fill: boolean
  backgrounds: any[]
}

export interface HeatmapConfig<T> extends RadialConfig, CommonConfig<T>, ValueConfig {
  color: string | ((dataItem: GenomeData) => string)
  backgrounds: any[]
}

export interface ChordConfig<T> extends CommonConfig<T>, ValueConfig {
  color: string | ((dataItem: ChordData) => string)
  radius: number
}

export interface HighlightConfig<T> extends CommonConfig<T>, RadialConfig {
  color: string | ((dataItem: GenomeData) => string)
  strokeColor: string
  strokeWidth: number
}

export interface StackConfig<T> extends AxesConfig, RadialConfig, CommonConfig<T>, ValueConfig {
  color: string | ((dataItem: GenomeData) => string)
  direction: 'in' | 'out' | 'center'
  thickness: number
  radialMargin: number
  margin: number
  strokeWith: number
  strokeColor: string
  backgrounds: any[]
}

export interface TextConfig<T> extends CommonConfig<T>, RadialConfig {
  style: Record<string, unknown>
  color: string | ((dataItem: GenomeData) => string)
  backgrounds: any[]
}
