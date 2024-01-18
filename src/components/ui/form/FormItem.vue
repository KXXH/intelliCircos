<script lang="ts">
import type { InjectionKey } from 'vue'
</script>

<script lang="ts" setup>
import { provide } from 'vue'
import { useId } from 'radix-vue'
import { cn } from '@/lib/utils'

// eslint-disable-next-line vue/no-export-in-script-setup
export const FORM_ITEM_INJECTION_KEY
  // eslint-disable-next-line symbol-description
  = Symbol() as InjectionKey<string>

const id = useId()
provide(FORM_ITEM_INJECTION_KEY, id)
</script>

<template>
  <div :class="cn('space-y-2', $attrs.class ?? '')">
    <slot />
  </div>
</template>
