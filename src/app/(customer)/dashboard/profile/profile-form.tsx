'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getLastTwoInitials, getUserIdFromLocalStorage } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useGetAccount, useUpdateProfileMutation } from '@/queries/useAccount'
import { DateTimePicker } from '@/components/customize/date-time-picker'
import { UpdateProfileBodySchema, UpdateProfileBodyType } from '@/schemaValidations/account.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem } from '@/components/ui/form'

export default function ProfileForm() {
  const updateProfileMutation = useUpdateProfileMutation()
  const [editingField, setEditingField] = useState<string | null>(null)
  const userId = getUserIdFromLocalStorage()
  const { data } = useGetAccount(userId ?? undefined, Boolean(userId))
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<UpdateProfileBodyType>({
    resolver: zodResolver(UpdateProfileBodySchema),
    defaultValues: {
      fullname: '',
      email: '',
      phoneNumber: '',
      birthDate: undefined,
      address: '',
      image: undefined,
    },
  })
  useEffect(() => {
    if (data) {
      const { fullname, email, phoneNumber, birthDate, address, image } = data.payload.data
      form.reset({
        fullname,
        email,
        phoneNumber,
        birthDate,
        address,
        image: image ?? undefined,
      })
    }
  }, [data, form])
  const avatar = form.watch('image')
  const previewAvatarFromFile = () => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }
  const preview = previewAvatarFromFile()
  const src =
    typeof preview === 'string'
      ? preview
      : preview instanceof File
        ? URL.createObjectURL(preview)
        : undefined

  const handleUpdateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (updateProfileMutation.isPending) return
      await updateProfileMutation.mutateAsync({
        id: Number(userId),
        body: { image: selectedFile || undefined },
      })
    }
  }

  const handleEditClick = (field: string) => {
    if (field !== 'email') {
      setEditingField(field)
    }
  }
  const handleCancelClick = () => {
    setEditingField(null)
  }
  const onSubmit = async (data: UpdateProfileBodyType) => {}
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => {
          console.log(err)
        })}
      >
        <Card className="gap-4 rounded">
          <CardHeader className="flex flex-row items-center justify-between border-b-8 border-gray-200 pb-4">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold text-blue-900">Thông tin cá nhân</CardTitle>
              <CardDescription className="text-[16px] text-gray-500">
                Lưu thông tin của Quý khách để đặt dịch vụ nhanh hơn
              </CardDescription>
            </div>
            <div className="flex items-start justify-start gap-2">
              <Avatar className="h-11 w-11" onClick={() => avatarInputRef.current?.click()}>
                <AvatarImage src={src} />
                <AvatarFallback>
                  {getLastTwoInitials(form.getValues('fullname') || '')}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={handleUpdateAvatar}
                className="hidden"
              />
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </form>
    </Form>
  )
}
