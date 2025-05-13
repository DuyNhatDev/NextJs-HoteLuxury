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
import ReactDateRange, { State } from '@/components/customize/react-date-range'
import AlertDialogCheckBooking from '@/app/partner/manage/order/list/components/alert-check-booking'

export const OrderTableContext = createContext<{
  
  orderView: OrderItem | null
  setOrderView: (value: OrderItem | null) => void
  orderCheck: OrderItem | null
  setOrderCheck: (value: OrderItem | null) => void
  orderConfirm: OrderItem | null
  setOrderConfirm: (value: OrderItem | null) => void
  orderReject: OrderItem | null
  setOrderReject: (value: OrderItem | null) => void
  orderPayment: OrderItem | null
  setOrderPayment: (value: OrderItem | null) => void
}>({
  orderView: null,
  setOrderView: (value: OrderItem | null) => {},
  orderCheck: null,
  setOrderCheck: (value: OrderItem | null) => {},
  orderConfirm: null,
  setOrderConfirm: (value: OrderItem | null) => {},
  orderReject: null,
  setOrderReject: (value: OrderItem | null) => {},
  orderPayment: null,
  setOrderPayment: (value: OrderItem | null) => {}
})

const PAGE_SIZE = 10
export default function OrderTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [orderView, setOrderView] = useState<OrderItem | null>(null)
  const [orderCheck, setOrderCheck] = useState<OrderItem | null>(null)
  const [orderConfirm, setOrderConfirm] = useState<OrderItem | null>(null)
  const [orderReject, setOrderReject] = useState<OrderItem | null>(null)
  const [orderPayment, setOrderPayment] = useState<OrderItem | null>(null)
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: undefined,
    endDate: undefined,
    key: 'selection' as const
  })
  const [checkInRange, setCheckInRange] = useState<State | undefined>({
    startDate: undefined,
    endDate: undefined,
    key: 'selection' as const
  })
  const [checkOutRange, setCheckOutRange] = useState<State | undefined>({
    startDate: undefined,
    endDate: undefined,
    key: 'selection' as const
  })
  const orderListQuery = useGetBookingList({
    filterStart: createdRange?.startDate,
    filterEnd: createdRange?.endDate,
    checkInStart: checkInRange?.startDate,
    checkInEnd: checkInRange?.endDate,
    checkOutStart: checkOutRange?.startDate,
    checkOutEnd: checkOutRange?.endDate
  })
  const data = orderListQuery?.data?.payload?.data || []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    isConfirmed: false,
    dayEnd: false
  })
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
    setCreatedRange({
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    })
    setCheckInRange({
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    })
    setCheckOutRange({
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    })
  }

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <OrderTableContext.Provider
      value={{
        orderView,
        setOrderView,
        orderCheck,
        setOrderCheck,
        orderConfirm,
        setOrderConfirm,
        orderReject,
        setOrderReject,
        orderPayment,
        setOrderPayment
      }}
    >
      <div className='w-full'>
        <AlertDialogCheckBooking bookingCheck={orderCheck} setBookingCheck={setOrderCheck} />
        <div className='flex items-center justify-between gap-6'>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Đặt phòng:</p>
            <ReactDateRange
              value={createdRange}
              onChange={(newRange) => setCreatedRange(newRange!)}
              className='bg-transparent'
              placeholder='Chọn ngày đặt phòng'
            />
          </div>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Nhận phòng:</p>
            <ReactDateRange
              value={checkInRange}
              onChange={(newRange) => setCheckInRange(newRange!)}
              className='bg-transparent'
              placeholder='Chọn ngày nhận phòng'
            />
          </div>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Trả phòng:</p>
            <ReactDateRange
              value={checkOutRange}
              onChange={(newRange) => setCheckOutRange(newRange!)}
              className='bg-transparent'
              placeholder='Chọn ngày trả phòng'
            />
          </div>
        </div>
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
            Đặt lại
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
