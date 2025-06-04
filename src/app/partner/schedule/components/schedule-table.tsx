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
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import ReactDateRange from '@/components/custom/react-date-range'
import { useGetScheduleList } from '@/hooks/queries/useSchedule'
import scheduleTableColumns, { ScheduleItem } from '@/app/partner/schedule/components/schedule-table-column'
import AlertDialogDeleteSchedule from '@/app/partner/schedule/components/alert-delete-schedule'
import { State } from '@/types/react-date-range'

export const ScheduleTableContext = createContext<{
  scheduleDelete: ScheduleItem | null
  setScheduleDelete: (value: ScheduleItem | null) => void
}>({
  scheduleDelete: null,
  setScheduleDelete: (value: ScheduleItem | null) => {}
})

const PAGE_SIZE = 10
export default function ScheduleTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [scheduleDelete, setScheduleDelete] = useState<ScheduleItem | null>(null)
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
  const orderListQuery = useGetScheduleList({
    checkInStart: checkInRange?.startDate,
    checkInEnd: checkInRange?.endDate,
    checkOutStart: checkOutRange?.startDate,
    checkOutEnd: checkOutRange?.endDate
  })
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
    columns: scheduleTableColumns,
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
    table.getColumn('bookingCode')?.setFilterValue('')
    table.getColumn('customerName')?.setFilterValue('')
    table.getColumn('customerPhone')?.setFilterValue('')
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
    <ScheduleTableContext.Provider
      value={{
        scheduleDelete,
        setScheduleDelete
      }}
    >
      <div className='w-full'>
        <AlertDialogDeleteSchedule scheduleDelete={scheduleDelete} setScheduleDelete={setScheduleDelete} />
        <div className='flex items-center gap-10'>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Ngày nhận phòng:</p>
            <ReactDateRange
              value={checkInRange}
              onChange={(newRange) => setCheckInRange(newRange!)}
              className='bg-transparent'
              placeholder='Chọn ngày nhận phòng'
            />
          </div>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Ngày trả phòng:</p>
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
            placeholder='Mã đơn'
            value={(table.getColumn('bookingCode')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('bookingCode')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
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
                  <TableCell colSpan={scheduleTableColumns.length} className='h-24 text-center'>
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
              pathname='/partner/order/list'
            />
          </div>
        </div>
      </div>
    </ScheduleTableContext.Provider>
  )
}
