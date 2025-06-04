import dashboardApiRequest from '@/api/dashboard'
import { PartnerDashboardQueryParams } from '@/types/partner-dashboard.type'
import { useQuery } from '@tanstack/react-query'

export const useGetPartnerDashboard = (queryParams: PartnerDashboardQueryParams) => {
  return useQuery({
    queryKey: ['partner-dashboard', queryParams],
    queryFn: () => dashboardApiRequest.getPartnerDashboard(queryParams)
  })
}
