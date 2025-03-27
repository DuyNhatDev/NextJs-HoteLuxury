import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

export default function PartnerPage() {
  return (
    <main className="grid flex-1 items-start gap-4 !p-0 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0" className="bg-muted-50 gap-3 py-5">
          <CardHeader>
            <CardTitle>Tài khoản người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              {/* <PartnerTable /> */}
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
