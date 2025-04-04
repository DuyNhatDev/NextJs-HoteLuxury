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
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, PlusCircle } from 'lucide-react'
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
import { MultiUploadImage } from '@/components/customize/multi-upload-image'
import RichTextEditor from '@/components/customize/rich-text-editor'
import UploadImage from '@/components/customize/upload-image'
import {
  CreateRoomTypeBodySchema,
  CreateRoomTypeBodyType,
} from '@/schemaValidations/room-type.schema'
import { useAddRoomTypeMutation } from '@/queries/useRoomType'
import CurrencyInput from '@/components/customize/currency-input'

export default function AddRoomType({ hotelId }: { hotelId: number }) {
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [open, setOpen] = useState(false)
  const addRoomTypeMutation = useAddRoomTypeMutation()
  const form = useForm<CreateRoomTypeBodyType>({
    resolver: zodResolver(CreateRoomTypeBodySchema),
    defaultValues: {
      hotelId: hotelId ?? undefined,
      roomTypeName: '',
      roomTypePrice: undefined,
      maxPeople: undefined,
      roomTypeQuantity: undefined,
      roomTypeDescription: '',
      roomTypeImage: undefined,
      roomTypeImages: undefined,
    },
  })

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      hotelId,
    })
  }, [hotelId, form])

  const reset = () => {
    form.reset()
    setFile(null)
    setFiles([])
  }

  const onSubmit = async (data: CreateRoomTypeBodyType) => {
    if (addRoomTypeMutation.isPending) return
    try {
      let body = data
      if (file) {
        body = {
          ...body,
          roomTypeImage: file,
        }
      }
      if (files) {
        body = {
          ...body,
          roomTypeImages: files,
        }
      }
      await addRoomTypeMutation.mutateAsync(body)
      toast.success('Thêm thành công')
      reset()
      setOpen(false)
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
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Thêm loại phòng</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm loại phòng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="w-full max-w-[600px] flex-shrink-0 space-y-2"
            id="add-room-type-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e)
            })}
            onReset={reset}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="roomTypeImage"
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
                name="roomTypeImages"
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
                    name="roomTypeName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="roomTypeName">
                            Tên loại phòng <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="roomTypeName"
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
                    name="roomTypePrice"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="roomTypePrice">
                            Giá phòng <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              currency="VNĐ"
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
                    name="roomTypeQuantity"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="roomTypeQuantity">
                            Số lượng phòng <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="roomTypeQuantity"
                              type="number"
                              className="w-full"
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
                    name="maxPeople"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="maxPeople">
                            Số người <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="maxPeople"
                              type="number"
                              className="w-full"
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
                <div className="flex w-full gap-4">
                  <FormField
                    control={form.control}
                    name="roomTypeDescription"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="grid gap-2">
                          <FormLabel htmlFor="hotelDescription">Mô tả</FormLabel>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            title="Nhập mô tả cho loại phòng"
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
          <Button type="submit" form="add-room-type-form" className="bg-blue-500 hover:bg-blue-600">
            {addRoomTypeMutation.isPending && (
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            )}
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
