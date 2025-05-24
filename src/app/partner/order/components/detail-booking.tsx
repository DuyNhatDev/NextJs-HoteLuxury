import { Button } from '@/components/ui/button'
import { useGetDetailBooking } from '@/queries/useBooking'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Fragment } from 'react'
import { format, parseISO } from 'date-fns'
import { formatDayWithDate } from '@/lib/utils'

type DetailBookingDialogProps = {
  id: number | undefined
  setId: (value: number | undefined) => void
}

export default function DetailBookingDialog({ id, setId }: DetailBookingDialogProps) {
  const { data } = useGetDetailBooking(id, Boolean(id))
  const booking = data?.payload?.data

  const bookingInfo = [
    {
      title: 'Thông tin đơn đặt phòng',
      items: [
        ['Mã đơn', booking?.bookingCode],
        ['Phương thức thanh toán', booking?.paymentMethod],
        ['Trạng thái', booking?.status],
        ['Xác nhận', booking?.isConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận']
      ]
    },
    {
      title: 'Thông tin khách hàng',
      items: [
        ['Họ tên', `${booking?.title || ''} ${booking?.customerName || ''}`],
        ['SĐT', booking?.customerPhone],
        ['Email', booking?.customerEmail]
      ]
    },
    {
      title: 'Thông tin phòng',
      items: [
        ['Loại phòng', booking?.roomTypeName],
        ['Số lượng phòng', booking?.roomQuantity],
        ['Giá', booking?.price ? `${Number(booking.price).toLocaleString('vi-VN')} VNĐ` : '']
      ]
    },
    {
      title: 'Thời gian & ghi chú',
      items: [
        ['Thời gian đặt', booking?.createdAt ? format(parseISO(String(booking.createdAt)), 'HH:mm dd/MM/yyyy') : ''],
        [
          'Ngày nhận - Ngày Trả',
          booking?.dayStart && booking?.dayEnd
            ? `${formatDayWithDate(new Date(String(booking.dayStart)))} → ${formatDayWithDate(new Date(String(booking.dayEnd)))}`
            : 'Không xác định'
        ],
        ['Ghi chú', booking?.note || 'Không có ghi chú']
      ]
    }
  ]
  const reset = () => {
    setId(undefined)
  }
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Chi tiết đơn</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 p-0 text-sm'>
          {bookingInfo.map((section, index) => (
            <div key={index} className='rounded-lg border border-gray-200 p-4 shadow-sm'>
              <h3 className='mb-3 text-base font-semibold'>{section.title}</h3>
              <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                {section.items.map(([label, value], idx) => (
                  <Fragment key={idx}>
                    <div className='font-medium text-gray-600'>{label}:</div>
                    <div className='font-medium'>{value}</div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={reset}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
