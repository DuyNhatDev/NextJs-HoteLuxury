'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { VerifyAccountBodySchema, VerifyAccountBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useVerifyAccountMutation } from '@/queries/useAuth'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface InputOtpFormDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  email: string
  token: string
}

export default function InputOtpFormDialog({
  open,
  setOpen,
  email,
  token,
}: InputOtpFormDialogProps) {
  const router = useRouter()
  const verifyAccountMutation = useVerifyAccountMutation()
  const form = useForm<VerifyAccountBodyType>({
    resolver: zodResolver(VerifyAccountBodySchema),
    defaultValues: {
      otpCode: '',
    },
  })

  const onSubmit = async (data: VerifyAccountBodyType) => {
    if (verifyAccountMutation.isPending) return
    try {
      await verifyAccountMutation.mutateAsync({ body: data, token })
      toast.success('Gửi yêu cầu thành công, vui lòng theo dõi email để xem phản hồi')
      //router.push('/login')
      setOpen(false)
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-black font-bold flex-grow">
            Nhập mã OTP
          </DialogTitle>
          <DialogDescription className="text-center">
            Mã OTP đã được gửi đến email: <span className="font-bold text-black"> {email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                  control={form.control}
                  name="otpCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            {...field}
                            value={field.value || ''}
                            onChange={(val) => field.onChange(val)}
                          >
                            <InputOTPGroup className="flex justify-center space-x-2">
                              {[...Array(6)].map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="
                                    bg-gray-200 text-center rounded-md border-none text-3xl
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 w-13 h-13
                                  "
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage className="flex justify-center" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  Xác nhận
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
