'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, PlusCircle, Upload } from 'lucide-react'
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
import { handleErrorApi } from '@/lib/utils'
import { useAddPartnerMutation } from '@/queries/useAccount'
import {
  CreatePartnerAccountBodySchema,
  CreatePartnerAccountBodyType,
} from '@/schemaValidations/account.schema'
import { toast } from 'sonner'
import CustomSelect from '@/components/customize/select'
import { PasswordInput } from '@/components/ui/password-input'
import { useGetDistricts, useGetProvinces, useGetWards } from '@/queries/useLocation'
import { SelectLocation } from '@/types/location.types'
import Combobox from '@/components/customize/combobox'
import { CreateHotelBodySchema, CreateHotelBodyType } from '@/schemaValidations/hotel.schema'
import { MultiImageUpload } from '@/components/customize/multi-image-upload'

export default function AddHotel() {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [open, setOpen] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const addPartnerMutation = useAddPartnerMutation()
  const [selectedProvince, setSelectedProvince] = useState<SelectLocation>({ id: '', name: '' })
  const [selectedDistrict, setSelectedDistrict] = useState<SelectLocation>({ id: '', name: '' })
  const [selectedWard, setSelectedWard] = useState<SelectLocation>({ id: '', name: '' })
  const provincesQueries = useGetProvinces(open)
  const districtsQueries = useGetDistricts(selectedProvince.id)
  const wardsQueries = useGetWards(selectedDistrict.id)
  const provinces = provincesQueries.data?.payload || []
  const districts = districtsQueries.data?.payload || []
  const wards = wardsQueries.data?.payload || []
  const form = useForm<CreateHotelBodyType>({
    resolver: zodResolver(CreateHotelBodySchema),
    defaultValues: {
      hotelImage: undefined,
      hotelImages: undefined,
    },
  })
  const avatar = form.watch('hotelImage')
  const previewAvatarFromFile = (): string | undefined => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return typeof avatar === 'string' ? avatar : undefined
  }

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (data: CreateHotelBodyType) => {
    let body = data
    if (file) {
      body = {
        ...body,
        hotelImage: file,
      }
    }
    if (files) {
      body = {
        ...body,
        hotelImages: files,
      }
    }
    console.log(body)
    // if (data.address) {
    //   const fullAddress = `${data.address}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
    //   body = {
    //     ...data,
    //     address: fullAddress,
    //   }
    // }
    // if (addPartnerMutation.isPending) return
    // try {
    //   if (file) {
    //     body = {
    //       ...body,
    //       image: file,
    //     }
    //   }
    //   await addPartnerMutation.mutateAsync(body)
    //   toast.success('Thêm thành công')
    //   reset()
    //   setOpen(false)
    // } catch (error) {
    //   handleErrorApi({
    //     error,
    //     setError: form.setError,
    //   })
    // }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1 bg-green-500 hover:bg-green-600">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Thêm khách sạn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm khách sạn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="w-full max-w-[600px] flex-shrink-0 space-y-2"
            id="add-hotel-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e)
            })}
            onReset={reset}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="hotelImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh thumbnail</FormLabel>
                    <div className="flex items-start justify-start gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:9000/uploads/' + file.name)
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed hover:cursor-pointer"
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
              <FormField
                control={form.control}
                name="hotelImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh slider</FormLabel>
                    <FormControl>
                      <MultiImageUpload
                        value={(field.value || []).map((item) =>
                          typeof item === 'string'
                            ? item
                            : item instanceof File
                              ? URL.createObjectURL(item)
                              : ''
                        )}
                        maxImages={10}
                        onChange={(urls, files) => {
                          field.onChange(urls)
                          setFiles(files)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="grid gap-7">
                <div className="flex w-full gap-4">
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
                            <Input id="email" type="email" className="w-full" required {...field} />
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
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="relative grid gap-2">
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
                  <div className="flex-1">
                    <div className="grid gap-2">
                      <Label>Tỉnh/Thành phố</Label>
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
                  </div>
                  <div className="flex-1">
                    <div className="grid gap-2">
                      <Label>Quận/Huyện</Label>
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
                  </div>
                </div>
                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <div className="grid gap-2">
                      <Label>Phường/Xã</Label>
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
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel htmlFor="address">Số nhà, tên đường</FormLabel>
                        <FormControl>
                          <Input id="address" type="text" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div> */}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-hotel-form" className="bg-blue-500 hover:bg-blue-600">
            {addPartnerMutation.isPending && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
