import type { KaryotypeData } from 'circos/data'
import _, { add, has, isFunction, isNil, isNumber, isString, random, sample } from 'lodash-es'
import { type MaybeRef, unref } from 'vue'
import { every, scaleLinear } from 'd3'
import { isEmpty } from 'validator'
import { generateRandomCategoryPalette, gieStainColor} from '../palette'
import type { ITrack } from '.'
import { type CircosDataFile, useDataStore } from '@/stores/data'

enum FieldType {
  numeric = 'numeric',
  ordinal = 'ordinal',
  categorical = 'categorical',
  error = 'error',
}
function fieldType(data: Record<string, any>[], field: string): FieldType {
  const L = data.length
  const toNumber = _.chain(data).map(field).map(Number).value()
  const nanCount = toNumber.filter(Number.isNaN).length
  const uniqueValue = _.chain(data).map(field).uniq().value()
  const emptyCount = data.filter(d => (d[field] === '' || isNil(d))).length
  if (nanCount / L < 0.1) {
    if (uniqueValue.length / L < 0.1)
      return FieldType.ordinal
    else
      return FieldType.numeric
  }
  else {
    if (emptyCount / L < 0.1)
      return FieldType.categorical
    else
      return FieldType.error
  }
}

function pickAField(dataFile: CircosDataFile, expectedFieldType: FieldType, dropValue: boolean = false): [string, FieldType] {
  const data = dataFile.content
  const fields = Object.keys(data[0])
  const fieldCandidates = fields.filter(f => fieldType(data, f) === expectedFieldType).filter(f => !dropValue || f !== 'value').filter(f => !isFunction(data[0][f]))
  if (fieldCandidates.includes('value'))
    return ['value', expectedFieldType]

  if (fieldCandidates.length > 0) {
    return [sample(fieldCandidates)!, expectedFieldType]
  }
  else {
    const fieldCandidates = fields.filter(f => fieldType(data, f) !== FieldType.error)
    const sampledField = sample(fieldCandidates)
    return [
      sampledField!,
      fieldType(data, sampledField!),
    ]
  }
}

function getSchema(data: Record<string, any>[]) {
  const fields = Object.keys(data[0])
  return fields.map((f) => {
    return {
      name: f,
      type: fieldType(data, f),
    }
  })
}

function validPositionalData(data: Record<string, any>[]) {
  return every([
    'block_id',
    'position',
    'value',
  ], f => has(data[0], f))
}

function validRangeData(data: Record<string, any>[]) {
  return every([
    'block_id',
    'start',
    'end',
    'value',
  ], f => has(data[0], f))
}

function pickAPositionalDataset(files: CircosDataFile[]) {
  return sample(files.filter(f => validPositionalData(f.content)))
}

function pickARangeDataset(files: CircosDataFile[]) {
  return sample(files.filter(f => validRangeData(f.content)))
}

function pickATextDataset(files: CircosDataFile[]) {
  return sample(files.filter(f => validPositionalData(f.content) && isString(f.content[0].value)))
}

function pickAChordDataset(files: CircosDataFile[]) {
  // return sample(files.filter(f => has(f.content[0], 'start') && has(f.content[0], 'end')))
  return sample(files.filter(f => has(f.content[0], 'source') && has(f.content[0], 'target')))
}

function pickACategoricalDataset(files: CircosDataFile[]) {
  // return sample(files.filter(f => validPositionalData(f.content) && isString(f.content[0].value)))
  return sample(files.filter(f => has(f.content[0], 'block_id') && has(f.content[0], 'start') && has(f.content[0], 'end')))
}

let _id = 0

function _getId() {
  return `track_${_id++}`
}

