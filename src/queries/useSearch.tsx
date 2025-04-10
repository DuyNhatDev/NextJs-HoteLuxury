import searchApiRequest from '@/apiRequests/search'
import { FilterParamsType, SuggestParamsType } from '@/schemaValidations/search.schema'
import { useQuery } from '@tanstack/react-query'

export const useGetSuggestList = (queryParams: SuggestParamsType) => {
  return useQuery({
    queryFn: () => searchApiRequest.getSuggestList(queryParams),
    queryKey: ['suggests', queryParams],
  })
}
export const useGetFilterHotelList = (queryParams: FilterParamsType) => {
  return useQuery({
    queryFn: () => searchApiRequest.getFilterHotelList(queryParams),
    queryKey: ['filter-hotels', queryParams],
  })
}
