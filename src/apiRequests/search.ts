import http from '@/lib/http'
import { buildQueryParams, formatDateToString } from '@/lib/utils'
import {
  FilterListResType,
  FilterParamsType,
  SuggestListResType,
  SuggestParamsType,
} from '@/schemaValidations/search.schema'
import queryString from 'query-string'

const searchApiRequest = {
  getSuggestList: (queryParams: SuggestParamsType) =>
    http.get<SuggestListResType>(
      '/hotel/suggested-hotel?' +
        queryString.stringify({
          filter: queryParams.filter,
        })
    ),
  getFilterHotelList: (queryParams: FilterParamsType) =>
    http.get<FilterListResType>('/hotel/user-filter?' + buildQueryParams(queryParams)),
}

export default searchApiRequest
