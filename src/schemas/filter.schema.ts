import { HotelSchema } from '@/schemas/hotel.schema'
import z from 'zod'

export const SuggestParamsSchema = z.object({
  filter: z.string()
})

export type SuggestParamsType = z.infer<typeof SuggestParamsSchema>

export const FilterSchema = z.object({
  dayStart: z.date(),
  dayEnd: z.date(),
  filter: z.string(),
  adultQuantity: z.number(),
  childQuantity: z.number(),
  currentRooms: z.number()
})

export type FilterType = z.infer<typeof FilterSchema>

export const FilterRoomTypeSchema = z.object({
  dayStart: z.date(),
  dayEnd: z.date(),
  adultQuantity: z.number(),
  childQuantity: z.number(),
  currentRooms: z.number()
})

export type FilterRoomTypeType = z.infer<typeof FilterRoomTypeSchema>

export const SuggestListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  provinces: z.array(z.string()),
  data: z.array(HotelSchema)
})

export type SuggestListResType = z.infer<typeof SuggestListResSchema>

export const FilterParamsSchema = z.object({
  dayStart: z.date(),
  dayEnd: z.date(),
  filter: z.string().optional(),
  adultQuantity: z.number(),
  childQuantity: z.number(),
  currentRooms: z.number(),
  hotelName: z.string().optional(),
  hotelStar: z.array(z.string()),
  hotelType: z.array(z.string()),
  minPrice: z.string().optional()
})

export type FilterParamsType = z.infer<typeof FilterParamsSchema>

export const FilterListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(HotelSchema),
  outOfRoom: z.array(HotelSchema)
})

export type FilterListResType = z.infer<typeof FilterListResSchema>
