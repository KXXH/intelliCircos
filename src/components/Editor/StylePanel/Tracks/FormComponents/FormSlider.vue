<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Slider } from '@/components/ui/slider'

defineProps<{
  name: string
  label: string
  description: string
  min?: number
  max?: number
  step?: number
}>()
</script>

<template>
  <FormField v-slot="{ value, handleChange }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Slider
          type="number"
          :model-value="[value]"
          :min="min"
          :max="max"
          :step="step"
          @update:model-value="(v) => handleChange(v?.[0])"
        />
      </FormControl>
      <FormDescription>
        {{ description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
