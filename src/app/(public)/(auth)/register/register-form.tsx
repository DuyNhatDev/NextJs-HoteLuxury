'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RegisterBodySchema, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'
import Image from 'next/image'
import { EyeIcon, EyeOffIcon, ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const togglePasswordVisibility = (key: 'password' | 'confirmPassword') => {
    if (key === 'password') {
      setShowPassword((prev) => !prev)
    } else {
      setShowConfirmPassword((prev) => !prev)
    }
  }
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
    console.log('Register')
  }

  return (
    <Card className="mx-auto max-w-sm min-w-96">
      <CardHeader className="relative flex items-center w-full px-4">
        <ArrowLeft
          className="absolute left-5 cursor-pointer"
          onClick={() => {
            router.back()
          }}
        />
        <CardTitle className="text-2xl font-bold text-blue-900 mx-auto">Đăng Ký</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="fullname">
                        Họ và tên <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullname"
                        placeholder="Ví dụ: Nguyen Van A"
                        type="text"
                        required
                        {...field}
                      />
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
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        placeholder="Ví dụ: email@gmail.com"
                        type="email"
                        required
                        {...field}
                      />
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
                      <Label htmlFor="password">
                        Mật khẩu <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                          onClick={() => togglePasswordVisibility('password')}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
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
                      <Label htmlFor="confirmPassword">
                        Nhập lại mật khẩu <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2 bg-orange-500 hover:bg-orange-600">
                Đăng ký
              </Button>
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-500 px-2">Bạn đã có tài khoản?</span>
                <Link
                  href="/login"
                  className="text-sm text-blue-700 hover:underline cursor-pointer"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
