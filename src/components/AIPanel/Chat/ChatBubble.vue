<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

defineProps<{
  text: string
  role: 'user' | 'agent'
  loading?: boolean
}>()
</script>

<template>
  <div
    :class="cn(
      'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-xs arrow relative',
      role === 'user'
        ? 'ml-auto bg-primary text-primary-foreground arrow-user'
        : 'bg-muted arrow-agent',
    )"
  >
    <template v-if="loading && text.length === 0">
      <Loader2 class="h-4 w-4 animate-in animate-duration-500 animate-iteration-infinite spin-in-360" />
    </template>
    <template v-else>
      {{ text }}
    </template>
  </div>
  <!-- <Skeleton
    v-else
    :class="cn(
      'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-xs min-h-[1em] box-content min-w-[3ch]',
      role === 'user'
        ? 'ml-auto bg-primary text-primary-foreground'
        : 'bg-muted',
    )"
  >
    {{ text }}
  </Skeleton> -->
</template>

<style scoped>
.arrow::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 10px; /* 调整这个值来改变三角形的大小 */
  height: 10px; /* 调整这个值来改变三角形的大小 */
}

.arrow-agent::before {
  @apply bg-muted;
  left: -10px;
  clip-path: polygon(100% 0, 0 50%, 100% 100%);
}

.arrow-user::before {
  @apply bg-primary;
  right: -10px;
  left: auto;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
</style>
