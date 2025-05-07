import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { AccountType } from '@/schemaValidations/account.schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useContext, createContext } from 'react'
import { getLastTwoInitials } from '@/lib/utils'
import { PenLine, Trash2 } from 'lucide-react'
import CustomTooltip from '@/components/customize/tooltip'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { PartnerItem } from '@/app/partner/manage/order/confirmed/components/confirmed-order-table'

export const PartnerTableContext = createContext<{
  partnerIdEdit: number | undefined
  setPartnerIdEdit: (value: number) => void
  partnerDelete: PartnerItem | null
  setPartnerDelete: (value: PartnerItem | null) => void
}>({
  partnerIdEdit: undefined,
  setPartnerIdEdit: (value: number | undefined) => {},
  partnerDelete: null,
  setPartnerDelete: (value: PartnerItem | null) => {}
})
export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => (
      <div>
        <Avatar className='aspect-square h-[50px] w-[50px] rounded-md object-cover'>
          <AvatarImage src={row.getValue('image')} />
          <AvatarFallback className='rounded-none'>{getLastTwoInitials(row.original.fullname)}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: 'fullname',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('fullname')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('phoneNumber') || '-'}</div>,
    accessorFn: (row) => row.phoneNumber || ''
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setPartnerIdEdit, setPartnerDelete } = useContext(PartnerTableContext)
      const openEditPartner = () => {
        setPartnerIdEdit(row.original.userId)
      }

      const openDeletePartner = () => {
        setPartnerDelete(row.original)
      }
      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Sửa'>
            <PenLine className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openEditPartner} />
          </CustomTooltip>
          <CustomTooltip content='Xóa'>
            <Trash2 className='h-5 w-5 text-red-600 hover:cursor-pointer' onClick={openDeletePartner} />
          </CustomTooltip>
        </div>
      )
    }
  }
]
