import { UserItem } from '@/app/admin/manage/user/list/components/user-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { handleErrorApi } from '@/lib/utils'
import { useDeleteUserMutation } from '@/queries/useAccount'
import { toast } from 'sonner'

export default function AlertDialogDeleteUser({
  userDelete,
  setUserDelete,
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
          error,
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
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản<span className="rounded px-1 font-bold">{userDelete?.fullname}</span>
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={deletePartner}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
