'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetListVoucher } from '@/hooks/queries/useVoucher'
import { format, parseISO } from 'date-fns'
import Image from 'next/image'

export default function VoucherList() {
  const { data } = useGetListVoucher()
  const listVoucher = data?.payload?.data || []
  return (
    <Card className='gap-0 rounded py-3'>
      <CardHeader className='gap-0'>
        <CardTitle className='p-3 text-xl font-bold text-sky-500'>
          Voucher của tôi
          {listVoucher.length === 0 && (
            <p className='text-[15px] font-normal text-gray-500'>Quý khách chưa có voucher nào!</p>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {listVoucher.map((voucher) => {
          const isFixed = voucher.discountType === 'fixed'
          const minValue = voucher.minOrderValue
          const value = voucher.discountValue
          return (
            <div key={voucher.voucherId} className='my-3 flex items-center gap-2 border p-2'>
              <div className='relative h-26 w-36 overflow-hidden'>
                <Image
                  src={isFixed ? '/image/fixed-voucher.png' : '/image/percentage-voucher.png'}
                  alt='Hình ảnh'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col items-start'>
                <p className='text-lg text-blue-600'>Mã voucher: {voucher.code}</p>
                <p className='text-lg'>
                  {isFixed ? `Giảm ${value.toLocaleString('vi-VN')}đ` : `Giảm ${value}%`} cho đơn từ{' '}
                  {minValue.toLocaleString('vi-VN')}đ
                </p>
                <p className='text-[15px] text-gray-500'>
                  Hiệu lực đến: {format(parseISO(String(voucher.expiredAt)), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
