import BookingForm from '@/app/(customer)/thong-tin-booking/[id]/components/booking-form'
import BookingInfo from '@/app/(customer)/thong-tin-booking/[id]/components/booking-info'

export default function BookingPage() {
  return (
    <div className="mx-auto w-full p-4">
      <div className="mx-auto flex w-full flex-col gap-15 py-3 sm:max-w-xl md:max-w-5xl lg:flex-row">
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
