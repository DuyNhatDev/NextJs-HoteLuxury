import voucherApiRequest from '@/api/voucher'
import { CreateUpdateVoucherBodyType } from '@/schemas/voucher.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetListVoucher = () => {
  return useQuery({
    queryFn: () => voucherApiRequest.getListVoucher(),
    queryKey: ['vouchers']
  })
}

export const useGetSuitableVoucher = (price: number) => {
  return useQuery({
    queryFn: () => voucherApiRequest.getSuitableVoucher(price),
    queryKey: ['suitable-voucher', price]
  })
}

export const useGetListVoucherByAdmin = () => {
  return useQuery({
    queryFn: () => voucherApiRequest.getListVoucherByVoucher(),
    queryKey: ['admin-vouchers']
  })
}

export const useAddVoucherMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: voucherApiRequest.addVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] })
    }
  })
}

export const useUpdateVoucherMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CreateUpdateVoucherBodyType }) =>
      voucherApiRequest.updateVoucher(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] })
    }
  })
}

export const useDeleteVoucherMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: voucherApiRequest.deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] })
    }
  })
}