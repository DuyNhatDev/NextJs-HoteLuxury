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
import { LocationListResType, LocationType } from '@/schemas/location.schema'
import { useGetLocationList } from '@/hooks/queries/useLocation'
import AddLocation from '@/app/admin/location/components/add-location'
import EditLocation from '@/app/admin/location/components/edit-location'
import AlertDialogDeleteLocation from '@/app/admin/location/components/delete-location'

export type LocationItem = LocationListResType['data'][0]

const LocationTableContext = createContext<{
  locationIdEdit: number | undefined
  setLocationIdEdit: (value: number) => void
  locationDelete: LocationItem | null
  setLocationDelete: (value: LocationItem | null) => void
}>({
  locationIdEdit: undefined,
  setLocationIdEdit: (value: number | undefined) => {},
  locationDelete: null,
  setLocationDelete: (value: LocationItem | null) => {}
})

export const columns: ColumnDef<LocationType>[] = [
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
      const { setLocationIdEdit, setLocationDelete } = useContext(LocationTableContext)
      const openEditRoomType = () => {
        setLocationIdEdit(row.original.locationId)
      }
      const openDeletePartner = () => {
        setLocationDelete(row.original)
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
export default function LocationTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [locationIdEdit, setLocationIdEdit] = useState<number | undefined>()
  const [locationDelete, setLocationDelete] = useState<LocationItem | null>(null)
  const { data: destinationListQuery } = useGetLocationList()
  const data = destinationListQuery?.payload.data.reverse() ?? []
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
    <LocationTableContext.Provider value={{ locationIdEdit, setLocationIdEdit, locationDelete, setLocationDelete }}>
      <div className='w-full'>
        <EditLocation id={locationIdEdit} setId={setLocationIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeleteLocation locationDelete={locationDelete} setLocationDelete={setLocationDelete} />
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc theo tên'
            value={(table.getColumn('locationName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('locationName')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddLocation />
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
              pathname='/admin/location'
            />
          </div>
        </div>
      </div>
    </LocationTableContext.Provider>
  )
}
