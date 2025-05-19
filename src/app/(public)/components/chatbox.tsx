'use client'
import { Chat } from '@/components/ui/chat'
import { useChatMutation } from '@/queries/useChat'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MessageCircleMore } from 'lucide-react'

export default function ChatBox() {
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([])
  const [input, setInput] = useState('')

  const mutation = useChatMutation()

  const handleSubmit = async (
    event?: { preventDefault?: () => void } | undefined,
    options?: { experimental_attachments?: FileList }
  ) => {
    if (event?.preventDefault) event.preventDefault()
    if (!input.trim()) return
    const userMessage = {
      id: String(Date.now()),
      role: 'user',
      content: input.trim(),
      createdAt: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    try {
      const res = await mutation.mutateAsync({ question: userMessage.content })
      const aiMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: res.payload.answer,
        createdAt: new Date()
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: String(Date.now() + 2),
        role: 'assistant',
        content: 'Đã có lỗi xảy ra khi gọi API.'
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const stop = () => {
    mutation.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex h-15 w-15 items-center justify-center rounded-full'>
          <MessageCircleMore className='!h-10 !w-10 text-blue-500' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={mutation.isPending}
          stop={stop}
          setMessages={setMessages}
        />
      </DialogContent>
    </Dialog>
  )
}