export function useSmartMerge() {
  const dataStore = useDataStore()
  const pickACategoricalField = (data: Record<string, any>[]) => pickAField(data, FieldType.categorical)
  const pickANumericField = (data: Record<string, any>[]) => pickAField(data, FieldType.numeric)
  // const pickAnOrdinalField = (data: Record<string, any>[]) => pickAField(data, FieldType.ordinal)
  function pickAKaryotypeField(_data: Record<string, any>[]) {
    sample(dataStore.karyotypes)
  }

  const CONFIG_TEMPLATES: { [key: string]: Function } = {
    layout: (size: {
      innerRadius: number
      outerRadius: number
    }, data: CircosDataFile) => {
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          labels: { radialOffset: 100 },
          ticks: { display: false },
        },
        data,
        type: 'layout',
      }
    },
    highlight: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      const [encodingField, _fieldType] = pickAField(data, FieldType.categorical)

      // const palette = generateRandomCategoryPalette()
      // const values = _.chain(data).map(encodingField).uniq().value()
      // const colorMap = _.zipObject(values, values.map(() => palette.next().value!))
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          opacity: 0.3,
          // TODO：颜色目前写死了
          color: function(d: any) {
            return gieStainColor[d.gieStain]
          },
          tooltipContent(d: any) {
            return d?.name
          },
        },
        data,
        type: 'highlight',
      }
    },
    line: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      const useBackgroundColor = random(0, 1) > 0.8
      // const useAxes = random(0, 1) > 0.3
      const useAxes = true
      const maxGap = 1000000 // 不知道是啥，先这么写
      const thickness = 1
      const axisColor = '#666666'
      const axes = [
        {
          spacing: 1,
          thickness,
          color: axisColor,
        },
      ]
      const backgrounds = [
        {
          start: 0,
          end: 0.002,
          color: '#4caf50',
          opacity: 0.5,
        },
      ]
      const [encodingField, _fieldType] = pickAField(data, FieldType.numeric)
      const min = Math.min(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      const max = Math.max(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      console.log('sizeout: ' + size.outerRadius)
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          maxGap,
          min,
          max,
          color: '#222222',
          axes: useAxes ? axes : [],
          backgrounds: useBackgroundColor ? backgrounds : [],
        },
        data,
        type: 'line',
      }
    },
    scatter: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      const [encodingField, _fieldType] = pickAField(data, FieldType.numeric)
      const palette = generateRandomCategoryPalette()
      const min = Math.min(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      const max = Math.max(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      // const useFill = random(0, 1) > 0.5
      const useFill = true
      // const useStaticFill = random(0, 1) > 0.5
      const useStaticFill = false
      const [fillField, _fillFieldType] = pickAField(data, FieldType.categorical, true)
      const values = _.chain(data).map(fillField).uniq().value()
      const colorMap = _.zipObject(values, values.map(() => palette.next().value!))
      const fillColor = (d: any) => {
        // console.log('fillColor', d, d[fillField])
        return useStaticFill || !fillField ? '#f44336' : colorMap[d[fillField]]
      }
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          min,
          max,
          fill: useFill,
          color: useFill ? fillColor : undefined,
          strokeWidth: 0,
          tooltipContent(d: any) {
            return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
          },
          size: 1,
        },
        data,
        type: 'scatter',
      }
    },
    histogram: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      const [encodingField, _fieldType] = pickAField(data, FieldType.numeric)
      const min = Math.min(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      const max = Math.max(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          color: '#222222',
          min,
          max,
        },
        data,
        type: 'histogram',
      }
    },
    stack: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          thickness: 4,
          margin: 0.01 * length,
          strokeWidth: 0,
          color: function (d: any) {
            if (d.end - d.start > 3000000) {
              return 'green'
            } else if (d.end - d.start > 1500000) {
              return 'red'
            } else if (d.end - d.start > 1000000) {
              return 'yellow'
            } else if (d.end - d.start > 700000) {
              return 'blue'
            }
          },
        },
        data,
        type: 'stack',
      }
    },
    text: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      const [encodingField, _fieldType] = pickAField(data, FieldType.categorical)
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          value: encodingField,
        },
        data,
        type: 'text',
      }
    },
    heatmap: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      const [encodingField, _fieldType] = pickAField(data, FieldType.numeric)
      const min = Math.min(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      const max = Math.max(
        0,
        ...data.content.map(d => Number(d[encodingField])),
      )
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          min,
          max,
        },
        data,
        type: 'heatmap',
      }
    },
    chord: (size: { innerRadius: number, outerRadius: number }, data: CircosDataFile) => {
      return {
        config: {
          innerRadius: size.innerRadius,
          outerRadius: size.outerRadius,
          radius: 0.5,
          logScale: true,
          opacity: 0.8,
          color: '#ff5722',
        },
        data, 
        type: 'chords',
      }
    }
  }

  const DATA_TYPE: { [key: string]: Function[] } = {
    // layout: [pickAKaryotypeField],
    line: [pickAPositionalDataset],
    scatter: [pickAPositionalDataset],
    text: [pickATextDataset],
    highlight: [pickACategoricalDataset],
    heatmap: [pickARangeDataset],
    stack: [pickACategoricalDataset],
    histogram: [pickARangeDataset],
    chord: [pickAChordDataset],
  }

  function normalizeRadius(tracks: ITrack[], layout: { innerRadius: number, outerRadius: number }) {
    return _.chain(tracks).map((t) => {
      let innerRadius = t.config?.innerRadius
      let outerRadius = t.config?.outerRadius
      if (innerRadius <= 1 && outerRadius <= 1) {
        innerRadius = innerRadius * layout.innerRadius
        outerRadius = outerRadius * layout.innerRadius
      }
      else if (innerRadius <= 10 && outerRadius <= 10) {
        innerRadius = innerRadius * layout.outerRadius
        outerRadius = outerRadius * layout.outerRadius
      }
      return {
        ...t,
        config: {
          ...t.config,
          innerRadius,
          outerRadius,
        },
      }
    }).value()
  }

  function checkValidLayout(partical_track: Partial<ITrack>, ctx: MaybeRef<ITrack[]>) {
    if (isNil(partical_track.type) || isEmpty(partical_track.type) || partical_track.type !== 'layout')
      throw new Error(`Incorrect Layout Type: ${partical_track.type}`)

    const tracks = unref(ctx)
    const alreadyHasLayout = tracks.some(t => t.type === 'layout')
    if (alreadyHasLayout)
      throw new Error('Layout already exists')
    if (Number.isNaN(partical_track.config?.innerRadius) || Number.isNaN(partical_track.config?.outerRadius))
      throw new Error('Invalid innerRadius or outerRadius')
  }

  function smartMerge(partical_track: Partial<ITrack>, ctx: MaybeRef<ITrack[]>, direction: ('in' | 'out') = 'out', opts: { width?: number, innerRadius: number, outerRadius: number }): ITrack {
    if (partical_track.type === 'layout')
      checkValidLayout(partical_track, ctx)

    const tracks = normalizeRadius(unref(ctx), { innerRadius: opts.innerRadius, outerRadius: opts.outerRadius })

    // calculate radius
    const isFirstTrack = tracks.length === 0
    if (isFirstTrack) {
      direction = 'out' // 第一个track无所谓内外，设置为外侧
      if (!opts.width)
        throw new Error('The first track must have a width')
    }
    const minInnerRadius = _.chain(tracks).filter(t => t.config?.innerRadius).map(t => t.config.innerRadius).min().value() ?? 0
    const maxOutterRadius = _.chain(tracks).filter(t => t.config?.outerRadius).map(t => t.config.outerRadius).max().value() ?? opts.width ?? 0
    const trackWidth = random(30, 50)
    console.log('maxOutterRadius: ' + maxOutterRadius)
    const targetOuterRadius = direction === 'out' ? maxOutterRadius + trackWidth : minInnerRadius
    const targetInnerRadius = direction === 'out' ? targetOuterRadius - trackWidth : minInnerRadius - trackWidth
    console.log('targetOuterRadius: ' + targetOuterRadius)
    const size = {
      innerRadius: targetInnerRadius,
      outerRadius: targetOuterRadius,
    }

    // calculate id
    const id = _getId()

    // calculate data
    let data, dataset
    if (!partical_track.data) {
      if (!partical_track.type)
        throw new Error('Type is required')

      const type = partical_track.type
      if (!DATA_TYPE[type])
        throw new Error(`Type '${type}' not supported`)
      if (type === 'layout') {
        data = dataStore.karyotypes.map(k => k.content)[0]
        // dataset = dataStore.karyotypes[0].content
      }
      else {
        const dataFuncs = DATA_TYPE[type]
        dataset = sample(dataFuncs)!(dataStore.attachments)
        console.log(dataset)
        // dataset = sample(dataFuncs)!(dataStore.attachments).content
        // dataset = sample(dataStore.attachments)?.content
        if (!dataset)
          throw new Error('No dataset available')
        // data = sample(dataFuncs)!(dataset)
        data = dataset
      }
    }
    else {
      data = partical_track.data
    }

    // calculate config
    const default_config = CONFIG_TEMPLATES[partical_track.type!](size, data)
    const config = {
      ...default_config.config,
      ...partical_track.config,
    }

    return {
      ...partical_track,
      type: partical_track.type!,
      id,
      data: data!,
      config,
    }
  }

  function adjustRadius(old_tracks: ITrack[], new_track: ITrack, opts: { width?: number, innerRadius: number, outerRadius: number }) {
    // 只有在direction为out时才调整
    const tracks = normalizeRadius(old_tracks, opts)
    // 找到已有track中最小的内半径
    const minOldInnerRadius = _.chain(tracks).filter(t => t.config?.innerRadius).map(t => t.config.innerRadius).min().value() ?? 0
    // 找到已有track中最大的外半径
    const maxOldOutterRadius = _.chain(tracks).filter(t => t.config?.outerRadius).map(t => t.config.outerRadius).max().value() ?? opts.width ?? 0
    // 新的外半径，要不是最大的外半径，要不是新track的外半径
    const maxNewOutterRadius = Math.max(
      maxOldOutterRadius,
      new_track.config.outerRadius
    )
    const minNewInnerRadius = Math.min(
      minOldInnerRadius,
      new_track.config.innerRadius
    )
    const scale = scaleLinear().domain([minNewInnerRadius, maxNewOutterRadius]).range([minNewInnerRadius, maxNewOutterRadius])

    console.log('scale:: ' + scale(new_track.config.innerRadius) + ' XXXXXXX ' + scale(new_track.config.outerRadius))

    return _.chain([
      ...tracks,
      new_track,
    ]).map(t => ({
      ...t,
      config: {
        ...t.config,
        innerRadius: scale(t.config.innerRadius),
        outerRadius: scale(t.config.outerRadius),
      },
    })).value()
  }

  function addPartialTrack(partical_track: Partial<ITrack>, ctx: MaybeRef<ITrack[]>, direction: ('in' | 'out') = 'out', opts: { width?: number, innerRadius: number, outerRadius: number }) {
    const new_track = smartMerge(partical_track, ctx, direction, opts)
    const new_tracks = adjustRadius(unref(ctx), new_track, opts)
    // figureStore.tracks = new_tracks
    return new_tracks
  }

  function addMultiplePartialTracks(partical_tracks: Partial<ITrack>[], ctx: MaybeRef<ITrack[]>, direction: ('in' | 'out') = 'out', opts: { width?: number, innerRadius: number, outerRadius: number }) {
    const partical_tracks_config = partical_tracks.map(track => smartMerge(track, ctx, direction, opts))
    let tracks = unref(ctx)
    for (const track of partical_tracks_config)
      tracks = adjustRadius(tracks, track, opts)
    return tracks
  }

  return {
    smartMerge,
    addPartialTrack,
    addMultiplePartialTracks,
  }
}
