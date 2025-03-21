'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RegisterBodySchema, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleErrorApi } from '@/lib/utils'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useRegisterMutation } from '@/queries/useAuth'
import InputOtpFormDialog from '@/app/(public)/(auth)/register/otp-form-dialog'
import { PasswordInput } from '@/components/ui/password-input'

export default function RegisterForm() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const registerMutation = useRegisterMutation()
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBodySchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const onSubmit = async (data: RegisterBodyType) => {
    if (registerMutation.isPending) return
    try {
      const result = await registerMutation.mutateAsync(data)
      setToken(result.payload.otp_token)
      setEmail(data.email)
      setDialogOpen(true)
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }
  return (
    <>
      <Card className="mx-auto max-w-sm min-w-96">
        <CardHeader className="relative flex items-center w-full px-4">
          <ArrowLeft className="absolute left-5 cursor-pointer" onClick={() => router.back()} />
          <CardTitle className="text-2xl font-bold text-blue-900 mx-auto">Đăng Ký</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <FormLabel htmlFor="fullname">
                          Họ và tên <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="fullname"
                            placeholder="Ví dụ: Nguyen Van A"
                            type="text"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <FormLabel htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="Ví dụ: example@gmail.com"
                            type="email"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2 relative">
                        <FormLabel htmlFor="password">
                          Mật khẩu <span className="text-red-500">*</span>
                        </FormLabel>
                        <PasswordInput id="password" required {...field} />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2 relative">
                        <FormLabel htmlFor="confirmPassword">
                          Nhập lại mật khẩu <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput id="confirmPassword" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-2 bg-orange-500 hover:bg-orange-600"
                >
                  {registerMutation.isPending && (
                    <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                  )}
                  Đăng ký
                </Button>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-500 px-2">Bạn đã có tài khoản?</span>
                  <Link href="/login" className="text-sm text-blue-700 underline cursor-pointer">
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <InputOtpFormDialog open={dialogOpen} setOpen={setDialogOpen} email={email} token={token} />
    </>
  )
}
