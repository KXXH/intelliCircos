<script setup lang="ts">
import { type Ref, computed, toRaw, toRef } from 'vue'
import type { string, z } from 'zod'
import GeneralSettings from './GeneralSettings.vue'
import Form from './Tracks/FormComponents/Form.vue'
import { FormFieldTypes } from './Tracks/FormComponents'
import { useFigureStore } from '@/stores/figure'
import { HighlightConfig, LineConfig, ScatterConfig, HistogramConfig, ChordConfig, HeatmapConfig, StackConfig } from '@/schema/circosSchema'
import type { ITrackConfig } from '@/lib/circos'
import { useDataStore } from '@/stores/data'
import { fixConfig } from '@/lib/circos/configFix'

const figure = useFigureStore()
const data = useDataStore()
const formAttrs = computed(() => {
  // console.log('formAttrs Change!')
  return figure.tracks.map((track) => {
    console.log(figure.tracks)
    const modelVal = track.config
    const dataset = track.data
    // const modelVal = track.config
    const schema = {
      line: LineConfig,
      scatter: ScatterConfig,
      highlight: HighlightConfig,
      histogram: HistogramConfig,
      chord: ChordConfig,
      heatmap: HeatmapConfig,
      stack: StackConfig,
    }[track.type]
    const formTitle = `${track.type} ${track.id}`
    const typeMap = {
      color: FormFieldTypes.COLOR,
      fillColor: FormFieldTypes.COLOR,
      opacity: FormFieldTypes.SLIDER,
    }
    const optionBindings = {
      logScaleBase: {
        options: [
          {
            label: '2',
            value: '2',
          },
          {
            label: '10',
            value: '10',
          },
        ],
      },
      direction: {
        options: [
          {
            label: 'in',
            value: 'in',
          },
          {
            label: 'out',
            value: 'out',
          },
        ],
      },
      opacity: {
        min: 0,
        max: 1,
        step: 0.01,
      },
    }
    return {
      schema,
      dataset,
      modelVal,
      formTitle,
      typeMap,
      optionBindings,
      id: track.id,
    }
  }).filter(attrs => attrs.schema)
})

function onDatasetNameChange(id: string, newName: string) {
  const newFileObj = data.files.find(v => v.name === newName)
  if (!newFileObj)
    return
  figure.updateTrackData(id, newFileObj)
}

function onConfigChange(id: string, val: Partial<ITrackConfig>) {
  figure.updateTrackConfig(id, fixConfig(val))
}
</script>

<template>
  <div class="">
    <GeneralSettings />
    <Form
      v-for="attrs in formAttrs" :key="attrs.formTitle" :model-value="attrs.modelVal" :schema="attrs.schema" :attrsId="attrs.id"
      :form-title="attrs.formTitle" :type-map="attrs.typeMap" :option-bindings="attrs.optionBindings" :dataset="attrs.dataset.name"
      @update:model-value="(val: Ref<Partial<ITrackConfig>>) => {
        onConfigChange(attrs.id, toRaw(val))
        // console.log('config change!')
      }"
      @update:dataset="(val: string) => onDatasetNameChange(attrs.id, val)"
    />
  </div>
</template>
