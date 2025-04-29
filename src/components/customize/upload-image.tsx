import { Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRef } from 'react'
import clsx from 'clsx'

interface UploadImageProps {
  value?: string | undefined
  onChange: (file: File, previewUrl: string) => void
  className?: string
}

export default function UploadImage({ value, onChange, className }: UploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile)
      onChange(selectedFile, previewUrl)
    }
  }

  return (
    <div className={clsx('flex items-start justify-start gap-2', className)}>
      <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
      <button
        type='button'
        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed hover:cursor-pointer'
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className='text-muted-foreground h-4 w-4' />
        <span className='sr-only'>Upload</span>
      </button>

      {value && (
        <Avatar className='aspect-square h-[100px] w-[100px] rounded-md object-cover'>
          <AvatarImage src={typeof value === 'string' ? value : undefined} />
          <AvatarFallback className='rounded-none text-center'>Avatar</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
