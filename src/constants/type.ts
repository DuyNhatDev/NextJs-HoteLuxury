export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
} as const

export const Role = {
  Admin: 'Admin',
  Manager: 'Manager',
  Client: 'Client',
} as const

export const RoleValues = [Role.Admin, Role.Manager, Role.Client] as const

export const OrderStatus = {
  Pending: 'Pending',
  Processing: 'Processing',
  Rejected: 'Rejected',
  Delivered: 'Delivered',
  Paid: 'Paid',
} as const

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid,
] as const
