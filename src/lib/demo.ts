import { onMounted } from 'vue'
import { csvParse } from 'd3'
import { useFigureStore } from '@/stores/figure'
import { useDataStore } from '@/stores/data'
import { generateCategorialPalette } from '@/lib/palette'
import GRCh37Raw from '@/lib/circosJS/demo/data/GRCh37.json'
import cytobandsRaw from '@/lib/circosJS/demo/data/cytobands.csv?raw'
import snp250Raw from '@/lib/circosJS/demo/data/snp.density.250kb.txt?raw'
import snpRaw from '@/lib/circosJS/demo/data/snp.density.txt?raw'
import snp1mRaw from '@/lib/circosJS/demo/data/snp.density.1mb.txt?raw'
import fusionGenesRaw from '@/lib/circosJS/demo/data/fusion-genes.csv?raw'
import esRaw from '@/lib/circosJS/demo/data/es.csv?raw'
import segdupRaw from '@/lib/circosJS/demo/data/segdup.csv?raw'
// import ipsRaw from '@/lib/circosJS/demo/data/ips.csv?raw'

export function initDemoData() {
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
  const fusionGenes = csvParse(fusionGenesRaw).filter((d) => {
    return (d.source_id === 'chr1' || d.source_id === 'chr2' || d.source_id === 'chr3') && (d.target_id === 'chr1' || d.target_id === 'chr2' || d.target_id === 'chr3')
  }).map(function (d) {
    return {
      source: {
        id: d.source_id,
        start: parseInt(d.source_breakpoint) - 2000000,
        end: parseInt(d.source_breakpoint) + 2000000
      },
      target: {
        id: d.target_id,
        start: parseInt(d.target_breakpoint) - 2000000,
        end: parseInt(d.target_breakpoint) + 2000000
      }
    }
  })
  const es = csvParse(esRaw).filter((d) => {
    return d.chr === 'chr1' || d.chr === 'chr2' || d.chr === 'chr3'
  }).map((d) => {
    return {
      block_id: d.chr,
      start: d.start,
      end: d.end,
      value: Math.floor(Math.random() * 300) + 1,
    }
  })
  const segdup = csvParse(segdupRaw).filter((d) => {
    return d.chr === 'chr1' || d.chr === 'chr2' || d.chr === 'chr3'
  }).filter(function(d) {
    return d.end - d.start > 700000
  }).map(function(d) {
    return {
      block_id: d.chr,
      start: d.start,
      end: d.end,
    }
  })
  // console.log(segdup)

  onMounted(() => {
    const dataStore = useDataStore()
    const palette = generateCategorialPalette(undefined, true)
    dataStore.files = [
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
      {
        filename: 'fusion-genes.csv',
        name: 'fusion-genes',
        type: 'attachment',
        color: palette.next().value!,
        content: fusionGenes,
      },
      {
       filename: 'es.csv',
        name: 'es',
        type: 'attachment',
        color: palette.next().value!,
        content: es,
      },
      {
        filename: 'segdup.csv',
         name: 'segdup',
         type: 'attachment',
         color: palette.next().value!,
         content: segdup,
      },
    ]

    const gieStainColor: Record<string, string> = {
      gpos100: 'rgb(0,0,0)',
      gpos: 'rgb(0,0,0)',
      gpos75: 'rgb(130,130,130)',
      gpos66: 'rgb(160,160,160)',
      gpos50: 'rgb(200,200,200)',
      gpos33: 'rgb(210,210,210)',
      gpos25: 'rgb(200,200,200)',
      gvar: 'rgb(220,220,220)',
      gneg: 'rgb(255,255,255)',
      acen: 'rgb(217,47,39)',
      stalk: 'rgb(100,127,164)',
      select: 'rgb(135,177,255)',
    }
    const figureStore = useFigureStore()
    figureStore.tracks = [{
      config: {
        innerRadius: figureStore.width / 2 - 100,
        outerRadius: figureStore.width / 2 - 80,
        labels: { display: false },
        ticks: { display: false },
      },
      data: dataStore.files.find(item => item.name === 'GRCh37')!,
      type: 'layout',
      id: 'GRCh37',
    }, {
      config: {
        innerRadius: figureStore.width / 2 - 100,
        outerRadius: figureStore.width / 2 - 80,
        opacity: 0.3,
        color(d: any) {
          return gieStainColor[d.gieStain]
        },
        tooltipContent(d: any) {
          return d.name
        },
      },
      data: dataStore.files.find(item => item.name === 'cytobands')!,
      type: 'highlight',
      id: 'cytobands',
    }, {
      config: {
        innerRadius: 0.5,
        outerRadius: 0.8,
        maxGap: 1000000,
        min: 0,
        max: 0.015,
        color: '#222222',
        axes: [
          {
            spacing: 0.001,
            thickness: 1,
            color: '#666666',
          },
        ],
        backgrounds: [
          {
            start: 0,
            end: 0.002,
            color: '#f44336',
            opacity: 0.5,
          },
          {
            start: 0.006,
            end: 0.015,
            color: '#4caf50',
            opacity: 0.5,
          },
        ],
        tooltipContent: null,
      },
      data: dataStore.files.find(item => item.name === 'snp250')!,
      type: 'line',
      id: 'snp-250',
    }, {
      config: {
        innerRadius: 0.5,
        outerRadius: 0.8,
        min: 0,
        max: 0.015,
        fill: false,
        strokeWidth: 0,
        tooltipContent(d: any) {
          return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
        },
      },
      data: dataStore.files.find(item => item.name === 'snp250')!,
      type: 'scatter',
      id: 'snp-250-tooltip',
    }, {
      config: {
        innerRadius: 1.01,
        outerRadius: 1.15,
        maxGap: 1000000,
        min: 0,
        max: 0.015,
        color: '#222222',
        axes: [
          {
            position: 0.002,
            color: '#f44336',
          },
          {
            position: 0.006,
            color: '#4caf50',
          },
        ],
        tooltipContent: null,
      },
      data: dataStore.files.find(item => item.name === 'snp')!,
      type: 'line',
      id: 'snp',
    }, {
      config: {
        innerRadius: 1.01,
        outerRadius: 1.15,
        maxGap: 1000000,
        min: 0,
        max: 0.015,
        color: '#f44336',
        tooltipContent: null,
      },
      data: dataStore.files.find(item => item.name === 'snp1m')!,
      type: 'line',
      id: 'snp1m',
    }, {
      config: {
        innerRadius: 0.85,
        outerRadius: 0.95,
        maxGap: 1000000,
        direction: 'in',
        min: 0,
        max: 0.015,
        color: '#222222',
        axes: [
          {
            position: 0.01,
            color: '#4caf50',
          },
          {
            position: 0.008,
            color: '#4caf50',
          },
          {
            position: 0.006,
            color: '#4caf50',
          },
          {
            position: 0.002,
            color: '#f44336',
          },
        ],
        tooltipContent: null,
      },
      data: dataStore.files.find(item => item.name === 'snp')!,
      type: 'line',
      id: 'snp-in',
    }, {
      config: {
        innerRadius: 0.85,
        outerRadius: 0.95,
        maxGap: 1000000,
        direction: 'in',
        min: 0,
        max: 0.015,
        color: '#f44336',
        tooltipContent: null,
      },
      data: dataStore.files.find(item => item.name === 'snp1m')!,
      type: 'line',
      id: 'snp1m-in',
    }]
  })
}
