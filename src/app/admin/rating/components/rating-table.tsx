'use client'
import {
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
import { createContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/custom/auto-pagination'
import { useGetAdminRatingList } from '@/hooks/queries/useRating'
import { State } from '@/types/react-date-range'
import { adminRatingTableColumns, RatingItem } from '@/app/admin/rating/components/rating-table-column'
import AlertDialogDeleteRating from '@/app/admin/rating/components/delete-rating'
import DashboardFilterRange from '@/components/custom/dashboard-filter-range'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import DialogDetailRating from '@/app/admin/rating/components/detail-rating'

export const RatingTableContext = createContext<{
  ratingView: RatingItem | null
  setRatingView: (value: RatingItem | null) => void
  ratingDelete: RatingItem | null
  setRatingDelete: (value: RatingItem | null) => void
}>({
  ratingView: null,
  setRatingView: (value: RatingItem | null) => {},
  ratingDelete: null,
  setRatingDelete: (value: RatingItem | null) => {}
})

const PAGE_SIZE = 5
export default function AdminRatingTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [ratingView, setRatingView] = useState<RatingItem | null>(null)
  const [ratingDelete, setRatingDelete] = useState<RatingItem | null>(null)
  const [createdRange, setCreatedRange] = useState<State | undefined>({
    startDate: undefined,
    endDate: undefined,
    key: 'selection' as const
  })
  const [fullname, setFullname] = useState('')
  const [hotelName, setHotelName] = useState('')
  const [ratingDescription, setRatingDescription] = useState('')
  const { data: ratingListQuery } = useGetAdminRatingList({
    filterStart: createdRange?.startDate,
    filterEnd: createdRange?.endDate,
    fullname,
    hotelName,
    ratingDescription
  })
  const data = ratingListQuery?.payload.data ?? []
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
    columns: adminRatingTableColumns,
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

  const handleReset = () => {
    setCreatedRange({
      startDate: undefined,
      endDate: undefined,
      key: 'selection'
    })
    setFullname('')
    setHotelName('')
    setRatingDescription('')
  }

  return (
    <RatingTableContext.Provider value={{ ratingView, setRatingView, ratingDelete, setRatingDelete }}>
      <div className='w-full'>
        <DialogDetailRating ratingView={ratingView} setRatingView={setRatingView} />
        <AlertDialogDeleteRating ratingDelete={ratingDelete} setRatingDelete={setRatingDelete} />
        <div className='flex items-center justify-between'>
          <DashboardFilterRange
            value={createdRange}
            onChange={(newRange) => setCreatedRange(newRange!)}
            className='bg-transparent'
            placeholder='Chọn khoảng thời gian'
          />
          <Button variant='outline' onClick={handleReset}>
            <RotateCcw />
            Đặt lại
          </Button>
        </div>

        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc theo tên khách hàng'
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Lọc theo tên khách sạn'
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Lọc theo nội dung đánh giá'
            value={ratingDescription}
            onChange={(e) => setRatingDescription(e.target.value)}
            className='max-w-sm flex-1'
          />
          <div className='ml-auto flex items-center gap-2'></div>
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
                  <TableCell colSpan={adminRatingTableColumns.length} className='h-24 text-center'>
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
              pathname='/admin/voucher'
            />
          </div>
        </div>
      </div>
    </RatingTableContext.Provider>
  )
}
