import http from '@/lib/http'
import { PartnerDashboardResType } from '@/types/dashboard.type'

const dashboardApiRequest = {
  getPartnerDashboard: (param: string) => http.get<PartnerDashboardResType>(`/user/partner/dashboard?time=${param}`)
}
export default dashboardApiRequest
