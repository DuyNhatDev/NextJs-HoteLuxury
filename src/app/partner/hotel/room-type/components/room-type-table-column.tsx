import { RoomTypeTableContext } from '@/app/partner/hotel/room-type/components/room-type-table'
import CustomTooltip from '@/components/custom/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatCurrency, getLastTwoInitials } from '@/lib/utils'
import { RoomTypeListResType } from '@/schemas/room-type.schema'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { PenLine, Trash2 } from 'lucide-react'
import { useContext } from 'react'

export type RoomTypeItem = RoomTypeListResType['data'][0]

export const roomTypeTableColumns: ColumnDef<RoomTypeItem>[] = [
  {
    accessorKey: 'roomTypeImage',
    header: 'Ảnh',
    cell: ({ row }) => (
      <div>
        <Avatar className='aspect-square h-[50px] w-[50px] rounded-md object-cover'>
          <AvatarImage src={row.getValue('roomTypeImage')} />
          <AvatarFallback className='rounded-none'>{getLastTwoInitials(row.original.roomTypeName)}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: 'roomTypeName',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('roomTypeName')}</div>
  },
  {
    accessorKey: 'roomTypePrice',
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='!px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Giá cơ bản
          <CaretSortIcon className='h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div>{formatCurrency(row.getValue('roomTypePrice'))}</div>,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue<number>(columnId) ?? 0
      const b = rowB.getValue<number>(columnId) ?? 0
      return a - b
    }
  },
  {
    accessorKey: 'roomTypeWeekendPrice',
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='!px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Giá cuối tuần
          <CaretSortIcon className='h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div>{formatCurrency(row.getValue('roomTypeWeekendPrice'))}</div>,
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue<number>(columnId) ?? 0
      const b = rowB.getValue<number>(columnId) ?? 0
      return a - b
    }
  },
  {
    accessorKey: 'roomTypeQuantity',
    header: 'Số lượng',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('roomTypeQuantity') || '-'}</div>,
    accessorFn: (row) => row.roomTypeQuantity || ''
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setRoomTypeIdEdit, setRoomTypeDelete } = useContext(RoomTypeTableContext)
      const openEditRoomType = () => {
        setRoomTypeIdEdit(row.original.roomTypeId)
      }

      const openDeletePartner = () => {
        setRoomTypeDelete(row.original)
      }
      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Sửa'>
            <PenLine className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openEditRoomType} />
          </CustomTooltip>
          <CustomTooltip content='Xóa'>
            <Trash2 className='h-5 w-5 text-red-600 hover:cursor-pointer' onClick={openDeletePartner} />
          </CustomTooltip>
        </div>
      )
    }
  }
]
