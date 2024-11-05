<script setup lang="ts" generic="T extends ZodObject<any, any, any>">
import { Form, useForm } from 'vee-validate'
import { ZodBoolean, ZodEnum, ZodNumber, ZodString } from 'zod'
import type { ZodObject, ZodTypeAny, z } from 'zod'
import { cloneDeep, startCase } from 'lodash-es'
import { computed, nextTick, ref, toRaw, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { watchPausable } from '@vueuse/core'
import SettingsPanel from '../../SettingsPanel.vue'
import FormNumber from './FormNumber.vue'
import FormSlider from './FormSlider.vue'
import FormSwitch from './FormSwitch.vue'
import FormSelect from './FormSelect.vue'
import FormColorPicker from './FormColorPicker.vue'
import FormInput from './FormInput.vue'
import DataSelect from './DataSelect.vue'
import { FormFieldTypes, FormInjectKey } from './index'

const props = withDefaults(defineProps<{
  schema: T
  titleMap?: Record<string, string>
  typeMap?: Record<string, FormFieldTypes>
  optionBindings?: Record<string, Record<string, any>>
  formTitle: string
  showDataSelect?: boolean
  attrsId?: string
}>(), {
  showDataSelect: true,
})

// Form and model value
const modelVal = defineModel<z.infer<T>>({
  required: true,
})
const _form = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: modelVal as any,
})
// watch(modelVal, () => {
//   // _form.setValues(toRaw(modelVal))
// })
const { pause: pauseFormWatch, resume: resumeFormWatch } = watchPausable(_form.values, () => {
  modelVal.value = toRaw(_form.values)
})

function getFieldType(schema: ZodObject<any, any, any>, key: string): FormFieldTypes {
  if (props.typeMap?.[key])
    return props.typeMap[key]

  function determineType(schema: ZodTypeAny): FormFieldTypes {
    if (schema instanceof ZodString)
      return FormFieldTypes.STRING

    if (schema instanceof ZodNumber)
      return FormFieldTypes.NUMBER

    if (schema instanceof ZodBoolean)
      return FormFieldTypes.BOOLEAN

    if (schema instanceof ZodEnum)
      return FormFieldTypes.ENUM

    if (schema._def.innerType)
      return determineType(schema._def.innerType)

    throw new Error(`Unknown type for field ${key}`)
  }
  return determineType(schema.shape[key])
}

const fieldTypes = computed(() => {
  const map: Record<string, FormFieldTypes> = {}
  for (const key in props.schema.shape)
    map[key] = getFieldType(props.schema, key)

  return map
})

const open = defineModel<boolean>('open', {
  default: false,
})
// fix for vee-validate to set field value to undefined issue
let _savedFormVal = _form.values
function onOpenStateChange(val: boolean) {
  if (!val) {
    _savedFormVal = cloneDeep(toRaw(_form.values))
    pauseFormWatch()
  }
  else {
    nextTick(() => {
      if (_form.values !== _savedFormVal) {
        _form.setValues(_savedFormVal)
        setTimeout(() => resumeFormWatch())
      }
    })
  }
}

const data = defineModel<string>('dataset') // data.name
</script>

<template>
  <SettingsPanel v-model:open="open" :panel-title="props.formTitle" @update:open="onOpenStateChange"
    :is-title-change="true" :attrs-id="props.attrsId!">
    <DataSelect v-if="props.showDataSelect" v-model="data" />
    <form space-y-3>
      <template v-for="key in Object.keys(props.schema.shape)" :key="key">
        <FormNumber v-if="fieldTypes[key] === FormFieldTypes.NUMBER" :label="props.titleMap?.[key] || startCase(key)"
          :name="key" :description="props.schema.shape[key].description ?? ''" v-bind="props.optionBindings?.[key]" />
        <FormColorPicker v-else-if="fieldTypes[key] === FormFieldTypes.COLOR"
          :label="props.titleMap?.[key] || startCase(key)" :name="key"
          :description="props.schema.shape[key].description ?? ''" v-bind="props.optionBindings?.[key]" />
        <FormSlider v-else-if="fieldTypes[key] === FormFieldTypes.SLIDER"
          :label="props.titleMap?.[key] || startCase(key)" :name="key"
          :description="props.schema.shape[key].description ?? ''" v-bind="props.optionBindings?.[key]" />
        <FormSwitch v-else-if="fieldTypes[key] === FormFieldTypes.BOOLEAN"
          :label="props.titleMap?.[key] || startCase(key)" :name="key"
          :description="props.schema.shape[key].description ?? ''" v-bind="props.optionBindings?.[key]" />
        <FormSelect v-else-if="fieldTypes[key] === FormFieldTypes.ENUM" :label="props.titleMap?.[key] || startCase(key)"
          :name="key" :description="props.schema.shape[key].description ?? ''"
          :options="props.optionBindings![key].options" v-bind="props.optionBindings?.[key]" />
        <FormInput v-else :label="props.titleMap?.[key] || startCase(key)"
          :description="props.schema.shape[key].description ?? ''" :name="key" v-bind="props.optionBindings?.[key]" />
      </template>
    </form>
  </settingspanel>
</template>
