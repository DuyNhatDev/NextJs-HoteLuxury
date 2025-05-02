'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getLastTwoInitials, getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useGetAccount, useUpdateProfileMutation } from '@/queries/useAccount'
import { UpdateProfileBodySchema, UpdateProfileBodyType } from '@/schemaValidations/account.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format as formatDate } from 'date-fns'
import CustomSelect from '@/components/customize/select'

export default function ProfileForm() {
  const userId = getUserIdFromLocalStorage()
  const { data } = useGetAccount(userId ?? undefined, Boolean(userId))
  const updateProfileMutation = useUpdateProfileMutation()
  const [editingField, setEditingField] = useState<keyof UpdateProfileBodyType | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [initialData, setInitialData] = useState<UpdateProfileBodyType>({})
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<UpdateProfileBodyType>({
    resolver: zodResolver(UpdateProfileBodySchema),
    defaultValues: {
      fullname: '',
      email: '',
      phoneNumber: '',
      birthDate: undefined,
      address: '',
      image: undefined
    }
  })
  useEffect(() => {
    if (data) {
      const { fullname, email, phoneNumber, birthDate, gender, address, image } = data.payload.data
      const initial = {
        fullname,
        email,
        phoneNumber,
        birthDate,
        gender,
        address,
        image: image ?? undefined
      }
      form.reset(initial)
      setInitialData(initial)
    }
  }, [data, form])

  const avatar = form.watch('image')
  const previewAvatarFromFile = () => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }
  const preview = previewAvatarFromFile()
  const src = typeof preview === 'string' ? preview : preview instanceof File ? URL.createObjectURL(preview) : undefined
  const handleUpdateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (updateProfileMutation.isPending) return
      await updateProfileMutation.mutateAsync({
        id: Number(userId),
        body: { image: selectedFile || undefined }
      })
    }
  }
  const handleEditClick = (field: keyof UpdateProfileBodyType) => {
    if (field !== 'email') {
      setEditingField(field)
    }
  }
  const handleCancelClick = () => {
    if (editingField) {
      form.setValue(editingField, initialData[editingField] || '')
    }
    setEditingField(null)
  }

  const onSubmit = async (data: UpdateProfileBodyType) => {
    if (updateProfileMutation.isPending) return
    try {
      await updateProfileMutation.mutateAsync({ id: Number(userId), body: data })
      setEditingField(null)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
    setEditingField(null)
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, (err) => {
          console.log(err)
        })}
      >
        <Card className='gap-0 rounded'>
          <CardHeader className='flex flex-row items-center justify-between border-b-8 border-gray-200 pb-4'>
            <div className='flex flex-col'>
              <CardTitle className='text-2xl font-bold text-blue-900'>Thông tin cá nhân</CardTitle>
              <CardDescription className='text-[16px] text-gray-500'>
                Lưu thông tin của Quý khách để đặt dịch vụ nhanh hơn
              </CardDescription>
            </div>
            <div className='flex items-start justify-start gap-2'>
              <Avatar className='h-12 w-12' onClick={() => avatarInputRef.current?.click()}>
                <AvatarImage src={src} className='hover:cursor-pointer' />
                <AvatarFallback>{getLastTwoInitials(form.getValues('fullname') || '')}</AvatarFallback>
              </Avatar>
              <input
                type='file'
                accept='image/*'
                ref={avatarInputRef}
                onChange={handleUpdateAvatar}
                className='hidden'
              />
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='m-0 grid grid-cols-12 items-center border-b border-gray-300 py-3'>
              <div className='col-span-3 justify-start'>Họ tên</div>
              <div className='col-span-7'>
                <FormField
                  control={form.control}
                  name='fullname'
                  render={({ field }) => (
                    <FormItem>
                      {editingField === 'fullname' ? (
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='fullname' className='text-gray-500'>
                            Họ tên <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='name' className='w-full' {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      ) : (
                        <p>{field.value}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2 flex flex-col items-end gap-2'>
                {editingField === 'fullname' ? (
                  <>
                    <Button
                      type='button'
                      className='text-md bg-transparent text-blue-500 shadow-none hover:bg-transparent'
                      onClick={handleCancelClick}
                    >
                      Hủy
                    </Button>
                    <Button className='text-md bg-cyan-500 hover:bg-cyan-500' type='submit'>
                      Lưu
                    </Button>
                  </>
                ) : (
                  <button
                    type='button'
                    disabled={editingField !== null && editingField !== ('fullname' as keyof UpdateProfileBodyType)}
                    className='text-md p-0 text-blue-500 shadow-none hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400'
                    onClick={() => handleEditClick('fullname')}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
            <div className='m-0 grid grid-cols-12 items-center border-b border-gray-300 py-3'>
              <div className='col-span-3 justify-start'>Email</div>
              <div className='col-span-7'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <p>{field.value}</p>
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2 flex flex-col items-end gap-2'>
                {editingField === 'email' ? (
                  <>
                    <Button
                      type='button'
                      className='text-md bg-transparent text-blue-500 shadow-none hover:bg-transparent'
                      onClick={handleCancelClick}
                    >
                      Hủy
                    </Button>
                    <Button className='text-md bg-cyan-500 hover:bg-cyan-500' type='submit'>
                      Lưu
                    </Button>
                  </>
                ) : (
                  <button
                    type='button'
                    className='text-md bg-transparent px-0 py-1 shadow-none hover:bg-transparent disabled:cursor-not-allowed disabled:text-gray-400'
                    disabled
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
            <div className='m-0 grid grid-cols-12 items-center border-b border-gray-300 py-3'>
              <div className='col-span-3 justify-start'>Số điện thoại</div>
              <div className='col-span-7'>
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      {editingField === 'phoneNumber' ? (
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='phoneNumber' className='text-gray-500'>
                            Số điện thoại <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='phoneNumber' className='w-[80%] md:w-[35%]' {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      ) : (
                        <p className={field.value ? '' : 'text-gray-500'}>{field.value || 'Nhập số điện thoại'}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2 flex flex-col items-end gap-2'>
                {editingField === 'phoneNumber' ? (
                  <>
                    <Button
                      type='button'
                      className='text-md bg-transparent text-blue-500 shadow-none hover:bg-transparent'
                      onClick={handleCancelClick}
                    >
                      Hủy
                    </Button>
                    <Button className='text-md bg-cyan-500 hover:bg-cyan-500' type='submit'>
                      Lưu
                    </Button>
                  </>
                ) : (
                  <button
                    type='button'
                    disabled={editingField !== null && editingField !== ('phoneNumber' as keyof UpdateProfileBodyType)}
                    className='text-md p-0 text-blue-500 shadow-none hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400'
                    onClick={() => handleEditClick('phoneNumber')}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
            <div className='m-0 grid grid-cols-12 items-center border-b border-gray-300 py-3'>
              <div className='col-span-3 justify-start'>Ngày sinh</div>
              <div className='col-span-7'>
                <FormField
                  control={form.control}
                  name='birthDate'
                  render={({ field }) => (
                    <FormItem>
                      {editingField === 'birthDate' ? (
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='birthDate' className='text-gray-500'>
                            Ngày sinh <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='birthDate' type='date' className='w-[80%] md:w-[40%]' required {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      ) : (
                        <p className={field.value ? '' : 'text-gray-500'}>
                          {field.value ? formatDate(field.value, 'dd-MM-yyyy') : 'Chọn ngày sinh'}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2 flex flex-col items-end gap-2'>
                {editingField === 'birthDate' ? (
                  <>
                    <Button
                      type='button'
                      className='text-md bg-transparent text-blue-500 shadow-none hover:bg-transparent'
                      onClick={handleCancelClick}
                    >
                      Hủy
                    </Button>
                    <Button className='text-md bg-cyan-500 hover:bg-cyan-500' type='submit'>
                      Lưu
                    </Button>
                  </>
                ) : (
                  <button
                    type='button'
                    disabled={editingField !== null && editingField !== ('birthDate' as keyof UpdateProfileBodyType)}
                    className='text-md p-0 text-blue-500 shadow-none hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400'
                    onClick={() => handleEditClick('birthDate')}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
            <div className='m-0 grid grid-cols-12 items-center border-b border-gray-300 py-3'>
              <div className='col-span-3 justify-start'>Giới tính</div>
              <div className='col-span-7'>
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      {editingField === 'gender' ? (
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='gender' className='text-gray-500'>
                            Giới tính <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <CustomSelect
                              options={[
                                { label: 'Nam', value: 'Nam' },
                                { label: 'Nữ', value: 'Nữ' }
                              ]}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Chọn giới tính'
                              className='w-[50%] md:w-[30%]'
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      ) : (
                        <p className={field.value ? '' : 'text-gray-500'}>{field.value || 'Chọn giới tính'}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2 flex flex-col items-end gap-2'>
                {editingField === 'gender' ? (
                  <>
                    <Button
                      type='button'
                      className='text-md bg-transparent text-blue-500 shadow-none hover:bg-transparent'
                      onClick={handleCancelClick}
                    >
                      Hủy
                    </Button>
                    <Button className='text-md bg-cyan-500 hover:bg-cyan-500' type='submit'>
                      Lưu
                    </Button>
                  </>
                ) : (
                  <button
                    type='button'
                    disabled={editingField !== null && editingField !== ('gender' as keyof UpdateProfileBodyType)}
                    className='text-md p-0 text-blue-500 shadow-none hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400'
                    onClick={() => handleEditClick('gender')}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
            <div className='m-0 grid grid-cols-12 items-center border-b border-gray-300 py-3'>
              <div className='col-span-3 justify-start'>Địa chỉ</div>
              <div className='col-span-7'>
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      {editingField === 'address' ? (
                        <div className='grid gap-2'>
                          <FormLabel htmlFor='address' className='text-gray-500'>
                            Địa chỉ <span className='text-red-500'>*</span>
                          </FormLabel>
                          <FormControl>
                            <Input id='address' className='w-full' {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      ) : (
                        <p className={field.value ? '' : 'text-gray-500'}>{field.value || 'Nhập địa chỉ'}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-2 flex flex-col items-end gap-2'>
                {editingField === 'address' ? (
                  <>
                    <Button
                      type='button'
                      className='text-md bg-transparent text-blue-500 shadow-none hover:bg-transparent'
                      onClick={handleCancelClick}
                    >
                      Hủy
                    </Button>
                    <Button className='text-md bg-cyan-500 hover:bg-cyan-500' type='submit'>
                      Lưu
                    </Button>
                  </>
                ) : (
                  <button
                    type='button'
                    disabled={editingField !== null && editingField !== ('address' as keyof UpdateProfileBodyType)}
                    className='text-md p-0 text-blue-500 shadow-none hover:cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400'
                    onClick={() => handleEditClick('address')}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
