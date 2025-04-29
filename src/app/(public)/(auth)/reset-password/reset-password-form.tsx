'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/password-input'
import { ResetPasswordBodySchema, ResetPasswordBodyType } from '@/schemaValidations/auth.schema'
import { useResetPasswordMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { handleErrorApi } from '@/lib/utils'
import { ArrowLeft, LoaderCircle } from 'lucide-react'

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const resetPasswordMutation = useResetPasswordMutation()
  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBodySchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: ResetPasswordBodyType) => {
    if (resetPasswordMutation.isPending) return
    try {
      await resetPasswordMutation.mutateAsync({ body: data, token: token! })
      toast.success('Đặt lại mật khẩu thành công')
      router.push('/login')
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }
  return (
    <div className='flex h-full min-h-[50vh] w-full items-center justify-center px-4'>
      <Card className='mx-auto max-w-sm'>
        <CardHeader className='relative flex w-full items-center px-4'>
          <ArrowLeft
            className='absolute left-5 cursor-pointer'
            onClick={() => {
              router.back()
            }}
          />
          <CardTitle className='mx-auto text-2xl font-bold text-blue-900'>Đặt lại mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8' noValidate>
              <div className='grid gap-4'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='password'>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <PasswordInput id='password' {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='confirmPassword'>Nhập lại mật khẩu mới</FormLabel>
                      <FormControl>
                        <PasswordInput id='confirmPassword' required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full bg-blue-500 hover:bg-blue-600'>
                  {resetPasswordMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
                  Xác nhận
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
