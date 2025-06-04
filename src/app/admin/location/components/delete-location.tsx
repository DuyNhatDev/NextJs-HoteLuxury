import { LocationItem } from '@/app/admin/location/components/location-table'
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
import { useDeleteDestinationMutation } from '@/hooks/queries/useLocation'
import { toast } from 'sonner'

export default function AlertDialogDeleteLocation({
  locationDelete,
  setLocationDelete
}: {
  locationDelete: LocationItem | null
  setLocationDelete: (value: LocationItem | null) => void
}) {
  const { mutateAsync } = useDeleteDestinationMutation()
  const deleteLocation = async () => {
    if (locationDelete) {
      try {
        await mutateAsync(locationDelete.locationId)
        setLocationDelete(null)
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
      open={Boolean(locationDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setLocationDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa địa điểm?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn địa điểm
            <span className='rounded px-1 font-bold'>{locationDelete?.locationName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={deleteLocation}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
