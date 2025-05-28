import scheduleApiRequest from '@/api/schedule'
import { ScheduleParamsType } from '@/schemas/schedule.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetScheduleList = (queryParams: ScheduleParamsType) => {
  return useQuery({
    queryFn: () => scheduleApiRequest.getScheduleList(queryParams),
    queryKey: ['schedule-list', queryParams]
  })
}

export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: scheduleApiRequest.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-list'] })
    }
  })
}
