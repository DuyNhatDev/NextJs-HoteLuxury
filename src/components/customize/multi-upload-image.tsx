'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { X, File, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type MultiUploadImageProps = {
  value?: string[]
  onChange?: (images: string[], files: File[]) => void
  maxImages?: number
  className?: string
  name?: string
  accept?: string
}

type UploadedFile = {
  id: string
  preview: string
  fileType: string
  isDeleting: boolean
  originFile?: File
  isFromAPI?: boolean
}

export const MultiUploadImage = ({
  value = [],
  onChange,
  maxImages,
  className,
  name,
  accept = 'image/*'
}: MultiUploadImageProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [inputKey, setInputKey] = useState(Date.now())
  const prevValueRef = useRef<string[]>([])

  // Sync ảnh từ prop value (chỉ khi không có ảnh đang upload)
  useEffect(() => {
    const hasLocalUpload = files.some((f) => !f.isFromAPI)
    if (JSON.stringify(prevValueRef.current) === JSON.stringify(value)) return
    if (hasLocalUpload) return

    const apiFiles: UploadedFile[] = value.map((url, index) => ({
      id: `api-${index}`,
      preview: url,
      fileType: `image/${url.split('.').pop() || 'jpeg'}`,
      isDeleting: false,
      isFromAPI: true
    }))

    setFiles(apiFiles)
    prevValueRef.current = value
  }, [value, files])

  const getCurrentFiles = (list: UploadedFile[]) => {
    const apiImages = list.filter((f) => f.isFromAPI).map((f) => f.preview)
    const uploadedFiles = list.filter((f) => !f.isFromAPI && f.originFile).map((f) => f.originFile!)
    return { apiImages, uploadedFiles }
  }

  const handleUpload = (filesList: FileList) => {
    const fileArray = Array.from(filesList)

    if (maxImages && files.length + fileArray.length > maxImages) {
      alert(`Bạn chỉ được upload tối đa ${maxImages} ảnh.`)
      return
    }

    const newFiles: UploadedFile[] = fileArray.map((file) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      preview: URL.createObjectURL(file),
      fileType: file.type,
      isDeleting: false,
      originFile: file,
      isFromAPI: false
    }))

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)

    if (onChange) {
      const { apiImages, uploadedFiles } = getCurrentFiles(updatedFiles)
      onChange(apiImages, uploadedFiles)
    }

    setInputKey(Date.now())
  }

  const handleDeleteImage = useCallback(
    (id: string) => {
      const deletedFile = files.find((f) => f.id === id)
      if (deletedFile?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(deletedFile.preview)
      }

      const updatedFiles = files.filter((f) => f.id !== id)
      setFiles(updatedFiles)

      if (onChange) {
        const { apiImages, uploadedFiles } = getCurrentFiles(updatedFiles)
        onChange(apiImages, uploadedFiles)
      }
    },
    [files, onChange]
  )

  const handleDeleteAll = () => {
    files.forEach((f) => {
      if (f.preview.startsWith('blob:')) {
        URL.revokeObjectURL(f.preview)
      }
    })

    setFiles([])
    onChange?.([], [])
  }

  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview.startsWith('blob:')) URL.revokeObjectURL(f.preview)
      })
    }
  }, [files])

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div className='flex flex-wrap gap-4'>
        {(maxImages === undefined || files.length < maxImages) && (
          <button
            type='button'
            className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed hover:cursor-pointer'
          >
            <label className='flex h-full w-full cursor-pointer items-center justify-center text-sm sm:text-base'>
              <input
                key={inputKey}
                type='file'
                accept={accept}
                multiple
                className='hidden'
                name={name}
                onChange={(e) => e.target.files?.length && handleUpload(e.target.files)}
              />
              <Upload className='text-muted-foreground h-4 w-4' />
            </label>
          </button>
        )}

        {files.map((file) => (
          <div key={file.id} className='relative h-20 w-20 rounded-md sm:h-24 sm:w-24'>
            {file.fileType.startsWith('image/') ? (
              <Avatar className='aspect-square h-[100px] w-[100px] rounded-md object-cover'>
                <AvatarImage src={file.preview} onError={() => console.error('Lỗi tải ảnh:', file.preview)} />
                <AvatarFallback>Ảnh</AvatarFallback>
              </Avatar>
            ) : (
              <div className='flex h-full w-full items-center justify-center rounded-md bg-gray-100'>
                <File className='h-8 w-8 text-gray-500 sm:h-10 sm:w-10' />
              </div>
            )}
            <button
              onClick={() => handleDeleteImage(file.id)}
              className='absolute top-1 right-1 rounded-full bg-red-200 p-1 text-red-600 hover:bg-red-300'
              type='button'
            >
              <X className='h-2 w-2 sm:h-3 sm:w-3' />
            </button>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <Button variant='destructive' className='mt-4 w-fit' onClick={handleDeleteAll}>
          Xóa tất cả
        </Button>
      )}
    </div>
  )
}
