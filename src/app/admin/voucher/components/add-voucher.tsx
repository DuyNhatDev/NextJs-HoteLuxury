'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import CurrencyInput from '@/components/custom/currency-input'
import { CreateUpdateVoucherBodySchema, CreateUpdateVoucherBodyType } from '@/schemas/voucher.schema'
import { useAddVoucherMutation } from '@/hooks/queries/useVoucher'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

export default function AddVoucher() {
  const [open, setOpen] = useState(false)
  const addVoucherMutation = useAddVoucherMutation()
  const form = useForm<CreateUpdateVoucherBodyType>({
    resolver: zodResolver(CreateUpdateVoucherBodySchema),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'fixed',
      discountValue: 1,
      quantity: 1,
      minOrderValue: 1,
      maxPercentageDiscount: 200000,
      expiredAt: ''
    }
  })

  const discountType = form.watch('discountType')

  //   useEffect(() => {
  //     form.reset({
  //       ...form.getValues()
  //     })
  //   }, [form])

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (data: CreateUpdateVoucherBodyType) => {
    if (addVoucherMutation.isPending) return
    try {
      await addVoucherMutation.mutateAsync(data)
      toast.success('Thêm thành công')
      reset()
      setOpen(false)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1 bg-green-500 hover:bg-green-600'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm Voucher</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Thêm Voucher</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='w-full max-w-[600px] flex-shrink-0 space-y-2'
            id='add-voucher-form'
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e)
            })}
            onReset={reset}
          >
            <div className='grid gap-4 py-4'>
              <div className='grid gap-7'>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='discountType'
                    render={({ field }) => (
                      <FormItem className='flex flex-1 flex-col gap-2'>
                        <FormLabel>
                          Loại voucher <span className='text-red-500'>*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='flex items-center gap-6'
                          >
                            <FormItem className='flex items-center gap-2 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='fixed' />
                              </FormControl>
                              <FormLabel className='text-[15px] font-normal'>Cố định</FormLabel>
                            </FormItem>
                            <FormItem className='flex items-center gap-2 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value='percentage' />
                              </FormControl>
                              <FormLabel className='text-[15px] font-normal'>Phần trăm</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='code'>
                            Mã voucher <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='code' type='text' className='w-full' required {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex w-full gap-4'>
                  {discountType === 'fixed' ? (
                    <FormField
                      control={form.control}
                      name='discountValue'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <div className='grid gap-2'>
                            <FormLabel htmlFor='discountValue'>
                              Giá trị giảm (số tiền) <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                currency='VNĐ'
                                className='w-full'
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name='discountValue'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <div className='grid gap-2'>
                            <FormLabel htmlFor='discountValue'>
                              Giá trị giảm (Phần trăm %) <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                              <div className='relative w-full'>
                                <Input
                                  id='discountValue'
                                  type='number'
                                  min={1}
                                  max={100}
                                  step={1}
                                  required
                                  {...field}
                                  className='pr-10'
                                  onChange={(e) => {
                                    const raw = e.target.value
                                    if (raw === '') {
                                      field.onChange(raw)
                                      return
                                    }

                                    const value = parseInt(raw, 10)
                                    if (!isNaN(value)) {
                                      const clamped = Math.min(100, Math.max(1, value))
                                      field.onChange(clamped)
                                    }
                                  }}
                                />
                                <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500'>
                                  %
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  {discountType === 'fixed' ? (
                    <FormField
                      control={form.control}
                      name='minOrderValue'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <div className='grid gap-2'>
                            <FormLabel htmlFor='minOrderValue'>
                              Tối thiểu với đơn từ (số tiền) <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                currency='VNĐ'
                                className='w-full'
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name='maxPercentageDiscount'
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <div className='grid gap-2'>
                            <FormLabel htmlFor='maxPercentageDiscount'>
                              Giảm tối đa (số tiền) <span className='text-red-500'>*</span>
                            </FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                currency='VNĐ'
                                className='w-full'
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='quantity'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='quantity'>
                            Số lượng <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id='quantity'
                              type='number'
                              className='w-full'
                              required
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='expiredAt'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='expiredAt'>
                            Ngày hết hạn <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='expiredAt' type='date' className='w-full' required {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='description'>
                            Mô tả <span className='text-red-500'>*</span>
                          </FormLabel>
                          <Textarea placeholder='Mô tả cho voucher' className='break-all' {...field} />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-voucher-form' className=''>
            {addVoucherMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
