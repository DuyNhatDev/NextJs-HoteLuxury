import { HotelSchema } from '@/schemaValidations/hotel.schema'
import z from 'zod'

export const SearchSuggestSchema = z.object({
  dayStart: z.date(),
  dayEnd: z.date(),
  filter: z.string(),
})

export type SearchSuggestType = z.infer<typeof SearchSuggestSchema>

export const SearchSuggestResSchema = z.object({
  status: z.string(),
  message: z.string(),
  provinces: z.array(z.string()),
  data: z.array(HotelSchema),
})

export type SearchSuggestResType = z.infer<typeof SearchSuggestResSchema>
