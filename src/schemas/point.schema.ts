import z from 'zod'

export const PointSchema = z.object({
  pointHistoryId: z.number(),
  userId: z.number(),
  point: z.number(),
  description: z.string(),
  isPlus: z.boolean(),
  createdAt: z.date()
})

export type PointType = z.infer<typeof PointSchema>

export const PointHistoryResSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(PointSchema)
})

export type PointHistoryResType = z.infer<typeof PointHistoryResSchema>
