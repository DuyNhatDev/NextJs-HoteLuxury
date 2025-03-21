'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PartnerRegisterBodySchema, PartnerRegisterBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { usePartnerRegisterMutation } from '@/queries/useAuth'
import { PasswordInput } from '@/components/ui/password-input'
import CustomSelect from '@/components/customize/select'
import { Label } from '@/components/ui/label'
import { useGetDistricts, useGetProvinces, useGetWards } from '@/queries/useLocation'
import { SelectLocation } from '@/types/location.types'
import Combobox from '@/components/customize/combobox'
import InputOtpFormDialog from '@/app/(public)/(auth)/register/partner/otp-form-dialog'
import Link from 'next/link'

export default function PartnerRegisterForm() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const partnerRegisterMutation = usePartnerRegisterMutation()
  const [selectedProvince, setSelectedProvince] = useState<SelectLocation>({ id: '', name: '' })
  const [selectedDistrict, setSelectedDistrict] = useState<SelectLocation>({ id: '', name: '' })
  const [selectedWard, setSelectedWard] = useState<SelectLocation>({ id: '', name: '' })

  const provincesQueries = useGetProvinces()
  const districtsQueries = useGetDistricts(selectedProvince.id)
  const wardsQueries = useGetWards(selectedDistrict.id)

  const provinces = provincesQueries.data?.payload || []
  const districts = districtsQueries.data?.payload || []
  const wards = wardsQueries.data?.payload || []
  const form = useForm<PartnerRegisterBodyType>({
    resolver: zodResolver(PartnerRegisterBodySchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      //gender: '',
      phoneNumber: '',
      birthDay: '',
      address: '',
      roleId: 'R2',
    },
  })
  const onSubmit = async (data: PartnerRegisterBodyType) => {
    const fullAddress = `${data.address}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
    const body = {
      ...data,
      address: fullAddress,
    }
    if (partnerRegisterMutation.isPending) return
    try {
      const result = await partnerRegisterMutation.mutateAsync(body)
      setToken(result.payload.otp_token)
      setEmail(data.email)
      setDialogOpen(true)
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }
  return (
    <>
      <Card className="mx-auto max-w-xl min-w-96">
        <CardHeader className="relative flex items-center w-full px-4">
          {/* <ArrowLeft className="absolute left-5 cursor-pointer" onClick={() => router.back()} /> */}
          <CardTitle className="text-2xl font-bold text-blue-900 mx-auto">
            Đăng Ký Đối Tác
          </CardTitle>
          <CardDescription className="text-center">
            Vui lòng điền đầy đủ thông tin để đăng ký trở thành đối tác của HoteLuxury
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid gap-7">
                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="fullname">
                            Họ và tên <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="fullname"
                              placeholder="Ví dụ: Nguyen Van A"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="email">
                            Email <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="Ví dụ: example@gmail.com"
                              type="email"
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

                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="phoneNumber">
                            Số điện thoại <span className="text-red-500">*</span>
                          </FormLabel>
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
                  <FormField
                    control={form.control}
                    name="birthDay"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="birthDay">
                            Ngày sinh <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id="birthDay" type="date" required {...field} />
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
                          <FormLabel htmlFor="gender">
                            Giới tính <span className="text-red-500">*</span>
                          </FormLabel>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </Label>
                    <Combobox
                      items={provinces.map((p) => ({ value: p.idProvince, label: p.name }))}
                      placeholder="Chọn tỉnh/thành phố"
                      onChange={(id) => {
                        const selected = provinces.find((p) => p.idProvince === id)
                        setSelectedProvince({ id, name: selected?.name || '' })
                        setSelectedDistrict({ id: '', name: '' })
                        setSelectedWard({ id: '', name: '' })
                      }}
                      value={selectedProvince.id}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <Combobox
                      items={districts.map((d) => ({ value: d.idDistrict, label: d.name }))}
                      placeholder="Chọn quận/huyện"
                      onChange={(id) => {
                        const selected = districts.find((d) => d.idDistrict === id)
                        setSelectedDistrict({ id, name: selected?.name || '' })
                        setSelectedWard({ id: '', name: '' })
                      }}
                      disabled={!selectedProvince.id}
                      value={selectedDistrict.id}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>
                      Phường/Xã <span className="text-red-500">*</span>
                    </Label>
                    <Combobox
                      items={wards.map((w) => ({ value: w.idWard, label: w.name }))}
                      placeholder="Chọn phường/xã"
                      onChange={(id) => {
                        const selected = wards.find((w) => w.idWard === id)
                        setSelectedWard({ id, name: selected?.name || '' })
                      }}
                      disabled={!selectedDistrict.id}
                      value={selectedWard.id}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="address">
                            Số nhà, tên đường <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id="address" type="text" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2 relative">
                          <FormLabel htmlFor="password">
                            Mật khẩu <span className="text-red-500">*</span>
                          </FormLabel>
                          <PasswordInput id="password" required {...field} />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2 relative">
                          <FormLabel htmlFor="confirmPassword">
                            Nhập lại mật khẩu <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <PasswordInput id="confirmPassword" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full mt-2 bg-orange-500 hover:bg-orange-600">
                  Đăng ký
                </Button>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-500 px-2">Bạn đã có tài khoản?</span>
                  <Link href="/login" className="text-sm text-blue-700 underline cursor-pointer">
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <InputOtpFormDialog open={dialogOpen} setOpen={setDialogOpen} email={email} token={token} />
    </>
  )
}
