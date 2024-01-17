<script setup lang="ts">
import { ref } from 'vue'
import SettingsPanel from './SettingsPanel.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

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
  <SettingsPanel panel-title="General Settings" v-model:open="isOpen">
    <form @submit.prevent="onSubmit" class="space-y-2">
        <FormField v-slot="{ componentField }" name="figureSize" >
          <FormItem>
            <FormLabel>Figure Size</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number"/>
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