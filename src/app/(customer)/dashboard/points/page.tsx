import PointHistory from '@/app/(customer)/dashboard/points/point-history'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LuxuryPoints',
  description: 'LuxuryPoints'
}

export default function PointPage() {
  return <PointHistory />
}
