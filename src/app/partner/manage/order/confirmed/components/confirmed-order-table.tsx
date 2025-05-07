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
import { AccountListResType } from '@/schemaValidations/account.schema'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/customize/auto-pagination'
import { useGetPartnerList } from '@/queries/useAccount'
import EditPartner from '@/app/admin/manage/partner/list/components/edit-partner'
import AlertDialogDeletePartner from '@/app/admin/manage/partner/list/components/delete-partner'
import { columns, PartnerTableContext } from '@/app/partner/manage/order/confirmed/components/table-column'

export type PartnerItem = AccountListResType['data'][0]

const PAGE_SIZE = 5
export default function PartnerTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [partnerIdEdit, setPartnerIdEdit] = useState<number | undefined>()
  const [partnerDelete, setPartnerDelete] = useState<PartnerItem | null>(null)
  const bookingListQuery = useGetPartnerList()
  const data = bookingListQuery.data?.payload.data ?? []
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
    columns: columns,
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
    <PartnerTableContext.Provider value={{ partnerIdEdit, setPartnerIdEdit, partnerDelete, setPartnerDelete }}>
      <div className='w-full'>
        <EditPartner id={partnerIdEdit} setId={setPartnerIdEdit} onSubmitSuccess={() => {}} />
        <AlertDialogDeletePartner partnerDelete={partnerDelete} setPartnerDelete={setPartnerDelete} />
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc theo tên'
            value={(table.getColumn('fullname')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('fullname')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Lọc theo email'
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <Input
            placeholder='Lọc theo số điện thoại'
            value={(table.getColumn('phoneNumber')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('phoneNumber')?.setFilterValue(event.target.value)}
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
              pathname='/partner/manage/order/confirmed'
            />
          </div>
        </div>
      </div>
    </PartnerTableContext.Provider>
  )
}
