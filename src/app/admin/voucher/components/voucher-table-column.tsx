import { ColumnDef } from '@tanstack/react-table'
import { useContext } from 'react'
import CustomTooltip from '@/components/custom/tooltip'
import { PenLine, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { VoucherLisResType } from '@/schemas/voucher.schema'
import { VoucherTableContext } from '@/app/admin/voucher/components/voucher-table'
import { format, parseISO } from 'date-fns'

export type VoucherItem = VoucherLisResType['data'][0]
const voucherTableColumns: ColumnDef<VoucherItem>[] = [
  {
    accessorKey: 'code',
    header: 'Mã voucher',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('code')}</div>
  },
  {
    accessorKey: 'discountType',
    header: 'Loại voucher',
    cell: ({ row }) => {
      const type = row.getValue('discountType')
      return <div className='capitalize'>{type === 'fixed' ? 'Cố định' : 'Phần trăm'}</div>
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === 'all') return true
      return row.getValue(columnId) === filterValue
    }
  },
  {
    accessorKey: 'discountValue',
    header: 'Giá trị giảm',
    cell: ({ row }) => {
      const discountType = row.getValue<'fixed' | 'percentage'>('discountType')
      const discountValue = row.getValue<number>('discountValue')

      return (
        <div className='capitalize'>
          {discountType === 'fixed' ? formatCurrency(discountValue) : `${discountValue}%`}
        </div>
      )
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Số lượng',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('quantity')}</div>
  },
  {
    accessorKey: 'startedAt',
    header: 'Ngày bắt đầu',
    cell: ({ row }) => {
      const startedAt = row.getValue<string>('startedAt')
      if (!startedAt) return '-'

      const date = parseISO(startedAt)
      if (isNaN(date.getTime())) return '-'

      return <div className='capitalize'>{format(date, 'dd/MM/yyyy')}</div>
    }
  },
  {
    accessorKey: 'expiredAt',
    header: 'Ngày hết hạn',
    cell: ({ row }) => (
      <div className='capitalize'>{format(parseISO(String(row.getValue('expiredAt'))), 'dd/MM/yyyy')}</div>
    )
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setVoucherIdEdit, setVoucherDelete } = useContext(VoucherTableContext)
      const openEditVoucher = () => {
        setVoucherIdEdit(row.original.voucherId)
      }

      const openDeletePartner = () => {
        setVoucherDelete(row.original)
      }
      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Sửa'>
            <PenLine className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openEditVoucher} />
          </CustomTooltip>
          <CustomTooltip content='Xóa'>
            <Trash2 className='h-5 w-5 text-red-600 hover:cursor-pointer' onClick={openDeletePartner} />
          </CustomTooltip>
        </div>
      )
    }
  }
]

export default voucherTableColumns
