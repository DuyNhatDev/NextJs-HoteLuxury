import z from 'zod'

export const ScheduleSchema = z.object({
  bookingCode: z.string(),
  roomId: z.number(),
  scheduleId: z.number(),
  bookingId: z.number(),
  dayStart: z.date(),
  dayEnd: z.date(),
  customerName: z.string(),
  roomTypeName: z.string()
})

export type ScheduleType = z.infer<typeof ScheduleSchema>

export const ScheduleListResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(ScheduleSchema)
})

export type ScheduleListResType = z.infer<typeof ScheduleListResSchema>

export const ScheduleParamsSchema = z.object({
  checkInStart: z.date().optional(),
  checkInEnd: z.date().optional(),
  checkOutStart: z.date().optional(),
  checkOutEnd: z.date().optional()
})
export type ScheduleParamsType = z.infer<typeof ScheduleParamsSchema>
