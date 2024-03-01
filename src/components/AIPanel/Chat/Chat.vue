<script setup lang="ts">
import { HumanMessage } from '@langchain/core/messages'
import ChatHeader from './ChatHeader.vue'
import ChatTextArea from './ChatTextArea.vue'
import ChatBubble from './ChatBubble.vue'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { useChat } from '@/lib/ai/client'

const { messages, reloadMessage } = useChat()
messages.value = [
  {
    id: -1,
    text: 'Hello, how can I help you?',
    role: 'agent',
    lastUpdated: Date.now(),
  },
]
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader class="border-b py-2">
      <ChatHeader />
    </CardHeader>
    <CardContent class="flex-1 overflow-auto py-2">
      <div className="space-y-4">
        <ChatBubble
          v-for="message in messages"
          :key="message.id"
          :text="message.text"
          :role="message.role"
          :loading="message.loading"
          :code="message.code"
          :reference="message.reference"
          @reload="() => reloadMessage(message.id)"
        />
      </div>
    </CardContent>
    <CardFooter border-t="~" class="p-4">
      <ChatTextArea />
    </CardFooter>
  </Card>
</template>
