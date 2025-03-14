import { Button } from '@/components/ui/button'
import { CredentialResType } from '@/schemaValidations/auth.schema'
import { useGoogleLogin } from '@react-oauth/google'
import Image from 'next/image'

export default function LoginByGoogle() {
  const handleLoginByGoogle = useGoogleLogin({ 
    onSuccess: (credentialResponse: any) => {
      if (credentialResponse) {
        // handleSuccess(credentialResponse)
        console.log('response: ', credentialResponse)
      } else {
        console.log('Không nhận được token!')
      }
    },
    onError: () => {
      alert('Login failed')
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
