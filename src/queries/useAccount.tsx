import accountApiRequest from '@/apiRequests/account'
import { UpdatePartnerAccountBodyType } from '@/schemaValidations/account.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useAddPartnerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['partners'],
      })
    },
  })
}

export const useUpdatePartnerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdatePartnerAccountBodyType }) =>
      accountApiRequest.updatePartner(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['partners'],
      })
    },
  })
}

export const useDeletePartnerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['partners'],
      })
    },
  })
}
