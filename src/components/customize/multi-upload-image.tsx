'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { X, File, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface MultiUploadImageProps {
  value?: string[]
  onChange?: (images: string[], files: File[]) => void
  maxImages?: number
  className?: string
  name?: string
  accept?: string
}

interface UploadedFile {
  id: string
  preview: string
  fileType: string
  isDeleting: boolean
  originFile?: File
  isFromAPI?: boolean
}

interface ImagePreviewProps {
  src: string
  fileType: string
  onDelete?: () => void
  isDeleting?: boolean
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  fileType,
  onDelete,
  isDeleting = false,
}) => {
  const isImage = fileType.startsWith('image/')
  return (
    <div
      className={cn('relative h-20 w-20 rounded-md sm:h-24 sm:w-24', isDeleting && 'opacity-50')}
    >
      {isImage ? (
        <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
          <AvatarImage src={src} />
          <AvatarFallback>Ảnh</AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
          <File className="h-8 w-8 text-gray-500 sm:h-10 sm:w-10" />
        </div>
      )}
      {!isDeleting && onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-1 right-1 rounded-full bg-red-200 p-1 text-red-600 hover:bg-red-300"
          type="button"
        >
          <X className="h-2 w-2 sm:h-3 sm:w-3" />
        </button>
      )}
    </div>
  )
}

export const MultiUploadImage: React.FC<MultiUploadImageProps> = ({
  value = [],
  onChange,
  maxImages,
  className,
  name,
  accept = 'image/*',
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [inputKey, setInputKey] = useState(Date.now())
  const prevValueRef = useRef<string[]>(value)

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(prevValueRef.current)) {
      const apiFiles: UploadedFile[] = value.map((url, index) => ({
        id: `api-${index}`,
        preview: url,
        fileType: `image/${url.split('.').pop() || 'jpeg'}`,
        isDeleting: false,
        isFromAPI: true,
      }))
      setFiles(apiFiles)
      prevValueRef.current = value
    }
  }, [value])

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
      isFromAPI: false,
    }))

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)

    if (onChange) {
      onChange(
        updatedFiles.filter((f) => f.isFromAPI).map((f) => f.preview),
        updatedFiles.map((f) => f.originFile!).filter(Boolean)
      )
    }

    setInputKey(Date.now())
  }

  const handleDeleteImage = useCallback(
    (id: string) => {
      const updatedFiles = files.filter((f) => f.id !== id)
      setFiles(updatedFiles)

      if (onChange) {
        onChange(
          updatedFiles.filter((f) => f.isFromAPI).map((f) => f.preview),
          updatedFiles.map((f) => f.originFile!).filter(Boolean)
        )
      }
    },
    [files, onChange]
  )

  const handleDeleteAll = () => {
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
      <div className="flex flex-wrap gap-4">
        {(maxImages === undefined || files.length < maxImages) && (
          <button
            type="button"
            className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed hover:cursor-pointer"
          >
            <label className="flex h-full w-full cursor-pointer items-center justify-center text-sm sm:text-base">
              <input
                key={inputKey}
                type="file"
                accept={accept}
                multiple
                className="hidden"
                name={name}
                onChange={(e) => e.target.files?.length && handleUpload(e.target.files)}
              />
              <Upload className="text-muted-foreground h-4 w-4" />
            </label>
          </button>
        )}

        {files.map((file) => (
          <ImagePreview
            key={file.id}
            src={file.preview}
            fileType={file.fileType}
            onDelete={() => handleDeleteImage(file.id)}
          />
        ))}
      </div>

      {files.length > 0 && (
        <Button variant="destructive" className="mt-4 w-fit" onClick={handleDeleteAll}>
          Xóa tất cả
        </Button>
      )}
    </div>
  )
}
