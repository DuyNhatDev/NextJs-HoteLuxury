import accountApiRequest from '@/apiRequests/account'
import { useQuery } from '@tanstack/react-query'

export const useGetAccount = (id: string) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountApiRequest.getAccount(id),
    enabled: !!id,
  })
}
