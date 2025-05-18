'use client'
import { useState } from 'react'

export default function Chat() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')

  const sendMessage = async () => {
    const res = await fetch('http://localhost:9000/auth/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })

    const data = await res.json()
    setReply(data.reply)
  }

  return (
    <div className='p-4'>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className='w-full border p-2'
        rows={3}
        placeholder='Hỏi trợ lý khách sạn...'
      />
      <button onClick={sendMessage} className='mt-2 rounded bg-blue-600 px-4 py-2 text-white'>
        Gửi
      </button>
      {reply && <div className='mt-4 rounded bg-gray-100 p-4'>{reply}</div>}
    </div>
  )
}
