import http from '@/lib/http'
import { ChatResType, ChatType } from '@/schemas/chat.schema'

const chatApiRequest = {
  chat: (body: ChatType) => http.post<ChatResType>('/auth/chatbot', body)
}
export default chatApiRequest
