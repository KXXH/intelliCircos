<script setup lang="ts">
import { ref } from 'vue'
// import { useForm } from 'vee-validate'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
// import { toTypedSchema } from '@vee-validate/zod'
// import { z } from 'zod'

const isOpen = ref(true)



// const generalSettingSchema = toTypedSchema(z.object({
//   // figureSize: z.number().min(0).max(100).default(50),
// }))

// const form = useForm({
//   validationSchema: generalSettingSchema,
// })

// const onSubmit = form.handleSubmit((values) => {
//   console.log('Form submitted!', values)
// })
const onSubmit = () => {}
</script>

<template>
  <Collapsible v-model:open="isOpen" class="w-full space-y-2">
    <div class="flex items-center justify-between px-4 space-x-4">
      <h4 text-sm font-semibold>
        General Settings
      </h4>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" class="w-9 p-0">
          <Transition leave-active-class="transition duration-300 ease-in-out transform" leave-from-class="rotate-0"
            leave-to-class="rotate-180" mode="out-in">
            <ChevronUp v-if="isOpen" class="h-4 w-4" />
            <ChevronDown v-else class="h-4 w-4" />
          </Transition>
          <span class="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <Separator />
    <CollapsibleContent class="space-y-2">
      <!-- <form @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="figureSize">
          <FormItem>
            <FormLabel>Figure Size</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormDescription>
              The size of the figure in percentage
            </FormDescription>
            <FormMessage />
          </FormItem>

        </FormField>
      </form> -->
    </CollapsibleContent>
  </Collapsible>
</template>

<style scoped>
.CollapsibleContent {
  overflow: hidden;
}

.CollapsibleContent[data-state="open"] {
  animation: slideDown 300ms ease-out;
}

.CollapsibleContent[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}

@keyframes slideDown {
  from {
    height: 0;
    @apply py-0;
    @apply border-0;
  }

  10% {
    @apply border;
  }

  to {
    height: var(--radix-collapsible-content-height);
    @apply py-3;
    @apply border;
  }
}

@keyframes slideUp {
  from {
    height: var(--radix-collapsible-content-height);
    @apply py-3;
    @apply border;
  }

  80% {
    @apply border-0;
  }

  to {
    height: 0;
    @apply py-0;
    @apply border-0;
  }
}
</style>
