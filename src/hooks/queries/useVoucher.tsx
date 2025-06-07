import voucherApiRequest from '@/api/voucher'
import { CreateUpdateVoucherBodyType } from '@/schemas/voucher.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetListVoucher = () => {
  return useQuery({
    queryFn: () => voucherApiRequest.getListVoucher(),
    queryKey: ['vouchers']
  })
}

export const useGetSuitableVoucher = (price: number, enabled: boolean = false) => {
  return useQuery({
    queryFn: () => voucherApiRequest.getSuitableVoucher(price),
    queryKey: ['suitable-voucher', price],
    enabled: !!price && enabled
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

export const useGetVoucher = (id?: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['voucher', id],
    queryFn: () => voucherApiRequest.getVoucher(id!),
    enabled: !!id && enabled
  })
}
export const useGetVoucher2 = (id?: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['voucher2', id],
    queryFn: () => voucherApiRequest.getVoucher2(id!),
    enabled: !!id && enabled
  })
}