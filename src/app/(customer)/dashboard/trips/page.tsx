import TabControl from '@/app/(customer)/dashboard/trips/components/tab-control'
import { Suspense } from 'react'

export default function TripPage() {
  return (
    <Suspense>
      <TabControl />
    </Suspense>
  )
}
