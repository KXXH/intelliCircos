<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CardTitle } from '@/components/ui/card'
import { RotateCcw } from 'lucide-vue-next'

</script>

<template>
  <div     flex flex-row items-center justify-between >
    <CardTitle>Agent</CardTitle>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" class="rounded-full" size="icon">
            <RotateCcw class="h-4 w-4" />
            <span className="sr-only">Reset Chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p   text-muted font-bold >
            Reset Chat
          </p>
          <p>
            This will clear the chat history for the current user.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

