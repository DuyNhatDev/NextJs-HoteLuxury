'use client'
import Gallery from '@/components/customize/gallery'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getLastTwoInitials } from '@/lib/utils'
import { useGetRatingList } from '@/queries/useRating'
import { Rating } from '@mui/material'
import { useEffect, useState } from 'react'

type ListRatingProps = {
  hotelId: number
  hotelName: string
  onSetRating: ({ total, average }: { total: number; average: number }) => void
}
export default function ListRating({ hotelId, hotelName, onSetRating }: ListRatingProps) {
  const listRatingQuery = useGetRatingList(hotelId)
  const listRating = listRatingQuery?.data?.payload?.data || []
  const listImage = listRatingQuery?.data?.payload?.allRatingImagesArray || []
  const totalRating = listRating.length
  const averageRating =
    totalRating > 0
      ? parseFloat((listRating.reduce((sum, rating) => sum + (rating.ratingStar || 0), 0) / totalRating).toFixed(1))
      : 0
  const [visibleCount, setVisibleCount] = useState(10)
  const visibleRatingList = listRating.slice(0, visibleCount)
  const ratingRemaining = Math.max(listRating.length - visibleCount, 0)
  
  useEffect(() => {
    if (averageRating > 0) {
      onSetRating({ total: totalRating, average: averageRating })
    }
  }, [totalRating, averageRating, onSetRating])

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  return (
    <div className='w-full'>
      <h2 className='py-2 font-semibold text-blue-900'>Đánh giá của khách hàng về {hotelName}</h2>
      <div className='flex items-center gap-2'>
        <Rating name='average-rating' value={averageRating / 2} precision={0.5} readOnly size='large' />
        <Badge className='rounded-sm bg-green-600 px-3 py-1 text-lg font-normal'>{averageRating.toFixed(1)}/10</Badge>
        <p className='text-lg text-gray-500'>| {totalRating} đánh giá</p>
      </div>
      <div className='mt-1 py-2'>{listImage.length > 0 && <Gallery images={listImage} maxLength={9} />}</div>
      <p className='mt-3 font-semibold'>Đánh giá gần đây</p>
      <div className='py-4'>
        {visibleRatingList.map((rating, index) => (
          <div
            key={rating.ratingId}
            className={`grid grid-cols-10 gap-4 py-3 ${
              index !== listRating.length - 1 ? 'border-b border-gray-300' : ''
            }`}
          >
            <div className='col-span-3'>
              <div className='flex items-center gap-2'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={rating.userId.image} />
                  <AvatarFallback>{getLastTwoInitials(rating.userId.fullname)}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-0'>
                  <p className='font-semibold'>{rating.userId.fullname}</p>
                  <p className='text-sm text-gray-500'>{formatDate(String(rating.ratingDate))}</p>
                </div>
              </div>
            </div>
            <div className='col-span-7'>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-1'>
                  <Rating name='read-only' value={rating.ratingStar / 2} precision={0.5} readOnly size='small' />
                  <Badge className='rounded-sm bg-green-600 text-xs font-normal'>{rating.ratingStar}/10</Badge>
                </div>
                <p className='font-normal'>{rating.ratingDescription}</p>
                <div className='mt-1 flex gap-2'>
                  {Array.isArray(rating?.ratingImages) && rating.ratingImages.length > 0 && (
                    <div className='mt-1'>
                      <Gallery images={rating.ratingImages as string[]} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ratingRemaining > 0 && (
        <div className='mt-4 flex justify-center'>
          <Button
            variant='outline'
            onClick={handleShowMore}
            className='border-blue-60 border-blue-700 text-blue-700 hover:text-blue-700'
          >
            Xem thêm {ratingRemaining} nhận xét
          </Button>
        </div>
      )}
    </div>
  )
}
