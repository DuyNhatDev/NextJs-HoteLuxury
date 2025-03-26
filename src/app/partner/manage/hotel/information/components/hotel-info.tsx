'use client'

import AddHotel from '@/app/partner/manage/hotel/information/components/add.hotel'
import { Rating } from '@/components/ui/rating'
import { useGetHotelList } from '@/queries/useHotel'
import { HotelType } from '@/schemaValidations/hotel.schema'
import Image from 'next/image'
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from '@/components/extension/carousel'
import { MapPin, PenLine, Phone } from 'lucide-react'
import CustomTooltip from '@/components/customize/tooltip'
import { useState } from 'react'
import EditHotel from '@/app/partner/manage/hotel/information/components/edit-hotel'

export default function HotelInformation() {
  const { data } = useGetHotelList()
  const myHotel: HotelType | undefined = data?.payload?.data[0]
  const [id, setId] = useState<number | undefined>()
  const [openEdit, setOpenEdit] = useState(false)
  if (!myHotel) {
    return <AddHotel />
  }
  const {
    hotelName,
    hotelPhoneNumber,
    hotelStar,
    hotelDescription,
    hotelAddress,
    hotelImage,
    hotelImages,
    hotelId,
  } = myHotel
  const imageList = [hotelImage, ...hotelImages]

  return (
    <div className="px-10 py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {openEdit && id && <EditHotel open={openEdit} setOpen={setOpenEdit} id={id} />}
          <h2 className="text-3xl font-bold">{hotelName}</h2>
          <CustomTooltip content="Sửa">
            <PenLine
              className="h-5 w-5 text-blue-600 hover:cursor-pointer"
              onClick={() => {
                setId(hotelId)
                setOpenEdit(true)
              }}
            />
          </CustomTooltip>
        </div>

        <div className="flex items-center gap-4">
          <Rating
            rating={hotelStar!}
            totalStars={5}
            size={28}
            variant="yellow"
            showText={false}
            disabled={true}
          />
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-red-500" />
          <p className="text-base">{hotelAddress}</p>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-green-500" />
          <p className="text-base">{hotelPhoneNumber}</p>
        </div>

        {imageList && imageList.length > 0 && (
          <Carousel>
            <CarouselNext className="top-1/3 -translate-y-1/3" />
            <CarouselPrevious className="top-1/3 -translate-y-1/3" />
            <CarouselMainContainer className="h-[500px]">
              {imageList.map((img, index) => (
                <SliderMainItem key={index} className="bg-transparent">
                  <div className="outline-border bg-background relative h-full w-full overflow-hidden rounded-xl outline outline-1">
                    <Image src={img} alt={`hotel-image-${index}`} fill />
                  </div>
                </SliderMainItem>
              ))}
            </CarouselMainContainer>
            <CarouselThumbsContainer>
              {imageList.map((img, index) => (
                <SliderThumbItem key={index} index={index} className="h-40 w-40 bg-transparent">
                  <div className="outline-border bg-background relative size-full overflow-hidden rounded-xl outline outline-1">
                    <Image src={img} alt={`hotel-image-thumb-${index}`} fill />
                  </div>
                </SliderThumbItem>
              ))}
            </CarouselThumbsContainer>
          </Carousel>
        )}

        <div className="border-gray-20 rounded-xl border px-6 py-4">
          <h4 className="mb-2 text-lg font-semibold">Mô tả:</h4>
          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: hotelDescription || '' }}
          />
        </div>
      </div>
    </div>
  )
}
