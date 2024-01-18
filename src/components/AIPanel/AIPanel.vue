<script setup lang="ts">
import { Sparkles, Wrench } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <span>
          Advanced
        </span>
      </TabsTrigger>
    </TabsList>
    <TabsContent value="account" class="relative flex flex-1 flex-col">
      <Chat class="flex-1" />
    </TabsContent>
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you'll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="space-y-1">
            <Label for="current">Current password</Label>
            <Input id="current" type="password" />
          </div>
          <div class="space-y-1">
            <Label for="new">New password</Label>
            <Input id="new" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save password</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</template>
