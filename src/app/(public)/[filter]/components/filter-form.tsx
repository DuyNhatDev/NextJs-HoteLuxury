'use client'
import { FilterParamsSchema, FilterParamsType } from '@/schemaValidations/filter.schema'
import { useFilterStore } from '@/store/filter-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { hotelTypeItems, rangePriceItems, starItems } from '@/constants/type'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSearchParams, useRouter } from 'next/navigation'
import { getOriginalHotelTypeValueFromSlug, updateURLParams } from '@/lib/utils'
import ListFilterHotel from '@/app/(public)/[filter]/components/list-filter-hotel'

export default function FilterForm() {
  const filter = useFilterStore((state) => state.filter)
  const searchParams = useSearchParams()
  const router = useRouter()
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
    const subscription = watch((formValues) => {
      const cleanedHotelStar = (formValues.hotelStar ?? []).filter((s): s is string => typeof s === 'string')
      const cleanedHotelType = (formValues.hotelType ?? []).filter((s): s is string => typeof s === 'string')
      updateURLParams({
        currentParams: searchParams,
        router,
        values: {
          hotelStar: cleanedHotelStar,
          hotelType: cleanedHotelType,
          minPrice: formValues.minPrice ?? ''
        }
      })
    })

    return () => subscription.unsubscribe()
  }, [watch, router, searchParams])

  return (
    <div className='flex flex-col'>
      <div className='mx-auto mb-3 h-full w-full sm:max-w-xl md:max-w-6xl'>
        <div className='py-2 text-xl font-bold text-blue-900'>Khách sạn {filter.filter}</div>
      </div>
      <div className='grid grid-cols-4 items-start gap-4'>
        <div className='col-span-1 rounded border p-4'>
          <Form {...form}>
            <form className='flex w-full flex-col gap-3' noValidate>
              <div className='relative w-full'>
                <FormField
                  control={control}
                  name='hotelName'
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            id='hotelName'
                            placeholder='Nhập tên khách sạn'
                            className='bg-background h-11 rounded-sm'
                            autoComplete='off'
                            {...field}
                          />
                        </div>
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
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className='flex flex-col space-y-1'
                        >
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
              </div>
            </form>
          </Form>
        </div>

        <div className='col-span-3 rounded'>
          <ListFilterHotel filterParams={watchedValues} />
        </div>
      </div>
    </div>
  )
}
