import HotelInformation from '@/app/partner/manage/hotel/information/components/hotel-info'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export default function HotelInformationPage() {
  return (
    <main className="grid flex-1 items-start gap-4 !p-0 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0" className="bg-muted-50 gap-3 py-5">
          <CardHeader>
            <CardTitle>Thông tin khách sạn</CardTitle>
          </CardHeader>
          <CardContent>
            <HotelInformation />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
