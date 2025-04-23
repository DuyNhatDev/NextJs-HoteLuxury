'use client'
import RoomTypeTable from '@/app/(public)/[filter]/[hotel]/components/room-type-table'
import DateRangePicker from '@/components/customize/date-range-picker'
import RoomGuestSelector from '@/components/customize/room-guest-selector'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FilterSchema, FilterType } from '@/schemaValidations/filter.schema'
import { FilterRoomTypeType } from '@/schemaValidations/room-type.schema'
import { useFilterStore } from '@/store/filter-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'

export default function SearchForm({ hotelId }: { hotelId: number }) {
  const filter = useFilterStore((state) => state.filter)
  const setFilter = useFilterStore((state) => state.setFilter)
  const isHydrated = useFilterStore((state) => state.isHydrated)
  const [params, setParams] = useState<FilterRoomTypeType>({
    hotelId,
    dayStart: filter.dayStart,
    dayEnd: filter.dayEnd,
    adultQuantity: filter.adultQuantity,
    childQuantity: filter.childQuantity,
    currentRooms: filter.currentRooms,
  })
  const hasReset = useRef(false)
  const form = useForm<FilterType>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      ...filter,
    },
  })

  const { control, watch, setValue, reset } = form

  useEffect(() => {
    if (isHydrated && !hasReset.current) {
      reset(filter)
      hasReset.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated])

  const dayStart = watch('dayStart')
  const dayEnd = watch('dayEnd')
  const adultQuantity = watch('adultQuantity')
  const childQuantity = watch('childQuantity')

  const onSubmit = async (data: FilterType) => {
    const { filter, ...filterRoomTypeParams } = data
    setParams((prev) => ({
      ...prev,
      ...filterRoomTypeParams,
    }))
  }

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full rounded-sm bg-gray-800/20 p-4">
          <Form {...form}>
            <form
              className="flex w-full flex-col gap-3 md:flex-row"
              noValidate
              onSubmit={form.handleSubmit(onSubmit, (err) => {
                console.log(err)
              })}
            >
              <div className="w-full md:flex-[3]">
                <FormField
                  control={control}
                  name="dayStart"
                  render={() => (
                    <FormItem className="w-full">
                      <DateRangePicker
                        className="w-full"
                        value={{ from: dayStart, to: dayEnd }}
                        onChange={(range: DateRange | undefined) => {
                          if (range?.from) setValue('dayStart', range.from)
                          if (range?.to) setValue('dayEnd', range.to)
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full md:flex-[2.5]">
                <FormField
                  control={control}
                  name="currentRooms"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <RoomGuestSelector
                        rooms={field.value}
                        adults={adultQuantity}
                        child={childQuantity}
                        onRoomsChange={field.onChange}
                        onAdultsChange={(value) => setValue('adultQuantity', value)}
                        onChildrenChange={(value) => setValue('childQuantity', value)}
                      />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full md:flex-[1.5]">
                <Button
                  type="submit"
                  className="h-full w-full bg-orange-400 text-lg font-bold hover:bg-orange-500"
                >
                  Tìm
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <RoomTypeTable params={params} />
    </>
  )
}
