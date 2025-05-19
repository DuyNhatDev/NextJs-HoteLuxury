'use client'
import { CaretSortIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/customize/auto-pagination'
import { formatCurrency, getLastTwoInitials } from '@/lib/utils'
import { PenLine, Trash2 } from 'lucide-react'
import CustomTooltip from '@/components/customize/tooltip'
import { RoomTypeListResType, RoomTypeType } from '@/schemaValidations/room-type.schema'
import { useGetRoomTypeList } from '@/queries/useRoomType'
import AddRoomType from '@/app/partner/hotel/room-type/components/add-room-type'
import EditRoomType from '@/app/partner/hotel/room-type/components/edit-room-type'
import AlertDialogDeleteRoomType from '@/app/partner/hotel/room-type/components/delete-room-type'
import { useGetHotelList } from '@/queries/useHotel'
import { HotelType } from '@/schemaValidations/hotel.schema'

export type RoomTypeItem = RoomTypeListResType['data'][0]

const RoomTypeTableContext = createContext<{
  roomTypeIdEdit: number | undefined
  setRoomTypeIdEdit: (value: number) => void
  roomTypeDelete: RoomTypeItem | null
  setRoomTypeDelete: (value: RoomTypeItem | null) => void
}>({
  roomTypeIdEdit: undefined,
  setRoomTypeIdEdit: (value: number | undefined) => {},
  roomTypeDelete: null,
  setRoomTypeDelete: (value: RoomTypeItem | null) => {}
})

export const columns: ColumnDef<RoomTypeType>[] = [
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

const PAGE_SIZE = 5
export default function RoomTypeTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [roomTypeIdEdit, setRoomTypeIdEdit] = useState<number | undefined>()
  const [roomTypeDelete, setRoomTypeDelete] = useState<RoomTypeItem | null>(null)
  const hotelData = useGetHotelList()
  const myHotel: HotelType | undefined = hotelData.data?.payload?.data[0]
  const [hotelId, setHotelId] = useState<number | undefined>()
  const roomTypeListQuery = useGetRoomTypeList()
  const data = roomTypeListQuery.data?.payload.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  useEffect(() => {
    const hotelId = myHotel?.hotelId
    setHotelId(hotelId)
  }, [myHotel])

  return (
    <RoomTypeTableContext.Provider value={{ roomTypeIdEdit, setRoomTypeIdEdit, roomTypeDelete, setRoomTypeDelete }}>
      <div className='w-full'>
        <EditRoomType id={roomTypeIdEdit} setId={setRoomTypeIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteRoomType roomTypeDelete={roomTypeDelete} setRoomTypeDelete={setRoomTypeDelete} />
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc theo tên'
            value={(table.getColumn('roomTypeName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('roomTypeName')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Lọc theo giá cơ bản'
            value={(table.getColumn('roomTypePrice')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('roomTypePrice')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Lọc theo giá cuối tuần'
            value={(table.getColumn('roomTypeWeekendPrice')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('roomTypeWeekendPrice')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddRoomType hotelId={hotelId!} />
          </div>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 pt-4'>
          <div className='text-muted-foreground flex-1 py-4 text-xs'>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/partner/hotel/room-type'
            />
          </div>
        </div>
      </div>
    </RoomTypeTableContext.Provider>
  )
}
