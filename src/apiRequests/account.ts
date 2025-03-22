import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  CreatePartnerAccountBodyType,
  UpdatePartnerAccountBodyType,
} from '@/schemaValidations/account.schema'

const prefix = '/user'

const accountApiRequest = {
  getAccount: (id: string) => http.get<AccountResType>(`${prefix}/${id}`),
  getPartnerList: () => http.get<AccountListResType>(`${prefix}/partner`),
  getPendingPartnerList: () => http.get<AccountListResType>(`${prefix}/pending-partner`),
  addPartner: (body: CreatePartnerAccountBodyType) =>
    http.post<AccountResType>(`${prefix}`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updatePartner: (id: number, body: UpdatePartnerAccountBodyType) =>
    http.put<AccountResType>(`${prefix}/${id}`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePartner: (id: number) => http.delete(`${prefix}/${id}`),
}
export default accountApiRequest
