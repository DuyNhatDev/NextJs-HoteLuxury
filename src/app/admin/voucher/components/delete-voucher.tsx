import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { handleErrorApi } from '@/lib/utils'
import { useDeleteVoucherMutation } from '@/hooks/queries/useVoucher'
import { toast } from 'sonner'
import { VoucherItem } from '@/app/admin/voucher/components/voucher-table-column'

export default function AlertDialogDeleteVoucher({
  voucherDelete,
  setVoucherDelete
}: {
  voucherDelete: VoucherItem | null
  setVoucherDelete: (value: VoucherItem | null) => void
}) {
  const { mutateAsync } = useDeleteVoucherMutation()
  const deleteVoucher = async () => {
    if (voucherDelete) {
      try {
        await mutateAsync(voucherDelete.voucherId)
        setVoucherDelete(null)
        toast.success('Xóa thành công')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(voucherDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setVoucherDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa voucher?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa voucher
            <span className='rounded px-1 font-bold'>{voucherDelete?.code}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={deleteVoucher}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
