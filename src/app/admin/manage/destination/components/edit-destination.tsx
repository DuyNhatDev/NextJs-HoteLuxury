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
import { UpdateDestinationBodySchema, UpdateDestinationBodyType } from '@/schemaValidations/destination.schema'
import { useGetDestination, useUpdateDestinationMutation } from '@/queries/useDestination'

export default function EditDestination({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const { data } = useGetDestination(id, Boolean(id))
  const updateDestinationMutation = useUpdateDestinationMutation()

  const form = useForm<UpdateDestinationBodyType>({
    resolver: zodResolver(UpdateDestinationBodySchema),
    defaultValues: {
      locationName: '',
      locationImage: undefined
    }
  })
  useEffect(() => {
    if (data) {
      const { locationName, locationImage } = data.payload.data
      form.reset({
        locationName: locationName ?? '',
        locationImage: locationImage ?? undefined
      })
    }
  }, [data, form])
  const onSubmit = async (data: UpdateDestinationBodyType) => {
    if (updateDestinationMutation.isPending) return
    try {
      let body = data
      if (file) {
        body = {
          ...body,
          locationImage: file
        }
      }
      await updateDestinationMutation.mutateAsync({ id: id!, body })
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
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa địa điểm</DialogTitle>
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
                name='locationImage'
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

              <div className='grid gap-7'>
                <div className='flex w-full gap-4'>
                  <FormField
                    control={form.control}
                    name='locationName'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='locationName'>
                            Tên địa điểm <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='locationName' type='text' className='w-full' required {...field} />
                          </FormControl>
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
            {updateDestinationMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
