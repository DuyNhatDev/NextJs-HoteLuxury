import filterApiRequest from '@/apiRequests/filter'
import { FilterParamsType, SuggestParamsType } from '@/schemaValidations/filter.schema'
import { useQuery } from '@tanstack/react-query'

export const useGetSuggestList = (queryParams: SuggestParamsType) => {
  return useQuery({
    queryFn: () => filterApiRequest.getSuggestList(queryParams),
    queryKey: ['suggests', queryParams]
  })
}
export const useGetFilterHotelList = (queryParams: FilterParamsType) => {
  return useQuery({
    queryFn: () => filterApiRequest.getFilterHotelList(queryParams),
    queryKey: ['filter-hotels', queryParams]
  })
}
