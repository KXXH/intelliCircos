import type { DeepPartial } from 'utility-types'
import type { ChordData, GenomeData, HeatmapData, HighlightData, HistogramData, KaryotypeData, LineData, ScatterData, StackData, TextData } from './data'
import type { ChordConfig, HeatmapConfig, HighlightConfig, HistogramConfig, LineConfig, ScatterConfig, StackConfig, TextConfig } from './trackConfig'

declare module '@/lib/circosJS/dist/circos.module' {

  export interface LabelConfig {
    position: string
    display: boolean
    size: number
    color: string
    radialOffset: number
  }

  interface SizeConfig {
    minor: number
    major: number
  }

  interface TickConfig {
    display: boolean
    color: string
    spacing: number
    labels: boolean
    labelSpacing: number
    labelSuffix: string
    labelDenominator: number
    labelDisplay0: boolean
    labelSize: number
    labelColor: string
    labelFont: string
    majorSpacing: number
    size: SizeConfig
  }

  interface LayoutConfig {
    innerRadius: number
    outerRadius: number
    cornerRadius: number
    gap: number
    opacity: number
    labels: LabelConfig
    ticks: TickConfig
    onClick: () => void
    onMouseOver: () => void
    events: Record<string, unknown>
    zIndex: number
  }

  interface ContainerConfig {
    width: number
    height: number
    container: string | HTMLElement
    defaultTrackWidth: number
  }

  export class Core {
    constructor(config: DeepPartial<ContainerConfig>)
    removeTracks(trackIds: string | string[]): Core
    layout(data: KaryotypeData[], conf: DeepPartial<LayoutConfig>): Core
    chord<T extends ChordData>(id: string, data: T[], conf: DeepPartial<ChordConfig<T>>): Core
    heatmap<T extends HeatmapData>(id: string, data: T[], conf: DeepPartial<HeatmapConfig<T>>): Core
    highlight<T extends HighlightData>(id: string, data: T[], conf: DeepPartial<HighlightConfig<T>>): Core
    histogram<T extends HistogramData>(id: string, data: T[], conf: DeepPartial<HistogramConfig<T>>): Core
    line<T extends LineData>(id: string, data: T[], conf: DeepPartial<LineConfig<T>>): Core
    scatter<T extends ScatterData>(id: string, data: T[], conf: DeepPartial<ScatterConfig<T>>): Core
    stack<T extends StackData>(id: string, data: T[], conf: DeepPartial<StackConfig<T>>): Core
    text<T extends TextData>(id: string, data: T[], conf: DeepPartial<TextConfig<T>>): Core
    render(): void
  }
  // export interface Circos {
  //   new (conf: Partial<ContainerConfig>): Core
  //   (conf: Partial<ContainerConfig>): Core
  // }
  // export type Circos = Core
  export function Circos(conf: Partial<ContainerConfig>): Core
}
