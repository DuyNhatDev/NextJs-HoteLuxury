'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getLastTwoInitials, getUserIdFromLocalStorage } from '@/lib/utils'
import { useState } from 'react'
import { useGetAccount } from '@/queries/useAccount'
import { DateTimePicker } from '@/components/customize/date-time-picker'

export default function ProfileForm() {
  const [editingField, setEditingField] = useState<string | null>(null)
  const userId = getUserIdFromLocalStorage()
  const { data } = useGetAccount(userId ?? undefined, Boolean(userId))
  const handleEditClick = (field: string) => {
    if (field !== 'email') {
      setEditingField(field)
    }
  }
  const handleCancelClick = () => {
    setEditingField(null)
  }
  return (
    <Card className="gap-4 rounded">
      <CardHeader className="flex flex-row items-center justify-between border-b-8 border-gray-200 pb-4">
        <div className="flex flex-col">
          <CardTitle className="text-2xl font-bold text-blue-900">Thông tin cá nhân</CardTitle>
          <CardDescription className="text-[16px] text-gray-500">
            Lưu thông tin của Quý khách để đặt dịch vụ nhanh hơn
          </CardDescription>
        </div>
        <Avatar className="h-11 w-11">
          <AvatarImage src="/image/no-avatar.png" />
          <AvatarFallback>{getLastTwoInitials('Nguyễn Nhật Duy')}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  )
}
