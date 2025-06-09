import OrderDetail from '@/app/(customer)/dashboard/trips/[id]/order-detail'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chi tiết đơn',
  description: 'Chi tiết đơn'
}

export default function OrderDetailPage() {
  return <OrderDetail />
}
