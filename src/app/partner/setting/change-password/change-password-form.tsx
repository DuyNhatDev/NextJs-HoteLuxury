'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useChangePasswordMutation } from '@/queries/useAccount'
import { getUserIdFromLocalStorage, handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import { PasswordInput } from '@/components/ui/password-input'
export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation()
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      userId: getUserIdFromLocalStorage()!,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return
    try {
      await changePasswordMutation.mutateAsync(data)
      toast.success('Thay đổi mật khẩu thành công')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const handleReset = () => {
    form.reset()
  }
  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={handleReset}
      >
        <Card className='mx-auto max-w-sm min-w-96' x-chunk='dashboard-07-chunk-4'>
          <CardHeader>
            <CardTitle className='mx-auto text-2xl font-bold'>Đổi mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='oldPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <FormLabel htmlFor='oldPassword'>Mật khẩu cũ</FormLabel>
                      <FormControl>
                        <PasswordInput id='oldPassword' required {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <FormLabel htmlFor='newPassword'>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <PasswordInput id='newPassword' required {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <FormLabel htmlFor='confirmPassword'>Nhập lại mật khẩu mới</FormLabel>
                      <FormControl>
                        <PasswordInput id='confirmPassword' required {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className='flex items-center gap-2 md:ml-auto'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button className='bg-blue-500 hover:bg-blue-600' size='sm' type='submit'>
                  Lưu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
