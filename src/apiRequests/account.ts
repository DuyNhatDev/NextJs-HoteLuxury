import http from '@/lib/http'
import { AccountListResType, AccountResType } from '@/schemaValidations/account.schema'

const accountApiRequest = {
  getAccount: (userId: string) => http.get<AccountResType>(`/user/${userId}`),
  getPartnerList: () => http.get<AccountListResType>(`/user/partner`),
  getPendingPartnerList: () => http.get<AccountListResType>(`/user/pending-partner`),
}
export default accountApiRequest
