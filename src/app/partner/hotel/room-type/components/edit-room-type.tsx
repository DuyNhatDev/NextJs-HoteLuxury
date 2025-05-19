'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import UploadImage from '@/components/customize/upload-image'
import { UpdateRoomTypeBodySchema, UpdateRoomTypeBodyType } from '@/schemaValidations/room-type.schema'
import { useGetRoomType, useUpdateRoomTypeMutation } from '@/queries/useRoomType'
import { MultiUploadImage } from '@/components/customize/multi-upload-image'
import CurrencyInput from '@/components/customize/currency-input'
import RichTextEditor from '@/components/customize/rich-text-editor'

export default function EditRoomType({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const { data } = useGetRoomType(String(id), Boolean(id))
  const updateRoomTypeMutation = useUpdateRoomTypeMutation()

  const form = useForm<UpdateRoomTypeBodyType>({
    resolver: zodResolver(UpdateRoomTypeBodySchema),
    defaultValues: {
      roomTypeName: '',
      roomTypePrice: 0,
      roomTypeWeekendPrice: 0,
      roomTypeQuantity: 0,
      adultQuantity: 0,
      childQuantity: 0,
      roomTypeDescription: '',
      roomTypeImage: undefined,
      roomTypeImages: undefined
    }
  })
  useEffect(() => {
    if (data) {
      const {
        roomTypeName,
        roomTypePrice,
        roomTypeWeekendPrice,
        roomTypeQuantity,
        adultQuantity,
        childQuantity,
        roomTypeDescription,
        roomTypeImage,
        roomTypeImages
      } = data.payload.data
      form.reset({
        roomTypeName: roomTypeName ?? '',
        roomTypePrice: Number(roomTypePrice) ?? 0,
        roomTypeWeekendPrice: Number(roomTypeWeekendPrice) ?? 0,
        roomTypeQuantity: roomTypeQuantity ?? 0,
        adultQuantity: adultQuantity ?? 0,
        childQuantity: childQuantity ?? 0,
        roomTypeDescription: roomTypeDescription ?? '',
        roomTypeImage: roomTypeImage ?? undefined,
        roomTypeImages: roomTypeImages ?? undefined
      })
    }
  }, [data, form])
  const onSubmit = async (data: UpdateRoomTypeBodyType) => {
    if (updateRoomTypeMutation.isPending) return
    try {
      let mergedImages: (File | string)[] = []

      if (files.length > 0) {
        mergedImages = [
          ...(Array.isArray(data.roomTypeImages) ? data.roomTypeImages.filter((img) => typeof img === 'string') : []),
          ...files
        ]
      } else {
        mergedImages = (data.roomTypeImages || []) as (string | File)[]
      }
      const body = {
        ...data,
        roomTypeImage: file ?? data.roomTypeImage,
        roomTypeImages: mergedImages
      }
      await updateRoomTypeMutation.mutateAsync({ id: id!, body })
      toast.success('Cập nhật thành công')
      reset()
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const reset = () => {
    form.reset()
    setId(undefined)
    setFile(null)
    setFiles([])
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
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa loại phòng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-room-type-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='roomTypeImage'
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
                name='roomTypeImages'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh slider</FormLabel>
                    <FormControl>
                      <MultiUploadImage
                        value={(field.value || []).map((item) =>
                          typeof item === 'string' ? item : item instanceof File ? URL.createObjectURL(item) : ''
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
              <div className='grid gap-7'>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='roomTypeName'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='roomTypeName'>
                            Tên loại phòng <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='roomTypeName' type='text' className='w-full' required {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='roomTypePrice'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='roomTypePrice'>
                            Giá cơ bản <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              currency='VNĐ'
                              className='w-full'
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='roomTypeWeekendPrice'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='roomTypeWeekendPrice'>
                            {`Giá cuối tuần (T6, T7, CN)`} <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              currency='VNĐ'
                              className='w-full'
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='roomTypeQuantity'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='roomTypeQuantity'>
                            Số lượng phòng <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id='roomTypeQuantity'
                              type='number'
                              className='w-full'
                              required
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const value = e.target.valueAsNumber
                                field.onChange(isNaN(value) ? undefined : value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='adultQuantity'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='adultQuantity'>
                            Số người lớn <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id='adultQuantity'
                              type='number'
                              className='w-full'
                              required
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const value = e.target.valueAsNumber
                                field.onChange(isNaN(value) ? undefined : value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='childQuantity'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='childQuantity'>
                            Số trẻ em <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id='childQuantity'
                              type='number'
                              className='w-full'
                              required
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const value = e.target.valueAsNumber
                                field.onChange(isNaN(value) ? undefined : value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='roomTypeDescription'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='hotelDescription'>Mô tả</FormLabel>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            title='Nhập mô tả cho loại phòng'
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
          <Button type='submit' form='edit-room-type-form' className='bg-blue-500 hover:bg-blue-600'>
            {updateRoomTypeMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
