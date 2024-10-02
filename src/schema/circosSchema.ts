import { z } from 'zod'
import isHexColor from 'validator/es/lib/isHexColor'

const hexColor = z.string().refine(isHexColor)

// data.d.ts
export const KaryotypeData = z.object({
  id: z.string(),
  label: z.string(),
  len: z.number(),
  color: hexColor,
}).passthrough()

export const GenomeData = z.object({
  chromosome: z.string(),
  start: z.number(),
  end: z.number(),
  value: z.number(),
}).passthrough()

export const EndpointData = z.object({
  id: z.string(),
  start: z.number(),
  end: z.number(),
}).passthrough()

export const ChordData = z.object({
  start: EndpointData,
  end: EndpointData,
})

export const LineData = z.object({
  block_id: z.string(),
  position: z.number(),
  value: z.number(),
})

export const HeatmapData = z.object({
  block_id: z.string(),
  start: z.number(),
  end: z.number(),
  value: z.number(),
})

export const StackData = z.object({
  block_id: z.string(),
  start: z.number(),
  end: z.number(),
})

export const TextData = z.object({
  block_id: z.string(),
  position: z.number(),
  value: z.string(),
})

// trackConfig.d.ts
export const AxesConfigObj = {
  // axes: z.array(z.unknown()).optional(), // TODO: 暂时不允许设置axis
  showAxesTooltip: z.boolean().default(true).describe('Whether to show the tooltip of the axis'),
}

export const PaletteConfigObj = {
  colorPaletteSize: z.number(),
  colorPalette: z.string(),
  usePalette: z.boolean(),
  colorPaletteReverse: z.boolean(),
}

export const RadialConfigObj = {
  innerRadius: z.number().describe('The inner radius of the track'),
  outerRadius: z.number().describe('The outer radius of the track'),
}

export const ValueConfigObj = {
  min: z.number().describe('The minimum value of the track'),
  max: z.number().describe('The maximum value of the track'),
  logScale: z.boolean().default(false).describe('Whether to use log scale on axis'),
  logScaleBase: z.enum(['2', '10']).default('10'),
}

export const CommonConfigObj = {
  // zIndex: z.boolean(),
  opacity: z.number().min(0).max(1).default(1).describe('The opacity of the track'),
  // tooltipContent: z.string().optional(),
  // events: z.record(z.unknown()),
}

export const LineConfig = z.object(AxesConfigObj).extend(RadialConfigObj).extend(CommonConfigObj).extend(ValueConfigObj).extend({
  direction: z.enum(['in', 'out']).default('out').describe('The direction of the line'),
  // color: hexColor.describe('The color of the line'),
  fill: z.boolean().describe('Whether to fill the line'),
  // fillColor: z.string().describe('The color of the fill'),
  thickness: z.number().describe('The thickness of the line'),
  // maxGap: z.unknown(),
  // backgrounds: z.array(z.unknown()).optional(),
})

export const ScatterConfig = z.object(AxesConfigObj).extend(RadialConfigObj).extend(CommonConfigObj).extend(ValueConfigObj).extend({
  direction: z.enum(['in', 'out']).default('out'),
  // color: hexColor,
  fill: z.boolean(),
  size: z.number(),
  shape: z.string(),
  // strokeColor: hexColor,
  strokeWidth: z.number(),
  // backgrounds: z.array(z.unknown()),
})

export const HistogramConfig = z.object(AxesConfigObj).extend(RadialConfigObj).extend(CommonConfigObj).extend(ValueConfigObj).extend({
  direction: z.enum(['in', 'out']).default('out'),
  // color: hexColor,
  fill: z.boolean(),
  // backgrounds: z.array(z.unknown()),
})

export const HeatmapConfig = z.object(RadialConfigObj).extend(CommonConfigObj).extend(ValueConfigObj).extend({
  // color: hexColor,
  // backgrounds: z.array(z.unknown()),
})

export const ChordConfig = z.object(CommonConfigObj).extend(ValueConfigObj).extend({
  color: hexColor,
  radius: z.number(),
})

export const HighlightConfig = z.object(CommonConfigObj).extend(RadialConfigObj).extend({
  // color: hexColor,
  // strokeColor: hexColor,
  strokeWidth: z.number(),
})

export const StackConfig = z.object(AxesConfigObj).extend(RadialConfigObj).extend(CommonConfigObj).extend(ValueConfigObj).extend({
  color: hexColor,
  direction: z.enum(['in', 'out', 'center']).default('out'),
  thickness: z.number(),
  radicalMargin: z.number(),
  margin: z.number(),
  // stokeColor: hexColor,
  strokeWidth: z.number(),
})

// circos.d.ts
export const LabelConfig = z.object({
  position: z.string(),
  display: z.boolean(),
  size: z.number(),
  color: hexColor,
  radialOffset: z.number(),
})

export const SizeConfig = z.object({
  minor: z.number(),
  major: z.number(),
})

export const TickConfig = z.object({
  display: z.boolean(),
  color: hexColor,
  spacing: z.number(),
  labels: z.boolean(),
  labelSpacing: z.number(),
  labelSuffix: z.string(),
  labelDenominator: z.number(),
  labelDisplay0: z.boolean(),
  labelSize: z.number(),
  labelColor: hexColor,
  labelFont: z.string(),
  majorSpacing: z.number(),
  size: SizeConfig,
})

export const LayoutConfig = z.object({
  innerRadius: z.number(),
  outerRadius: z.number(),
  cornerRadius: z.number(),
  gap: z.number(),
  opacity: z.number().min(0).max(1),
  labels: LabelConfig,
  ticks: TickConfig,
  events: z.record(z.unknown()),
  zIndex: z.number(),
}).passthrough()

export const ContainerConfig = z.object({
  width: z.number(),
  height: z.number(),
  container: z.string().or(z.unknown()), // HTMLElement cannot be validated at runtime, hence unknown
  defaultTrackWidth: z.number(),
})
