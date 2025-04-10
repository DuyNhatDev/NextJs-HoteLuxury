import { HotelSchema } from '@/schemaValidations/hotel.schema'
import z from 'zod'

export const SuggestParamsSchema = z.object({
  filter: z.string(),
})

export type SuggestParamsType = z.infer<typeof SuggestParamsSchema>

export const SearchSchema = z.object({
  dayStart: z.date(),
  dayEnd: z.date(),
  filter: z.string(),
  adultQuantity: z.number(),
  childQuantity: z.number(),
  currentRooms: z.number(),
})

export type SearchType = z.infer<typeof SearchSchema>

export const SuggestListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  provinces: z.array(z.string()),
  data: z.array(HotelSchema),
})

export type SuggestListResType = z.infer<typeof SuggestListResSchema>
