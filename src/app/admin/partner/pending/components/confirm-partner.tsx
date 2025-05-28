import { PartnerPendingItem } from '@/app/admin/partner/pending/components/partner-pending-table'
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
import { useConfirmPartnerMutation } from '@/hooks/queries/useAccount'
import { toast } from 'sonner'

export default function AlertDialogConfirmPartner({
  partnerConfirm,
  setPartnerConfirm
}: {
  partnerConfirm: PartnerPendingItem | null
  setPartnerConfirm: (value: PartnerPendingItem | null) => void
}) {
  const { mutateAsync } = useConfirmPartnerMutation()
  const confirmPartner = async () => {
    if (partnerConfirm) {
      try {
        await mutateAsync({ id: partnerConfirm.userId, isConfirmed: true })
        setPartnerConfirm(null)
        toast.success('Duyệt thành công')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(partnerConfirm)}
      onOpenChange={(value) => {
        if (!value) {
          setPartnerConfirm(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Duyệt tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản
            <span className='rounded px-1 font-bold'>{partnerConfirm?.fullname}</span>sẽ được duyệt
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-green-500 hover:bg-green-600' onClick={confirmPartner}>
            Duyệt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
