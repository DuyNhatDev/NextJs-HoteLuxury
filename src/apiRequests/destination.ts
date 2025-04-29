import http from '@/lib/http'
import { objectToFormData } from '@/lib/utils'
import {
  CreateDestinationBodyType,
  DestinationListResType,
  DestinationResType,
  UpdateDestinationBodyType
} from '@/schemaValidations/destination.schema'

const prefix = '/location'

const destinationApiRequest = {
  getDestinationList: () => http.get<DestinationListResType>(`${prefix}`),
  getDestination: (id: number) => http.get<DestinationResType>(`${prefix}/${id}`),
  addDestination: (body: CreateDestinationBodyType) => {
    const formData = objectToFormData(body)
    return http.post<DestinationListResType>(`${prefix}`, formData)
  },
  updateDestination: (id: number, body: UpdateDestinationBodyType) => {
    const formData = objectToFormData(body)
    return http.put<DestinationListResType>(`${prefix}/${id}`, formData)
  },
  deleteDestination: (id: number) => http.delete(`${prefix}/${id}`)
}
export default destinationApiRequest
