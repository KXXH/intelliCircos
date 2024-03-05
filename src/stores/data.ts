import { defineStore } from 'pinia'
import { csvParse } from 'd3'
import { computed, ref } from 'vue'
import { generateCategorialPalette } from '@/lib/palette'

import GRCh37Raw from '@/lib/circosJS/demo/data/GRCh37.json'
import cytobandsRaw from '@/lib/circosJS/demo/data/cytobands.csv?raw'
import snp250Raw from '@/lib/circosJS/demo/data/snp.density.250kb.txt?raw'
import snpRaw from '@/lib/circosJS/demo/data/snp.density.txt?raw'
import snp1mRaw from '@/lib/circosJS/demo/data/snp.density.1mb.txt?raw'

const GRCh37 = GRCh37Raw.filter((d) => {
  return d.id === 'chr1' || d.id === 'chr2' || d.id === 'chr3'
})
const cytobands = csvParse(cytobandsRaw).filter((d) => {
  return d.chrom === 'chr1' || d.chrom === 'chr2' || d.chrom === 'chr3'
}).map((d) => {
  return {
    block_id: d.chrom,
    start: Number.parseInt(d.chromStart),
    end: Number.parseInt(d.chromEnd),
    gieStain: d.gieStain,
    name: d.name,
  }
})

const snp250 = csvParse(snp250Raw).map((d) => {
  return {
    block_id: d.chromosome,
    position: (Number.parseInt(d.start) + Number.parseInt(d.end)) / 2,
    value: +d.value,
  }
})

const snp = csvParse(snpRaw).map((d) => {
  return {
    block_id: d.chromosome,
    position: (Number.parseInt(d.start) + Number.parseInt(d.end)) / 2,
    value: +d.value,
  }
})
const snp1m = csvParse(snp1mRaw).map((d) => {
  return {
    block_id: d.chromosome,
    position: (Number.parseInt(d.start) + Number.parseInt(d.end)) / 2,
    value: +d.value,
  }
})

export interface CircosDataFile {
  filename: string
  name: string
  content: Record<string, any>[]
  type: 'karyotype' | 'attachment'
  color?: string
}

export const useDataStore = defineStore('data', () => {
  const palette = generateCategorialPalette(undefined, true)
  const files = ref<CircosDataFile[]>([
    {
      filename: 'GRCh37.json',
      name: 'GRCh37',
      content: GRCh37,
      type: 'karyotype',
      color: palette.next().value!,
    },
    {
      filename: 'cytobands.csv',
      name: 'cytobands',
      content: cytobands,
      color: palette.next().value!,
      type: 'attachment',
    },
    {
      filename: 'snp.density.250kb.txt',
      name: 'snp250',
      content: snp250,
      color: palette.next().value!,
      type: 'attachment',
    },
    {
      filename: 'snp.density.txt',
      name: 'snp',
      type: 'attachment',
      color: palette.next().value!,
      content: snp,
    },
    {
      filename: 'snp.density.1mb.txt',
      name: 'snp1m',
      type: 'attachment',
      color: palette.next().value!,
      content: snp1m,
    },
  ])
  const addFile = (file: File, type: ('attachment' | 'karyotype') = 'attachment') => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        if (file.type === 'application/json') {
          const content = JSON.parse(e.target.result as string)
          files.value.push({
            filename: file.name,
            name: file.name.split('.')[0],
            content,
            color: palette.next().value!,
            type,
          })
        }
        else if (file.type === 'text/csv' || file.type
          === 'text/plain') {
          const content = csvParse(e.target.result as string)
          files.value.push({
            filename: file.name,
            name: file.name.split('.')[0],
            content,
            color: palette.next().value!,
            type,
          })
        }
        else {
          throw new Error(`Unsupported file type. Expected .json, .csv, or .txt, got ${file.type}`)
        }
      }
      else {
        throw new Error('Failed to read file (Unknown Error).')
      }
    }
    reader.readAsText(file)
  }
  const removeFile = (filename: string) => {
    const index = files.value.findIndex(f => f.filename === filename)
    if (index > -1)
      files.value.splice(index, 1)
  }
  const addKaryotype = (file: File) => {
    addFile(file, 'karyotype')
  }
  const addAttachment = (file: File) => {
    addFile(file, 'attachment')
  }

  const karyotypes = computed(() => {
    return files.value.filter(f => f.type === 'karyotype')
  })

  const attachments = computed(() => {
    return files.value.filter(f => f.type === 'attachment')
  })

  return {
    files,
    karyotypes,
    attachments,
    addFile,
    addKaryotype,
    addAttachment,
    removeFile,
  }
})
