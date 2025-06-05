import { ColumnDef } from '@tanstack/react-table'
import { useContext } from 'react'
import CustomTooltip from '@/components/custom/tooltip'
import { Eye } from 'lucide-react'
import { AdminHotelListResType } from '@/schemas/hotel.schema'
import { formatCurrency } from '@/lib/utils'
import { AdminHotelTableContext } from '@/app/admin/hotel/components/hotel-table'

export type AdminHotelItem = AdminHotelListResType['data'][0]
const adminHotelTableColumns: ColumnDef<AdminHotelItem>[] = [
  {
    accessorKey: 'hotelName',
    header: 'Tên khách sạn',
    size: 240,
    cell: ({ row }) => <div className='break-words whitespace-normal'>{row.getValue('hotelName')}</div>
  },
  {
    accessorKey: 'locationName',
    header: 'Địa điểm',
    size: 150,
    cell: ({ row }) => <div className='capitalize'>{row.getValue('locationName')}</div>
  },
  {
    accessorKey: 'totalBooking',
    header: 'Tổng số đơn',
    size: 100,
    cell: ({ row }) => <div className='text-center'>{row.getValue('totalBooking')}</div>
  },
  {
    accessorKey: 'totalPrice',
    header: 'Doanh thu ban đầu',
    size: 140,
    cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue('totalPrice'))}</div>
  },
  {
    accessorKey: 'totalFinalPrice',
    header: 'Doanh thu cuối cùng',
    size: 140,
    cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue('totalFinalPrice'))}</div>
  },
  {
    accessorKey: 'commission',
    header: 'Hoa hồng chênh lệch',
    size: 140,
    cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue('commission'))}</div>
  },
  {
    accessorKey: 'totalMoney',
    header: 'Tổng hoa hồng',
    size: 140,
    cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue('totalMoney'))}</div>
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    size: 80,
    cell: function Actions({ row }) {
      const { setHotelIdView } = useContext(AdminHotelTableContext)

      const openOrderView = () => setHotelIdView(row.original.hotelId)

      return (
        <div className='flex justify-center'>
          <CustomTooltip content='Xem chi tiết'>
            <Eye className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openOrderView} />
          </CustomTooltip>
        </div>
      )
    }
  }
]

export default adminHotelTableColumns
