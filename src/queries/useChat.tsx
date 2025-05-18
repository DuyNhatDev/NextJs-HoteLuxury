import chatApiRequest from '@/apiRequests/chat'
import { useMutation } from '@tanstack/react-query'

export const useChatMutation = () => {
  return useMutation({
    mutationFn: chatApiRequest.chat
  })
}
