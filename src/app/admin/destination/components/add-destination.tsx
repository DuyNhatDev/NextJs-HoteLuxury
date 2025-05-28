'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import UploadImage from '@/components/customize/upload-image'
import { CreateDestinationBodySchema, CreateDestinationBodyType } from '@/schemaValidations/destination.schema'
import { useAddDestinationMutation } from '@/hooks/queries/useDestination'

export default function AddDestination() {
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const addDestinationMutation = useAddDestinationMutation()
  const form = useForm<CreateDestinationBodyType>({
    resolver: zodResolver(CreateDestinationBodySchema),
    defaultValues: {
      locationName: '',
      locationImage: undefined
    }
  })

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (data: CreateDestinationBodyType) => {
    if (addDestinationMutation.isPending) return
    try {
      let body = data
      if (file) {
        body = {
          ...body,
          locationImage: file
        }
      }
      await addDestinationMutation.mutateAsync(body)
      toast.success('Thêm thành công')
      reset()
      setOpen(false)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1 bg-green-500 hover:bg-green-600'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm địa điểm</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-screen overflow-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Thêm địa điểm</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='w-full max-w-[600px] flex-shrink-0 space-y-2'
            id='add-destination-form'
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e)
            })}
            onReset={reset}
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
          <Button type='submit' form='add-destination-form' className=''>
            {addDestinationMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
