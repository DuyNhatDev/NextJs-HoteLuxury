import http from '@/lib/http'
import { PointHistoryResType } from '@/schemas/point.schema'

const prefix = '/point-history'

const pointApiRequest = {
  getPointHistory: () => http.get<PointHistoryResType>(`${prefix}`)
}
export default pointApiRequest
