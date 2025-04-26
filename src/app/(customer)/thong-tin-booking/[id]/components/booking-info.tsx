'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingStore } from '@/store/booking-store'
export default function BookingInfo() {
  const booking = useBookingStore((state) => state.booking)
  return (
    <Card className="w-full rounded-sm p-2">
      <CardHeader className="px-0">
        <CardTitle className="text-blue-900">{booking.hotelName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}
