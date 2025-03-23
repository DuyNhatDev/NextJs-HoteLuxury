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
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AccountListResType, AccountType } from '@/schemaValidations/account.schema'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import AutoPagination from '@/components/customize/auto-pagination'
import { useGetPartnerPendingList } from '@/queries/useAccount'
import { Check, View, X } from 'lucide-react'
import CustomTooltip from '@/components/customize/tooltip'
import DetailPartner from '@/app/admin/manage/partner/pending/components/detail-partner'
import AlertDialogRejectPartner from '@/app/admin/manage/partner/pending/components/reject-partner'
import AlertDialogConfirmPartner from '@/app/admin/manage/partner/pending/components/confirm-partner'

export type PartnerPendingItem = AccountListResType['data'][0]

const PartnerPendingTableContext = createContext<{
  partnerId: number | undefined
  setPartnerId: (value: number) => void
  partnerReject: PartnerPendingItem | null
  setPartnerReject: (value: PartnerPendingItem | null) => void
  partnerConfirm: PartnerPendingItem | null
  setPartnerConfirm: (value: PartnerPendingItem | null) => void
}>({
  partnerId: undefined,
  setPartnerId: (value: number | undefined) => {},
  partnerReject: null,
  setPartnerReject: (value: PartnerPendingItem | null) => {},
  partnerConfirm: null,
  setPartnerConfirm: (value: PartnerPendingItem | null) => {},
})

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'fullname',
    header: 'Tên',
    cell: ({ row }) => <div className="capitalize">{row.getValue('fullname')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }) => <div className="capitalize">{row.getValue('phoneNumber') || '-'}</div>,
    accessorFn: (row) => row.phoneNumber || '',
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setPartnerId, setPartnerReject, setPartnerConfirm } = useContext(
        PartnerPendingTableContext
      )
      const openDetailPartner = () => {
        setPartnerId(row.original.userId)
      }
      const openRejectPartner = () => {
        setPartnerReject(row.original)
      }
      const openConfirmPartner = () => {
        setPartnerConfirm(row.original)
      }

      return (
        <div className="flex gap-3">
          <CustomTooltip content="Xem">
            <View
              className="h-5 w-5 text-blue-600 hover:cursor-pointer"
              onClick={openDetailPartner}
            />
          </CustomTooltip>
          <CustomTooltip content="Từ chối">
            <X className="h-5 w-5 text-red-600 hover:cursor-pointer" onClick={openRejectPartner} />
          </CustomTooltip>
          <CustomTooltip content="Duyệt">
            <Check
              className="h-5 w-5 text-green-600 hover:cursor-pointer"
              onClick={openConfirmPartner}
            />
          </CustomTooltip>
        </div>
      )
    },
  },
]

const PAGE_SIZE = 10
export default function PartnerPendingTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [partnerId, setPartnerId] = useState<number | undefined>()
  const [partnerReject, setPartnerReject] = useState<PartnerPendingItem | null>(null)
  const [partnerConfirm, setPartnerConfirm] = useState<PartnerPendingItem | null>(null)
  const partnerPendingListQuery = useGetPartnerPendingList()
  const data = partnerPendingListQuery.data?.payload.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
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
      pagination,
    },
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    })
  }, [table, pageIndex])

  return (
    <PartnerPendingTableContext.Provider
      value={{
        partnerId,
        setPartnerId,
        partnerReject,
        setPartnerReject,
        partnerConfirm,
        setPartnerConfirm,
      }}
    >
      <div className="w-full">
        <DetailPartner id={partnerId} setId={setPartnerId} />
        <AlertDialogRejectPartner
          partnerReject={partnerReject}
          setPartnerReject={setPartnerReject}
        />
        <AlertDialogConfirmPartner
          partnerConfirm={partnerConfirm}
          setPartnerConfirm={setPartnerConfirm}
        />
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder="Lọc theo tên"
            value={(table.getColumn('fullname')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('fullname')?.setFilterValue(event.target.value)}
            className="max-w-sm flex-1"
          />
          <Input
            placeholder="Lọc theo email"
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className="max-w-sm flex-1"
          />
          <Input
            placeholder="Lọc theo số điện thoại"
            value={(table.getColumn('phoneNumber')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('phoneNumber')?.setFilterValue(event.target.value)}
            className="max-w-sm flex-1"
          />
          <div className="ml-auto flex items-center gap-2"></div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 pt-4">
          <div className="text-muted-foreground flex-1 py-4 text-xs">
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/admin/manage/partner/pending"
            />
          </div>
        </div>
      </div>
    </PartnerPendingTableContext.Provider>
  )
}
