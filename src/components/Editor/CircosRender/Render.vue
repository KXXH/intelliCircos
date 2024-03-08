<script setup lang="ts">
import { csvParse } from 'd3'
import { onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import GRCh37Raw from '@/lib/circosJS/demo/data/GRCh37.json'
import cytobandsRaw from '@/lib/circosJS/demo/data/cytobands.csv?raw'
import snp250Raw from '@/lib/circosJS/demo/data/snp.density.250kb.txt?raw'
import snpRaw from '@/lib/circosJS/demo/data/snp.density.txt?raw'
import snp1mRaw from '@/lib/circosJS/demo/data/snp.density.1mb.txt?raw'
import { useFigureStore } from '@/stores/figure'

import { Circos } from '@/lib/circosJS/dist/circos.module'

// import { Circos } from '@/lib/circosJS/src/circos'
import type { ITrack, RawCircosData } from '@/lib/circos'
import { useDataStore } from '@/stores/data'

// const { Circos } = circosJS
const figure = useFigureStore()
const dataStore = useDataStore()

let CircosInstance: ReturnType<typeof Circos> | undefined

const el = ref<HTMLElement>()
async function render(config: ITrack[], remove = false) {
  console.log('rendering')
  if (!CircosInstance) {
    CircosInstance = Circos({
      container: el.value,
    })
  }
  config.forEach(async (track) => {
    // get data
    let data: RawCircosData = []
    if (track.data) {
      if (typeof track.data === 'string')
        data = dataStore.files.find(file => file.name === track.data)?.content as RawCircosData
      else if (track.data instanceof Function)
        data = await track.data()
      else
        data = track.data
    }

    if (track.type === 'layout') {
      // @ts-expect-error 先忽略掉TS错
      CircosInstance.layout(data, track.config)
    }
    else {
      // @ts-expect-error 先忽略掉TS错
      CircosInstance[track.type](track.id, data, track.config)
    }
  })
  CircosInstance.render([], remove)
}
onMounted(() => {
  render(figure.tracks)
})
onMounted(() => {
  watchDebounced(() => figure.tracks, () => {
    render(figure.tracks, true)
  }, {
    debounce: 100,
  })
})
</script>

<template>
  <div ref="el" h-full w-full flex="~ items-center content-center" overflow-hidden p-4 class="dark:brightness-120 dark:invert-10" />
</template>
