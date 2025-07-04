'use client'
import { FilterParamsSchema, FilterParamsType } from '@/schemas/filter.schema'
import { useFilterStore } from '@/store/filter-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { hotelTypeItems, rangePriceItems, starItems } from '@/constants/type'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { getOriginalHotelTypeValueFromSlug, updateURLParams } from '@/lib/utils'
import ListFilterHotel from '@/app/(public)/[filter]/components/list-filter-hotel'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export default function FilterForm() {
  const filter = useFilterStore((state) => state.filter)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [hotelQuantity, setHotelQuantity] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const form = useForm<FilterParamsType>({
    resolver: zodResolver(FilterParamsSchema),
    defaultValues: {
      dayStart: filter.dayStart,
      dayEnd: filter.dayEnd,
      filter: filter.filter,
      hotelName: '',
      adultQuantity: filter.adultQuantity,
      childQuantity: filter.childQuantity,
      currentRooms: filter.currentRooms,
      hotelStar: [],
      hotelType: [],
      minPrice: ''
    }
  })

  const { control, watch, reset } = form
  const watchedValues = watch()

  useEffect(() => {
    if (watchedValues.hotelName !== '') {
      setIsFocus(true)
    } else {
      setIsFocus(false)
    }
  }, [watchedValues.hotelName])

  useEffect(() => {
    const hotelStar = searchParams.get('hotelStar')?.split(',') ?? []
    const hotelType = searchParams.get('hotelType')?.split(',') ?? []
    const minPrice = searchParams.get('minPrice') ?? ''
    const originHotelType = hotelType.map((slug) => getOriginalHotelTypeValueFromSlug(slug))
    reset({
      dayStart: filter.dayStart,
      dayEnd: filter.dayEnd,
      filter: filter.filter,
      hotelName: '',
      adultQuantity: filter.adultQuantity,
      childQuantity: filter.childQuantity,
      currentRooms: filter.currentRooms,
      hotelStar,
      hotelType: originHotelType,
      minPrice
    })
  }, [filter, reset, searchParams])

  useEffect(() => {
    const subscription = watch((formValues, { name }) => {
      if (['hotelStar', 'hotelType', 'minPrice'].includes(name || '')) {
        updateURLParams({
          currentParams: searchParams,
          router: {
            push: (url) => router.push(`${pathname}${url}`)
          },
          values: {
            hotelStar: (formValues.hotelStar ?? []).filter((s): s is string => typeof s === 'string'),
            hotelType: (formValues.hotelType ?? []).filter((s): s is string => typeof s === 'string'),
            minPrice: formValues.minPrice ?? ''
          }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, router, searchParams, pathname])

  const FilterFormContent = () => (
    <Form {...form}>
      <form className='flex w-full flex-col gap-3' noValidate>
        <FormField
          control={control}
          name='hotelName'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormControl>
                <Input
                  id='hotelName'
                  placeholder='Nhập tên khách sạn'
                  className='bg-background h-11 rounded-sm'
                  autoComplete='off'
                  autoFocus={isFocus}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='my-3 border-t border-gray-200'></div>

        <FormField
          control={control}
          name='hotelStar'
          render={() => (
            <FormItem>
              <FormLabel className='text-base'>Hạng sao</FormLabel>
              {starItems.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name='hotelStar'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center space-x-3'>
                      <FormControl>
                        <Checkbox
                          checked={(field.value ?? []).includes(item.value)}
                          onCheckedChange={(checked) =>
                            checked
                              ? field.onChange([...(field.value ?? []), item.value])
                              : field.onChange((field.value ?? []).filter((v) => v !== item.value))
                          }
                        />
                      </FormControl>
                      <FormLabel className='text-sm font-normal'>{item.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='my-3 border-t border-gray-200'></div>

        <FormField
          control={control}
          name='hotelType'
          render={() => (
            <FormItem>
              <FormLabel className='text-base'>Loại hình</FormLabel>
              {hotelTypeItems.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name='hotelType'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center space-x-3'>
                      <FormControl>
                        <Checkbox
                          checked={(field.value ?? []).includes(item.value)}
                          onCheckedChange={(checked) =>
                            checked
                              ? field.onChange([...(field.value ?? []), item.value])
                              : field.onChange((field.value ?? []).filter((v) => v !== item.value))
                          }
                        />
                      </FormControl>
                      <FormLabel className='text-sm font-normal'>{item.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='my-3 border-t border-gray-200'></div>

        <FormField
          control={control}
          name='minPrice'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base'>Giá</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className='flex flex-col space-y-1'>
                  {rangePriceItems.map((item) => (
                    <FormItem key={item.value} className='flex flex-row items-center space-x-3'>
                      <FormControl>
                        <RadioGroupItem value={item.value} />
                      </FormControl>
                      <FormLabel className='font-normal'>{item.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )

  return (
    <div className='flex flex-col'>
      <div className='mx-auto mb-3 h-full w-full sm:max-w-xl md:max-w-6xl'>
        <p className='px-4 py-2 text-xl font-bold text-blue-900 md:px-0'>
          Khách sạn {filter.filter}: <span className='text-foreground font-normal'>{hotelQuantity} khách sạn</span>
        </p>
      </div>

      <div className='grid grid-cols-4 items-start gap-4'>
        {isMobile ? (
          <div className='col-span-4'>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='fixed bottom-3 left-5 z-50 flex w-20 items-center gap-2 px-4 py-2 shadow-md md:hidden'
                >
                  <Menu className='h-5 w-5 text-sky-500' />
                  <span className='text-sm font-medium'>Bộ lọc</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-96 overflow-y-auto p-5'>
                <SheetHeader className='p-0'>
                  <SheetTitle>Bộ lọc khách sạn</SheetTitle>
                </SheetHeader>
                <FilterFormContent />
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className='col-span-1 rounded border p-4'>
            <FilterFormContent />
          </div>
        )}

        <div className={isMobile ? 'col-span-4 px-5' : 'col-span-3'}>
          <ListFilterHotel filterParams={watchedValues} onSetHotelQuantity={setHotelQuantity} />
        </div>
      </div>
    </div>
  )
}
