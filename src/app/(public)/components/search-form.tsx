'use client'
import CustomDateRangePicker from '@/components/custom/date-range-picker'
import RoomGuestSelector from '@/components/custom/room-guest-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formatProvince, generateSlugUrl } from '@/lib/utils'
import { useGetLocationList } from '@/hooks/queries/useLocation'
import { useGetSuggestList } from '@/hooks/queries/useFilter'
import { FilterSchema, FilterType } from '@/schemas/filter.schema'
import { HotelType } from '@/schemas/hotel.schema'
import { useFilterStore } from '@/store/filter-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import { Hotel, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useForm } from 'react-hook-form'

export default function SearchForm() {
  const setFilter = useFilterStore((state) => state.setFilter)
  const resetFilter = useFilterStore((state) => state.resetFilter)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isHotel, setIsHotel] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)
  const form = useForm<FilterType>({
    resolver: zodResolver(FilterSchema),
    defaultValues: {
      dayStart: new Date(),
      dayEnd: addDays(new Date(), 1),
      filter: '',
      adultQuantity: 2,
      childQuantity: 0,
      currentRooms: 1
    }
  })

  const { control, watch, setValue } = form
  const dayStart = watch('dayStart')
  const dayEnd = watch('dayEnd')
  const keyword = watch('filter')
  const adultQuantity = watch('adultQuantity')
  const childQuantity = watch('childQuantity')
  const suggestListQuery = useGetSuggestList({
    filter: keyword
  })
  const suggestHotelList = suggestListQuery.data?.payload.data ?? []
  const suggestLocationList = suggestListQuery.data?.payload.provinces ?? []
  const destinationListQuery = useGetLocationList()
  const destinationList = destinationListQuery.data?.payload.data ?? []
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    const subscription = form.watch((values) => {
      setFilter(values)
    })
    return () => subscription.unsubscribe()
  }, [form, setFilter])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  useEffect(() => {
    resetFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const findHotelByKeyword = (keyword: string, suggestions: HotelType[]): HotelType | undefined =>
    suggestions.find((hotel) => hotel.hotelName === keyword)

  const onSubmit = async (data: FilterType) => {
    setFilter(data)
    if (keyword.trim() === '') {
      setOpen(true)
    } else {
      if (!isHotel) {
        const url = `/khach-san-${generateSlugUrl(keyword)}`
        router.push(url)
      } else {
        const matchedHotel = findHotelByKeyword(keyword, suggestHotelList)
        if (matchedHotel?.locationName) {
          const url = `/khach-san-${generateSlugUrl(matchedHotel?.locationName)}/${generateSlugUrl(keyword)}-chi-tiet`
          router.push(url)
        }
      }
    }
  }
  return (
    <div className='inset-0 flex items-center justify-center'>
      <div className='relative w-full max-w-[740px] rounded-sm bg-gray-800/20 p-4 shadow-lg'>
        <Form {...form}>
          <form
            className='flex w-full flex-col gap-3'
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
            <div className='relative w-full' ref={inputRef}>
              <FormField
                control={control}
                name='filter'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormControl>
                      <div className='relative w-full'>
                        <MapPin className='text-muted-foreground absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2' />
                        <Input
                          id='filter'
                          placeholder='Bạn muốn đi đâu?'
                          className='bg-background h-15 rounded-sm pl-15 !text-base placeholder:text-base'
                          autoComplete='off'
                          onFocus={() => setOpen(true)}
                          {...field}
                        />
                      </div>
                    </FormControl>

                    {open && field.value.trim() === '' && (
                      <div className='max-h-lg bg-background absolute top-full right-0 left-0 z-20 mt-1 overflow-auto rounded-md px-4 pt-2 pb-4 shadow-lg'>
                        <h1 className='p-2 text-lg font-bold'>Địa điểm đang hot nhất</h1>

                        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                          {destinationList.map((destination) => (
                            <Card
                              key={destination.locationId}
                              onClick={() => {
                                setValue('filter', destination.locationName)
                                setOpen(false)
                              }}
                              className='hover:bg-muted cursor-pointer border-0 p-2 text-left shadow-none transition-colors'
                            >
                              <CardContent className='flex items-center gap-3 p-0'>
                                <div className='relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-md sm:h-[70px] sm:w-[70px]'>
                                  <Image
                                    src={destination.locationImage as string}
                                    alt={destination.locationName}
                                    sizes='(max-width: 768px) 100vw, 33vw'
                                    quality={100}
                                    fill
                                  />
                                </div>
                                <p className='text-[14px] sm:text-[16px]'>{destination.locationName}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {open && field.value.trim() !== '' && (
                      <>
                        {suggestHotelList.length === 0 && suggestLocationList.length === 0 ? (
                          <div className='max-h-lg bg-background absolute top-full right-0 left-0 z-20 mt-1 overflow-auto rounded-sm p-5 shadow-lg'>
                            <div className='-mx-4 flex items-center justify-center px-4 py-2'>
                              <p className='text-md ml-1 font-semibold'>Không tìm thấy kết quả nào phù hợp</p>
                            </div>
                          </div>
                        ) : (
                          <div className='max-h-lg bg-background absolute top-full right-0 left-0 z-20 mt-1 overflow-auto rounded-sm px-4 pb-4 shadow-lg'>
                            {suggestHotelList.length > 0 && (
                              <>
                                <div className='-mx-4 flex items-center px-4 py-2'>
                                  <p className='ml-1 text-sm font-semibold'>Khách sạn</p>
                                </div>
                                <div className='space-y-1'>
                                  {suggestHotelList.slice(0, 10).map((hotel, index) => (
                                    <Card
                                      key={`hotel-${index}`}
                                      className='hover:bg-muted bg-background cursor-pointer border-none px-4 py-2 shadow-none transition-colors'
                                      onClick={() => {
                                        setIsHotel(true)
                                        setValue('filter', hotel.hotelName)
                                        setOpen(false)
                                      }}
                                    >
                                      <CardContent className='p-0'>
                                        <div className='flex items-center gap-2'>
                                          <Hotel className='h-5 w-5 text-gray-600' />
                                          <p className='text-sm'>{hotel.hotelName}</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </>
                            )}

                            {suggestLocationList.length > 0 && (
                              <>
                                <div className='-mx-4 mt-3 flex items-center px-4 py-2'>
                                  <p className='text-sm font-semibold'>Địa điểm</p>
                                </div>
                                <div className='space-y-1'>
                                  {suggestLocationList.slice(0, 10).map((location, index) => (
                                    <Card
                                      key={`location-${index}`}
                                      className='hover:bg-muted bg-background cursor-pointer border-none px-4 py-2 shadow-none transition-colors'
                                      onClick={() => {
                                        setValue('filter', formatProvince(location))
                                        setOpen(false)
                                      }}
                                    >
                                      <CardContent className='p-0'>
                                        <div className='flex items-center gap-2'>
                                          <MapPin className='h-5 w-5 text-gray-600' />
                                          <p className='text-sm'>{formatProvince(location)}</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className='grid w-full max-w-full grid-cols-1 items-stretch gap-3 overflow-hidden sm:grid-cols-20'>
              <div className='col-span-1 w-full max-w-full sm:col-span-10'>
                <FormField
                  control={control}
                  name='dayStart'
                  render={() => (
                    <FormItem className='w-full'>
                      <div className='w-full min-w-0'>
                        <CustomDateRangePicker
                          className='w-full'
                          value={{ from: dayStart, to: dayEnd }}
                          onChange={(range: DateRange | undefined) => {
                            if (range?.from) setValue('dayStart', range.from)
                            if (range?.to) setValue('dayEnd', range.to)
                          }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-1 w-full max-w-full sm:col-span-7'>
                <FormField
                  control={control}
                  name='currentRooms'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className='w-full min-w-0'>
                        <RoomGuestSelector
                          rooms={field.value}
                          adults={adultQuantity}
                          child={childQuantity}
                          onRoomsChange={field.onChange}
                          onAdultsChange={(value) => setValue('adultQuantity', value)}
                          onChildrenChange={(value) => setValue('childQuantity', value)}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-1 w-full sm:col-span-3'>
                <Button type='submit' className='h-full w-full bg-orange-400 text-lg font-bold hover:bg-orange-500'>
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
