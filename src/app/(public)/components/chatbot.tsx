'use client'
import { Chat } from '@/components/ui/chat'
import { useChatMutation } from '@/queries/useChat'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircleMore, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { generateRandom9DigitNumber } from '@/lib/utils'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAsked, setHasAsked] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const chatMutation = useChatMutation()

  useEffect(() => {
    setSessionId(generateRandom9DigitNumber())
  }, [])

  const sendMessage = async (content: string) => {
    if (!hasAsked) setHasAsked(true)
    const userMessage = {
      id: String(Date.now()),
      role: 'user',
      content,
      createdAt: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const res = await chatMutation.mutateAsync({ question: content, sessionId })
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

  const handleSubmit = async (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.()
    if (!input.trim()) return
    await sendMessage(input.trim())
  }

  const append = async (message: { role: 'user'; content: string }) => {
    await sendMessage(message.content)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const stop = () => {
    chatMutation.reset()
  }

  return (
    <div className='fixed right-4 bottom-4 z-50'>
      {!isOpen && (
        <Button
          variant='outline'
          onClick={() => setIsOpen(!isOpen)}
          className='flex h-15 w-15 items-center justify-center rounded-full shadow-lg'
        >
          <MessageCircleMore className='!h-10 !w-10 text-blue-500' />
        </Button>
      )}

      {isOpen && (
        <div className='bg-background mt-4 max-h-[75vh] w-[360px] overflow-auto rounded-md border shadow-lg'>
          <div className='sticky top-0 z-10 flex h-12 items-center justify-between gap-4 bg-sky-400 px-4'>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Avatar>
                  <AvatarImage src='/image/chatbot.png' alt='chatbot' />
                  <AvatarFallback>CB</AvatarFallback>
                </Avatar>
                <div className='ring-background absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-[2px]'></div>
              </div>
              <p className='text-xl font-bold'>ChatBot</p>
            </div>
            <X className='cursor-pointer' onClick={() => setIsOpen(false)} />
          </div>
          <Chat
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isGenerating={chatMutation.isPending}
            stop={stop}
            setMessages={setMessages}
            className={hasAsked ? 'py-3 pl-3 pr-1' : 'px-3'}
            append={append}
            suggestions={['Làm sao để đặt phòng?', 'Có thể hủy phòng được không?', 'Khách sạn rẻ nhất?']}
          />
        </div>
      )}
    </div>
  )
}
