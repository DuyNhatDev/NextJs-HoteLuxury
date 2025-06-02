import http from '@/lib/http'
import { VoucherLisResType } from '@/schemas/voucher.schema'

const prefix = '/voucher'

const voucherApiRequest = {
  getListVoucher: () => http.get<VoucherLisResType>(`${prefix}`),
  getSuitableVoucher: (price: number) => http.get<VoucherLisResType>(`${prefix}/suitable-voucher?price=${price}`)
}
export default voucherApiRequest
