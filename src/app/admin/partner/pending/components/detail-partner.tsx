'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useGetAccount } from '@/queries/useAccount'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
export default function DetailPartner({
  id,
  setId
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
}) {
  const { data } = useGetAccount(String(id), Boolean(id))
  const {
    fullname = '',
    email = '',
    phoneNumber = '',
    birthDate = '',
    gender = 'Nam',
    address = ''
  } = data?.payload.data ?? {}

  const reset = () => {
    setId(undefined)
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Chi tiết tài khoản</DialogTitle>
        </DialogHeader>
        <div className='grid auto-rows-max items-start gap-6 rounded-xl p-6 shadow-md md:gap-8'>
          <div className='grid gap-6'>
            {[
              { label: 'Họ và tên', value: fullname },
              { label: 'Email', value: email },
              { label: 'Số điện thoại', value: phoneNumber },
              { label: 'Giới tính', value: gender },
              { label: 'Ngày sinh', value: formatDate(birthDate) },
              { label: 'Địa chỉ', value: address }
            ].map((item, index) => (
              <div key={index} className='flex items-center gap-4'>
                <Label className='w-1/4 font-medium'>{item.label}:</Label>
                <div className='flex-1 rounded-lg border border-gray-200 p-3 shadow-sm'>{item.value || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
