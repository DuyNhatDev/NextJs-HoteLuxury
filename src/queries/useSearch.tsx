import searchApiRequest from '@/apiRequests/search'
import { SuggestParamsType } from '@/schemaValidations/search.schema'
import { useQuery } from '@tanstack/react-query'

export const useGetSuggestList = (queryParams: SuggestParamsType) => {
  return useQuery({
    queryFn: () => searchApiRequest.getSuggestList(queryParams),
    queryKey: ['suggests', queryParams],
  })
}
