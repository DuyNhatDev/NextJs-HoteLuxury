import http from '@/lib/http'
import { buildQueryParams } from '@/lib/utils'
import { AdminDashboardQueryParams, AdminDashboardResType, AdminRevenueChartData } from '@/types/admin-dashboard.type'
import { PartnerDashboardQueryParams, PartnerDashboardResType } from '@/types/partner-dashboard.type'

const dashboardApiRequest = {
  getPartnerDashboard: (queryParams: PartnerDashboardQueryParams) =>
    http.get<PartnerDashboardResType>(`/user/partner/dashboard?` + buildQueryParams(queryParams)),
  getAdminDashboard: (queryParams: AdminDashboardQueryParams) =>
    http.get<AdminDashboardResType>(`admin/homepage?` + buildQueryParams(queryParams))
}
export default dashboardApiRequest
