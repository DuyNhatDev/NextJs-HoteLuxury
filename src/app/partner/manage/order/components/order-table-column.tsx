import { ColumnDef } from '@tanstack/react-table'
import { BookingListResType } from '@/schemaValidations/booking-schema'
import { format, parseISO } from 'date-fns'
import { useContext } from 'react'
import { OrderTableContext } from '@/app/partner/manage/order/components/order-table'
import CustomTooltip from '@/components/customize/tooltip'
import { CircleHelp, CircleX, CreditCard, Eye, FileCheck } from 'lucide-react'

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
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
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
      const { setOrderView, setOrderCheck, setOrderConfirm, setOrderReject, setOrderPayment } =
        useContext(OrderTableContext)

      const openOrderView = () => setOrderView(row.original)
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
