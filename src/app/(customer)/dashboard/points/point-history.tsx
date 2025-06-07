'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAccount } from '@/hooks/queries/useAccount'
import { useGetPointHistory } from '@/hooks/queries/usePoint'
import { getUserIdFromLocalStorage } from '@/lib/utils'
import { parseISO, format } from 'date-fns'
import { useState } from 'react'

export default function PointHistory() {
  const userId = getUserIdFromLocalStorage()
  const { data: userData } = useGetAccount(userId ?? undefined, Boolean(userId))
  const point = userData?.payload?.data?.point ?? 0
  const { data } = useGetPointHistory()
  const pointHistory = data?.payload?.data || []
  const [visibleCount, setVisibleCount] = useState(10)
  const visiblePointHistory = pointHistory.slice(0, visibleCount)
  const pointHistoryRemaining = Math.max(pointHistory.length - visibleCount, 0)

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  return (
    <Card className='gap-2 rounded py-5'>
      <CardHeader className='gap-0'>
        <CardTitle className='px-3 text-lg font-bold text-sky-500'>
          <span className='text-3xl'>{point}</span> điểm khả dụng
        </CardTitle>
        {pointHistory.length === 0 && <p className='font-normal text-gray-500'>Quý khách chưa có hoạt động nào!</p>}
      </CardHeader>
      <CardContent>
        <p className='text-lg font-semibold'>Lịch sử điểm</p>
        {visiblePointHistory.map((item) => (
          <div key={item.pointHistoryId} className='my-3 flex items-center justify-between border p-2'>
            <div className='flex flex-col items-start'>
              <p className='text-lg'>
                {item.isPlus ? '+' : '-'} {item.point}
              </p>
              <p className='text-sm text-gray-500'>{item.description}</p>
            </div>
            <p className='text-sm'>{format(parseISO(String(item.createdAt)), 'HH:mm dd/MM/yyyy')}</p>
          </div>
        ))}
        {pointHistoryRemaining > 0 && (
          <div className='mt-4 flex justify-center'>
            <p onClick={handleShowMore} className='border-blue-60 border-blue-700 text-blue-700 hover:text-blue-700'>
              Xem thêm {pointHistoryRemaining} thông báo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
