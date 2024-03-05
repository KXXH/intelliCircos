<script setup lang="ts">
import { type Ref, computed, toRaw, toRef } from 'vue'
import type { string, z } from 'zod'
import GeneralSettings from './GeneralSettings.vue'
import Form from './Tracks/FormComponents/Form.vue'
import { FormFieldTypes } from './Tracks/FormComponents'
import { useFigureStore } from '@/stores/figure'
import { HighlightConfig, LineConfig, ScatterConfig } from '@/schema/circosSchema'
import type { ITrackConfig } from '@/lib/circos'

const figure = useFigureStore()
const formAttrs = computed(() => {
  return figure.tracks.map((track) => {
    const modelVal = track.config
    // const modelVal = track.config
    const schema = {
      line: LineConfig,
      scatter: ScatterConfig,
      highlight: HighlightConfig,
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
      modelVal,
      formTitle,
      typeMap,
      optionBindings,
      id: track.id,
    }
  }).filter(attrs => attrs.schema)
})

// const lineConfigTest = ref<z.infer<typeof LineConfig> & Record<string, any>>({
//   innerRadius: 0,
//   outerRadius: 100,
//   opacity: 1,
//   min: 0,
//   max: 100,
//   logScale: false,
//   logScaleBase: '10',
//   direction: 'out',
//   showAxesTooltip: true,
//   color: '#000000',
//   fillColor: '#000000',
//   thickness: 1,
//   fill: false,
// })
</script>

<template>
  <div class="">
    <GeneralSettings />
    <!-- <Form
      v-model="lineConfigTest" :schema="LineConfig" form-title="Line" :type-map="{
        color: FormFieldTypes.COLOR,
        fillColor: FormFieldTypes.COLOR,
        opacity: FormFieldTypes.SLIDER,
      }" :option-bindings="{
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
      }"
    /> -->
    <Form v-for="attrs in formAttrs" :key="attrs.formTitle" :model-value="attrs.modelVal" :schema="attrs.schema" :form-title="attrs.formTitle" :type-map="attrs.typeMap" :option-bindings="attrs.optionBindings" @update:model-value="(val: Ref<Partial<ITrackConfig>>) => figure.updateTrack(attrs.id, toRaw(val))" />
  </div>
</template>
