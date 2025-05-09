'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetBookingList } from '@/queries/useBooking'
import { createContext, useEffect, useState } from 'react'
import orderTableColumns, { OrderItem } from '@/app/partner/manage/order/list/components/order-table-column'
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
import AutoPagination from '@/components/customize/auto-pagination'
import { Input } from '@/components/ui/input'
import CustomSelect from '@/components/customize/select'
import { bookingConfirmItems, bookingStatusItems } from '@/constants/type'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { DatePickerWithRange } from '@/components/customize/date-picker-with-range'

export const OrderTableContext = createContext<{
  orderAction: OrderItem | null
  setOrderAction: (value: OrderItem | null) => void
}>({
  orderAction: null,
  setOrderAction: (value: OrderItem | null) => {}
})

const PAGE_SIZE = 10
export default function OrderTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [orderAction, setOrderAction] = useState<OrderItem | null>(null)
  const orderListQuery = useGetBookingList({})
  const data = orderListQuery?.data?.payload?.data || []
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
    columns: orderTableColumns,
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

  const handleReset = () => {
    table.getColumn('customerName')?.setFilterValue('')
    table.getColumn('customerPhone')?.setFilterValue('')
    table.getColumn('status')?.setFilterValue('')
    table.getColumn('isConfirmed')?.setFilterValue('')
  }

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <OrderTableContext.Provider value={{ orderAction, setOrderAction }}>
      <div className='w-full'>
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Tên khách hàng'
            value={(table.getColumn('customerName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('customerName')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Số điện thoại'
            value={(table.getColumn('customerPhone')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('customerPhone')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <CustomSelect
            placeholder='Trạng thái'
            options={bookingStatusItems}
            value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
            onChange={(value) => table.getColumn('status')?.setFilterValue(value)}
            className='max-w-sm flex-1'
          />

          <CustomSelect
            placeholder='Xác nhận'
            options={bookingConfirmItems}
            value={
              table.getColumn('isConfirmed')?.getFilterValue() !== undefined
                ? String(table.getColumn('isConfirmed')?.getFilterValue())
                : ''
            }
            onChange={(value) => table.getColumn('isConfirmed')?.setFilterValue(value)}
            className='max-w-sm flex-1'
          />
          <Button variant='outline' onClick={handleReset}>
            <RotateCcw />
          </Button>
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
                  <TableCell colSpan={orderTableColumns.length} className='h-24 text-center'>
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
              pathname='/partner/manage/order/list'
            />
          </div>
        </div>
      </div>
    </OrderTableContext.Provider>
  )
}
