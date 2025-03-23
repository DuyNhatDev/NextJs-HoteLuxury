import http from '@/lib/http'
import { objectToFormData } from '@/lib/utils'
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
  addPartner: (body: CreatePartnerAccountBodyType) => {
    const formData = objectToFormData(body)
    return http.post<AccountResType>(`${prefix}`, formData)
  },
  updatePartner: (id: number, body: UpdatePartnerAccountBodyType) => {
    const formData = objectToFormData(body)
    return http.put<AccountResType>(`${prefix}/${id}`, formData)
  },
  deletePartner: (id: number) => http.delete(`${prefix}/${id}`),
}
export default accountApiRequest
