type TotalMoneyFilterResult = {
  totalBooking: number
  totalPrice: number
  totalFinalPrice: number
  totalMoney: number
  totalCommission: number
}

export type TotalBookingsByRoomType = {
  month: number
  [roomType: string]: number
}

type TotalBookingOfHotelByTime = {
  _id: {
    month: number
  }
  totalBookings: number
}

type TotalRevenueOfHotelByTime = {
  _id: {
    month: number
  }
  totalRevenue: number
}

type TopBookingUser = {
  totalBookings: number
  totalPrice: number
  userId: number
  fullname: string
  phoneNumber?: string
  email?: string
  address?: string
  image?: string
  birthDate?: string
}

export type PartnerDashboardResType = {
  status: string
  message: string
  totalMoneyFilterResult: TotalMoneyFilterResult[]
  ratingQuantity: number
  ratingAverage: number
  totalBookingOfHotel: number
  totalCancelledBookingOfHotel: number
  totalBookingsByRoomType: TotalBookingsByRoomType[]
  totalBookingOfHotelByTime: TotalBookingOfHotelByTime[]
  totalRevenueOfHotelByTime: TotalRevenueOfHotelByTime[]
  top10BookingUser: TopBookingUser[]
}

export type PartnerDashboardQueryParams = {
  time?: string
  filterStart?: Date
  filterEnd?: Date
}

export type PartnerRevenueChartData = {
  month: string
  totalRevenue: number
}
