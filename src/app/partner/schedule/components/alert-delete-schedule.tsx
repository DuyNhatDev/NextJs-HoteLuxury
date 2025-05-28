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
import { useDeleteScheduleMutation } from '@/hooks/queries/useSchedule'
import { ScheduleType } from '@/schemaValidations/schedule.schema'
import { Info } from 'lucide-react'
import { toast } from 'sonner'

type DeleteScheduleProps = {
  scheduleDelete: ScheduleType | null
  setScheduleDelete: (value: ScheduleType | null) => void
}
export default function AlertDialogDeleteSchedule({ scheduleDelete, setScheduleDelete }: DeleteScheduleProps) {
  const { mutateAsync } = useDeleteScheduleMutation()
  const deleteSchedule = async () => {
    if (scheduleDelete) {
      try {
        await mutateAsync(scheduleDelete.scheduleId)
        setScheduleDelete(null)
        toast.success('Xóa thành công')
      } catch (error) {
        handleErrorApi({
          error
        })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(scheduleDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setScheduleDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader className='items-center'>
          <AlertDialogTitle>
            <div className='mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-400/10'>
              <Info className='h-7 w-7 text-blue-400' />
            </div>
            <p>Xác nhận xóa lịch hẹn của đơn {scheduleDelete?.bookingCode}</p>
            <p className='text-center'>Khách hàng: {scheduleDelete?.customerName}</p>
          </AlertDialogTitle>
          <AlertDialogDescription>Hành động này không thể hoàn tác</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-2 sm:justify-center'>
          <AlertDialogCancel>Đóng</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 hover:bg-red-500' onClick={deleteSchedule}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
