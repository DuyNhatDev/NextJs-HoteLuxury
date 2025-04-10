import http from '@/lib/http'
import { formatDateToString } from '@/lib/utils'
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
  http.get<FilterListResType>(
    '/hotel/user-filter?' +
      queryString.stringify(
        {
          dayStart: formatDateToString(queryParams.dayStart),
          dayEnd: formatDateToString(queryParams.dayEnd),
          adultQuantity: queryParams.adultQuantity,
          childQuantity: queryParams.childQuantity,
          currentRooms: queryParams.currentRooms,
          filter: queryParams.filter,
          hotelName: queryParams.hotelName,
          hotelStar: queryParams.hotelStar,
          hotelType: queryParams.hotelType,
          minPrice: queryParams.minPrice,
        },
        {
          skipNull: true,
          skipEmptyString: true,
          arrayFormat: 'none',
        }
      )
  ),

}

export default searchApiRequest
