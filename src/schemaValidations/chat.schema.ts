import z from 'zod'

export const ChatSchema = z.object({
  question: z.string()
})

export type ChatType = z.infer<typeof ChatSchema>

export const ChatResSchema = z.object({
  answer: z.string()
})

export type ChatResType = z.infer<typeof ChatResSchema>
