<script setup lang="ts">
import { ref } from 'vue'
import ChatHeader from './ChatHeader.vue'
import ChatTextArea from './ChatTextArea.vue'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  role: 'user' | 'agent'
}

const messages = ref<Message[]>([
  {
    id: '1',
    text: 'Hello, how can I help you?',
    role: 'agent',
  },
  {
    id: '2',
    text: 'I need help with my account',
    role: 'user',
  },
  {
    id: '3',
    text: 'Ok, I can help you with that',
    role: 'agent',
  },
])
</script>

<template>
  <Card class="h-full flex flex-col">
    <CardHeader>
      <ChatHeader />
    </CardHeader>
    <CardContent class="flex-1">
      <div className="space-y-4">
        <div
          v-for="message in messages" :key="message.id" :class="cn(
            'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-xs',
            message.role === 'user'
              ? 'ml-auto bg-primary text-primary-foreground'
              : 'bg-muted',
          )"
        >
          {{ message.text }}
        </div>
      </div>
    </CardContent>
    <CardFooter border-t="~" class="p-4">
      <ChatTextArea />
    </CardFooter>
  </Card>
</template>
