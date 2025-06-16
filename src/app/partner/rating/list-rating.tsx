'use client'
import Gallery from '@/components/custom/gallery'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getHotelIdFromLocalStorage, getLastTwoInitials } from '@/lib/utils'
import { useGetRatingList } from '@/hooks/queries/useRating'
import { useState } from 'react'
import { State } from '@/types/react-date-range'
import { Input } from '@/components/ui/input'
import { RotateCcw } from 'lucide-react'
import DashboardFilterRange from '@/components/custom/dashboard-filter-range'

export default function ListRating() {
  const hotelId = getHotelIdFromLocalStorage()
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: undefined,
    endDate: undefined,
    key: 'selection' as const
  })
  const [name, setName] = useState('')
  const { data: listRatingQuery } = useGetRatingList({
    hotelId: Number(hotelId),
    filterStart: createdRange?.startDate,
    filterEnd: createdRange?.endDate,
    fullname: name
  })
  const listRating = listRatingQuery?.payload?.data || []
  const [visibleCount, setVisibleCount] = useState(10)
  const visibleRatingList = listRating.slice(0, visibleCount)
  const ratingRemaining = Math.max(listRating.length - visibleCount, 0)

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  const handleReset = () => {
    setCreatedRange({
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    })
    setName('')
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <DashboardFilterRange
            value={createdRange}
            onChange={(newRange) => setCreatedRange(newRange!)}
            className='bg-transparent'
            placeholder='Chọn khoảng thời gian'
          />
          <Input placeholder='Lọc theo tên' value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <Button variant='outline' onClick={handleReset}>
          <RotateCcw />
          Đặt lại
        </Button>
      </div>
      <div className='mt-2 py-4'>
        {visibleRatingList.length === 0 ? (
          <p className='text-center text-gray-500'>Không có dữ liệu</p>
        ) : (
          visibleRatingList.map((rating, index) => (
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
                  <p className='font-semibold'>{rating.userId.fullname}</p>
                </div>
              </div>
              <div className='col-span-7'>
                <div className='flex flex-col gap-1'>
                  <div className='flex gap-1'>
                    <Badge className='rounded-sm bg-green-600 text-xs font-normal'>{rating.ratingStar}/10</Badge>
                    <p className='text-sm text-gray-500'>{formatDate(String(rating.ratingDate))}</p>
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
          ))
        )}
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
