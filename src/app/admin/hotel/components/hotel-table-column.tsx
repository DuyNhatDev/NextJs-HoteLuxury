import { ColumnDef } from '@tanstack/react-table'
import { useContext } from 'react'
import CustomTooltip from '@/components/custom/tooltip'
import { Eye } from 'lucide-react'
import { AdminHotelListResType } from '@/schemas/hotel.schema'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import { AdminHotelTableContext } from '@/app/admin/hotel/components/hotel-table'
import { useRouter } from 'next/navigation'
import { useDisableHotelMutation } from '@/hooks/queries/useHotel'
import { Switch } from '@mui/material'

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
    header: 'Hoa hồng',
    size: 140,
    cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue('commission'))}</div>
  },
  {
    accessorKey: 'totalMoney',
    header: 'Tổng chênh lệch',
    size: 140,
    cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue('totalMoney'))}</div>
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    size: 80,
    cell: function Actions({ row }) {
      const { mutateAsync } = useDisableHotelMutation()
      const { setHotelIdView } = useContext(AdminHotelTableContext)
      const router = useRouter()
      const openHotelView = () => {
        setHotelIdView(row.original.hotelId)
        router.push(`/admin/hotel/${row.original.hotelId}`)
      }
      const handleToggleActive = async (newValue: boolean) => {
        try {
          await mutateAsync({ id: row.original.hotelId, body: { isDeleted: !newValue } })
        } catch (error) {
          handleErrorApi({ error })
        }
      }
      return (
        <div className='flex justify-center'>
          <CustomTooltip content='Xem chi tiết'>
            <Eye className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openHotelView} />
          </CustomTooltip>
          <CustomTooltip content='Active'>
            <Switch
              checked={!row.original.isDeleted}
              onChange={(e) => handleToggleActive(e.target.checked)}
              size='small'
            />
          </CustomTooltip>
        </div>
      )
    }
  }
]

export default adminHotelTableColumns
