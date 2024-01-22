import type { ChordData, GenomeData, KaryotypeData } from './data'
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
    constructor(config: Partial<ContainerConfig>)
    removeTracks(trackIds: string | string[]): Core
    layout(data: KaryotypeData, conf: Partial<LayoutConfig>): Core
    chord(id: string, data: ChordConfig, conf: Partial<ChordConfig>): Core
    heatmap(id: string, data: GenomeData, conf: Partial<HeatmapConfig>): Core
    highlight(id: string, data: any, conf: Partial<HighlightConfig>): Core
    histogram(id: string, data: GenomeData, conf: Partial<HistogramConfig>): Core
    line(id: string, data: GenomeData, conf: Partial<LineConfig>): Core
    scatter(id: string, data: GenomeData, conf: Partial<ScatterConfig>): Core
    stack(id: string, data: any, conf: Partial<StackConfig>): Core
    text(id: string, data: any, conf: Partial<TextConfig>): Core
    render(): void
  }

  export interface Circos {
    new (conf: Partial<ContainerConfig>): Core
    (conf: Partial<ContainerConfig>): Core
  }
}
