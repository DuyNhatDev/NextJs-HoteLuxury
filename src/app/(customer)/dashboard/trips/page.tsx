import TabControl from '@/app/(customer)/dashboard/trips/components/tab-control'
import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đơn của tôi',
  description: 'Đơn của tôi'
}

export default function TripPage() {
  return (
    <Suspense>
      <TabControl />
    </Suspense>
  )
}
