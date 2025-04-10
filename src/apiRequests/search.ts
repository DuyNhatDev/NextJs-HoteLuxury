import http from '@/lib/http'
import { formatDateToString } from '@/lib/utils'
import {
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
}

export default searchApiRequest
