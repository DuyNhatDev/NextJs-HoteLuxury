import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils'
import { useLoginByGoogleMutation } from '@/queries/useAuth'
import { CredentialResType, LoginByGoogleBodyType } from '@/schemaValidations/auth.schema'
import { useGoogleLogin } from '@react-oauth/google'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginByGoogle() {
  const router = useRouter()
  const { setIsAuth } = useAppContext()
  const loginByGoogleMutation = useLoginByGoogleMutation()
  const handleSuccess = async (credentialResponse: CredentialResType) => {
    const gg_resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${credentialResponse.access_token}`,
      },
    })
    const data: LoginByGoogleBodyType = await gg_resp.json()
    console.log(data)
    if (loginByGoogleMutation.isPending) return
    try {
      const result = await loginByGoogleMutation.mutateAsync(data)
      console.log(result.payload)
      setIsAuth(true)
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error,
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
    },
  })
  return (
    <Button
      variant="outline"
      className="w-full"
      type="button"
      onClick={() => handleLoginByGoogle()}
    >
      <Image src="/logo/google-logo.png" alt="Google Logo" width={20} height={20} />
      Đăng nhập bằng Google
    </Button>
  )
}
