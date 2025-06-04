import http from '@/lib/http'
import { buildQueryParams } from '@/lib/utils'
import { PartnerDashboardQueryParams, PartnerDashboardResType } from '@/types/partner-dashboard.type'

const dashboardApiRequest = {
  getPartnerDashboard: (queryParams: PartnerDashboardQueryParams) =>
    http.get<PartnerDashboardResType>(`/user/partner/dashboard?` + buildQueryParams(queryParams))
}
export default dashboardApiRequest
