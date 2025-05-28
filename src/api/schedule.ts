import http from '@/lib/http'
import { buildQueryParams } from '@/lib/utils'
import { ScheduleListResType, ScheduleParamsType } from '@/schemas/schedule.schema'

const prefix = '/schedule'

const scheduleApiRequest = {
  getScheduleList: (queryParams: ScheduleParamsType) =>
    http.get<ScheduleListResType>(`${prefix}?` + buildQueryParams(queryParams)),
  deleteSchedule: (id: number) => http.delete(`${prefix}/${id}`)
}
export default scheduleApiRequest
