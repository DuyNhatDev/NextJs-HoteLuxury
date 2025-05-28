import chatApiRequest from '@/api/chat'
import { useMutation } from '@tanstack/react-query'

export const useChatMutation = () => {
  return useMutation({
    mutationFn: chatApiRequest.chat
  })
}
