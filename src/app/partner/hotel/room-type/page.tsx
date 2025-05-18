import RoomTypeTable from '@/app/partner/hotel/room-type/components/room-type-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default function PartnerPage() {
  return (
    <main className='grid flex-1 items-start gap-4 !p-0 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0' className='bg-muted-50 gap-3 py-5'>
          <CardHeader>
            <CardTitle>Danh sách loại phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <RoomTypeTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
