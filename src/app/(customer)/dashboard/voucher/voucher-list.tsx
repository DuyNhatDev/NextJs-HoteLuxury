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
          const { code, discountValue, minOrderValue, quantity } = voucher
          const isFixed = voucher.discountType === 'fixed'
          return (
            <div
              key={voucher.voucherId}
              className='my-3 flex flex-col gap-2 border p-2 md:flex-row md:items-center md:justify-between'
            >
              <div className='flex w-full flex-row items-start gap-2 sm:items-center'>
                <div className='relative h-16 w-20 shrink-0 overflow-hidden sm:h-26 sm:w-36'>
                  <Image
                    src={isFixed ? '/image/fixed-voucher.png' : '/image/percentage-voucher.png'}
                    alt='Hình ảnh'
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='flex flex-col items-start text-sm sm:text-base'>
                  <p className='text-blue-600'>Mã voucher: {code}</p>
                  <p>
                    {isFixed ? `Giảm ${discountValue.toLocaleString('vi-VN')}đ` : `Giảm ${discountValue}%`} cho đơn từ{' '}
                    {minOrderValue.toLocaleString('vi-VN')}đ
                  </p>
                  <p className='text-gray-500'>
                    Hiệu lực đến: {format(parseISO(String(voucher.expiredAt)), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              <p className='text-right text-sm md:mr-3 md:text-lg md:whitespace-nowrap'>x {quantity}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
