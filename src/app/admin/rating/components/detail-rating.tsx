import { RatingItem } from '@/app/admin/rating/components/rating-table-column'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Gallery from '@/components/custom/gallery'
import { formatDate, getLastTwoInitials } from '@/lib/utils'

export default function DialogDetailRating({
  ratingView,
  setRatingView
}: {
  ratingView: RatingItem | null
  setRatingView: (value: RatingItem | null) => void
}) {
  const reset = () => {
    setRatingView(null)
  }
  return (
    <Dialog
      open={Boolean(ratingView)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
        </DialogHeader>
        <p className='text-lg'>{ratingView?.hotelId?.hotelName}</p>
        <div className='grid grid-cols-10 gap-4 py-3'>
          <div className='col-span-3'>
            <div className='flex items-center gap-2'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={ratingView?.userId?.image} />
                <AvatarFallback>{getLastTwoInitials(ratingView?.userId?.fullname ?? '')}</AvatarFallback>
              </Avatar>
              <p className='font-semibold'>{ratingView?.userId?.fullname}</p>
            </div>
          </div>
          <div className='col-span-7'>
            <div className='flex flex-col gap-1'>
              <div className='flex gap-1'>
                <Badge className='rounded-sm bg-green-600 text-xs font-normal'>{ratingView?.ratingStar}/10</Badge>
                <p className='text-sm text-gray-500'>
                  {ratingView?.ratingDate ? formatDate(String(ratingView.ratingDate)) : '-'}
                </p>
              </div>
              <p className='font-normal'>{ratingView?.ratingDescription}</p>
              <div className='mt-1 flex gap-2'>
                {Array.isArray(ratingView?.ratingImages) && ratingView.ratingImages.length > 0 && (
                  <div className='mt-1'>
                    <Gallery images={ratingView.ratingImages as string[]} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={reset}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
