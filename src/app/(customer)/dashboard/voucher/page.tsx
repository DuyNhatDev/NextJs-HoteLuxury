import VoucherList from '@/app/(customer)/dashboard/voucher/voucher-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voucher của tôi',
  description: 'Voucher của tôi'
}

export default function VoucherPage() {
  return <VoucherList />
}
