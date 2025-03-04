'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBodySchema, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleErrorApi } from '@/lib/utils'
import Image from 'next/image'
import { EyeIcon, EyeOffIcon, ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { useLoginMutation } from '@/queries/useAuth'
import { toast } from 'sonner'

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const loginMutation = useLoginMutation()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast.success(result.payload.message)
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
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
        <CardTitle className="text-2xl font-bold text-blue-900 mx-auto">Đăng nhập</CardTitle>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required {...field} />
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
                      <Label htmlFor="password">Mật khẩu</Label>
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
                          onClick={() => {
                            setShowPassword((prev) => !prev)
                          }}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5 cursor-pointer" />
                          ) : (
                            <EyeIcon className="w-5 h-5 cursor-pointer" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <Link
                  href="/forget-password"
                  className="text-sm text-blue-700 hover:underline cursor-pointer"
                >
                  Quên mật khẩu?
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-blue-700 hover:underline cursor-pointer"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                Đăng nhập
              </Button>
              <div className="my-0 flex items-center justify-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500">Hoặc</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <Link href="">
                <Button variant="outline" className="w-full" type="button">
                  <Image src="/logo/google-logo.png" alt="Google Logo" width={20} height={20} />
                  Đăng nhập bằng Google
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
