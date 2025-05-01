import { UserItem } from '@/app/admin/manage/user/list/components/user-table'
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
import { useDeleteUserMutation } from '@/queries/useAccount'
import { OctagonAlert } from 'lucide-react'
import { toast } from 'sonner'

export default function AlertDialogDeleteUser({
  userDelete,
  setUserDelete
}: {
  userDelete: UserItem | null
  setUserDelete: (value: UserItem | null) => void
}) {
  const { mutateAsync } = useDeleteUserMutation()
  const deletePartner = async () => {
    if (userDelete) {
      try {
        await mutateAsync(userDelete.userId)
        setUserDelete(null)
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
      open={Boolean(userDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setUserDelete(null)
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
            Tài khoản<span className='rounded px-1 font-bold'>{userDelete?.fullname}</span>
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
