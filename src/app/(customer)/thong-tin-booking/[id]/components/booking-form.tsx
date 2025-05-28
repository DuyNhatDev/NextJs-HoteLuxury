'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { useGetAccount } from '@/hooks/queries/useAccount'
import { useCreateBookingMutation } from '@/hooks/queries/useBooking'
import { CreateBookingBodySchema, CreateBookingBodyType } from '@/schemaValidations/booking-schema'
import { useBookingStore } from '@/store/booking-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
export default function BookingForm() {
  const router = useRouter()
  const booking = useBookingStore((state) => state.booking)
  const userId = getUserIdFromLocalStorage()
  const { data } = useGetAccount(userId ?? undefined, Boolean(userId))
  const createBookingMutation = useCreateBookingMutation()
  const form = useForm<CreateBookingBodyType>({
    resolver: zodResolver(CreateBookingBodySchema),
    defaultValues: {
      userId: 0,
      roomTypeId: 0,
      dayStart: new Date(),
      dayEnd: addDays(new Date(), 1),
      roomQuantity: 0,
      price: 0,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      note: ''
    }
  })

  const { setValue } = form
  useEffect(() => {
    if (booking) {
      setValue('userId', Number(userId))
      setValue('roomTypeId', booking.roomTypeId)
      setValue('dayStart', booking.dayStart)
      setValue('dayEnd', booking.dayEnd)
      setValue('roomQuantity', booking.currentRooms)
      setValue('price', Number(booking.price))
      setValue('note', '')
    }

    if (data) {
      const { fullname, email, phoneNumber } = data.payload.data
      setValue('customerName', fullname || '')
      setValue('customerEmail', email || '')
      setValue('customerPhone', phoneNumber || '')
    }
  }, [booking, data, userId, setValue])

  const onSubmit = async (data: CreateBookingBodyType) => {
    if (createBookingMutation.isPending) return
    try {
      const result = await createBookingMutation.mutateAsync(data)
      const url = result.payload.data
      if (url && typeof url === 'string') {
        window.open(url, '_blank')
      } else {
        toast.success('Đặt phòng thành công')
        setTimeout(() => {
          router.push('/dashboard/trips')
        }, 1000)
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }
  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onSubmit={form.handleSubmit(onSubmit, (err) => {
          console.log(err)
        })}
      >
        <Card className='w-full rounded-sm p-3'>
          <CardHeader className='px-0'>
            <CardTitle className='text-blue-900'>Thông tin người đặt</CardTitle>
            <CardDescription className='italic'>Vui lòng điền đầy đủ thông tin</CardDescription>
          </CardHeader>
          <CardContent className='px-0'>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-4'>
                    <FormLabel className='col-span-2'>
                      Danh xưng <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='col-span-4 flex items-center gap-6'
                      >
                        <FormItem className='flex items-center gap-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='Anh' />
                          </FormControl>
                          <FormLabel className='text-[17px] font-normal'>Anh</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center gap-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='Chị' />
                          </FormControl>
                          <FormLabel className='text-[17px] font-normal'>Chị</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className='col-span-6' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='customerName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-4'>
                    <FormLabel htmlFor='customerName' className='col-span-2'>
                      Họ và tên đầy đủ <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Input
                      id='customerName'
                      type='text'
                      placeholder='Vui lòng nhập đầy đủ họ tên'
                      className='col-span-4'
                      {...field}
                    />
                    <FormMessage className='col-span-5' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='customerPhone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-4'>
                    <FormLabel htmlFor='customerPhone' className='col-span-2'>
                      Số điện thoại liên hệ <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Input
                      id='customerPhone'
                      type='text'
                      placeholder='Nhập số điện thoại'
                      className='col-span-4'
                      {...field}
                    />
                    <FormMessage className='col-span-5' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='customerEmail'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-4'>
                    <FormLabel htmlFor='customerEmail' className='col-span-2'>
                      Email <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Input id='customerEmail' type='text' placeholder='Nhập email' className='col-span-4' {...field} />
                    <FormMessage className='col-span-5' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-2'>
                      <FormLabel className='text-[16px] font-semibold text-blue-900'>Yêu cầu đặc biệt</FormLabel>
                      <Textarea
                        placeholder='Nếu quý khách có yêu cầu đặc biệt, vui lòng cho chúng tôi biết tại đây'
                        className='break-all'
                        {...field}
                      />

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paymentMethod'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex flex-col gap-4'>
                      <FormLabel className='text-[16px] font-semibold text-blue-900'>Phương thức thanh toán</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex items-center gap-6'
                        >
                          <FormItem className='flex items-center gap-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='Online' />
                            </FormControl>
                            <FormLabel className='font-normal'>Thanh toán online</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center gap-2 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='Trực tiếp' />
                            </FormControl>
                            <FormLabel className='font-normal'>Thanh toán khi nhận phòng</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full bg-orange-400 py-5 text-lg font-semibold hover:bg-orange-400'>
              {createBookingMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
              Yêu cầu đặt phòng
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
