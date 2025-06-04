export type HotelInfo = {
  hotelId: number
  hotelName: string
  totalBooking: number
  totalPrice: number
  totalFinalPrice: number
  totalMoney: number
  commission: number
}

export type UserInfo = {
  userId: number
  userName: string
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
  hotel: HotelInfo[]
  user: UserInfo[]
  totalCommissionByMonth: CommissionByMonth[]
  statusCode: number
}

export type AdminDashboardQueryParams = {
  filterStart?: Date
  filterEnd?: Date
}

export type AdminRevenueChartData = {
  month: string
  totalRevenue: number
}
