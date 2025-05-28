import filterApiRequest from '@/api/filter'
import { FilterParamsType, SuggestParamsType } from '@/schemas/filter.schema'
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
