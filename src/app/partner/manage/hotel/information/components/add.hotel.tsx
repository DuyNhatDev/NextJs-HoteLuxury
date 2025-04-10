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
import { LoaderCircle, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import CustomSelect from '@/components/customize/select'
import { useGetDistricts, useGetProvinces, useGetWards } from '@/queries/useLocation'
import { SelectLocation } from '@/types/location.types'
import Combobox from '@/components/customize/combobox'
import { CreateHotelBodySchema, CreateHotelBodyType } from '@/schemaValidations/hotel.schema'
import { MultiUploadImage } from '@/components/customize/multi-upload-image'
import { useGetDestinationList } from '@/queries/useDestination'
import RichTextEditor from '@/components/customize/rich-text-editor'
import { useAddHotelMutation } from '@/queries/useHotel'
import UploadImage from '@/components/customize/upload-image'

export default function AddHotel() {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [open, setOpen] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState<SelectLocation>({ id: '', name: '' })
  const [selectedDistrict, setSelectedDistrict] = useState<SelectLocation>({ id: '', name: '' })
  const [selectedWard, setSelectedWard] = useState<SelectLocation>({ id: '', name: '' })
  const provincesQueries = useGetProvinces(open)
  const districtsQueries = useGetDistricts(selectedProvince.id)
  const wardsQueries = useGetWards(selectedDistrict.id)
  const destinationsQueries = useGetDestinationList(open)
  const provinces = provincesQueries.data?.payload || []
  const districts = districtsQueries.data?.payload || []
  const wards = wardsQueries.data?.payload || []
  const destinations = destinationsQueries.data?.payload?.data || []
  const addHotelMutation = useAddHotelMutation()
  const form = useForm<CreateHotelBodyType>({
    resolver: zodResolver(CreateHotelBodySchema),
    defaultValues: {
      userId: Number(getUserIdFromLocalStorage()),
      hotelName: '',
      hotelType: '',
      hotelPhoneNumber: '',
      hotelStar: 5,
      hotelDescription: '',
      hotelAddress: '',
      locationId: undefined,
      hotelImage: undefined,
      hotelImages: undefined,
    },
  })
  const reset = () => {
    form.reset()
    setFile(null)
    setFiles([])
  }
  const onSubmit = async (data: CreateHotelBodyType) => {
    if (addHotelMutation.isPending) return
    try {
      let body = data
      if (data.hotelAddress) {
        const fullAddress = `${data.hotelAddress}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
        body = {
          ...data,
          hotelAddress: fullAddress,
        }
      }
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
      await addHotelMutation.mutateAsync(body)
      toast.success('Thêm thành công')
      reset()
      setOpen(false)
      console.log(body)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
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
                    <UploadImage
                      value={
                        typeof field.value === 'string'
                          ? field.value
                          : field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : undefined
                      }
                      onChange={(selectedFile, previewUrl) => {
                        setFile(selectedFile)
                        field.onChange(previewUrl)
                      }}
                    />
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
                      <MultiUploadImage
                        value={(field.value || []).map((item) =>
                          typeof item === 'string'
                            ? item
                            : item instanceof File
                              ? URL.createObjectURL(item)
                              : ''
                        )}
                        maxImages={20}
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
              <div className="grid gap-7">
                <div className="flex w-full gap-4">
                  <FormField
                    control={form.control}
                    name="hotelName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="hotelName">
                            Tên khách sạn <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="hotelName"
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
                </div>
                <div className="flex w-full gap-4">
                  <FormField
                    control={form.control}
                    name="hotelPhoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="hotelPhoneNumber">
                            Số điện thoại <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="hotelPhoneNumber"
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
                    name="hotelType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="relative grid gap-2">
                          <FormLabel htmlFor="password">
                            Loại <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomSelect
                              options={[
                                { label: 'Khách sạn', value: 'Khách sạn' },
                                { label: 'Khu nghỉ dưỡng', value: 'Khu nghỉ dưỡng' },
                                { label: 'Biệt thự', value: 'Biệt thự' },
                                { label: 'Căn hộ', value: 'Căn hộ' },
                                { label: 'Nhà nghỉ', value: 'Nhà nghỉ' },
                              ]}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Chọn loại"
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
                    name="hotelStar"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="hotelStar">
                            Số sao <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomSelect
                              options={[
                                { label: '⭐⭐⭐⭐⭐', value: 5 },
                                { label: '⭐⭐⭐⭐', value: 4 },
                                { label: '⭐⭐⭐', value: 3 },
                                { label: '⭐⭐', value: 2 },
                                { label: '⭐', value: 1 },
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
                  <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="locationId">Địa điểm</FormLabel>
                          <Combobox
                            items={destinations.map((d) => ({
                              value: d.locationId,
                              label: d.locationName,
                            }))}
                            placeholder="Chọn địa điểm"
                            onChange={field.onChange}
                            value={field.value}
                            className="w-full"
                          />
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
                          setSelectedProvince({ id: String(id), name: selected?.name || '' })
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
                          setSelectedDistrict({ id: String(id), name: selected?.name || '' })
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
                          setSelectedWard({ id: String(id), name: selected?.name || '' })
                        }}
                        disabled={!selectedDistrict.id}
                        value={selectedWard.id}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="hotelAddress"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel htmlFor="hotelAddress">Số nhà, tên đường</FormLabel>
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
                    name="hotelDescription"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="hotelDescription">Mô tả</FormLabel>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            title="Nhập mô tả cho khách sạn"
                          />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-hotel-form" className="bg-blue-500 hover:bg-blue-600">
            {addHotelMutation.isPending && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
