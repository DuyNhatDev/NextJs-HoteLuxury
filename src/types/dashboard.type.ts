export type PartnerDashboardType = {
  ratingQuantity: number
  ratingAverage: number
  totalBookingOfHotel: number
  totalCancelledBookingOfHotel: number
  totalBookingsByRoomType: TotalBookingsByRoomType[]
  totalBookingOfHotelByTime: TotalBookingByTime[]
  totalRevenueOfHotelByTime: TotalRevenueByTime[]
  theMostBookingUser: MostBookingUser[]
}
export type PartnerDashboardResType = {
  status: string
  message: string
} & PartnerDashboardType

export type TotalBookingsByRoomType = {
  maxBookings: RoomTypeBooking[]
  minBookings: RoomTypeBooking[]
}

export type RoomTypeBooking = {
  totalBookings: number
  roomTypeId: number
  roomTypeName: string
}

export type TotalBookingByTime = {
  _id: {
    month: string
  }
  totalBookings: number
}

export type TotalRevenueByTime = {
  _id: {
    month: string
  }
  totalRevenue: number
}

export type MostBookingUser = {
  theMostBookingUser: UserBookingInfo[]
}

export type UserBookingInfo = {
  totalBookings: number
  userId: number
  fullname: string
  phoneNumber: string
  email: string
  address: string
  image: string
  birthDate: string
}
