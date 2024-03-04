<script setup lang="ts">
import { csvParse } from 'd3'
import { onMounted, ref } from 'vue'
import GRCh37Raw from '@/lib/circosJS/demo/data/GRCh37.json'
import cytobandsRaw from '@/lib/circosJS/demo/data/cytobands.csv?raw'
import snp250Raw from '@/lib/circosJS/demo/data/snp.density.250kb.txt?raw'
import snpRaw from '@/lib/circosJS/demo/data/snp.density.txt?raw'
import snp1mRaw from '@/lib/circosJS/demo/data/snp.density.1mb.txt?raw'
import { useFigureStore } from '@/stores/figure'
import { Circos } from '@/lib/circosJS/dist/circos.module'
import type { ITrack } from '@/lib/circos'

// const { Circos } = circosJS
const figure = useFigureStore()
const el = ref<HTMLElement>()
async function render(config: ITrack[]) {
  onMounted(() => {
    const circos = Circos({
      container: el.value,
    })
    config.forEach((track) => {
      if (track.type === 'layout') {
        // @ts-expect-error 先忽略掉TS错
        circos.layout(track.data, track.config)
      }
      else {
        // @ts-expect-error 先忽略掉TS错
        circos[track.type](track.id, track.data, track.config)
      }
    })
    circos.render()
  })
}
render(figure.tracks)
</script>

<template>
  <div ref="el" h-full w-full flex="~ items-center content-center overflow-hidden" p-4 />
</template>
