import http from '@/lib/http'
import { formatDateToString } from '@/lib/utils'
import { SearchSuggestResType, SearchSuggestType } from '@/schemaValidations/search.schema'
import queryString from 'query-string'

const searchApiRequest = {
  getSuggestList: (queryParams: SearchSuggestType) =>
    http.get<SearchSuggestResType>(
      '/hotel/suggested-hotel?' +
        queryString.stringify({
          dayStart: formatDateToString(queryParams.dayStart),
          dayEnd: formatDateToString(queryParams.dayStart),
          filter: queryParams.filter,
        })
    ),
}

export default searchApiRequest
