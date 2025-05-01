/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen items-center bg-transparent'>
      <div className='container flex flex-col items-center justify-between px-5 text-gray-700 md:flex-row'>
        <div className='mx-8 w-full lg:w-1/2'>
          <div className='font-dark mb-8 text-7xl font-extrabold text-[#FF6A3D]'>404</div>
          <p className='mb-8 text-2xl leading-normal font-light md:text-3xl'>
            Xin lỗi, trang bạn tìm kiếm không được tìm thấy.
          </p>
          <Link
            href='/'
            className='inline rounded-lg border border-transparent bg-blue-500 px-5 py-3 text-sm leading-5 font-medium text-white shadow-2xl transition-all duration-400 focus:outline-none'
          >
            <span className='inline-block rotate-180'>➔</span> Về trang chủ
          </Link>
        </div>
        <div className='mx-5 my-12 w-full lg:flex lg:w-1/2 lg:justify-end'>
          <img src='/image/404.svg' className='w-full' alt='Page not found' />
        </div>
      </div>
    </div>
  )
}
