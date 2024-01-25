<script setup lang="ts">
import { csvParse } from 'd3'
import { onMounted, ref } from 'vue'
import GRCh37Raw from '@/lib/circosJS/demo/data/GRCh37.json'
import cytobandsRaw from '@/lib/circosJS/demo/data/cytobands.csv?raw'
import snp250Raw from '@/lib/circosJS/demo/data/snp.density.250kb.txt?raw'
import snpRaw from '@/lib/circosJS/demo/data/snp.density.txt?raw'
import snp1mRaw from '@/lib/circosJS/demo/data/snp.density.1mb.txt?raw'

import { Circos } from '@/lib/circosJS/dist/circos.module'

// const { Circos } = circosJS

const el = ref<HTMLElement>()

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

const GRCh37 = GRCh37Raw.filter((d) => {
  return d.id === 'chr1' || d.id === 'chr2' || d.id === 'chr3'
})
const cytobands = csvParse(cytobandsRaw).filter((d) => {
  return d.chrom === 'chr1' || d.chrom === 'chr2' || d.chrom === 'chr3'
})
  .map((d) => {
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

onMounted(() => {
  const width = 500
  const circosLine = Circos({
    container: el.value,
  })
  circosLine
    .layout(
      GRCh37,
      {
        innerRadius: width / 2 - 100,
        outerRadius: width / 2 - 80,
        labels: { display: false },
        ticks: { display: false },
      },
    )
    .highlight('cytobands', cytobands, {
      innerRadius: width / 2 - 100,
      outerRadius: width / 2 - 80,
      opacity: 0.3,
      color(d) {
        return gieStainColor[d.gieStain]
      },
      tooltipContent(d) {
        return d.name
      },
    })
    .line('snp-250', snp250, {
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
    })
    .scatter('snp-250-tooltip', snp250, {
      innerRadius: 0.5,
      outerRadius: 0.8,
      min: 0,
      max: 0.015,
      fill: false,
      strokeWidth: 0,
      tooltipContent(d) {
        return `${d.block_id}:${Math.round(d.position)} ➤ ${d.value}`
      },
    })
    .line('snp', snp, {
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
    })
    .line('snp1m', snp1m, {
      innerRadius: 1.01,
      outerRadius: 1.15,
      maxGap: 1000000,
      min: 0,
      max: 0.015,
      color: '#f44336',
      tooltipContent: null,
    })
    .line('snp-in', snp, {
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
    })
    .line('snp1m-in', snp1m, {
      innerRadius: 0.85,
      outerRadius: 0.95,
      maxGap: 1000000,
      direction: 'in',
      min: 0,
      max: 0.015,
      color: '#f44336',
      tooltipContent: null,
    })
    .render()
})
</script>

<template>
  <div ref="el" h-full w-full flex="~ items-center content-center" p-4 />
</template>
