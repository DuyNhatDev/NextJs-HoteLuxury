import { ColumnDef } from '@tanstack/react-table'
import { BookingListResType } from '@/schemas/booking-schema'
import { format, parseISO } from 'date-fns'
import { useContext } from 'react'
import { OrderTableContext } from '@/app/partner/order/components/order-table'
import CustomTooltip from '@/components/custom/tooltip'
import { CircleHelp, CircleX, CreditCard, Eye, FileCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type OrderItem = BookingListResType['data'][0]
const orderTableColumns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: 'customerName',
    header: 'Tên khách hàng',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('customerName')}</div>
  },
  {
    accessorKey: 'customerPhone',
    header: 'Số điện thoại',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('customerPhone')}</div>
  },
  {
    accessorKey: 'createdAt',
    header: 'Thời gian đặt',
    cell: ({ row }) => {
      const value = row.getValue('createdAt')
      const formattedDate = value ? format(parseISO(String(value)), 'dd/MM/yyyy HH:mm') : ''
      return <div>{formattedDate}</div>
    }
  },
  {
    accessorKey: 'dayStart',
    header: 'Ngày nhận - Ngày trả',
    cell: ({ row }) => {
      const checkIn = row.getValue('dayStart')
      const checkOut = row.getValue('dayEnd')
      const formattedCheckIn = checkIn ? format(parseISO(String(checkIn)), 'dd/MM/yyyy') : ''
      const formattedCheckOut = checkOut ? format(parseISO(String(checkOut)), 'dd/MM/yyyy') : ''

      return (
        <div>
          {formattedCheckIn} - {formattedCheckOut}
        </div>
      )
    }
  },
  {
    accessorKey: 'dayEnd',
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusColorMap = {
        'Đã thanh toán': {
          bg: 'bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10',
          text: 'text-emerald-500',
          dot: 'bg-emerald-500'
        },
        'Chưa thanh toán': {
          bg: 'bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10',
          text: 'text-amber-500',
          dot: 'bg-amber-500'
        },
        'Đã hủy': {
          bg: 'bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10',
          text: 'text-red-500',
          dot: 'bg-red-500'
        },
        'Đã hết phòng': {
          bg: 'bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10',
          text: 'text-gray-500',
          dot: 'bg-gray-500'
        }
      } as const

      type StatusType = keyof typeof statusColorMap

      const color: {
        bg: string
        text: string
        dot: string
      } = statusColorMap[status as StatusType] || {
        bg: 'bg-gray-600/10 dark:bg-gray-600/20 hover:bg-gray-600/10',
        text: 'text-gray-500',
        dot: 'bg-gray-500'
      }
      return <Badge className={`${color.bg} ${color.text} rounded-full shadow-none`}>{status}</Badge>
    },
    filterFn: 'includesString'
  },
  {
    accessorKey: 'isConfirmed',
    header: 'Xác nhận',
    cell: ({ row }) => {
      const isConfirmed = row.getValue('isConfirmed')
      return <div>{isConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</div>
    },
    filterFn: (row, columnId, filterValue) => {
      return row.getValue(columnId) === filterValue
    },
    enableHiding: false
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setOrderIdView, setOrderCheck, setOrderConfirm, setOrderReject, setOrderPayment } =
        useContext(OrderTableContext)

      const openOrderView = () => setOrderIdView(row.original.bookingId)
      const openOrderCheck = () => setOrderCheck(row.original)
      const openOrderConfirm = () => setOrderConfirm(row.original)
      const openOrderReject = () => setOrderReject(row.original)
      const openOrderPayment = () => setOrderPayment(row.original)

      const isConfirmed = row.original.isConfirmed
      const status = row.original.status

      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Xem chi tiết'>
            <Eye className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openOrderView} />
          </CustomTooltip>
          {!isConfirmed && (
            <>
              <CustomTooltip content='Kiểm tra'>
                <CircleHelp className='h-5 w-5 text-yellow-600 hover:cursor-pointer' onClick={openOrderCheck} />
              </CustomTooltip>
              <CustomTooltip content='Xác nhận'>
                <FileCheck className='h-5 w-5 text-green-600 hover:cursor-pointer' onClick={openOrderConfirm} />
              </CustomTooltip>
              <CustomTooltip content='Từ chối'>
                <CircleX className='h-5 w-5 text-red-600 hover:cursor-pointer' onClick={openOrderReject} />
              </CustomTooltip>
            </>
          )}
          {isConfirmed && status === 'Chưa thanh toán' && (
            <CustomTooltip content='Thanh toán'>
              <CreditCard className='h-5 w-5 text-gray-500 hover:cursor-pointer' onClick={openOrderPayment} />
            </CustomTooltip>
          )}
        </div>
      )
    }
  }
]
export default orderTableColumns
