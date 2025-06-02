import pointApiRequest from '@/api/point'
import { useQuery } from '@tanstack/react-query'

export const useGetPointHistory = () => {
  return useQuery({
    queryFn: () => pointApiRequest.getPointHistory(),
    queryKey: ['point-history']
  })
}
