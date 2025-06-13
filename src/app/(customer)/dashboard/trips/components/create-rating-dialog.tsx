'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MultiUploadImage } from '@/components/custom/multi-upload-image'
import Rating from '@mui/material/Rating'
import Image from 'next/image'
import { useState } from 'react'
import { handleErrorApi, removePhong } from '@/lib/utils'
import { BookingType } from '@/schemas/booking-schema'
import { useCreateRatingMutation } from '@/hooks/queries/useRating'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

type RatingDialogProps = {
  open: boolean
  setOpen: (value: boolean) => void
  booking: BookingType
}

export default function CreateRatingDialog({ open, setOpen, booking }: RatingDialogProps) {
  const createRatingMutation = useCreateRatingMutation()
  const [ratingStar, setRatingStar] = useState(5)
  const [ratingDescription, setRatingDescription] = useState('')
  const [ratingImages, setRatingImages] = useState<string[] | File[]>([])
  const [files, setFiles] = useState<File[]>([])

  const reset = () => {
    setRatingStar(5)
    setRatingDescription('')
    setRatingImages([])
    setFiles([])
    setOpen(false)
  }

  const onSubmit = async () => {
    if (createRatingMutation.isPending) return
    const data = {
      hotelId: booking.hotelId,
      ratingStar,
      ratingDescription,
      ratingImages,
      ratingDate: new Date()
    }

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
        error
        //setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset()
      }}
    >
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Đánh giá</DialogTitle>
        </DialogHeader>

        <form
          noValidate
          className='grid auto-rows-max items-start gap-4 md:gap-8'
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <div className='grid gap-4 py-0'>
            <div className='text-lg'>{booking.hotelName}</div>
            <div className='flex items-center gap-4'>
              <div className='relative h-20 w-25 overflow-hidden'>
                <Image src={booking.roomTypeImage} alt={booking.hotelName} fill className='object-cover' />
              </div>
              <div className='text-lg'>Phòng {removePhong(booking.roomTypeName)}</div>
            </div>

            <div className='flex items-center gap-2'>
              <span>Chọn số điểm:</span>
              <Rating
                value={ratingStar}
                onChange={(event, newValue) => setRatingStar(newValue ?? 5)}
                max={5}
                precision={0.5}
                size='large'
              />
              <span>{(ratingStar || 0) * 2}/10</span>
            </div>

            <div className='grid gap-2'>
              <span>Mô tả:</span>
              <Textarea
                placeholder='Hãy chia sẻ nhận xét cho khách sạn này bạn nhé!'
                value={ratingDescription}
                onChange={(e) => setRatingDescription(e.target.value)}
              />
            </div>

            <div className='grid gap-2'>
              <span>Thêm hình ảnh:</span>
              <MultiUploadImage
                value={(ratingImages || []).map((item) =>
                  typeof item === 'string' ? item : item instanceof File ? URL.createObjectURL(item) : ''
                )}
                maxImages={20}
                onChange={(urls, files) => {
                  setRatingImages(urls)
                  setFiles(files)
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type='submit'>
              {createRatingMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
              Gửi đánh giá
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
