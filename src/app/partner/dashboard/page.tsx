import PartnerDashboard from '@/app/partner/dashboard/components/partner-dashboard'
import { Card, CardContent } from '@/components/ui/card'

export default function PartnerDashboardPage() {
  return (
    <main className='grid w-full flex-1 items-start gap-4 overflow-x-hidden !p-0 sm:px-6 sm:py-0 md:gap-8'>
      <div className='w-full space-y-2 overflow-x-hidden'>
        <Card x-chunk='dashboard-06-chunk-0' className='bg-muted-50 w-full gap-3 overflow-x-hidden py-1'>
          <CardContent className='w-full overflow-x-hidden'>
            <PartnerDashboard />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
