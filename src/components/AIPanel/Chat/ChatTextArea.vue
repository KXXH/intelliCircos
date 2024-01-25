<script setup lang="ts">
import { Send } from 'lucide-vue-next'
import { ComboboxAnchor } from 'radix-vue'
import { ref } from 'vue'
import AutoComplete from './AutoComplete.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

// const listOpen = ref(false)
// const value = ref('')
</script>

<template>
  <AutoComplete w-full />
</template>

<style scoped>

</style>
