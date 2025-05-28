'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetBookingList } from '@/hooks/queries/useBooking'
import { createContext, useEffect, useState } from 'react'
import orderTableColumns, { OrderItem } from '@/app/partner/order/components/order-table-column'
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
import CustomSelect from '@/components/custom/select'
import { bookingConfirmItems, bookingStatusItems } from '@/constants/type'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import ReactDateRange, { State } from '@/components/custom/react-date-range'
import AlertDialogCheckBooking from '@/app/partner/order/components/alert-check-order'
import AlertDialogConfirmBooking from '@/app/partner/order/components/alert-confirm-order'
import AlertDialogRejectBooking from '@/app/partner/order/components/alert-reject-order'
import AlertDialogPaymentBooking from '@/app/partner/order/components/alert-payment-order'
import { endOfDay, startOfDay } from 'date-fns'
import { useAppStore } from '@/store/app-store'
import { CreateBookingResType } from '@/schemas/booking-schema'
import { toast } from 'sonner'
import DetailBookingDialog from '@/app/partner/order/components/detail-booking'

export const OrderTableContext = createContext<{
  orderIdView: number | undefined
  setOrderIdView: (value: number) => void
  orderCheck: OrderItem | null
  setOrderCheck: (value: OrderItem | null) => void
  orderConfirm: OrderItem | null
  setOrderConfirm: (value: OrderItem | null) => void
  orderReject: OrderItem | null
  setOrderReject: (value: OrderItem | null) => void
  orderPayment: OrderItem | null
  setOrderPayment: (value: OrderItem | null) => void
}>({
  orderIdView: undefined,
  setOrderIdView: (value: number | undefined) => {},
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
  const socket = useAppStore((state) => state.socket)
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [orderIdView, setOrderIdView] = useState<number | undefined>()
  const [orderCheck, setOrderCheck] = useState<OrderItem | null>(null)
  const [orderConfirm, setOrderConfirm] = useState<OrderItem | null>(null)
  const [orderReject, setOrderReject] = useState<OrderItem | null>(null)
  const [orderPayment, setOrderPayment] = useState<OrderItem | null>(null)
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
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
  const { data, refetch } = useGetBookingList({
    filterStart: createdRange?.startDate,
    filterEnd: createdRange?.endDate,
    checkInStart: checkInRange?.startDate,
    checkInEnd: checkInRange?.endDate,
    checkOutStart: checkOutRange?.startDate,
    checkOutEnd: checkOutRange?.endDate
  })
  const listOrder = data?.payload?.data || []
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
    data: listOrder,
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

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onNewBooking(data: CreateBookingResType['data']) {
      const { customerName, roomQuantity } = data
      toast.success(`Khách hàng ${customerName} vừa đặt ${roomQuantity} phòng`)
      refetch()
    }
    function onCancelBooking(data: { customerName: string; bookingCode: string }) {
      const { customerName, bookingCode } = data
      toast.info(`Khách hàng ${customerName} vừa hủy đơn ${bookingCode}`)
      refetch()
    }
    socket?.on('new-booking', onNewBooking)
    socket?.on('cancel-booking', onCancelBooking)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('new-booking', onNewBooking)
      socket?.off('cancel-booking', onNewBooking)
    }
  }, [refetch, socket])

  return (
    <OrderTableContext.Provider
      value={{
        orderIdView,
        setOrderIdView,
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
        <DetailBookingDialog id={orderIdView} setId={setOrderIdView} />
        <AlertDialogCheckBooking bookingCheck={orderCheck} setBookingCheck={setOrderCheck} />
        <AlertDialogConfirmBooking bookingConfirm={orderConfirm} setBookingConfirm={setOrderConfirm} />
        <AlertDialogRejectBooking bookingReject={orderReject} setBookingReject={setOrderReject} />
        <AlertDialogPaymentBooking bookingPayment={orderPayment} setBookingPayment={setOrderPayment} />
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
        <div className='flex items-center justify-end space-x-2 pt-1'>
          <div className='text-muted-foreground flex-1 py-2 text-xs'>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{listOrder.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/partner/order'
            />
          </div>
        </div>
      </div>
    </OrderTableContext.Provider>
  )
}
