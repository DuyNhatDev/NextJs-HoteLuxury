'use client'

import DateRangePicker from '@/components/customize/date-range-picker'
import RoomGuestSelector from '@/components/customize/room-guest-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formatProvince } from '@/lib/utils'
import { useGetDestinationList } from '@/queries/useDestination'
import { useGetSuggestList } from '@/queries/useSearch'
import { SearchSuggestSchema, SearchSuggestType } from '@/schemaValidations/search.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import { Hotel, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'

export default function SearchForm() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)
  const form = useForm<SearchSuggestType>({
    resolver: zodResolver(SearchSuggestSchema),
    defaultValues: {
      dayStart: new Date(),
      dayEnd: addDays(new Date(), 2),
      filter: '',
    },
  })
  const dayStart = form.watch('dayStart')
  const dayEnd = form.watch('dayEnd')
  const keyword = form.watch('filter')
  const suggestListQuery = useGetSuggestList({
    dayStart,
    dayEnd,
    filter: keyword,
  })
  const suggestHotelList = suggestListQuery.data?.payload.data ?? []
  const suggestLocationList = suggestListQuery.data?.payload.provinces ?? []
  const destinationListQuery = useGetDestinationList()
  const destinationList = destinationListQuery.data?.payload.data ?? []
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  // useEffect(() => {
  //   console.log(suggestLocationList)
  // }, [suggestLocationList])
  useEffect(() => {
    console.log(keyword)
  }, [keyword])
  const onSubmit = async (data: SearchSuggestType) => {
    console.log('From', data.dayStart)
    console.log('To', data.dayEnd)
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full max-w-3xl rounded-sm bg-gray-800/20 p-4 shadow-lg">
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-4"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
            <div className="relative w-full" ref={inputRef}>
              <FormField
                control={form.control}
                name="filter"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative w-full">
                        <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                        <Input
                          id="filter"
                          placeholder="Bạn muốn đi đâu"
                          className="bg-background h-14 rounded-lg pl-13"
                          onFocus={() => setOpen(true)}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    {open && field.value.trim() === '' && (
                      <div className="max-h-lg absolute top-full right-0 left-0 z-20 mt-1 overflow-auto rounded-md bg-white px-4 pt-2 pb-4 shadow-lg">
                        <h1 className="p-2 text-lg font-bold text-gray-700">
                          Địa điểm đang hot nhất
                        </h1>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                          {destinationList.map((destination) => (
                            <Card
                              key={destination.locationId}
                              onClick={() => setOpen(false)}
                              className="hover:bg-muted cursor-pointer border-0 p-2 text-left shadow-none transition-colors"
                            >
                              <CardContent className="flex items-center gap-3 p-0">
                                <div className="relative h-[70px] w-[70px] flex-shrink-0 overflow-hidden rounded-md">
                                  <Image
                                    src={destination.locationImage as string}
                                    alt={destination.locationName}
                                    quality={100}
                                    fill
                                  />
                                </div>
                                <p className="text-[16px] text-gray-800">
                                  {destination.locationName}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    {open && field.value.trim() !== '' && (
                      <div className="max-h-lg absolute top-full right-0 left-0 z-20 mt-1 overflow-auto rounded-md bg-white px-4 pt-2 pb-4 shadow-lg">
                        <div className="my-2 flex items-center rounded-md bg-gray-100 p-1">
                          <Hotel className="mr-2 ml-1 text-gray-600" />
                          <p className="ml-1 text-sm font-semibold text-gray-700">Khách sạn</p>
                        </div>
                        <div className="space-y-1">
                          {suggestHotelList.slice(0, 10).map((hotel, index) => (
                            <Card
                              key={`hotel-${index}`}
                              className="cursor-pointer border-none bg-white px-4 py-2 shadow-none transition-colors hover:bg-gray-100"
                              onClick={() => {
                                setOpen(false)
                              }}
                            >
                              <CardContent className="p-0">
                                <p className="text-sm text-gray-800">{hotel.hotelName}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <div className="mt-4 mb-2 flex items-center rounded-md bg-gray-100 p-1">
                          <MapPin className="mr-2 text-gray-600" />
                          <p className="text-sm font-semibold text-gray-700">Địa điểm</p>
                        </div>

                        <div className="space-y-1">
                          {suggestLocationList.slice(0, 10).map((location, index) => (
                            <Card
                              key={`location-${index}`}
                              className="cursor-pointer border-none bg-white px-4 py-2 shadow-none transition-colors hover:bg-gray-100"
                              onClick={() => {
                                setOpen(false)
                              }}
                            >
                              <CardContent className="p-0">
                                <p className="text-sm text-gray-800">{formatProvince(location)}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-8 items-stretch gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="dayStart"
                  render={() => (
                    <FormItem className="w-full">
                      <DateRangePicker
                        className="w-full"
                        value={{
                          from: form.watch('dayStart'),
                          to: form.watch('dayEnd'),
                        }}
                        onChange={(range: DateRange | undefined) => {
                          if (range?.from) form.setValue('dayStart', range.from)
                          if (range?.to) form.setValue('dayEnd', range.to)
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <RoomGuestSelector className="w-full" />
              </div>

              <div className="col-span-1 h-full">
                <Button
                  type="submit"
                  className="h-full w-full bg-orange-400 font-bold hover:bg-orange-500"
                >
                  Tìm
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
