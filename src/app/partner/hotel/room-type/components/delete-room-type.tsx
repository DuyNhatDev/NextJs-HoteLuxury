import { RoomTypeItem } from '@/app/partner/hotel/room-type/components/room-type-table-column'
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
import { useDeleteRoomTypeMutation } from '@/hooks/queries/useRoomType'
import { toast } from 'sonner'

export default function AlertDialogDeleteRoomType({
  roomTypeDelete,
  setRoomTypeDelete
}: {
  roomTypeDelete: RoomTypeItem | null
  setRoomTypeDelete: (value: RoomTypeItem | null) => void
}) {
  const { mutateAsync } = useDeleteRoomTypeMutation()
  const deleteRoomType = async () => {
    if (roomTypeDelete) {
      try {
        await mutateAsync(roomTypeDelete.roomTypeId)
        setRoomTypeDelete(null)
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
      open={Boolean(roomTypeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setRoomTypeDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa loại phòng?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa loại phòng
            <span className='rounded px-1 font-bold'>{roomTypeDelete?.roomTypeName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={deleteRoomType}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
