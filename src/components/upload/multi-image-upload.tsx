'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { X, File } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface MultiImageUploadProps {
  value?: string[]
  onChange?: (images: string[]) => void
  maxImages?: number
  className?: string
  name?: string
  accept?: string
}

interface UploadedFile {
  id: string
  url: string
  fileType: string
  isDeleting: boolean
}

interface ImagePreviewProps {
  src: string
  fileType: string
  onDelete?: () => void
  isDeleting?: boolean
}

// --- Image Preview Component ---
export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  fileType,
  onDelete,
  isDeleting = false,
}) => {
  const isImage = fileType.startsWith('image/')

  return (
    <div
      className={cn('relative w-20 h-20 sm:w-24 sm:h-24 rounded-md', isDeleting && 'opacity-50')}
    >
      {isImage ? (
        <Image
          src={src}
          alt="Preview"
          width={50}
          height={50}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
          <File className="h-8 w-8 text-gray-500 sm:h-10 sm:w-10" />
        </div>
      )}
      {!isDeleting && onDelete && (
        <button
          onClick={onDelete}
          className="absolute right-1 top-1 rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300"
          aria-label="Remove file"
          type="button"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      )}
    </div>
  )
}

// --- MultiImageUpload Component ---
export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  maxImages,
  className,
  name,
  accept = 'image/*',
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [inputKey, setInputKey] = useState(Date.now())
  const isControlled = !!onChange
  const prevValueRef = useRef<string[]>(value)

  // Đồng bộ với props value nếu có sự thay đổi
  useEffect(() => {
    if (isControlled && JSON.stringify(value) !== JSON.stringify(prevValueRef.current)) {
      setFiles(
        value.map((url, index) => ({
          id: `${index}-${Date.now()}`,
          url,
          fileType: `image/${url.split('.').pop()?.toLowerCase() || 'jpeg'}`,
          isDeleting: false,
        }))
      )
      prevValueRef.current = value
    }
  }, [value, isControlled])

  // Xử lý khi người dùng chọn file mới
  const handleUpload = (filesList: FileList) => {
    const fileArray = Array.from(filesList)

    // Kiểm tra nếu số lượng file sau khi thêm vào vượt quá maxImages
    if (maxImages && files.length + fileArray.length > maxImages) {
      alert(`Bạn chỉ được upload tối đa ${maxImages} ảnh.`)
      return
    }

    const newFiles: UploadedFile[] = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: URL.createObjectURL(file),
      fileType: file.type || 'application/octet-stream',
      isDeleting: false,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    if (onChange) onChange([...value, ...newFiles.map((f) => f.url)])
    setInputKey(Date.now()) // Reset input để có thể chọn lại cùng file
  }

  // Xử lý xoá ảnh
  const handleDeleteImage = useCallback(
    (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id))
      if (onChange) onChange(files.filter((f) => f.id !== id).map((f) => f.url))
    },
    [onChange, files]
  )

  // Cleanup blob URLs khi unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url.startsWith('blob:')) URL.revokeObjectURL(file.url)
      })
    }
  }, [])

  return (
    <div className={cn('flex flex-col w-full', className)}>
      <div className="flex flex-wrap gap-4">
        {(maxImages === undefined || files.length < maxImages) && (
          <Button variant="outline" className="h-20 w-20 sm:h-24 sm:w-24" asChild>
            <label className="flex h-full w-full cursor-pointer items-center justify-center text-sm sm:text-base">
              Thêm ảnh
              <input
                key={inputKey}
                type="file"
                accept={accept}
                multiple
                className="hidden"
                name={name}
                onChange={(e) => e.target.files?.length && handleUpload(e.target.files)}
              />
            </label>
          </Button>
        )}
        {files.map((file) => (
          <ImagePreview
            key={file.id}
            src={file.url}
            fileType={file.fileType}
            onDelete={() => handleDeleteImage(file.id)}
          />
        ))}
      </div>
    </div>
  )
}
