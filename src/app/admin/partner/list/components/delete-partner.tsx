import { PartnerItem } from '@/app/admin/partner/list/components/partner-table'
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
import { buttonVariants } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils'
import { useDeletePartnerMutation } from '@/hooks/queries/useAccount'
import { OctagonAlert } from 'lucide-react'
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
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className='bg-destructive/10 mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full'>
              <OctagonAlert className='text-destructive h-7 w-7' />
            </div>
            Xóa tài khoản?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-center text-[15px]'>
            Tài khoản<span className='rounded px-1 font-bold'>{partnerDelete?.fullname}</span>
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-2 sm:justify-center'>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={deletePartner}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
