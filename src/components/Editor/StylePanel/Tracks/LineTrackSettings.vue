<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { ref, toRefs } from 'vue'
import type { z } from 'zod'
import { Equal } from 'lucide-vue-next'
import type { LineConfig as LineConfigType } from 'circos/trackConfig'
import { syncRef } from '@vueuse/core'
import type { DeepPartial } from 'utility-types'
import SettingsPanel from '../SettingsPanel.vue'
import FormNumber from './FormComponents/FormNumber.vue'
import FormSlider from './FormComponents/FormSlider.vue'
import FormSwitch from './FormComponents/FormSwitch.vue'
import FormSelect from './FormComponents/FormSelect.vue'
import FormColorPicker from './FormComponents/FormColorPicker.vue'
import { LineConfig } from '@/schema/circosSchemaNew'

// type a = typeof form.values
// type b = typeof val
// type c = typeof formVal
const props = defineProps<{
  schema: z.infer<typeof LineConfig>
}>()
// const fieldTypeMap = computed(()=>{
//   const map: Record<string, string> = {}
// })
// const props = defineProps < LineConfigType >()
const typedSchema = toTypedSchema(LineConfig)
const form = useForm({
  validationSchema: typedSchema,
  initialValues: {
    innerRadius: 0,
    outerRadius: 100,
    opacity: 1,
    min: 0,
    max: 100,
    logScale: false,
    logScaleBase: 10,
    direction: 'out',
    showAxesTooltip: true,
    color: '#000000',
  },
  // initialValues: props,
})
const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})

const open = defineModel<boolean>('open', {
  default: false,
})

const formVal = ref<DeepPartial<z.infer<typeof LineConfig>>>(form.values)
const modelVal = defineModel<
    DeepPartial<z.infer<typeof LineConfig>>
  >({
    required: true,
  })
setInterval(() => {
  console.log(LineConfig.shape)
}, 1000)
// console.log('form', form.values)
</script>

<template>
  <SettingsPanel v-model:open="open" panel-title="Line">
    <form space-y-3 @submit="onSubmit">
      <FormSwitch
        name="showAxesTooltip" label="Show axes tooltip"
        description="Whether the line track should show axes tooltip"
      />
      <FormNumber name="innerRadius" label="Inner radius" description="The inner radius of the line track" />
      <FormNumber name="outerRadius" label="Outer radius" description="The outer radius of the line track" />
      <FormSlider
        name="opacity" label="Opacity" description="The opacity of the line track" :min="0" :max="1"
        :step="0.05"
      />
      <FormNumber name="min" label="Axis min" description="The minimum value of the line track" />
      <FormNumber name="max" label="Axis max" description="The maximum value of the line track" />
      <FormSwitch name="[logScale]" label="Log scale" description="Whether the line track should use a log scale" />
      <FormSelect
        :disabled="!form.values.logScale" name="logScaleBase" label="Log scale base"
        description="The base of the log scale" :options="[
          { value: 2, label: '2' },
          { value: 10, label: '10' },
        ]" placeholder="Select a base"
      />
      <FormSelect
        name="direction" label="Direction" description="The direction of the line track" :options="[
          { value: 'in', label: 'In' },
          { value: 'out', label: 'Out' },
        ]"
      />
      <FormColorPicker name="color" label="Color" description="The color of the line track" type="color" />
      <FormSwitch name="fill" label="Fill" description="Whether the line track should be filled" />
      <FormColorPicker name="fillColor" label="Fill Color" description="The fill color of the line track" type="color" />
      <FormNumber name="thickness" label="Thickness" description="The thickness of the line track" />
    </form>
  </SettingsPanel>
</template>

<style scoped></style>
@/schema/circosSchema