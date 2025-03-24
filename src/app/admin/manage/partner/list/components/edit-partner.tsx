'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  UpdatePartnerAccountBodySchema,
  UpdatePartnerAccountBodyType,
} from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { useGetAccount, useUpdatePartnerMutation } from '@/queries/useAccount'
import { handleErrorApi } from '@/lib/utils'
import { Role } from '@/constants/type'
import { toast } from 'sonner'
import CustomSelect from '@/components/customize/select'

export default function EditPartner({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const { data } = useGetAccount(String(id), Boolean(id))
  const updatePartnerMutation = useUpdatePartnerMutation()

  const form = useForm<UpdatePartnerAccountBodyType>({
    resolver: zodResolver(UpdatePartnerAccountBodySchema),
    defaultValues: {
      fullname: '',
      email: '',
      image: undefined,
      phoneNumber: '',
      gender: 'Nam',
      birthDate: '',
      address: '',
      roleId: Role.Partner,
    },
  })
  const avatar = form.watch('image')
  const previewAvatarFromFile = (): string | undefined => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return typeof avatar === 'string' ? avatar : undefined
  }

  useEffect(() => {
    if (data) {
      const { fullname, image, email, phoneNumber, birthDate, gender, address, active, roleId } =
        data.payload.data
      form.reset({
        fullname: fullname ?? '',
        email: email ?? '',
        image: image ?? undefined,
        phoneNumber: phoneNumber ?? '',
        birthDate: birthDate ?? '',
        gender: gender ?? 'Nam',
        address: address ?? '',
        active: active ?? false,
        roleId: roleId ?? Role.Partner,
      })
    }
  }, [data, form])
  const onSubmit = async (data: UpdatePartnerAccountBodyType) => {
    if (updatePartnerMutation.isPending) return
    try {
      let body = data
      if (file) {
        body = {
          ...body,
          image: file,
        }
      }
      await updatePartnerMutation.mutateAsync({ id: id!, body })
      toast.success('Cập nhật thành công')
      reset()
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  const reset = () => {
    setId(undefined)
    setFile(null)
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản đối tác</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-partner-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="image">Ảnh đại diện</FormLabel>
                    <div className="flex items-start justify-start gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:9000/uploads' + file.name)
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="text-muted-foreground h-4 w-4" />
                        <span className="sr-only">Upload</span>
                      </button>
                      {field.value && (
                        <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                          <AvatarImage src={previewAvatarFromFile()} />
                          <AvatarFallback className="rounded-none text-center">
                            Avatar
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid gap-7">
                <div className="flex w-full gap-4">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="fullname">Họ và tên</FormLabel>
                          <FormControl>
                            <Input
                              id="fullname"
                              type="text"
                              className="w-full"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              id="phoneNumber"
                              type="phone"
                              className="w-full"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex w-full gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="birthDate">Ngày sinh</FormLabel>
                          <FormControl>
                            <Input id="birthDate" type="date" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="gender">Giới tính</FormLabel>
                          <FormControl>
                            <CustomSelect
                              options={[
                                { label: 'Nam', value: 'Nam' },
                                { label: 'Nữ', value: 'Nữ' },
                              ]}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Chọn giới tính"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex w-full gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel htmlFor="address">Địa chỉ</FormLabel>
                        <FormControl>
                          <Input id="address" type="text" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full gap-4">
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel htmlFor="active">Active</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-partner-form" className="bg-blue-500 hover:bg-blue-600">
            {updatePartnerMutation.isPending && (
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            )}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
