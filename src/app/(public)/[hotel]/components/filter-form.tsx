'use client'
import { FilterParamsSchema, FilterParamsType } from '@/schemaValidations/search.schema'
import { useSearchStore } from '@/store/search-store'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { hotelTypeItems, rangePriceItems, starItems } from '@/constants/type'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useSearchParams, useRouter } from 'next/navigation'
import { getOriginalHotelTypeValueFromSlug, updateURLParams } from '@/lib/utils'

export default function FilterForm() {
  const search = useSearchStore((state) => state.search)
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<FilterParamsType>({
    resolver: zodResolver(FilterParamsSchema),
    defaultValues: {
      dayStart: search.dayStart,
      dayEnd: search.dayEnd,
      filter: '',
      hotelName: '',
      adultQuantity: search.adultQuantity,
      childQuantity: search.childQuantity,
      currentRooms: search.currentRooms,
      hotelStar: [],
      hotelType: [],
      minPrice: '',
    },
  })

  const { control, watch } = form

  useEffect(() => {
    const hotelStar = searchParams.get('hotelStar')?.split(',') ?? []
    const hotelType = searchParams.get('hotelType')?.split(',') ?? []
    const minPrice = searchParams.get('minPrice') ?? ''
    const originHotelType = hotelType.map((slug) => getOriginalHotelTypeValueFromSlug(slug))
    form.reset({
      ...form.getValues(),
      hotelStar,
      hotelType: originHotelType,
      minPrice,
    })
  }, [form, searchParams])

  useEffect(() => {
    const subscription = watch((formValues) => {
      updateURLParams({
        currentParams: searchParams,
        router,
        values: {
          hotelStar: (formValues.hotelStar ?? []).filter((v): v is string => typeof v === 'string'),
          hotelType: (formValues.hotelType ?? []).filter((v): v is string => typeof v === 'string'),
          minPrice: formValues.minPrice ?? '',
        },
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, router, searchParams])

  const onSubmit = async (data: FilterParamsType) => {}

  return (
    <div>
      <Form {...form}>
        <form
          className="flex w-full flex-col gap-3"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="relative w-full">
            <FormField
              control={control}
              name="hotelName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        id="hotelName"
                        placeholder="Nhập tên khách sạn"
                        className="bg-background h-11 rounded-sm"
                        autoComplete="off"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="my-3 border-t border-gray-200"></div>
            <FormField
              control={control}
              name="hotelStar"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Hạng sao</FormLabel>
                  {starItems.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="hotelStar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={(field.value ?? []).includes(item.value)}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([...(field.value ?? []), item.value])
                                  : field.onChange(
                                      (field.value ?? []).filter((v) => v !== item.value)
                                    )
                              }
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="my-3 border-t border-gray-200"></div>
            <FormField
              control={control}
              name="hotelType"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Loại hình</FormLabel>
                  {hotelTypeItems.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="hotelType"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={(field.value ?? []).includes(item.value)}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([...(field.value ?? []), item.value])
                                  : field.onChange(
                                      (field.value ?? []).filter((v) => v !== item.value)
                                    )
                              }
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="my-3 border-t border-gray-200"></div>

            <FormField
              control={control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Giá</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {rangePriceItems.map((item) => (
                        <FormItem key={item.value} className="flex flex-row items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value={item.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{item.label}</FormLabel>
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
  )
}
