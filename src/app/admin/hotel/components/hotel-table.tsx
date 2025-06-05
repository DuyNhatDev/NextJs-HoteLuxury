'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import AutoPagination from '@/components/custom/auto-pagination'
import { Input } from '@/components/ui/input'
import { endOfDay, startOfMonth } from 'date-fns'
import { State } from '@/types/react-date-range'
import DashboardFilterRange from '@/components/custom/dashboard-filter-range'
import adminHotelTableColumns from '@/app/admin/hotel/components/hotel-table-column'
import { useGetHotelListByAdmin } from '@/hooks/queries/useHotel'
import { CSVLink } from 'react-csv'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export const AdminHotelTableContext = createContext<{
  hotelIdView: number | undefined
  setHotelIdView: (value: number) => void
}>({
  hotelIdView: undefined,
  setHotelIdView: (value: number | undefined) => {}
})

const PAGE_SIZE = 10
export default function AdminHotelTable() {
  const searchParam = useSearchParams()
  const [isClient, setIsClient] = useState(false)
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [hotelIdView, setHotelIdView] = useState<number | undefined>()
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: startOfMonth(new Date()),
    endDate: endOfDay(new Date()),
    key: 'selection' as const
  })
  const { data } = useGetHotelListByAdmin({
    filterStart: createdRange?.startDate,
    filterEnd: createdRange?.endDate
  })

  const listHotel = data?.payload?.data || []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  const table = useReactTable({
    data: listHotel,
    columns: adminHotelTableColumns,
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
    setIsClient(true)
  }, [])

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  if (!isClient) {
    return null
  }

  const csvHeaders = () => {
    return table
      .getVisibleFlatColumns()
      .filter((col) => col.id !== 'actions')
      .map((col) => ({
        label: typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id,
        key: col.id
      }))
  }

  const csvData = table.getFilteredRowModel().rows.map((row) => ({
    hotelName: row.original.hotelName,
    locationName: row.original.locationName,
    totalBooking: row.original.totalBooking,
    totalPrice: row.original.totalPrice,
    totalFinalPrice: row.original.totalFinalPrice,
    commission: row.original.commission,
    totalMoney: row.original.totalMoney
  }))

  return (
    <AdminHotelTableContext.Provider
      value={{
        hotelIdView,
        setHotelIdView
      }}
    >
      <div className='w-full'>
        {/* <DetailBookingDialog id={hotelIdView} setId={setHotelIdView} /> */}
        <div className='flex items-center gap-2 pt-2 pb-4'>
          <DashboardFilterRange
            value={createdRange}
            onChange={(newRange) => setCreatedRange(newRange!)}
            className='bg-transparent'
            placeholder='Chọn khoảng thời gian'
          />
          <Input
            placeholder='Tên khách sạn'
            value={(table.getColumn('hotelName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('hotelName')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Địa điểm'
            value={(table.getColumn('locationName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('locationName')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <Button asChild>
            <CSVLink data={csvData} headers={csvHeaders()} filename='danh_sach_khach_san.csv'>
              <Download />
              Xuất CSV
            </CSVLink>
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
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
                  <TableCell colSpan={adminHotelTableColumns.length} className='h-24 text-center'>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-end space-x-2 pt-3'>
          <div className='text-muted-foreground flex-1 pt-2 text-xs'>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{listHotel.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/admin/hotel'
            />
          </div>
        </div>
      </div>
    </AdminHotelTableContext.Provider>
  )
}
