<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import SettingsPanel from './SettingsPanel.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const isOpen = ref(true)

const generalSettingSchema = toTypedSchema(z.object({
  figureSize: z.number().min(0).max(100).default(50),
}))

const form = useForm({
  validationSchema: generalSettingSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <SettingsPanel v-model:open="isOpen" panel-title="General Settings">
    <form class="space-y-2" @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="figureSize">
        <FormItem>
          <FormLabel>Figure Size</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="number" />
          </FormControl>
          <FormDescription>
            The size of the figure in percentage
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" variant="default" size="sm" w-full>
        Save
      </Button>
    </form>
  </SettingsPanel>
</template>
