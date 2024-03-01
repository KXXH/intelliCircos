<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import SettingsPanel from '../SettingsPanel.vue'
import FormNumber from './FormComponents/FormNumber.vue'
import FormSlider from './FormComponents/FormSlider.vue'
import FormSwitch from './FormComponents/FormSwitch.vue'
import FormSelect from './FormComponents/FormSelect.vue'
import FormColorPicker from './FormComponents/FormColorPicker.vue'
import { ScatterConfig } from '@/schema/circosSchema'

const typedSchema = toTypedSchema(ScatterConfig)
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
  },
})
const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})

const open = defineModel<boolean>('open', {
  default: false,
})
</script>

<template>
  <SettingsPanel
    v-model:open="open"
    panel-title="Scatter"
  >
    <form space-y-3 @submit="onSubmit">
      <FormNumber name="innerRadius" label="Inner radius" description="The inner radius of the scatter track" />
      <FormNumber name="outerRadius" label="Outer radius" description="The outer radius of the scatter track" />
      <FormSlider name="opacity" label="Opacity" description="The opacity of the scatter track" :min="0" :max="1" :step="0.05" />
      <FormNumber name="min" label="Axis min" description="The minimum value of the scatter track" />
      <FormNumber name="max" label="Axis max" description="The maximum value of the scatter track" />
      <FormSwitch name="[logScale]" label="Log scale" description="Whether the scatter track should use a log scale" />
      <FormSelect
        :disabled="!form.values.logScale"
        name="logScaleBase"
        label="Log scale base"
        description="The base of the log scale"
        :options="[
          { value: 2, label: '2' },
          { value: 10, label: '10' },
        ]"
        placeholder="Select a base"
      />
      <FormSelect
        name="direction" label="Direction" description="The direction of the scatter track" :options="[
          { value: 'in', label: 'In' },
          { value: 'out', label: 'Out' },
        ]"
      />
      <FormColorPicker name="color" label="Color" description="The color of the scatter track" type="color" />
      <FormSwitch name="fill" label="Fill" description="Whether the scatter track should be filled" />
      <FormNumber name="size" label="Size" description="The size of the scatter track" />
      <FormSelect
        name="shape" label="Shape" description="The shape of the scatter track" :options="[
          { value: 'circle', label: 'Circle' },
          { value: 'square', label: 'Square' },
        ]"
      />
      <FormColorPicker name="strokeColor" label="Stroke color" description="The stroke color of the scatter track" type="color" />
      <FormNumber name="strokeWidth" label="Stroke width" description="The stroke width of the scatter track" />
    </form>
  </SettingsPanel>
</template>

<style scoped>

</style>
