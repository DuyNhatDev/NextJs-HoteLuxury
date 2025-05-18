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
import { useRejectPartnerMutation } from '@/queries/useAccount'
import { toast } from 'sonner'

export default function AlertDialogRejectPartner({
  partnerReject,
  setPartnerReject
}: {
  partnerReject: PartnerPendingItem | null
  setPartnerReject: (value: PartnerPendingItem | null) => void
}) {
  const { mutateAsync } = useRejectPartnerMutation()
  const rejectPartner = async () => {
    if (partnerReject) {
      try {
        await mutateAsync(partnerReject.userId)
        setPartnerReject(null)
        toast.success('Từ chối thành công')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(partnerReject)}
      onOpenChange={(value) => {
        if (!value) {
          setPartnerReject(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Từ chối tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản<span className='rounded px-1 font-bold'>{partnerReject?.fullname}</span>
            sẽ bị từ chối
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={rejectPartner}>
            Từ chối
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
