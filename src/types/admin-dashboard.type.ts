export type TopHotel = {
  hotelId: number
  hotelName: string
  totalBooking: number
  totalPrice: number
  totalFinalPrice: number
  totalMoney: number
  commission: number
}

export type TopBookingUser = {
  userId: number
  userName: string
  phoneNumber: string
  email: string
  totalBooking: number
  totalPrice: number
}

export type CommissionByMonth = {
  month: number
  totalCommission: number
}

export type AdminDashboardResType = {
  status: string
  message: string
  totalHotel: number
  totalNewUser: number
  totalCommission: number
  totalMoney: number
  hotel: TopHotel[]
  user: TopBookingUser[]
  totalCommissionByMonth: CommissionByMonth[]
  statusCode: number
}

export type AdminDashboardQueryParams = {
  filterStart?: Date
  filterEnd?: Date
}

export type AdminRevenueChartData = {
  month: string
  totalCommission: number
}
