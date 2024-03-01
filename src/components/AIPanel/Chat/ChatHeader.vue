<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CardTitle } from '@/components/ui/card'
import { useChat } from '@/lib/ai/client'

const { reset } = useChat()
</script>

<template>
  <div flex flex-row items-center justify-between>
    <CardTitle>Agent</CardTitle>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button class="rounded-full" size="icon" variant="ghost" @click="reset">
          <RotateCcw class="h-4 w-4" :stroke-width="2" />
          <span className="sr-only">Reset Chat</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p text-muted font-bold>
          Reset Chat
        </p>
        <p>
          This will clear the chat history for the current user.
        </p>
      </TooltipContent>
    </Tooltip>
  </div>
</template>
