<script setup lang="ts">
import { inject, provide } from 'vue'
import { FormInjectKey } from '.'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

withDefaults(defineProps<{
  name: string
  label: string
  description: string
  type?: string
}>(), {
  type: 'string',
})
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Input v-bind="componentField" :type="type" />
      </FormControl>
      <FormDescription>
        {{ description }}
        {{ JSON.stringify(componentField, null, 2) }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
