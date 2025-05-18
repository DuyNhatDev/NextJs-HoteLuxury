import { ColumnDef } from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import { useContext } from 'react'
import CustomTooltip from '@/components/customize/tooltip'
import { Trash2 } from 'lucide-react'
import { ScheduleListResType } from '@/schemaValidations/schedule.schema'
import { ScheduleTableContext } from '@/app/partner/schedule/components/schedule-table'

export type ScheduleItem = ScheduleListResType['data'][0]
const scheduleTableColumns: ColumnDef<ScheduleItem>[] = [
  {
    accessorKey: 'bookingCode',
    header: 'Mã đơn',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('bookingCode')}</div>
  },
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
    accessorKey: 'dayStart',
    header: 'Ngày nhận phòng',
    cell: ({ row }) => {
      const value = row.getValue('dayStart')
      const formattedDate = value ? format(parseISO(String(value)), 'dd/MM/yyyy') : ''
      return <div>{formattedDate}</div>
    }
  },
  {
    accessorKey: 'dayEnd',
    header: 'Ngày trả phòng',
    cell: ({ row }) => {
      const value = row.getValue('dayEnd')
      const formattedDate = value ? format(parseISO(String(value)), 'dd/MM/yyyy') : ''
      return <div>{formattedDate}</div>
    }
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setScheduleDelete } = useContext(ScheduleTableContext)
      const openScheduleDelete = () => setScheduleDelete(row.original)

      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Xóa'>
            <Trash2 className='h-5 w-5 text-red-600 hover:cursor-pointer' onClick={openScheduleDelete} />
          </CustomTooltip>
        </div>
      )
    }
  }
]
export default scheduleTableColumns
