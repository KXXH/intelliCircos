<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  choices: {
    label?: string
    value: string
  }[]
}>()
const value = defineModel<string>()
</script>

<template>
  <Select v-model="value">
    <SelectTrigger>
      <SelectValue placeholder="Select data type" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="choice in props.choices" :key="choice.value" :value="choice.value">
          {{ choice.label ?? choice.value }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<style scoped>

</style>
