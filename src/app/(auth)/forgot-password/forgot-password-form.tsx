'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ForgotPasswordBodySchema, ForgotPasswordBodyType } from '@/schemaValidations/auth.schema'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForgotPasswordMutation } from '@/queries/useAuth'
import { handleErrorApi } from '@/lib/utils'
import InputOtpFormDialog from '@/app/(auth)/forgot-password/verify-otp-form-dialog'

export default function ForgetPasswordForm() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const forgotPasswordMutation = useForgotPasswordMutation()
  const form = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBodySchema),
    defaultValues: {
      email: ''
    }
  })
  const onSubmit = async (data: ForgotPasswordBodyType) => {
    if (forgotPasswordMutation.isPending) return
    try {
      const result = await forgotPasswordMutation.mutateAsync(data)
      setToken(result.payload.data)
      setEmail(data.email)
      setDialogOpen(true)
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }
  return (
    <div className='flex h-full min-h-[40vh] w-full items-center justify-center px-4'>
      <Card className='mx-auto max-w-sm'>
        <CardHeader className='relative flex w-full items-center px-4'>
          <ArrowLeft
            className='absolute left-5 cursor-pointer'
            onClick={() => {
              router.back()
            }}
          />
          <CardTitle className='mx-auto text-center text-2xl font-bold text-blue-900'>Quên mật khẩu</CardTitle>
          <CardDescription>Nhập email của bạn để gửi yêu cầu đặt lại mật khẩu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8' noValidate>
              <div className='grid gap-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='grid gap-2'>
                      <FormLabel htmlFor='email'>Email</FormLabel>
                      <FormControl>
                        <Input id='email' placeholder='example@gmail.com' type='email' {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full'>
                  {forgotPasswordMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
                  Gửi yêu cầu
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <InputOtpFormDialog open={dialogOpen} setOpen={setDialogOpen} email={email} token={token} />
    </div>
  )
}
