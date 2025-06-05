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
import voucherTableColumns, { VoucherItem } from '@/app/admin/voucher/components/voucher-table-column'
import { useGetListVoucherByAdmin } from '@/hooks/queries/useVoucher'
import CustomSelect from '@/components/custom/select'
import { voucherTypeItems } from '@/constants/type'
import EditVoucher from '@/app/admin/voucher/components/edit-voucher'
import AlertDialogDeleteVoucher from '@/app/admin/voucher/components/delete-voucher-type'
import AddVoucher from '@/app/admin/voucher/components/add-voucher'

export const VoucherTableContext = createContext<{
  voucherIdEdit: number | undefined
  setVoucherIdEdit: (value: number) => void
  voucherDelete: VoucherItem | null
  setVoucherDelete: (value: VoucherItem | null) => void
}>({
  voucherIdEdit: undefined,
  setVoucherIdEdit: (value: number | undefined) => {},
  voucherDelete: null,
  setVoucherDelete: (value: VoucherItem | null) => {}
})

const PAGE_SIZE = 5
export default function VoucherTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [voucherIdEdit, setVoucherIdEdit] = useState<number | undefined>()
  const [voucherDelete, setVoucherDelete] = useState<VoucherItem | null>(null)
  const { data: voucherListQuery } = useGetListVoucherByAdmin()
  const data = voucherListQuery?.payload.data ?? []
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
    columns: voucherTableColumns,
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
    <VoucherTableContext.Provider value={{ voucherIdEdit, setVoucherIdEdit, voucherDelete, setVoucherDelete }}>
      <div className='w-full'>
        <EditVoucher id={voucherIdEdit} setId={setVoucherIdEdit} />
        <AlertDialogDeleteVoucher voucherDelete={voucherDelete} setVoucherDelete={setVoucherDelete} /> 
        <div className='flex items-center gap-2 py-4'>
          <Input
            placeholder='Lọc theo mã voucher'
            value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('code')?.setFilterValue(event.target.value)}
            className='max-w-sm flex-1'
          />
          <CustomSelect
            placeholder='Loại voucher'
            options={voucherTypeItems}
            value={(table.getColumn('discountType')?.getFilterValue() as string) ?? 'all'}
            onChange={(value) => {
              table.getColumn('discountType')?.setFilterValue(value === 'all' ? undefined : value)
            }}
            className='max-w-sm flex-1'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddVoucher />
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
                  <TableCell colSpan={voucherTableColumns.length} className='h-24 text-center'>
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
    </VoucherTableContext.Provider>
  )
}
