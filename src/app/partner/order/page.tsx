import OrderTable from '@/app/partner/order/components/order-table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Suspense } from 'react'

export default function OrderPage() {
  return (
    <main className='grid flex-1 items-start gap-4 !p-0 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0' className='bg-muted-50 gap-3 py-1'>
          <CardHeader>{/* <CardTitle>Danh sách đơn</CardTitle> */}</CardHeader>
          <CardContent>
            <Suspense>
              <OrderTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
