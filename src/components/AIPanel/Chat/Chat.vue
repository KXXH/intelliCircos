<script setup lang="ts">
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'
import ChatHeader from './ChatHeader.vue'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
    <CardFooter>
      <form class="flex w-full items-center space-x-2">
        <Input class="flex-1 text-xs" placeholder="Type your message..." />
        <Button type="submit" size="icon" class="h-9 w-9">
          <Send class="w-4 h-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </CardFooter>
  </Card>
</template>
