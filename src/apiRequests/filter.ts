import http from '@/lib/http'
import { buildQueryParams, formatDateToString } from '@/lib/utils'
import {
  FilterListResType,
  FilterParamsType,
  SuggestListResType,
  SuggestParamsType,
} from '@/schemaValidations/filter.schema'

const searchApiRequest = {
  getSuggestList: (queryParams: SuggestParamsType) =>
    http.get<SuggestListResType>('/hotel/suggested-hotel?' + buildQueryParams(queryParams)),
  getFilterHotelList: (queryParams: FilterParamsType) =>
    http.get<FilterListResType>('/hotel/user-filter?' + buildQueryParams(queryParams)),
}

export default searchApiRequest
