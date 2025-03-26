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
import { Switch } from '@/components/ui/switch'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import CustomSelect from '@/components/customize/select'
import UploadImage from '@/components/customize/upload-image'
import { UpdateHotelBodySchema, UpdateHotelBodyType } from '@/schemaValidations/hotel.schema'
import { useGetHotel, useUpdateHotelMutation } from '@/queries/useHotel'
import { MultiUploadImage } from '@/components/customize/multi-upload-image'

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
  const updateHotelMutation = useUpdateHotelMutation()

  const form = useForm<UpdateHotelBodyType>({
    resolver: zodResolver(UpdateHotelBodySchema),
    defaultValues: {
      hotelImage: undefined,
      hotelImages: undefined,
    },
  })
  useEffect(() => {
    if (data) {
      const { hotelImage, hotelImages } = data.payload.data
      form.reset({
        hotelImage: hotelImage ?? undefined,
        hotelImages: hotelImages ?? undefined,
      })
      console.log('image', form.watch('hotelImage'))
      console.log('images', form.watch('hotelImages'))
    }
  }, [data, form])
  const onSubmit = async (data: UpdateHotelBodyType) => {
    if (updateHotelMutation.isPending) return
    try {
      let mergedImages: (File | string)[] = []

      if (files.length > 0) {
        // Nếu có file mới, gộp ảnh cũ dạng string và file mới
        mergedImages = [
          ...(Array.isArray(data.hotelImages)
            ? data.hotelImages.filter((img) => typeof img === 'string')
            : []),
          ...files,
        ]
      } else {
        // Không có file mới => giữ nguyên dữ liệu cũ
        mergedImages = (data.hotelImages || []) as (string | File)[]
      }

      const body = {
        ...data,
        hotelImage: file ?? data.hotelImage,
        hotelImages: mergedImages,
      }
      console.log(body)
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
    setOpen(false)
    setFile(null)
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
