import http from '@/lib/http'
import { buildQueryParams } from '@/lib/utils'
import {
  FilterListResType,
  FilterParamsType,
  SuggestListResType,
  SuggestParamsType,
} from '@/schemaValidations/filter.schema'

const filterApiRequest = {
  getSuggestList: (queryParams: SuggestParamsType) =>
    http.get<SuggestListResType>('/hotel/suggested-hotel?' + buildQueryParams(queryParams)),
  getFilterHotelList: (queryParams: FilterParamsType) =>
    http.get<FilterListResType>('/hotel/user-filter?' + buildQueryParams(queryParams)),
}

export default filterApiRequest
