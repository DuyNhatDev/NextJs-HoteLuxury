import z from 'zod'

export const RoomTypeSchema = z.object({
  roomTypeId: z.number(),
  hotelId: z.number(),
  roomTypeName: z.string(),
  roomTypeQuantity: z.number(),
  availableRoomQuantity: z.number(),
  roomTypePrice: z.number(),
  roomTypeDescription: z.string(),
  maxPeople: z.number(),
  roomTypeImage: z.string(),
  roomTypeImages: z.array(z.string()),
})

export type RoomTypeType = z.infer<typeof RoomTypeSchema>

export const RoomTypeResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: RoomTypeSchema,
})

export type RoomTypeResType = z.infer<typeof RoomTypeResSchema>

export const RoomTypeListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(RoomTypeSchema),
})

export type RoomTypeListResType = z.infer<typeof RoomTypeListResSchema>

export const CreateRoomTypeBodySchema = z.object({
  hotelId: z.number(),
  roomTypeName: z.string().min(1, { message: 'Tên khách sạn không được để trống' }),
  roomTypePrice: z.number({ message: 'Vui lòng chọn nhập giá' }),
  roomTypeDescription: z.string().optional(),
  roomTypeImage: z.union([z.string(), z.instanceof(File)]),
  roomTypeImages: z.array(z.union([z.string(), z.instanceof(File)]).optional()),
})

export type CreateRoomTypeBodyType = z.infer<typeof CreateRoomTypeBodySchema>

export const UpdateRoomTypeBodySchema = z.object({
  roomTypeName: z.string().min(1, { message: 'Tên khách sạn không được để trống' }),
  roomTypePrice: z.number({ message: 'Vui lòng chọn nhập giá' }),
  roomTypeDescription: z.string().optional(),
  roomTypeImage: z.union([z.string(), z.instanceof(File)]),
  roomTypeImages: z.array(z.union([z.string(), z.instanceof(File)]).optional()),
})

export type UpdateRoomTypeBodyType = z.infer<typeof UpdateRoomTypeBodySchema>
