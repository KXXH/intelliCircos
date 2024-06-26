<script setup lang="ts">
import { Code, Loader2, Paperclip, Play, RotateCw, View } from 'lucide-vue-next'
import ChatBubbleAction from './ChatBubbleAction.vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Reference } from '@/lib/ai/client'
import TooltipButton from '@/components/ui/tooltip-button/TooltipButton.vue'
import { applyRecommendation } from '@/lib/ai/recommend'
import { useFigureStore } from '@/stores/figure'

const props = defineProps<{
  code?: string
  text: string
  role: 'user' | 'agent'
  loading?: boolean
  reference?: Reference[]
}>()

const emits = defineEmits<{
  reload: []
}>()

const { toast } = useToast()
const figure = useFigureStore()

function onRunCode() {
  try {
    // console.log('当前配置:' + figure.CTMLConfig)
    console.log('props.code!' + props.code!)
    applyRecommendation(figure.CTMLConfig, props.code!)
    toast({
      title: 'Code executed',
      description: 'The code has been executed successfully',
    })
  }
  catch (e: any) {
    toast({
      title: 'Failed to run code',
      description: e.message,
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <div
    :class="cn(
      'flex w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-xs arrow relative',
      role === 'user'
        ? 'ml-auto bg-primary text-primary-foreground arrow-user'
        : 'bg-muted arrow-agent',
    )"
  >
    <template v-if="loading && text.length === 0 && code == null">
      <Loader2 class="h-4 w-4 animate-in animate-duration-500 animate-iteration-infinite spin-in-360" />
    </template>
    <template v-else>
      <div>
        {{ text }}
      </div>
      <template v-if="code">
        <div flex gap-1>
          <ChatBubbleAction hint="Code">
            <template #icon>
              <Code class="h-4 w-4" />
            </template>
            <template #popover>
              <div text-xs>
                <div mb-1 flex items-center gap-2 font-bold>
                  <span>Code</span>
                  <div flex="~ 1" />
                  <TooltipButton side="top" :side-offset="5" class="h-6 w-6 rounded-1" variant="secondary" size="icon">
                    <View class="h-4 w-4" />
                    <template #hint>
                      <div text-xs>
                        Preview
                      </div>
                    </template>
                  </TooltipButton>
                  <TooltipButton side="top" :side-offset="5" class="h-6 w-6 rounded-1" variant="secondary" size="icon">
                    <Play class="h-4 w-4" @click="onRunCode" />
                    <template #hint>
                      <div text-xs>
                        Run code
                      </div>
                    </template>
                  </TooltipButton>
                  <!-- <Button variant="secondary" size="icon" class="h-6 w-6">
                    <Play class="h-4 w-4" />
                  </Button> -->
                </div>
                <pre class="rounded bg-zinc-950 p-1 text-wrap text-xs text-white dark:bg-zinc-900"><code>{{ code }}</code></pre>
              </div>
            </template>
          </ChatBubbleAction>
          <ChatBubbleAction v-if="reference" hint="References">
            <template #icon>
              <Paperclip class="h-4 w-4" />
            </template>
            <template #popover>
              <div text-xs>
                <div font-bold>
                  References
                </div>
                <ul list-disc pl-5>
                  <li v-for="document in reference" :key="document.url">
                    <Button variant="link" class="h-5 px-0 py-0 text-xs" as="a" :href="document.url">
                      {{ document.title }}
                    </Button>
                  </li>
                </ul>
              </div>
            </template>
          </ChatBubbleAction>
          <ChatBubbleAction hint="Reload" @click="emits('reload')">
            <template #icon>
              <RotateCw class="h-4 w-4" />
            </template>
          </ChatBubbleAction>
        </div>
      </template>
      <!-- <code v-if="code" bg="background" p="1" rounded>{{ code }}</code> -->
    </template>
  </div>
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
