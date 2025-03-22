import accountApiRequest from '@/apiRequests/account'
import { useQuery } from '@tanstack/react-query'

export const useGetAccount = (id: string) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountApiRequest.getAccount(id),
    enabled: !!id,
  })
}

export const useGetPartnerList = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: accountApiRequest.getPartnerList,
  })
}

export const useGetPartnerPendingList = () => {
  return useQuery({
    queryKey: ['pending-partners'],
    queryFn: accountApiRequest.getPendingPartnerList,
  })
}