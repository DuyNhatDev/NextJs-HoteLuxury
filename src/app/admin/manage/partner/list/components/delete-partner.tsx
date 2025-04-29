import { PartnerItem } from '@/app/admin/manage/partner/list/components/partner-table'
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
import { useDeletePartnerMutation } from '@/queries/useAccount'
import { toast } from 'sonner'

export default function AlertDialogDeletePartner({
  partnerDelete,
  setPartnerDelete
}: {
  partnerDelete: PartnerItem | null
  setPartnerDelete: (value: PartnerItem | null) => void
}) {
  const { mutateAsync } = useDeletePartnerMutation()
  const deletePartner = async () => {
    if (partnerDelete) {
      try {
        await mutateAsync(partnerDelete.userId)
        setPartnerDelete(null)
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
      open={Boolean(partnerDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setPartnerDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản<span className='rounded px-1 font-bold'>{partnerDelete?.fullname}</span>
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={deletePartner}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
