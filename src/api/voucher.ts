import http from '@/lib/http'
import {
  CreateUpdateVoucherBodyType,
  Voucher2ResType,
  VoucherLisResType,
  VoucherResType
} from '@/schemas/voucher.schema'

const prefix = '/voucher'

const voucherApiRequest = {
  getListVoucher: () => http.get<VoucherLisResType>(`${prefix}`),
  getSuitableVoucher: (price: number) => http.get<VoucherLisResType>(`${prefix}/suitable-voucher?price=${price}`),
  getListVoucherByVoucher: () => http.get<VoucherLisResType>(`/admin${prefix}`),
  getVoucher: (id: number) => http.get<VoucherResType>(`${prefix}/${id}`),
  getVoucher2: (id: number) => http.get<Voucher2ResType>(`${prefix}/${id}`),
  addVoucher: (body: CreateUpdateVoucherBodyType) => http.post<VoucherResType>(`${prefix}`, body),
  updateVoucher: (id: number, body: CreateUpdateVoucherBodyType) => http.put<VoucherResType>(`${prefix}/${id}`, body),
  deleteVoucher: (id: number) => http.delete(`${prefix}/${id}`),
  getFestivalVoucher: () => http.get<VoucherResType>(`${prefix}/festival-voucher`),
}
export default voucherApiRequest
