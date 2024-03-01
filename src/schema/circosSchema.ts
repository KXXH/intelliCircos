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
export const AxesConfig = z.object({
  axes: z.array(z.unknown()),
  showAxesTooltip: z.boolean(),
})

export const PaletteConfig = z.object({
  colorPaletteSize: z.number(),
  colorPalette: z.string(),
  usePalette: z.boolean(),
  colorPaletteReverse: z.boolean(),
})

export const RadialConfig = z.object({
  innerRadius: z.number(),
  outerRadius: z.number(),
})

export const ValueConfig = z.object({
  min: z.unknown(),
  max: z.unknown(),
  logScale: z.boolean().default(false),
  logScaleBase: z.literal(2).or(z.literal(10)).default(10),
})

export const CommonConfig = z.object({
  zIndex: z.boolean(),
  opacity: z.number().min(0).max(1).default(1),
  tooltipContent: z.string().optional(),
  events: z.record(z.unknown()),
}).passthrough()

export const LineConfig = AxesConfig.and(RadialConfig).and(CommonConfig).and(ValueConfig).and(z.object({
  direction: z.enum(['in', 'out']).default('out'),
  color: hexColor,
  fill: z.boolean(),
  fillColor: z.string(),
  thickness: z.number(),
  maxGap: z.unknown(),
  backgrounds: z.array(z.unknown()),
}))

export const ScatterConfig = AxesConfig.and(RadialConfig).and(CommonConfig).and(ValueConfig).and(z.object({
  direction: z.enum(['in', 'out']).default('out'),
  color: hexColor,
  fill: z.boolean(),
  size: z.number(),
  shape: z.string(),
  strokeColor: hexColor,
  strokeWidth: z.number(),
  backgrounds: z.array(z.unknown()),
}))

export const HistogramConfig = AxesConfig.and(RadialConfig).and(CommonConfig).and(ValueConfig).and(z.object({
  direction: z.enum(['in', 'out']).default('out'),
  color: hexColor,
  fill: z.boolean(),
  backgrounds: z.array(z.unknown()),
}))

export const HeatmapConfig = RadialConfig.and(CommonConfig).and(ValueConfig).and(z.object({
  color: hexColor,
  backgrounds: z.array(z.unknown()),
}))

export const ChordConfig = CommonConfig.and(ValueConfig).and(z.object({
  color: hexColor,
  radius: z.number(),
}))

export const HighlightConfig = CommonConfig.and(RadialConfig).and(z.object({
  color: hexColor,
  strokeColor: hexColor,
  strokeWidth: z.number(),
}))

export const StackConfig = AxesConfig.and(RadialConfig).and(CommonConfig).and(ValueConfig).and(z.object({
  color: hexColor,
  direction: z.enum(['in', 'out', 'center']).default('out'),
  thickness: z.number(),
  radicalMargin: z.number(),
  margin: z.number(),
  stokeColor: hexColor,
  strokeWidth: z.number(),
}))

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
