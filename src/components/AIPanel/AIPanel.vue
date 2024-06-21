<script setup lang="ts">
import { Sparkles, Wrench } from 'lucide-vue-next'
import { Advanced } from './Advanced'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { Chat } from '@/components/AIPanel/Chat'
</script>

<template>
  <Tabs default-value="account" class="h-full w-full flex flex-col">
    <TabsList class="grid grid-cols-2 w-full">
      <TabsTrigger value="account" class="space-x-1">
        <Sparkles class="h-3 w-3" fill="var(----primary-foreground)" />
        <span>Chat View</span>
      </TabsTrigger>
      <TabsTrigger value="password" class="space-x-1">
        <Wrench class="h-3 w-3" fill="var(----primary-foreground)" />
        <span>Advanced</span>
      </TabsTrigger>
    </TabsList>
    <TabsContent value="account" class="relative flex flex-1 flex-col overflow-hidden data-[state=inactive]:hidden">
      <Chat class="flex-1" />
    </TabsContent>
    <TabsContent value="password" class="relative flex flex-1 flex-col data-[state=inactive]:hidden">
      <Advanced />
    </TabsContent>
  </Tabs>
</template>
