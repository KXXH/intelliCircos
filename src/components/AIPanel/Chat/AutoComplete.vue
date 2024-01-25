<script setup lang="ts">
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
} from '@/components/ui/card'

interface Command {
  name: string
  description: string
  shortcut?: string
}

const input = ref<HTMLInputElement | null>(null)

const value = ref('')
const commands: Command[] = [
  {
    name: '/explain',
    description: 'Explain recommendation result',
  },
  {
    name: '/recommend',
    description: 'Recommend a new item',
  },
]
const results = ref<Command[]>([])
const activeIndex = ref(-1)

function update(event: InputEvent) {
  if (event.inputType === 'deleteContentBackward' || value.value.endsWith(' ') || value.value.length === 0) {
    results.value = []
    return
  }

  const cursorPosition = input.value?.selectionStart ?? 0
  const subText = value.value.substring(0, cursorPosition)
  const tokens = subText.split(' ')
  const lastToken = tokens[tokens.length - 1]
  results.value = commands.filter(command =>
    command.name.startsWith(lastToken),
  )
  activeIndex.value = -1
}

function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, -1)
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    if (activeIndex.value === -1)
      return

    const command = results.value[activeIndex.value]
    const cursorPosition = input.value?.selectionStart ?? 0
    const subText = value.value.substring(0, cursorPosition)
    const tokens = subText.split(' ')
    tokens[tokens.length - 1] = command.name
    value.value = tokens.join(' ')
    results.value = []
    activeIndex.value = -1
  }
}
</script>

<template>
  <div flex="~ col" gap="2">
    <Transition
      enter-active-class="transition ease-in-out duration-200"
      enter-from-class="opacity-0 transform translate-y-1"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in-out duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 transform translate-y-1"
    >
      <Card
        v-if="results.length > 0" class="p-1 divide-y"
      >
        <div
          v-for="(result, idx) in results" :key="result.name"

          py-1 text-xs first:pt-0 last:pb-0
        >
          <div
            transition="colors ease"
            :class="{
              'bg-muted': idx === activeIndex,
            }"
            flex rounded-md p-2
          >
            <pre>{{ result.name }}</pre>
            <div flex="~ 1" />
            <span>{{ result.description }}</span>
          </div>
        </div>
      </Card>
    </Transition>
    <div flex="~ row" h-80px items-center gap-1 border rounded-md px-3 py-3>
      <textarea
        ref="input" v-model="value" h-full flex-1 resize-none
        class="w-full flex rounded-md bg-transparent text-sm outline-none disabled:cursor-not-allowed placeholder:text-muted-foreground disabled:opacity-50"
        @input="(payload) => update(payload as InputEvent)"
        @keydown="keydown"
      />
      <Button size="icon" variant="default">
        <Send class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
