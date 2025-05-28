import dashboardApiRequest from '@/apiRequests/dashboard'
import { useQuery } from '@tanstack/react-query'

export const useGetPartnerDashboard = (param: string) => {
  return useQuery({
    queryKey: ['partner-dashboard', param],
    queryFn: () => dashboardApiRequest.getPartnerDashboard(param)
  })
}
