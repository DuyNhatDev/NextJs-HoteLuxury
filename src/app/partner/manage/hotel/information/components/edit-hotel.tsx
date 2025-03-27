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
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import CustomSelect from '@/components/customize/select'
import UploadImage from '@/components/customize/upload-image'
import { UpdateHotelBodySchema, UpdateHotelBodyType } from '@/schemaValidations/hotel.schema'
import { useGetHotel, useUpdateHotelMutation } from '@/queries/useHotel'
import { MultiUploadImage } from '@/components/customize/multi-upload-image'
import Combobox from '@/components/customize/combobox'
import { useGetDestinationList } from '@/queries/useDestination'
import RichTextEditor from '@/components/customize/rich-text-editor'

export default function EditHotel({
  open,
  setOpen,
  id,
}: {
  open: boolean
  setOpen: (value: boolean) => void
  id?: number | undefined
}) {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const { data } = useGetHotel(String(id), Boolean(id))
  const destinationsQueries = useGetDestinationList(open)
  const destinations = destinationsQueries.data?.payload?.data || []
  const updateHotelMutation = useUpdateHotelMutation()

  const form = useForm<UpdateHotelBodyType>({
    resolver: zodResolver(UpdateHotelBodySchema),
    defaultValues: {
      hotelName: '',
      hotelType: '',
      hotelPhoneNumber: '',
      hotelStar: 5,
      hotelAddress: '',
      hotelDescription: '',
      locationId: undefined,
      hotelImage: undefined,
      hotelImages: undefined,
    },
  })
  useEffect(() => {
    if (data) {
      const {
        hotelName,
        hotelType,
        hotelPhoneNumber,
        hotelAddress,
        hotelStar,
        hotelDescription,
        locationId,
        hotelImage,
        hotelImages,
      } = data.payload.data
      form.reset({
        hotelName: hotelName ?? '',
        hotelType: hotelType ?? '',
        hotelPhoneNumber: hotelPhoneNumber ?? '',
        hotelStar: hotelStar ?? '',
        hotelAddress: hotelAddress ?? '',
        hotelDescription: hotelDescription ?? '',
        locationId: locationId ?? '',
        hotelImage: hotelImage ?? undefined,
        hotelImages: hotelImages ?? undefined,
      })
    }
  }, [data, form])
  const onSubmit = async (data: UpdateHotelBodyType) => {
    if (updateHotelMutation.isPending) return
    try {
      let mergedImages: (File | string)[] = []

      if (files.length > 0) {
        mergedImages = [
          ...(Array.isArray(data.hotelImages)
            ? data.hotelImages.filter((img) => typeof img === 'string')
            : []),
          ...files,
        ]
      } else {
        mergedImages = (data.hotelImages || []) as (string | File)[]
      }
      const body = {
        ...data,
        hotelImage: file ?? data.hotelImage,
        hotelImages: mergedImages,
      }
      await updateHotelMutation.mutateAsync({ id: id!, body })
      toast.success('Cập nhật thành công')
      reset()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  const reset = () => {
    form.reset()
    setOpen(false)
    setFile(null)
    setFiles([])
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin khách sạn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-hotel-form"
            onSubmit={form.handleSubmit(onSubmit)}
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
                                { label: 'Khu nghỉ dưỡng', value: 'Nữ' },
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
                  <FormField
                    control={form.control}
                    name="hotelAddress"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel htmlFor="hotelAddress">Địa chỉ</FormLabel>
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
          <Button type="submit" form="edit-hotel-form" className="bg-blue-500 hover:bg-blue-600">
            {updateHotelMutation.isPending && (
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            )}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
