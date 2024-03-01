<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SelectOption {
  label?: string
  value: any
}
withDefaults(defineProps<{
  name: string
  label: string
  description: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}>(), {
  placeholder: 'Select an option',
  disabled: false,
})
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Select v-bind="componentField" :disabled="disabled">
          <SelectTrigger>
            <SelectValue :placeholder="placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label ?? option.value }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
