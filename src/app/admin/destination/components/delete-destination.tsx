import { DestinationItem } from '@/app/admin/destination/components/destination-table'
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
import { useDeleteDestinationMutation } from '@/hooks/queries/useDestination'
import { toast } from 'sonner'

export default function AlertDialogDeleteDestination({
  destinationDelete,
  setDestinationDelete
}: {
  destinationDelete: DestinationItem | null
  setDestinationDelete: (value: DestinationItem | null) => void
}) {
  const { mutateAsync } = useDeleteDestinationMutation()
  const deleteDestination = async () => {
    if (destinationDelete) {
      try {
        await mutateAsync(destinationDelete.locationId)
        setDestinationDelete(null)
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
      open={Boolean(destinationDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDestinationDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa địa điểm?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn địa điểm
            <span className='rounded px-1 font-bold'>{destinationDelete?.locationName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={deleteDestination}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
