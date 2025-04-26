'use client'
import { useGetFilterRoomTypeList } from '@/queries/useRoomType'
import { FilterRoomTypeParamsType } from '@/schemaValidations/room-type.schema'
import { usePriceStore } from '@/store/price-store'
import { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from '@/components/customize/carousel'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useBookingStore } from '@/store/booking-store'
import { generateCode, getAccessTokenFromLocalStorage } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

interface RoomTypeTableProps {
  params: FilterRoomTypeParamsType
}

export default function RoomTypeTable({ params }: RoomTypeTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const setMinPrice = usePriceStore((state) => state.setMinPrice)
  const setBooking = useBookingStore((state) => state.setBooking)
  const roomTypeFilterListQuery = useGetFilterRoomTypeList(params)
  const roomTypeList = roomTypeFilterListQuery.data?.payload?.data || []
  const price = roomTypeFilterListQuery.data?.payload?.minPrice || 0

  useEffect(() => {
    setMinPrice(price)
  }, [price, setMinPrice])

  const handleBooking = (roomTypeId: number, roomTypeName: string, price: number) => {
    setBooking({ roomTypeName, price })
    const isLoggedIn = getAccessTokenFromLocalStorage()
    const currentUrl = pathname
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`)
    } else {
      const id = `${params.hotelId}${roomTypeId}${generateCode()}`
      const url = `/thong-tin-booking/${id}`
      router.push(url)
    }
  }

  return (
    <>
      {roomTypeFilterListQuery.isPending ? (
        <div className="flex items-center justify-center py-8">
          <Spinner>Đang tìm kiếm phòng. Xin vui lòng chờ trong giây lát</Spinner>
        </div>
      ) : roomTypeList.length === 0 ? (
        <p className="px-4 py-8 text-center text-lg">Không tìm thấy kết phù hợp</p>
      ) : (
        <Table className="mt-4 w-full table-fixed border-collapse border">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="w-[26.94%] border text-lg font-semibold text-blue-900">
                Loại phòng
              </TableHead>
              <TableHead className="w-[31.09%] border text-center text-lg font-semibold text-blue-900">
                Mô tả
              </TableHead>
              <TableHead className="w-[23.32%] border text-center text-lg font-semibold text-blue-900">
                Tổng giá
              </TableHead>
              <TableHead className="w-[18.65%] border text-right text-lg font-semibold text-blue-900">
                Giữ phòng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypeList.map((rt) => {
              const listImage = [...rt.roomTypeImages, ...rt.roomTypeImages]
              return (
                <TableRow key={rt.roomTypeId} className="hover:bg-transparent">
                  {/* Loại phòng */}
                  <TableCell className="w-[26.94%] border py-3 align-top font-medium break-words">
                    <h1 className="mb-2 text-base font-semibold whitespace-normal text-sky-500">
                      {rt.roomTypeName}
                    </h1>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div>
                          <div className="relative col-span-3 aspect-[3/2] h-full w-full overflow-hidden hover:cursor-pointer">
                            <Image
                              src={rt.roomTypeImage}
                              alt={rt.roomTypeName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-2 text-sm font-normal whitespace-normal text-sky-500 hover:cursor-pointer">
                            Xem ảnh chi tiết phòng
                          </p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="flex w-[720px] !max-w-3xl flex-col border-none bg-transparent p-4">
                        <DialogHeader className="flex-shrink-0">
                          <DialogTitle className="text-blue-500">{rt.roomTypeName}</DialogTitle>
                        </DialogHeader>
                        <Carousel>
                          <CarouselPrevious className="absolute top-1/2 left-4 z-10 h-7 w-7 -translate-y-1/2 opacity-50" />
                          <CarouselNext className="absolute top-1/2 right-4 z-10 h-7 w-7 -translate-y-1/2 opacity-50" />
                          <div className="relative">
                            <CarouselMainContainer className="h-[443px] w-[686px]">
                              {listImage.map((img, index) => (
                                <SliderMainItem
                                  key={index}
                                  className="h-full w-full bg-transparent"
                                >
                                  <div className="relative h-full w-full overflow-hidden">
                                    <Image
                                      src={img}
                                      alt={`hotel-image-${index}`}
                                      quality={100}
                                      fill
                                      className="object-cover object-center"
                                    />
                                  </div>
                                </SliderMainItem>
                              ))}
                            </CarouselMainContainer>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                              <CarouselThumbsContainer className="gap-x-1">
                                {listImage.map((_, index) => (
                                  <CarouselIndicator key={index} index={index} />
                                ))}
                              </CarouselThumbsContainer>
                            </div>
                          </div>
                        </Carousel>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  {/* Mô tả */}
                  <TableCell className="w-[31.09%] border align-top break-words">
                    <div
                      className="mt-2 leading-relaxed whitespace-normal"
                      dangerouslySetInnerHTML={{ __html: rt.roomTypeDescription || '' }}
                    ></div>
                  </TableCell>

                  {/* Tổng giá */}
                  <TableCell className="w-[23.32%] border text-center align-top">
                    <p className="mt-2 w-full text-lg font-semibold whitespace-normal text-sky-500">
                      {Number(rt.roomTypePrice).toLocaleString('vi-VN')}{' '}
                      <span className="text-sm">VND</span>
                    </p>
                  </TableCell>

                  {/* Đặt */}
                  <TableCell className="mt-2 w-[18.65%] border text-right align-top">
                    <div className="mt-2 inline-block w-full text-center whitespace-normal">
                      <Button
                        className="w-full rounded-t rounded-b-none bg-orange-400 py-2 text-[15px] font-bold whitespace-normal text-white hover:bg-orange-400"
                        onClick={() =>
                          handleBooking(rt.roomTypeId, rt.roomTypeName, rt.roomTypePrice)
                        }
                      >
                        Yêu cầu đặt
                      </Button>
                      <div className="w-full rounded-b border border-orange-400 bg-white px-6 py-1 text-[14px] text-orange-400">
                        {params.currentRooms} phòng
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </>
  )
}
