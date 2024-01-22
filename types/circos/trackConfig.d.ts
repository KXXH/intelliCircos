import type { ChordData, GenomeData } from './data'

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

interface CommonConfig {
  zIndex: boolean
  opacity: number
  tooltipContent: any
  events: object
}

export interface LineConfig extends AxesConfig, RadialConfig, CommonConfig, ValueConfig {
  direction: string
  color: string | ((dataItem: GenomeData) => string)
  fill: boolean
  fillColor: string
  thickness: number
  maxGap: any
  backgrounds: any[]
}

export interface ScatterConfig extends AxesConfig, RadialConfig, CommonConfig, ValueConfig {
  direction: string
  color: string | ((dataItem: GenomeData) => string)
  fill: boolean
  size: number
  shape: string
  strokeColor: string
  strokeWidth: number
  backgrounds: any[]
}

export interface HistogramConfig extends AxesConfig, RadialConfig, CommonConfig, ValueConfig {
  direction: string
  color: string | ((dataItem: GenomeData) => string)
  fill: boolean
  backgrounds: any[]
}

export interface HeatmapConfig extends RadialConfig, CommonConfig, ValueConfig {
  color: string | ((dataItem: GenomeData) => string)
  backgrounds: any[]
}

export interface ChordConfig extends CommonConfig, ValueConfig {
  color: string | ((dataItem: ChordData) => string)
  radius: number
}

export interface HighlightConfig extends CommonConfig {
  color: string | ((dataItem: GenomeData) => string)
  strokeColor: string
  strokeWidth: number
}

export interface StackConfig extends AxesConfig, RadialConfig, CommonConfig, ValueConfig {
  color: string | ((dataItem: GenomeData) => string)
  direction: string
  thickness: number
  radialMargin: number
  margin: number
  strokeWith: number
  strokeColor: string
  backgrounds: any[]
}

export interface TextConfig extends CommonConfig, RadialConfig {
  style: Record<string, unknown>
  color: string | ((dataItem: GenomeData) => string)
  backgrounds: any[]
}
