'use client'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'

type GalleryProps = {
  images: string[]
  maxLength?: number
}

export default function Gallery({ images, maxLength = 5 }: GalleryProps) {
  const shouldLimit = images.length > maxLength
  const remainingCount = images.length - (maxLength - 1)

  return (
    <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]} elementClassNames='flex flex-wrap gap-2'>
      {images.map((src, index) => {
        const isHidden = shouldLimit && index >= maxLength
        if (isHidden) {
          return (
            <a href={src} key={index} className='hidden'>
              <img src={src} alt='' />
            </a>
          )
        }
        if (shouldLimit && index === maxLength - 1) {
          return (
            <a href={src} key={index}>
              <div className='relative h-16 w-16 cursor-pointer overflow-hidden rounded sm:h-20 sm:w-20'>
                <img src={src} alt='more' className='h-full w-full object-cover' />
                <div className='absolute inset-0 flex items-center justify-center bg-black/50 text-center'>
                  <span className='text-xs font-medium text-white sm:text-sm'>Xem thêm {remainingCount} ảnh</span>
                </div>
              </div>
            </a>
          )
        }
        return (
          <a data-src={src} key={index}>
            <img src={src} className='h-16 w-16 cursor-pointer rounded object-cover sm:h-20 sm:w-20' alt='' />
          </a>
        )
      })}
    </LightGallery>
  )
}
