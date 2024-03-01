<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'

defineProps<{
  name: string
  label: string
  description: string
}>()
</script>

<template>
  <FormField v-slot="{ value, handleChange }" :name="name">
    <FormItem class="flex flex-row items-center justify-between">
      <div space-y-0.5>
        <FormLabel>{{ label }}</FormLabel>
        <FormDescription>
          {{ description }}
        </FormDescription>
      </div>
      <FormControl>
        <Switch :checked="value" @update:checked="handleChange" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
