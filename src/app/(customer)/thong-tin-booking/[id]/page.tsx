import BookingForm from '@/app/(customer)/thong-tin-booking/[id]/components/booking-form'
import BookingInfo from '@/app/(customer)/thong-tin-booking/[id]/components/booking-info'

export default function BookingPage() {
  return (
    <div className="mx-auto px-4 py-5">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="w-full lg:basis-4/7">
          <BookingForm />
        </div>
        <div className="w-full lg:basis-3/7">
          <BookingInfo />
        </div>
      </div>
    </div>
  )
}
