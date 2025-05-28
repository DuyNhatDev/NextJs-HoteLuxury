import z from 'zod'

export const RoomTypeSchema = z.object({
  roomTypeId: z.number(),
  hotelId: z.number(),
  roomTypeName: z.string(),
  roomTypeQuantity: z.number(),
  availableRoomQuantity: z.number(),
  roomTypePrice: z.number(),
  totalPrice: z.number(),
  roomTypeWeekendPrice: z.number(),
  roomTypeDescription: z.string(),
  adultQuantity: z.number(),
  childQuantity: z.number(),
  roomTypeImage: z.string(),
  roomTypeImages: z.array(z.string())
})

export type RoomTypeType = z.infer<typeof RoomTypeSchema>

export const RoomTypeResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: RoomTypeSchema
})

export type RoomTypeResType = z.infer<typeof RoomTypeResSchema>

export const RoomTypeListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(RoomTypeSchema)
})

export type RoomTypeListResType = z.infer<typeof RoomTypeListResSchema>

export const FilterRoomTypeListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(RoomTypeSchema),
  minPrice: z.number()
})

export type FilterRoomTypeListResType = z.infer<typeof FilterRoomTypeListResSchema>

export const CreateRoomTypeBodySchema = z.object({
  hotelId: z.number().optional(),
  roomTypeName: z.string().min(1, { message: 'Tên khách sạn không được để trống' }),
  roomTypePrice: z.number({ message: 'Vui lòng chọn nhập giá' }),
  roomTypeWeekendPrice: z.number({ message: 'Vuiổi chọn nhập giá cuối tuần' }),
  adultQuantity: z.number({ message: 'Vui lòng chọn số người lớn' }),
  childQuantity: z.number({ message: 'Vui lòng chọn số trẻ em' }),
  roomTypeQuantity: z.number({ message: 'Vui lòng nhập số lượng phòng' }),
  roomTypeDescription: z.string().optional(),
  roomTypeImage: z.union([z.string(), z.instanceof(File)]),
  roomTypeImages: z.array(z.union([z.string(), z.instanceof(File)]).optional())
})

export type CreateRoomTypeBodyType = z.infer<typeof CreateRoomTypeBodySchema>

export const UpdateRoomTypeBodySchema = z.object({
  roomTypeName: z.string().min(1, { message: 'Tên khách sạn không được để trống' }),
  roomTypePrice: z.number({ message: 'Vui lòng chọn nhập giá cơ bản' }),
  roomTypeWeekendPrice: z.number({ message: 'Vuiổi chọn nhập giá cuối tuần' }),
  adultQuantity: z.number({ message: 'Vui lòng chọn số người lớn' }),
  childQuantity: z.number({ message: 'Vui lòng chọn số trẻ em' }),
  roomTypeQuantity: z.number({ message: 'Vui lòng nhập số lượng phòng' }),
  roomTypeDescription: z.string().optional(),
  roomTypeImage: z.union([z.string(), z.instanceof(File)]),
  roomTypeImages: z.array(z.union([z.string(), z.instanceof(File)]).optional())
})

export type UpdateRoomTypeBodyType = z.infer<typeof UpdateRoomTypeBodySchema>

export const FilterRoomTypeParamsSchema = z.object({
  hotelId: z.number(),
  dayStart: z.date(),
  dayEnd: z.date(),
  adultQuantity: z.number(),
  childQuantity: z.number(),
  currentRooms: z.number()
})

export type FilterRoomTypeParamsType = z.infer<typeof FilterRoomTypeParamsSchema>
