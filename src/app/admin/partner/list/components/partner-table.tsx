'use client'
import { CaretSortIcon } from '@radix-ui/react-icons'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AccountListResType, AccountType } from '@/schemas/account.schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/custom/auto-pagination'
import { getLastTwoInitials } from '@/lib/utils'
import { useGetPartnerList } from '@/hooks/queries/useAccount'
import { PenLine, Trash2 } from 'lucide-react'
import AddPartner from '@/app/admin/partner/list/components/add-partner'
import CustomTooltip from '@/components/custom/tooltip'
import EditPartner from '@/app/admin/partner/list/components/edit-partner'
import AlertDialogDeletePartner from '@/app/admin/partner/list/components/delete-partner'

export type PartnerItem = AccountListResType['data'][0]

const PartnerTableContext = createContext<{
  partnerIdEdit: number | undefined
  setPartnerIdEdit: (value: number) => void
  partnerDelete: PartnerItem | null
  setPartnerDelete: (value: PartnerItem | null) => void
}>({
  partnerIdEdit: undefined,
  setPartnerIdEdit: (value: number | undefined) => {},
  partnerDelete: null,
  setPartnerDelete: (value: PartnerItem | null) => {}
})

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => (
      <div>
        <Avatar className='aspect-square h-[50px] w-[50px] rounded-md object-cover'>
          <AvatarImage src={row.getValue('image')} />
          <AvatarFallback className='rounded-none'>{getLastTwoInitials(row.original.fullname)}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: 'fullname',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('fullname')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('phoneNumber') || '-'}</div>,
    accessorFn: (row) => row.phoneNumber || ''
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setPartnerIdEdit, setPartnerDelete } = useContext(PartnerTableContext)
      const openEditPartner = () => {
        setPartnerIdEdit(row.original.userId)
      }

      const openDeletePartner = () => {
        setPartnerDelete(row.original)
      }
      return (
        <div className='flex gap-3'>
          <CustomTooltip content='Sửa'>
            <PenLine className='h-5 w-5 text-blue-600 hover:cursor-pointer' onClick={openEditPartner} />
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
export default function PartnerTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [partnerIdEdit, setPartnerIdEdit] = useState<number | undefined>()
  const [partnerDelete, setPartnerDelete] = useState<PartnerItem | null>(null)
  const { data: partnerListQuery } = useGetPartnerList()
  const data = partnerListQuery?.payload.data ?? []
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
          <div className='ml-auto flex items-center gap-2'>
            <AddPartner />
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
              pathname='/admin/partner/list'
            />
          </div>
        </div>
      </div>
    </PartnerTableContext.Provider>
  )
}
