import { ColumnDef } from '@tanstack/react-table'
import { BookingListResType } from '@/schemaValidations/booking-schema'
import { format, parseISO } from 'date-fns'
import { useContext } from 'react'
import { OrderTableContext } from '@/app/partner/manage/order/list/components/order-table'
import CustomTooltip from '@/components/customize/tooltip'
import { CircleHelp, CircleX, Eye, FileCheck } from 'lucide-react'

export type OrderItem = BookingListResType['data'][0]

const orderTableColumns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: 'customerName',
    header: 'Tên',
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
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setOrderAction } = useContext(OrderTableContext)

      const openActionOrder = () => {
        setOrderAction(row.original)
      }
      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Xem chi tiết'>
            <Eye className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openActionOrder} />
          </CustomTooltip>
          <CustomTooltip content='Kiểm tra'>
            <CircleHelp className='h-5 w-5 text-yellow-600 hover:cursor-pointer' onClick={openActionOrder} />
          </CustomTooltip>
          <CustomTooltip content='Xác nhận'>
            <FileCheck className='h-5 w-5 text-green-600 hover:cursor-pointer' onClick={openActionOrder} />
          </CustomTooltip>
          <CustomTooltip content='Từ chối'>
            <CircleX className='h-5 w-5 text-red-600 hover:cursor-pointer' onClick={openActionOrder} />
          </CustomTooltip>
        </div>
      )
    }
  }
]

export default orderTableColumns
