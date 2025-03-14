import http from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'

const accountApiRequest = {
  getAccount: (userId: string) => http.get<AccountResType>(`/user/${userId}`),
}
export default accountApiRequest
