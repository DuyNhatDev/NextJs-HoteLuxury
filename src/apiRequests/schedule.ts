import http from '@/lib/http'
import { buildQueryParams } from '@/lib/utils'
import { ScheduleListResType, ScheduleParamsType } from '@/schemaValidations/schedule.schema'

const prefix = '/schedule'

const scheduleApiRequest = {
  getScheduleList: (queryParams: ScheduleParamsType) =>
    http.get<ScheduleListResType>(`${prefix}/by-partner?` + buildQueryParams(queryParams)),
  deleteSchedule: (id: number) => http.delete(`${prefix}/${id}`)
}
export default scheduleApiRequest
