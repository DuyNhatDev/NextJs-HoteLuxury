import searchApiRequest from '@/apiRequests/search'
import { SearchSuggestType } from '@/schemaValidations/search.schema'
import { useQuery } from '@tanstack/react-query'

export const useGetSuggestList = (queryParams: SearchSuggestType) => {
  return useQuery({
    queryFn: () => searchApiRequest.getSuggestList(queryParams),
    queryKey: ['suggests', queryParams],
  })
}
