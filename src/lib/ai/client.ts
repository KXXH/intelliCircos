import { RemoteRunnable } from '@langchain/core/runnables/remote'
import { type Ref, reactive, ref,
} from 'vue'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import type { AIMessageChunk, BaseMessage } from '@langchain/core/messages'

const remoteChain = new RemoteRunnable<HumanMessage | HumanMessage[], BaseMessage, any>({
  url: 'http://localhost:8000/openai',
})

export interface Message {
  id: string
  text: string
  role: 'user' | 'agent'
  lastUpdated: number
  loading?: boolean
}

const messages = ref<Message[]>([])
export function useChat() {
  let _id = 0

  const sendMessage = async (text: string) => {
    const messageId = _id++

    const message: Message = reactive({
      id: messageId.toString(),
      text,
      role: 'user',
      lastUpdated: Date.now(),
    })

    messages.value.push(message)

    const resMessageId = _id++
    const aiMessage: Message = reactive({
      role: 'agent',
      id: resMessageId.toString(),
      text: '',
      lastUpdated: Date.now(),
      loading: true,
    })

    messages.value.push(aiMessage)

    const resStream = await remoteChain.stream(
      [
        ...messages.value.map((m) => {
          if (m.role === 'user')
            return new HumanMessage(m.text)
          else return new AIMessage(m.text)
        }),
        new HumanMessage(
          message.text,
        ),
      ],
    )

    for await (const chunk of resStream) {
      if (chunk.content)
        aiMessage.text += chunk.content
    }

    aiMessage.loading = false
  }

  return {
    messages,
    sendMessage,
  }
}
