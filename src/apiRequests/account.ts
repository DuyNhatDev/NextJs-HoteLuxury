import http from '@/lib/http'
import { objectToFormData } from '@/lib/utils'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreatePartnerAccountBodyType,
  CreateCustomerAccountBodyType,
  UpdatePartnerAccountBodyType,
  UpdateProfileBodyType,
  UpdateCustomerAccountBodyType
} from '@/schemaValidations/account.schema'

const prefix = '/user'

const accountApiRequest = {
  getAccount: (id: string) => http.get<AccountResType>(`${prefix}/${id}`),
  getPartnerList: () => http.get<AccountListResType>(`${prefix}/partner`),
  getPendingPartnerList: () => http.get<AccountListResType>(`${prefix}/pending-partner`),
  getUserList: () => http.get<AccountListResType>(`${prefix}/customer`),
  addPartner: (body: CreatePartnerAccountBodyType) => {
    const formData = objectToFormData(body)
    return http.post<AccountResType>(`${prefix}`, formData)
  },
  addUser: (body: CreateCustomerAccountBodyType) => {
    const formData = objectToFormData(body)
    return http.post<AccountResType>(`${prefix}`, formData)
  },
  updatePartner: (id: number, body: UpdatePartnerAccountBodyType) => {
    const formData = objectToFormData(body)
    return http.put<AccountResType>(`${prefix}/${id}`, formData)
  },
  updateCustomer: (id: number, body: UpdateCustomerAccountBodyType) => {
    const formData = objectToFormData(body)
    return http.put<AccountResType>(`${prefix}/${id}`, formData)
  },
  updateProfile: (id: number, body: UpdateProfileBodyType) => {
    const formData = objectToFormData(body)
    return http.put<AccountResType>(`${prefix}/${id}`, formData)
  },
  deleteAccount: (id: number) => http.delete(`${prefix}/${id}`),
  confirmPartner: (id: number, isConfirmed: boolean) => http.put<AccountResType>(`${prefix}/${id}`, { isConfirmed }),
  changePassword: (body: ChangePasswordBodyType) => http.post<AccountResType>(`${prefix}/update-password`, body)
}
export default accountApiRequest
