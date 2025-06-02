import voucherApiRequest from '@/api/voucher'
import { useQuery } from '@tanstack/react-query'

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
