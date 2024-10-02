import { RemoteRunnable } from '@langchain/core/runnables/remote'
import { reactive, ref } from 'vue'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import type { AIMessageChunk, BaseMessage } from '@langchain/core/messages'
import type { Document } from '@langchain/core/documents'

const remoteChain = new RemoteRunnable<ChatInput, RecommendationResult, any>({
  url: 'http://localhost:8000/recommend',
})

export interface Reference {
  title: string
  url: string
}

export interface DocumentMetadata {
  pdf_name: string
}
export interface Message {
  id: number
  text: string
  role: 'user' | 'agent'
  lastUpdated: number
  loading?: boolean
  code?: string
  reference?: Reference[]
}

export interface ChatInput {
  history: Array<AIMessage | HumanMessage> // 聊天历史，应该是一条AI一条人类，最后一条人类的消息表示最新的指令
  existing_design: string
}

interface RecommendationResult {
  configuration: string // The recommended configuration for the user.
  explanation: string // The explanation of the recommendation.
  reference: Document<DocumentMetadata>[] // The reference documents for the recommendation.
}

const messages = ref<Message[]>([])

function formatAiMessage(message: Message): AIMessage {
  if (message.code) {
    return new AIMessage(
      `Recommendation: ${message.code}\n\nReason: ${message.text}`,
    )
  }
  else {
    return new AIMessage(message.text)
  }
}

export function useChat() {
  let _id = 0

  const sendMessage = async (text: string) => {
    const messageId = _id++

    const message: Message = reactive({
      id: messageId,
      text,
      role: 'user',
      lastUpdated: Date.now(),
    })

    messages.value.push(message)

    const resMessageId = _id++
    const aiMessage: Message = reactive({
      role: 'agent',
      id: resMessageId,
      text: '',
      lastUpdated: Date.now(),
      loading: true,
    })

    const resStream = await remoteChain.stream({
      history: [
        ...messages.value.map((m) => {
          if (m.role === 'user')
            return new HumanMessage(m.text)
          else return formatAiMessage(m)
        }),
      ],
      existing_design: '',
    },
    )

    for await (const chunk of resStream) {
      if (chunk.configuration)
        aiMessage.code = chunk.configuration
      if (chunk.explanation)
        aiMessage.text = chunk.explanation
      if (chunk.reference) {
        aiMessage.reference = chunk.reference.map(doc => ({
          title: doc.metadata.pdf_name,
          url: doc.metadata.pdf_name,
        }))
      }
    }

    aiMessage.loading = false
    // 这里即使是宏任务也只能放到最后，因为微任务队列不一定会全部收到，就会执行宏任务，导致 message 错误更新
    setTimeout(() => messages.value.push(aiMessage), 0)
  }

  const reset = () => {
    messages.value = messages.value.filter(m => +m.id < 0)
    _id = 0
  }

  const reloadMessage = (id: number) => {
    // 重新加载消息id，消息id以下的内容都会删除
    if (id < 0)
      throw new Error('Cannot reload the initial message')

    const index = messages.value.findIndex(m => m.id === id)
    const targetMessage = messages.value[index]
    if (targetMessage.role === 'user')
      throw new Error('Human message cannot be reloaded')
    const lastHumanMessage = messages.value[index - 1]
    if (!(lastHumanMessage.role === 'user'))
      throw new Error('Incorrect message order')
    messages.value = messages.value.slice(0, index - 1)
    sendMessage(lastHumanMessage.text)
  }

  return {
    messages,
    sendMessage,
    reloadMessage,
    reset,
  }
}
