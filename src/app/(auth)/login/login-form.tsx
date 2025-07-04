'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CredentialResType, LoginBodySchema, LoginBodyType, LoginResType } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { handleErrorApi } from '@/lib/utils'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLoginByGoogleMutation, useLoginMutation } from '@/hooks/queries/useAuth'
import { toast } from 'sonner'
import { useGoogleLogin } from '@react-oauth/google'
import Image from 'next/image'
import { PasswordInput } from '@/components/ui/password-input'
import authApiRequest from '@/api/auth'
import { useAppStore } from '@/store/app-store'
import { generateSocketInstance } from '@/lib/socket'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clearTokens = searchParams.get('clearTokens')
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const loginMutation = useLoginMutation()
  const loginByGoogleMutation = useLoginByGoogleMutation()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBodySchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (clearTokens) {
      setRole()
    }
  }, [clearTokens, setRole])

  const handleLogin = (result: LoginResType) => {
    const prevPath = sessionStorage.getItem('prevPath')
    const role = result.roleId
    setRole(role)
    setSocket(generateSocketInstance(result.access_token))
    if (role === 'R1') {
      router.push('/admin/dashboard')
    } else if (role === 'R2') {
      router.push('/partner/dashboard')
    } else {
      if (prevPath) {
        router.push(prevPath)
      } else {
        router.push('/')
      }
    }
  }

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      handleLogin(result.payload)
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const handleSuccess = async (credentialResponse: CredentialResType) => {
    const gg_resp = await authApiRequest.getUserInfoFromGoogle(credentialResponse.access_token)
    const data = gg_resp.payload
    if (loginByGoogleMutation.isPending) return
    try {
      const result = await loginByGoogleMutation.mutateAsync(data)
      handleLogin(result.payload)
    } catch (error: any) {
      handleErrorApi({
        error
      })
    }
  }

  const handleLoginByGoogle = useGoogleLogin({
    onSuccess: (credentialResponse: any) => {
      if (credentialResponse) {
        handleSuccess(credentialResponse)
      } else {
        console.log('Không nhận được token!')
      }
    },
    onError: () => {
      toast('Đăng nhập thất bại')
    }
  })

  return (
    <Card className='mx-auto max-w-sm min-w-96'>
      <CardHeader className='relative flex w-full items-center px-4'>
        <ArrowLeft
          className='absolute left-5 cursor-pointer'
          onClick={() => {
            router.back()
          }}
        />
        <CardTitle className='mx-auto text-2xl font-bold text-blue-900'>Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='w-full max-w-[600px] flex-shrink-0 space-y-2'
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <FormLabel htmlFor='email'>Email</FormLabel>
                      <FormControl>
                        <Input id='email' type='email' required {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid gap-2'>
                    <div className='flex items-center justify-between'>
                      <FormLabel htmlFor='password'>Mật khẩu</FormLabel>
                      <Link href='/forgot-password' className='cursor-pointer text-sm text-blue-700 underline'>
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput id='password' autoComplete='true' required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full bg-orange-500 hover:bg-orange-600'>
                {loginMutation.isPending && <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />}
                Đăng nhập
              </Button>
              <div className='my-0 flex items-center justify-center'>
                <div className='flex-grow border-t border-gray-300'></div>
                <span className='px-3 text-gray-500'>Hoặc</span>
                <div className='flex-grow border-t border-gray-300'></div>
              </div>
              <Button variant='outline' className='w-full' type='button' onClick={() => handleLoginByGoogle()}>
                <Image src='/logo/google-logo.png' alt='Google Logo' width={20} height={20} />
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
        <div className='mt-4 px-2 text-center text-sm text-gray-500'>
          Bạn chưa có tài khoản?{' '}
          <Link href='register' className='cursor-pointer text-sm text-blue-700 underline'>
            Đăng ký
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
