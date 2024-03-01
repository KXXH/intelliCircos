<script setup lang="ts">
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
        <div class="flex flex-row gap-2">
          <Input class="flex-1" v-bind="componentField" type="color" />
          <!-- <Input class="flex-1" v-bind="componentField" type="text" /> -->
        </div>
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
