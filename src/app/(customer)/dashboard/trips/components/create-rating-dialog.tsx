'use client'
import { useCreateRatingMutation } from '@/hooks/queries/useRating'
import { CreateRatingBodySchema, CreateRatingBodyType } from '@/schemaValidations/rating.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { MultiUploadImage } from '@/components/customize/multi-upload-image'
import { Textarea } from '@/components/ui/textarea'
import { BookingType } from '@/schemaValidations/booking-schema'
import Rating from '@mui/material/Rating'
import Image from 'next/image'
import { handleErrorApi, removePhong } from '@/lib/utils'
import { toast } from 'sonner'

type RatingDialogProps = {
  open: boolean
  setOpen: (value: boolean) => void
  booking: BookingType
}

export default function CreateRatingDialog({ open, setOpen, booking }: RatingDialogProps) {
  const createRatingMutation = useCreateRatingMutation()
  const [files, setFiles] = useState<File[]>([])
  const [shouldRenderRating, setShouldRenderRating] = useState(false)
  const form = useForm<CreateRatingBodyType>({
    resolver: zodResolver(CreateRatingBodySchema),
    defaultValues: {
      hotelId: booking.hotelId,
      ratingStar: 5,
      ratingDescription: '',
      ratingDate: new Date(),
      ratingImages: undefined
    }
  })

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShouldRenderRating(true)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setShouldRenderRating(false)
    }
  }, [open])

  const reset = () => {
    form.reset()
    setOpen(false)
    setFiles([])
  }
  const onSubmit = async (data: CreateRatingBodyType) => {
    if (createRatingMutation.isPending) return
    try {
      let body = { ...data, ratingStar: data.ratingStar * 2 }
      if (files) {
        body = {
          ...body,
          ratingImages: files
        }
      }
      await createRatingMutation.mutateAsync({ id: Number(booking.bookingId), body })
      toast.success('Đánh giá thành công')
      reset()
      setOpen(false)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Đánh giá</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-hotel-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 py-0'>
              <div className='text-lg'>{booking.hotelName}</div>
              <div className='flex items-center gap-4'>
                <div className='relative h-20 w-25 overflow-hidden hover:cursor-pointer'>
                  <Image src={booking.roomTypeImage} alt={booking.hotelName} fill className='object-cover' />
                </div>

                <div className='text-lg'>Phòng {removePhong(booking.roomTypeName)}</div>
              </div>

              <div className='grid gap-7'>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='ratingStar'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='flex gap-2'>
                          <FormLabel htmlFor='ratingStar'>Chọn số điểm</FormLabel>
                          <FormControl>
                            {shouldRenderRating && (
                              <Rating
                                value={field.value ?? 5}
                                onChange={(event, newValue) => field.onChange(newValue)}
                                max={5}
                                precision={0.5}
                                size='large'
                              />
                            )}
                          </FormControl>
                          <span className='mt-1'>{(field.value || 0) * 2}/10</span>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='grid gap-7'>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='ratingDescription'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='hotelName'>Mô tả</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Hãy chia sẻ nhận xét cho khách sạn này bạn nhé!'
                              className='break-all'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name='ratingImages'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thêm hình ảnh</FormLabel>
                    <FormControl>
                      <MultiUploadImage
                        value={(field.value || []).map((item) =>
                          typeof item === 'string' ? item : item instanceof File ? URL.createObjectURL(item) : ''
                        )}
                        maxImages={20}
                        onChange={(urls, files) => {
                          field.onChange(urls)
                          setFiles(files)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-hotel-form' className=''>
            {createRatingMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
            Gửi đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
