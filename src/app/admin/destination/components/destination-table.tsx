'use client'
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
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/custom/auto-pagination'
import { getLastTwoInitials } from '@/lib/utils'
import { PenLine, Trash2 } from 'lucide-react'
import CustomTooltip from '@/components/custom/tooltip'
import { DestinationListResType, DestinationType } from '@/schemas/destination.schema'
import { useGetDestinationList } from '@/hooks/queries/useDestination'
import AddDestination from '@/app/admin/destination/components/add-destination'
import EditDestination from '@/app/admin/destination/components/edit-destination'
import AlertDialogDeleteDestination from '@/app/admin/destination/components/delete-destination'

export type DestinationItem = DestinationListResType['data'][0]

const DestinationTableContext = createContext<{
  destinationIdEdit: number | undefined
  setDestinationIdEdit: (value: number) => void
  destinationDelete: DestinationItem | null
  setDestinationDelete: (value: DestinationItem | null) => void
}>({
  destinationIdEdit: undefined,
  setDestinationIdEdit: (value: number | undefined) => {},
  destinationDelete: null,
  setDestinationDelete: (value: DestinationItem | null) => {}
})

export const columns: ColumnDef<DestinationType>[] = [
  {
    accessorKey: 'locationImage',
    header: () => <div className='text-center'>Ảnh</div>,
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <Avatar className='aspect-square h-[50px] w-[50px] rounded-md object-cover'>
          <AvatarImage src={row.getValue('locationImage')} />
          <AvatarFallback className='rounded-none'>{getLastTwoInitials(row.original.locationName)}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: 'locationName',
    header: () => <div className='text-center'>Tên</div>,
    cell: ({ row }) => <div className='text-center capitalize'>{row.getValue('locationName')}</div>
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>Thao tác</div>,
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setDestinationIdEdit, setDestinationDelete } = useContext(DestinationTableContext)
      const openEditRoomType = () => {
        setDestinationIdEdit(row.original.locationId)
      }
      const openDeletePartner = () => {
        setDestinationDelete(row.original)
      }
      return (
        <div className='flex justify-center gap-3'>
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
export default function DestinationTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [destinationIdEdit, setDestinationIdEdit] = useState<number | undefined>()
  const [destinationDelete, setDestinationDelete] = useState<DestinationItem | null>(null)
  const destinationListQuery = useGetDestinationList()
  const data = destinationListQuery.data?.payload.data ?? []
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

  return (
    <DestinationTableContext.Provider
      value={{ destinationIdEdit, setDestinationIdEdit, destinationDelete, setDestinationDelete }}
    >
      <div className='w-full'>
        <EditDestination id={destinationIdEdit} setId={setDestinationIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteDestination
          destinationDelete={destinationDelete}
          setDestinationDelete={setDestinationDelete}
        />
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc theo tên'
            value={(table.getColumn('locationName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('locationName')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddDestination />
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
              pathname='/admin/destination'
            />
          </div>
        </div>
      </div>
    </DestinationTableContext.Provider>
  )
}
