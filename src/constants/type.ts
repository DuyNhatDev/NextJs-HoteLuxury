export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
} as const

export const Role = {
  Admin: 'R1',
  Partner: 'R2',
  Customer: 'R3',
} as const

export const RoleValues = [Role.Admin, Role.Partner, Role.Customer] as const

export const RangePriceValues = [
  '',
  '0-500000',
  '500000-1000000',
  '1000000-2000000',
  '2000000-5000000',
  '5000000-100000000',
] as const

export const starItems = [
  { value: '5', label: '⭐⭐⭐⭐⭐' },
  { value: '4', label: '⭐⭐⭐⭐' },
  { value: '3', label: '⭐⭐⭐' },
  { value: '2', label: '⭐⭐' },
  { value: '1', label: '⭐' },
] as const

export const hotelTypeItems = [
  { value: 'Khách sạn', label: 'Khách sạn' },
  { value: 'Khu nghỉ dưỡng', label: 'Khu nghỉ dưỡng' },
  { value: 'Biệt thự', label: 'Biệt thự' },
  { value: 'Căn hộ', label: 'Căn hộ' },
  { value: 'Nhà nghỉ', label: 'Nhà nghỉ' },
] as const
export const rangePriceItems = [
  { label: 'Tất cả', value: '' },
  { label: 'Dưới 500.000', value: '0-500000' },
  { label: 'Từ 500.000 - 1.000.000', value: '500000-1000000' },
  { label: 'Từ 1.000.000 - 2.000.000', value: '1000000-2000000' },
  { label: 'Từ 2.000.000 - 5.000.000', value: '2000000-5000000' },
  { label: 'Trên 5.000.000', value: '5000000-100000000' },
] as const
