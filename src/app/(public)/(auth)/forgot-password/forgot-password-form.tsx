'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ForgotPasswordBodySchema, ForgotPasswordBodyType } from '@/schemaValidations/auth.schema'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForgetPasswordForm() {
  const router = useRouter()
  const form = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBodySchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: ForgotPasswordBodyType) {
    try {
      // Assuming a function to send reset email
      console.log(values)
      toast.success('Password reset email sent. Please check your inbox.')
    } catch (error) {
      console.error('Error sending password reset email', error)
      toast.error('Failed to send password reset email. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[40vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="relative flex items-center w-full px-4">
          <ArrowLeft
            className="absolute left-5 cursor-pointer"
            onClick={() => {
              router.back()
            }}
          />
          <CardTitle className="text-2xl font-bold text-blue-900 mx-auto">Quên mật khẩu</CardTitle>
          <CardDescription>Nhập email của bạn để nhận link đặt lại mật khẩu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
              <div className="grid gap-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="example@gmail.com"
                          type="email"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  Gửi yêu cầu
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
