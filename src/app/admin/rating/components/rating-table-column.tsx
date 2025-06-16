import { RatingTableContext } from '@/app/admin/rating/components/rating-table'
import CustomTooltip from '@/components/custom/tooltip'
import { useHiddenRatingMutation } from '@/hooks/queries/useRating'
import { handleErrorApi } from '@/lib/utils'
import { AdminRatingListResType } from '@/schemas/rating.schema'
import { Switch } from '@mui/material'
import { ColumnDef } from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import { Eye, PenLine, Trash2 } from 'lucide-react'
import { useContext } from 'react'

export type RatingItem = AdminRatingListResType['data'][0]

export const adminRatingTableColumns: ColumnDef<RatingItem>[] = [
  {
    accessorKey: 'fullname',
    header: 'Tên',
    accessorFn: (row) => row.userId.fullname,
    id: 'fullname',
    cell: ({ row }) => {
      const fullname = row.getValue<string>('fullname')
      return <div className='capitalize'>{fullname}</div>
    }
  },
  {
    accessorKey: 'hotelName',
    header: 'Khách sạn',
    accessorFn: (row) => row.hotelId.hotelName,
    id: 'hotelName',
    cell: ({ row }) => {
      const hotelName = row.getValue<string>('hotelName')
      return (
        <div className='max-w-[300px] truncate capitalize' title={hotelName}>
          {hotelName}
        </div>
      )
    }
  },
  {
    accessorKey: 'ratingDescription',
    header: 'Nội dung',
    cell: ({ row }) => {
      const description = row.getValue<string>('ratingDescription');
      return (
        <div
          className="truncate max-w-[300px] capitalize"
          title={description}
        >
          {description}
        </div>
      )
    }
  },
  {
    accessorKey: 'ratingDate',
    header: 'Thời gian',
    cell: ({ row }) => (
      <div className='capitalize'>{format(parseISO(String(row.getValue('ratingDate'))), 'dd/MM/yyyy')}</div>
    )
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { mutateAsync } = useHiddenRatingMutation()
      const { setRatingView, setRatingDelete } = useContext(RatingTableContext)
      const openViewRating = () => {
        setRatingView(row.original)
      }
      const handleHiddenRating = async (newValue: boolean) => {
        try {
          await mutateAsync({ id: row.original.ratingId, body: { isHidden: !newValue } })
        } catch (error) {
          handleErrorApi({ error })
        }
      }
      const openDeleteRating = () => {
        setRatingDelete(row.original)
      }
      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Xem chi tiết'>
            <Eye className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openViewRating} />
          </CustomTooltip>
          <CustomTooltip content='Ẩn'>
            <Switch
              checked={!row.original.isHidden}
              onChange={(e) => handleHiddenRating(e.target.checked)}
              size='small'
            />
          </CustomTooltip>
          <CustomTooltip content='Xóa'>
            <Trash2 className='h-5 w-5 text-red-600 hover:cursor-pointer' onClick={openDeleteRating} />
          </CustomTooltip>
        </div>
      )
    }
  }
]
