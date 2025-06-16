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
import { toast } from 'sonner'
import { useDeleteRatingMutation } from '@/hooks/queries/useRating'
import { RatingItem } from '@/app/admin/rating/components/rating-table-column'

export default function AlertDialogDeleteRating({
  ratingDelete,
  setRatingDelete
}: {
  ratingDelete: RatingItem | null
  setRatingDelete: (value: RatingItem | null) => void
}) {
  const { mutateAsync } = useDeleteRatingMutation()
  const deleteRating = async () => {
    if (ratingDelete) {
      try {
        await mutateAsync(ratingDelete.ratingId)
        setRatingDelete(null)
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
      open={Boolean(ratingDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setRatingDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa đánh giá của khách hàng
            <span className='rounded px-1 font-bold'>{ratingDelete?.userId.fullname}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={deleteRating}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
